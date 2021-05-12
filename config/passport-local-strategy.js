//requiring passport
const passport= require('passport');

//requiring passport-local strategy
const LocalStrategy= require('passport-local').Strategy;

const User= require('../models/user');

//launching passport-local strategy
passport.use(new LocalStrategy({
        usernameField: 'email',
        //this is used to make 'req' as first argument in the function
        passReqToCallback: true
    },
    //done is inbuilt function in passport
    function(req, email, password, done){
        //checking if email entered in browser is present in database
        User.findOne({email: email}, function(err, user){
            if(err){
                req.flash('error', err);
                return done(err);
            }
            
            //if user not found or password entered is incorrect
            if(!user || user.password!=password){
                req.flash('error', 'Invalid username/Password');
                return done(null, false);
            }

            return done(null, user);
        })
    }
));

//serializing the user
passport.serializeUser(function(user, done){
    done(null, user.id);
})

//deserializing the user
passport.deserializeUser(function(id, done){
    User.findById(id, function(err, user){
        if(err){
            console.log('Error in finding user --> Passport');
            return done(err);
        }
        return done(null, user);
    })
})

//check if the user is authenticated
passport.checkAuthentication= function(req, res, next){

    // if user is signed in
    if(req.isAuthenticated()){
        return next();
    }

    // if user is not signed in
    return res.redirect('/users/signin');
}

//for returning profile of authenticated user
passport.setAuthenticatedUser= function(req, res, next){
    if(req.isAuthenticated()){
        //req.user contains the current signed in user from the session cookie and we are just sending this to the locals for views
        res.locals.user= req.user;
    }
    next();
}

module.exports= passport;
