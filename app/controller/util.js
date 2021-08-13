/*
 * @Author: Lvhz
 * @Date: 2021-08-12 10:10:02
 * @Description: Description
 */
'use strict';
const svgCaptcha = require('svg-captcha');
const fse = require('fs-extra');
const BaseController = require('./base');

class UtilController extends BaseController {
  // 图片验证码
  async captcha() {
    const { ctx } = this;
    const captcha = svgCaptcha.create({
      size: 4,
      fontSize: 50,
      width: 100,
      height: 40,
      noise: 3,
    });
    // 存在session中
    ctx.session.captcha = captcha.text;
    console.log('captcha =>' + captcha.text);
    ctx.response.type = 'image/svg+xml';
    ctx.body = captcha.data;
  }
  // 发邮件
  async sendcode() {
    const { ctx } = this;
    const email = ctx.query.email;
    const code = Math.random().toString().slice(2, 6);
    console.log('邮箱：' + email + '验证码：' + code);
    ctx.session.emailcode = code;

    const subject = '实战项目验证码';
    const text = '';
    const html = `<h2>牛批社区</h2><a href="https://www.baidu.com"><span>${code}</span></a>`;
    const hasSend = await this.service.tools.sendMail(email, subject, text, html);
    if (hasSend) {
      this.message('发送成功');
    } else {
      this.error('发送失败');
    }
  }
  // 文件上传（这里只负责上传文件，不负责入库的操作）
  async uploadfile() {
    const { ctx } = this;
    const file = ctx.request.files[0];
    const { name } = ctx.request.body;
    console.log(file, name);

    await fse.move(file.filepath, this.config.UPLOAD_DIR + '/' + file.filename);

    this.success({
      url: `/public/${file.filename}`,
    });
  }
}
module.exports = UtilController;
