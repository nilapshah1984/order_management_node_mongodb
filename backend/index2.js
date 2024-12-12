import nodemailer from "nodemailer";

var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'pjangid096@gmail.com',
    pass: 'znsc aafy fhid lpyr'
  }
});

var mailOptions = {
  from: 'pjangid096@gmail.com',
  to: 'pjangid096@gmail.com',
  subject: 'Sending Email using Node.js',
  text: 'how are you ram?'
};

transporter.sendMail(mailOptions, function(error, info){
  if (error) {
    console.log(error);
  } else {
    console.log('Email sent: ' + info.response);
  }
});

