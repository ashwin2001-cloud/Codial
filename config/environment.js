const fs= require('fs');
const rfs= require('rotating-file-stream');
const path= require('path');

//storing path of production_logs file
const logDirectory= path.join(__dirname, '../production_logs');
//if file exists-> continue, if file does not exist-> create it
fs.existsSync(logDirectory) || fs.mkdirSync(logDirectory);

const accessLogStream= rfs.createStream('access.log', {
    //interval= 1 day
    interval: '1d',
    path: logDirectory
});

// const development= {
//     name: 'development',
//     asset_path: '/assets',
//     session_cookie_key: "blahsomething",
//     db: 'codial_db',
//     smtp: {
//         service: 'gmail',
//         host: 'smtp.gmail.com',
//         port: 587,
//         secure: false,
//         auth: {
//             user: process.env.CODIAL_GMAIL_USERNAME,
//             pass: process.env.CODIAL_GMAIL_PASSWORD
//         }
//     },
//     google_client_id: process.env.CODIAL_GOOGLE_CLIENT_ID,
//     google_client_secret: process.env.CODIAL_GOOGLE_CLIENT_SECRET,
//     google_callback_URL: "http://codialashwin.tech/users/auth/google/callback",
//     jwt_secret: process.env.CODIAL_JWT_SECRET,
//     morgan: {
//         mode: 'dev',
//         options: {stream: accessLogStream}
//     }
// }

const production= {
    name: 'production',
    asset_path: process.env.CODIAL_ASSET_PATH,
    session_cookie_key: process.env.CODIAL_SESSION_COOKIE_KEY,
    db: process.env.CODIAL_DB,
    smtp: {
        service: 'gmail',
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        auth: {
            user: process.env.CODIAL_GMAIL_USERNAME,
            pass: process.env.CODIAL_GMAIL_PASSWORD
        }
    },
    google_client_id: process.env.CODIAL_GOOGLE_CLIENT_ID,
    google_client_secret: process.env.CODIAL_GOOGLE_CLIENT_SECRET,
    google_callback_URL: "http://codialashwin.tech/users/auth/google/callback",
    jwt_secret: process.env.CODIAL_JWT_SECRET,
    morgan: {
        mode: 'combined',
        options: {stream: accessLogStream}
    }
}

module.exports= production;
// console.log(eval('production'));
// module.exports = eval(process.env.CODEIAL_ENVIRONMENT) == undefined ? development : eval(process.env.CODEIAL_ENVIRONMENT);
// module.exports= development;

// if(eval(process.env.CODIAL_ENVIRONMENT)== undefined){
//     module.exports= development;
// }

// else module.exports= eval(process.env.CODIAL_ENVIRONMENT);

// if(production == undefined){
//     module.exports= development;
// }
// else module.exports= production;
