const Post= require('../models/post');
const User= require('../models/user');

//function is converted from asynchronous to async await
module.exports.home= async function(req, res){
    
    //error handling done in async await, using TRY and CATCH
    //CHANGED
    try{
        let posts= await Post.find({})
        //to sort posts on the basis of time of creation
        .sort('-createdAt')
        // populating 'user' to 'post
        .populate('user')
        // populating 'comments' to 'post' and populating 'user' to 'comments'
        // this way of populating is important
        .populate({
            path: 'comments',
            populate:{
                path: 'user'
            },
            populate:{
                path: 'likes'
            }
        }).populate('comments')
        .populate('likes');
        
        for(post of posts){
            for(comment of post.comments){
                comment = await comment.populate('user', 'name id').execPopulate();
            }
            
        }
        // console.log(posts);
        let users= await User.find({});

        return res.render('home', {
            title: "Codeial | Home", 
            posts:  posts,
            all_users: users
        });
    }catch(err){
        console.log(err);
        return;
    }
}