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

const development= {
    name: 'development',
    asset_path: '/assets',
    session_cookie_key: 'ZFSl8PIyJTw8TqBT4rUZoRyjjj75MV52',
    db: 'codial_db',
    smtp: {
        service: 'gmail',
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        auth: {
            user: 'ashwinbaranwal2001@gmail.com',
            pass: 'Ashclash_123'
        }
    },
    google_client_id: "433451850541-3s3utruu82p7b8asnppvo8nrmbkqobfm.apps.googleusercontent.com",
    google_client_secret: "dAGYvOZrGBf144AVegjchN8c",
    google_callback_URL: "http://localhost:8001/users/auth/google/callback",
    jwt_secret: 'X9u6sMfacZwf5LJitUpPD0JC3eV3SfGF',
    morgan: {
        mode: 'dev',
        options: {stream: accessLogStream}
    }
}

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
    google_callback_URL: process.env.CODIAL_GOOGLE_CALLBACK_URL,
    jwt_secret: process.env.CODIAL_JWT_SECRET,
    morgan: {
        mode: 'combined',
        options: {stream: accessLogStream}
    }
}

// module.exports= production;
// console.log(eval('production'));
module.exports = eval(process.env.CODEIAL_ENVIRONMENT) == undefined ? development : eval(process.env.CODEIAL_ENVIRONMENT);
// module.exports= development;

// if(eval(process.env.CODIAL_ENVIRONMENT)== undefined){
//     module.exports= development;
// }

// else module.exports= eval(process.env.CODIAL_ENVIRONMENT);

// if(production == undefined){
//     module.exports= development;
// }
// else module.exports= production;