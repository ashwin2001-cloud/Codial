const mongoose=require('mongoose');

const likeSchema= new mongoose.Schema({

    user:{
        type: mongoose.Schema.Types.ObjectId
    },
    
    //this defines objectid of liked object
    likeable: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        refPath: 'onModel'
    },

    //this field is used for defining the type of liked object (post or comment)
    onModel:{
        type: String,
        required: true,
        //enum means value of onModel can be either 'Post' or 'Comment'. Nothing else
        enum: ['Post', 'Comment']
    }
    
}, {
    //used to include createdAt and updatedAt fields
    timestamps: true
});

const Like= mongoose.model('Like', likeSchema);
module.exports= Like;