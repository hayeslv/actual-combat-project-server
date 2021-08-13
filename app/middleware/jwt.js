/*
 * @Author: Lvhz
 * @Date: 2021-08-12 17:58:06
 * @Description: 解析token的中间件
 */
'use strict';
const jwt = require('jsonwebtoken');
module.exports = ({ app }) => {
  return async function verify(ctx, next) {
    if (!ctx.request.header.authorization) {
      ctx.body = {
        code: 403,
        message: '用户未登录',
      };
      return;
    }
    const token = ctx.request.header.authorization.replace('Bearer ', '');
    try {
      const res = await jwt.verify(token, app.config.jwt.secret);
      console.log(res);
      ctx.state.email = res.email;
      ctx.state.userid = res._id;
      await next();
    } catch (err) {
      if (err.name === 'TokenExpiredError') {
        ctx.body = {
          code: 403,
          message: '登录过期',
        };
      } else {
        ctx.body = {
          code: 500,
          message: '用户信息出错',
        };
      }
    }
  };
};

