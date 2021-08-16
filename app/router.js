/*
 * @Author: Lvhz
 * @Date: 2021-08-11 16:27:46
 * @Description: 路由
 */
'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller } = app;
  const jwt = app.middleware.jwt({ app });
  router.get('/', controller.home.index);

  router.get('/captcha', controller.util.captcha); // 图片验证码
  router.get('/sendcode', controller.util.sendcode); // 邮件验证码
  router.post('/uploadfile', controller.util.uploadfile); // 文件上传
  router.post('/uploadfileChunk', controller.util.uploadfileChunk); // 文件上传chunk
  router.post('/mergefile', controller.util.mergefile); // 文件合并
  router.post('/checkfile', controller.util.checkfile); // 文件合并

  router.group({ name: 'user', prefix: '/user' }, router => {
    const { info, register, login, verify } = controller.user;

    router.post('/register', register);
    router.post('/login', login);

    router.get('/info', jwt, info);

    router.get('/verify', verify);
  });
};
