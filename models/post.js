const mongoose=require('mongoose');

const postSchema= new mongoose.Schema({
    content:{
        type:String,
        required: true,
    },
    //used to refer user to post schema
    user: {
        //type is the objectid in the user database(in robo3T)
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    
    //used to refer array of comments to post schema
    comments:[{
        type:mongoose.Schema.Types.ObjectId,
        ref: 'Comment'
    }],
    likes: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Like'
        }
    ]
    
}, {
    //used to include createdAt and updatedAt fields
    timestamps: true
});

const Post= mongoose.model('Post', postSchema);
module.exports= Post;