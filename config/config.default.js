/*
 * @Author: Lvhz
 * @Date: 2021-08-11 16:27:46
 * @Description: Description
 */
/* eslint valid-jsdoc: "off" */

'use strict';
const path = require('path');

/**
 * @param {Egg.EggAppInfo} appInfo app info
 */
module.exports = appInfo => {
  /**
   * built-in config
   * @type {Egg.EggAppConfig}
   **/
  const config = exports = {};

  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_1628668755023_4223';

  // 打开文件上传
  config.multipart = {
    mode: 'file',
    whitelist: () => true,
  };
  // 上传文件的配置
  config.UPLOAD_DIR = path.resolve(__dirname, '..', 'app/public');

  // add your middleware config here
  config.middleware = [];

  // add your user config here
  const userConfig = {
    // myAppName: 'egg',
  };

  return {
    ...config,
    ...userConfig,
    // 这里关掉csrf：注，正式环境需要启动
    security: {
      csrf: {
        enable: false,
      },
    },
    mongoose: {
      client: {
        url: 'mongodb://192.168.2.135:27017/kkbhub',
        options: {},
      },
    },
    jwt: {
      secret: '@Dylan?hahah~123ze^',
    },
  };
};
