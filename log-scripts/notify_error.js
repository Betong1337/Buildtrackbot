require('dotenv').config();
const email = process.env.EMAIL;
const emailPass = process.env.EMAIL_PASS;

var nodemailer = require('nodemailer');

admin = function(msg, IsThisError) {
    let subject;
    if (IsThisError) {
        subject = "BTB-ERROR!";
    } else {
        subject = " BTB-NOTIFY";
    }
    var transporter = nodemailer.createTransport({
        service: 'outlook',
        auth: {
          user: email,
          pass: emailPass
        }
      });
      
      var mailOptions = {
        from: email,
        to: 'jacko04@live.se',
        subject: subject,
        text: msg
      };

      transporter.sendMail(mailOptions, function(error, info){
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
      });
}

module.exports = {admin}