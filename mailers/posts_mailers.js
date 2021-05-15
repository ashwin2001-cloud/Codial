const nodeMailer= require('../config/nodemailer');

exports.newPost= (post) => {

    console.log('Inside newPost mailer');
    let htmlString= nodeMailer.renderTemplate({post: post}, '/posts/new_post.ejs');

    nodeMailer.transporter.sendMail({
        from: 'ashwinbaranwal2001@gmail.com',
        to: post.user.email,
        subject: "New post published!",
        html: htmlString
    }, (err, info) => {
        if(err){ console.log("Error in sending mail", err); return; }

        // console.log('Message sent', info);
        return;
    })
}