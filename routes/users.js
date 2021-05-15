const express= require('express');
const router= express.Router();
const passport= require('passport');

const usersController= require('../controllers/users_controller');

router.get('/profile/:id', passport.checkAuthentication, usersController.profile);
router.post('/update/:id', passport.checkAuthentication, usersController.update);
// router.get('/post', postsController.post);
router.get('/signin', usersController.signIn);
router.get('/signup', usersController.signUp);
router.post('/create', usersController.create);
router.post('/createSession', passport.authenticate(
    'local',
    {failureRedirect: '/users/signin'},
) ,usersController.createSession);
router.get('/signout', usersController.destroySession);

//scope: it specifies which user's Google information you want your app to get access to. In this example, I need access to the user's Google profile and email address
router.get('/auth/google', passport.authenticate('google', {scope: ['profile', 'email']}));
router.get('/auth/google/callback', passport.authenticate('google', {failureRedirect: '/users/signin'}), usersController.createSession);

module.exports= router;