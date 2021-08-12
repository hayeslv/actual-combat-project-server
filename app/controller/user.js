/*
 * @Author: Lvhz
 * @Date: 2021-08-12 14:36:26
 * @Description: 用户类
 */
'use strict';
const md5 = require('md5');
const jwt = require('jsonwebtoken');
const BaseController = require('./base');

const HashSalt = ':DylanLV@sAult~';
const createRule = {
  email: { type: 'email' },
  nickname: { type: 'string' },
  password: { type: 'string' },
  captcha: { type: 'string' },
};

class UserController extends BaseController {
  async login() {
    const { ctx, app } = this;
    const { email, captcha, password, emailcode } = ctx.request.body;

    // 校验验证码
    if (captcha.toUpperCase() !== ctx.session.captcha.toUpperCase()) {
      return this.error('验证码错误');
    }
    if (emailcode !== ctx.session.emailcode) {
      return this.error('邮箱验证码错误');
    }
    const user = await ctx.model.User.findOne({
      email,
      password: md5(password + HashSalt),
    });
    if (!user) {
      return this.error('用户名或密码错误');
    }
    // 用户的信息加密成token返回
    const token = jwt.sign({
      _id: user._id,
      email,
    }, app.config.jwt.secret, {
      expiresIn: '1h', // token过期时间
    });
    this.success({ token, email, nickname: user.nickname });
  }
  async register() {
    const { ctx } = this;
    try {
      // 校验传递的参数：这里只做了简单的类型校验
      ctx.validate(createRule);
    } catch (e) {
      return this.error('参数校验失败', 500, e.errors);
    }

    const { email, password, captcha, nickname } = ctx.request.body;

    // 校验验证码
    if (captcha.toUpperCase() !== ctx.session.captcha.toUpperCase()) {
      return this.error('验证码错误');
    }
    // 邮箱是否重复
    if (await this.checkEmail(email)) {
      return this.error('邮箱重复啦');
    }

    const res = await ctx.model.User.create({
      email,
      nickname,
      password: md5(password + HashSalt), // 加盐加密
    });
    if (res._id) return this.message('注册成功');
  }
  async checkEmail(email) {
    const user = await this.ctx.model.User.findOne({ email });
    return user;
  }
  async verify() {
    // 校验用户名是否存在
  }
  async info() {
    const { ctx } = this;
    // 有的接口需要从token中读数据，有的不需要
    const { email } = ctx.state;
    const user = await this.checkEmail(email);
    this.success(user);
  }
}
module.exports = UserController;
