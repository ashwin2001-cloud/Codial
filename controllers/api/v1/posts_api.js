const Post= require('../../../models/post');
const Comment= require('../../../models/comment');

//index is generally used when we want to list down something
module.exports.index= async function(req, res){

    
    //copied from home controller
    let posts= await Post.find({})
        .sort('-createdAt')
        .populate('user')
        .populate({
            path: 'comments',
            populate:{
                path: 'user'
            }
        });

    return res.json(200, {
        message: "List of posts",
        posts: posts
    });
}

module.exports.destroy= async function(req, res){

    console.log('****', 'hello', '****');
    try{
        let post = await Post.findById(req.params.id);
        if (post.user == req.user.id){
            post.remove();

            await Comment.deleteMany({post: req.params.id});
    
            return res.json(200, {
                message: "Post and associated comments deleted successfully!"
            });
        }else{
            return res.json(401, {
                message: "You cannot delete this post!"
            });
        }

    }catch(err){
        console.log('********', err);
        return res.json(500, {
            message: "Internal Server Error"
        });
    }
    
}
