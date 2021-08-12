'use strict';
const svgCaptcha = require('svg-captcha');
const Controller = require('egg').Controller;

class UtilController extends Controller {
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
}
module.exports = UtilController;
