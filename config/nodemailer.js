const nodemailer= require('nodemailer');
const ejs= require('ejs');
const path= require('path');
const env= require('./environment');

//transporter defines how mails are going to be sent
let transporter= nodemailer.createTransport(env.smtp);

//to tell that we will mail ejs files
//arrow function used
let renderTemplate= (data, relativePath) => {
    let mailHTML;
    ejs.renderFile(
        //path of the ejs files
        path.join(__dirname, '../views/mailers', relativePath),
        data,
        function(err, template){
            if(err){ console.log('Error in rendering template'); return;}

            mailHTML= template;
        }
    )
    return mailHTML;
}

module.exports= {
    transporter: transporter,
    renderTemplate: renderTemplate
}