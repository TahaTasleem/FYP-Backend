var nodemailer = require('nodemailer');

function sendEmail(urlChangePass, userEmail){
  try{
    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: "alimuhammad.moaiz@gmail.com",
          pass: process.env.EMAIL_PASSWORD
        }
    });
    var mailOptions = {
      from: 'alimuhammad.moaiz@gmail.com',
      to: userEmail,
      subject: 'ADRS: RIDER ACCOUNT PASSWORD RECOVERY',
      text: "Dear User,\n\nPlease click the link below to change your account's password:\n" + urlChangePass + "\n\nThis link will work for 15 minutes only.\nIf you have not requested for this email, kindly ignore it!\n\nRegards,\nADRS-Team"
    };
    
    const sendEmail = transporter.sendMail(mailOptions, function(error, info){
      if (error) {
        console.log(error);
      }else {
        console.log('Reset link sent!\n' + info.response);
      }
    });
  }catch(err){
    console.log("Error sending email! "+ err);
  }
}

module.exports = {sendEmail};