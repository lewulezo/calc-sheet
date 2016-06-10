'use strict';

var NodeMailer = require('nodemailer');

const MAIL_SERVER_URL = 'smtp://lewulezo%40163.com:Naduynil.163@smtp.163.com';
const MAIL_OPTIONS = {
  from: 'lewulezo@163.com',
  to: 'lewulezo@163.com, kevin_lin_monkey@163.com',
}

class MailService {
  constructor(){
    this.transporter = NodeMailer.createTransport(MAIL_SERVER_URL);    
  }
  
  sendMail(subject, body){
    return new Promise((resolve, reject) => {
      var mailOptions = {
        subject: subject,
        html: body
      };
      Object.assign(mailOptions, MAIL_OPTIONS);
      this.transporter.sendMail(mailOptions, (err, res) =>{
        if (err) {
          reject(err);
          return;
        } else {
          resolve(res);
        }
      });
    });
  }

  static getInstance(){
    return new MailService();
  }
}

module.exports = MailService;


// //test
// !function test(){
//   var mailService = MailService.getInstance();
//   mailService.sendMail('测试', '得分50分').then(info => console.log(info)); 
// }();
