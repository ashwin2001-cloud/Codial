const mongoose= require('mongoose');

const commentSchema= new mongoose.Schema({
    content: {
        type: String,
        required: true
    },

    //referencing post: to get the post for which comment has been written
    post:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post'
    },

    //referencing user: to get the user who has commented
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    
    likes: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Like'
        }
    ]

},{
    timestamps: true
});

const Comment= mongoose.model('Comment', commentSchema);
module.exports= Comment;