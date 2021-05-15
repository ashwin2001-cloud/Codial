const Comment= require('../models/comment');
const Post= require('../models/post');
const Like= require('../models/like');

module.exports.create= async function(req, res){

    try{
        // comment can be created without finding post (using findById),
        // but user can change the post._id from inspect. That is why first post is found using findById, then comment is written
        let post= await Post.findById(req.body.post);
        if(post){
            let comment= await Comment.create({
                content: req.body.content,
                post: req.body.post,
                user: req.user._id
            });

            comment = await comment.populate('user', 'name').execPopulate();

            post.comments.push(comment);
            post.save();

            if(req.xhr){
                return res.json(200, {
                    data: {
                        comment: comment
                    },
                    message: 'Comment created successfully!'
                })
            }

            req.flash('success', 'Comment added!');
            res.redirect('/');
        }
    }catch(err){
        req.flash('error', err);
        return res.redirect('back');
    }

}

module.exports.destroy= async function(req, res){

    try{

        let comment= await Comment.findById(req.params.id);

        //comment gets deleted only when the user who is signed in has written the comment
        if(comment.user == req.user.id){
            let postId= comment.post;

            //CHANGE
            await Like.deleteMany({likeable: comment._id, onModel: 'Comment'});
            
            req.flash('success', 'Comment deleted!');
                
            //deleting comment
            comment.remove();

            let post= await Post.findById(postId);
            //deleting id of removed comment from post.comments
            post.update({$pull: {comments: req.params.id}});

            if(req.xhr){
                return res.status(200).json({
                    data: {
                        comment_id: req.params.id
                    },
                    message: "Post deleted"
                });
            }
            
            return res.redirect('back');
        }
    }catch(err){
        req.flash('error', err);
        return res.redirect('back');
    }
}