/*
 * @Author: Lvhz
 * @Date: 2021-08-12 16:31:54
 * @Description: Description
 */
'use strict';
const { Service } = require('egg');
const nodemailer = require('nodemailer');

const userEmail = 'lvhaizhoudylan@126.com';
const transporter = nodemailer.createTransport({
  service: '126',
  secureConnection: true,
  // secure: false,
  auth: {
    user: userEmail,
    pass: 'KPLWHFVVBNGARUFA', // 授权码，不是密码
  },
});

class ToolService extends Service {
  async sendMail(email, subject, text, html) {
    const mailOptions = {
      from: userEmail,
      cc: userEmail, // 抄送：抄送一份给自己，可以规避掉一部分垃圾邮件的验证
      to: email,
      subject,
      text,
      html,
    };
    try {
      await transporter.sendMail(mailOptions);
      return true;
    } catch (err) {
      console.log('email error', err);
      return false;
    }
  }
}

module.exports = ToolService;
