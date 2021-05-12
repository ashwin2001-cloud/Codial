const passport= require('passport');

//requiring oauth2 strategy
const googleStrategy= require('passport-google-oauth').OAuth2Strategy;

//library to generate random password
const crypto= require('crypto');
const User= require('../models/user');

const env= require('./environment');

//tell passport to use a new strategy for Google login
passport.use(new googleStrategy({
        clientID: env.google_client_id,
        clientSecret: env.google_client_secret,
        callbackURL: env.google_callback_URL
    
    },

    //callback function
    function(accessToken, refreshToken, profile, done){
        
        //finding user
        User.findOne({email: profile.emails[0].value}).exec(function(err, user){
            if(err){
                console.log('error in google-strategy passport');
                return;
            }

            console.log(profile);

            //signin
            if(user){
                //if user found, set this user as req.user
                return done(null, user);
            }
            
            //signup
            else{
                //if user is not found, we first create it and then set it as req.user
                User.create({
                    name: profile.displayName,
                    email: profile.emails[0].value,
                    //length of password-20, format of password- hexaDecimal
                    password: crypto.randomBytes(20).toString('hex')
                }, function(err, user){
                    if(err){
                        console.log('error in google-strategy passport');
                        return;
                    }
                    return done(null, user);
                })
            }
        })
    }
    
));

module.exports= passport;