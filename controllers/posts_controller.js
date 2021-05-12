const Post = require('../models/post');

//comment is required for deleting
const Comment = require('../models/comment');
const Like = require('../models/like');
const postsMailer= require('../mailers/posts_mailers');
const queue= require('../config/kue');
const postEmailWorker= require('../workers/post_email_worker');

module.exports.create= async function(req, res){

    try{
        let post= await Post.create({
            content: req.body.content,
            //req.user is the logged in user and we are accessing this using passport
            //req.user is present in passport_local_strategy file in setAuthenticatedUser function
            user: req.user._id
        });

        post = await post.populate('user', 'name email').execPopulate();
        // postsMailer.newPost(post);

        //creating and enqueing job in queue named 'emails'
        let job= queue.create('emails', post).save(function(err){
            if(err){
                console.log('Error in creating queue');
            }
            console.log('job enqueued', job.id, job.data);
        });

        //if request is made from ajax
        if(req.xhr){
            
            // if we want to populate just the name of the user (we'll not want to send the password in the API), this is how we do it!
            // post = await post.populate('user', 'name email').execPopulate();

            //prints all values in console
            return res.status(200).json({
                data:{
                    post: post,
                },
                message: "Post created!"
            });
        }
        
        req.flash('success', 'Post Published!');
        return res.redirect('back');
    }catch(err){

        req.flash('error', err);
        return res.redirect('back');
    }
        
}

module.exports.destroy= async function(req, res){

    try{
        let post= await Post.findById(req.params.id);

        //post gets deleted only when the user who is signed in has written the post

        //We have not populated user in post (in file post_controller.js). That is why post.user contains the id of user 
        //who has written the post and not post.user.id
        
        //Note:We have populated user in post only for home_controller.js file
        if(post.user == req.user.id){
            
            //deleting likes in post and then its comments
            //CHANGE
            await Like.deleteMany({likeable: post, onModel: 'Post'});
            await Like.deleteMany({_id: {$in: post.comments}});

            //function in mongodb to remove post
            post.remove();
            //deleting all comments in the post
            await Comment.deleteMany({post: req.params.id});
            console.log('***', req.user, '***');
            if(req.xhr){
                return res.status(200).json({
                    data: {
                        post_id: req.params.id
                    },
                    message: "Post deleted"
                });
            }

            req.flash('success', 'Post and associated comments deleted!');
            return res.redirect('back');
        }
        else{
            req.flash('error', 'Cannot delete this post!')
            return res.redirect('back');
        }
    }catch(err){
        req.flash('err', 'Cannot delete this post!');
        return res.redirect('back');
    }
    
}