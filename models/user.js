const mongoose=require('mongoose');

//setting up multer for uploading files
const multer= require('multer');
//path where file uploaded is saved- /uploads/users/avatars
const path= require('path');
const AVATAR_PATH= path.join('/uploads/users/avatars');

const userSchema= new mongoose.Schema({
    email:{
        type:String,
        required: true,
        unique: true
    },
    password:{
        type: String,
        required:true,
    },
    name:{
        type:String,
        required:true
    },
    avatar: {
        type: String
    }
}, {
    //used to include createdAt and updatedAt fields
    timestamps: true
});

//to link avatar in userSchema to AVATAR_PATH
let storage = multer.diskStorage({
    destination: function (req, file, cb) {
        // '..' is used to move one step above in directory
        // to get value of __dirname, do console.log(__dirname)
      cb(null, path.join(__dirname, '..', AVATAR_PATH));
    },
    filename: function (req, file, cb) {
      cb(null, file.fieldname + '-' + Date.now())
    }           
});

//static methods
userSchema.statics.uploadedAvatar= multer({storage: storage}).single('avatar');
userSchema.statics.avatarPath= AVATAR_PATH;

const User= mongoose.model('User', userSchema);

module.exports= User;