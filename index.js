const express= require('express');
const cookieParser = require('cookie-parser');
const path = require('path');
const port= 8001;
const app= express();
require('./config/view-helpers')(app);

const session= require('express-session');
const passport= require('passport');
const passportLocal= require('./config/passport-local-strategy');
const passportJWT= require('./config/passport-jwt-strategy');
const passportGoogle= require('./config/passport-google-oauth2-strategy');

//for socket.io
const chatServer= require('http').Server(app);
const chatSockets= require('./config/chat_sockets').chatSockets(chatServer);
chatServer.listen(5000);
console.log('chat server is listening on port 5000...');

const logger= require('morgan');

const env= require('./config/environment');

//requiring mongo-store
//concept in passport-js lecture
const MongoStore= require('connect-mongo')(session);

//requiring sass-middleware
const sassMiddleware= require('node-sass-middleware');

//requiring connect-flash for flash messages
const flash= require('connect-flash');

//requiring middleware file in config for flash messages
const customMWare= require('./config/middleware');

//we want sass to run only in development environment and not in production environment
if(env.name == 'development'){
    
    //launching sass-middleware
    app.use(sassMiddleware({
        //sources where scss files are found
        src: path.join(__dirname, env.asset_path, '/scss'),
        //destination where css files(after conversion from scss) get stored
        dest: path.join(__dirname, env.asset_path, '/css'),
        //true--> outputs errors on terminal, if sass does not work
        // debug: true,
        debug: false,
        outputStyle: 'extended',
        prefix: '/css'

    }));
}

app.use(express.urlencoded());
app.use(cookieParser());

const db= require('./config/mongoose');

//to access layouts
const expressLayouts= require('express-ejs-layouts');
app.use(expressLayouts);

//use assets
app.use(express.static(path.join(__dirname, env.asset_path)));

app.use('/uploads', express.static(__dirname + '/uploads'));

app.use(logger(env.morgan.mode), logger(env.morgan.options));

//to extract styles and scripts from sub-pages
//(concept of partials and layouts)
app.set('layout extractStyles', true);
app.set('layout extractScripts', true);

// set view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

//mongodb is used to store the session cookie in the db
app.use(session({
    name: 'Codial',
    secret: env.session_cookie_key,
    saveUninitialized: false,
    resave: false, 
    cookie: {
        //time in milliseconds, after which cookie will get expired
        maxAge: (1000*60*100)
    },
    //session cookie resets everytime our server restarts
    // to prevent this MongoStore is used
    store: new MongoStore(
        {
            mongooseConnection: db,
            autoRemove: 'disabled'
        },
        function(err){
            console.log(err || 'connect-mongodb setup ok');
        }
    )
}))

app.use(passport.initialize());
app.use(passport.session());

app.use(passport.setAuthenticatedUser);

//launching connect-flash
app.use(flash());

//launching setFlash from middleware.js
app.use(customMWare.setFlash);

//use express router
app.use('/', require('./routes'));

app.listen(port, function(err){

    if(err){
        console.log('Error in running the server: ${err}');
    }

    //interpolation
    console.log(`Server is running on port: ${port}`);
});