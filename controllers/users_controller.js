const User = require('../models/user');

const fs= require('fs');
const path= require('path');

module.exports.profile= function(req, res){

    User.findById(req.params.id, function(err, user){
        if(user){
            return res.render('user_profile', {
                title: "Profile",
                profile_user: user
            });
        }
        return res.redirect('back');
    })
    
    // //if cookie user_id is present
    // if(req.cookies.user_id){
        
    //     User.findById(req.cookies.user_id, function(err, user){
    //         if(user){
    //             return res.render('user_profile', {
    //                 title: "Profile",
    //                 user: user
    //             });
    //         }
    //         return res.redirect('back');
    //     })
    // }

    // //else user is not signed in, and he should not be able to
    // //access profile using localhost:8001/users/profile
    // else{
    //     res.redirect('/users/signin');
    // }
}

module.exports.signIn= function(req, res){
    if(req.isAuthenticated()){
        return res.redirect('/users/profile');
    }
    
    return res.render('user_sign_in', {
        title:"Codial | Sign In"
    })
    // return res.redirect('back');
}

module.exports.signUp= function(req, res){
    if(req.isAuthenticated()){
        return res.redirect('/users/profile');
    }

    return res.render('user_sign_up', {
        title:"Codial | Sign Up"
    })
}

//get the signup data
module.exports.create= function(req, res){
    
    console.log('hello');
    if (req.body.password != req.body.confirm_password){
        return res.redirect('back');
    }

    User.findOne({email: req.body.email}, function(err, user){
        if(err){console.log('error in finding user in signing up'); return}

        if (!user){
            User.create(req.body, function(err, user){
                if(err){console.log('error in creating user while signing up'); return}

                return res.redirect('/users/signin');
            });
        }else{
            return res.redirect('back');
        }

    });

}

// steps to authenticate
// find the user
module.exports.createSession= function(req, res){
    
    req.flash('success', 'Logged in successfully');
    return res.redirect('/');
    
}

module.exports.destroySession = function(req, res){
    req.logout();
    req.flash('success', 'You have logged out!');


    return res.redirect('/');
}

//updating profile
module.exports.update= async function(req, res){
    
    //this condition is applied so that the user does not change req.params.id from inspect
    //this condition is important
    // if(req.user.id == req.params.id){
    //     //User.findByIdAndUpdate(req.params.id, req.body, function(err, user)... can also be used
    //     User.findByIdAndUpdate(req.params.id, {name: req.body.name, email: req.body.email}, function(err, user){
    //         return res.redirect('back');
    //     })
    // }
    // else{
    //     return res.redirect('back');
    // }

    if(req.user.id == req.params.id){

        try{
            let user= await User.findById(req.params.id);
            User.uploadedAvatar(req, res, function(err){
                if(err){
                    console.log(err);
                }

                user.name=req.body.name;
                user.email=req.body.email;

                //called when file is uploaded
                if(req.file){
                    
                    //check if file is present inside /uploads/users/avatars
                    if(fs.existsSync(path.join(__dirname, '..', user.avatar))){
                        //deleting the old file
                        fs.unlinkSync(path.join(__dirname, '..', user.avatar));
                    }
                    // console.log(req.file);
                    user.avatar= User.avatarPath + '/' + req.file.filename;
                }

                //save function should be used when findById is used to update
                //if findByIdAndUpdate is used, data gets automatically saved
                user.save();
                return res.redirect('back');
            });
        } catch(err){
            console.log(err);
            req.flash('error', err); return res.redirect('back');
        }
    }
    else{
        req.flash('Error', 'Unauthorised');
        return res.status(401).send('Unauthorised!');
    }
}