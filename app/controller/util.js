/*
 * @Author: Lvhz
 * @Date: 2021-08-12 10:10:02
 * @Description: Description
 */
'use strict';
const svgCaptcha = require('svg-captcha');
const fse = require('fs-extra');
const path = require('path');
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
  // 文件切片上传
  async uploadfileChunk() {
    // 模拟一半概率报错
    // if (Math.random() > 0.5) {
    //   this.ctx.status = 500;
    //   return;
    // }
    // /public/hash/(hash+index)11
    const { ctx } = this;
    const file = ctx.request.files[0];
    const { hash, name } = ctx.request.body;

    // 切片的位置
    const chunkPath = path.resolve(this.config.UPLOAD_DIR, hash);
    // 文件最终存储的位置，合并之后
    // const filePath = path.resolve(this.config.UPLOAD_DIR, hash)

    if (!fse.existsSync(chunkPath)) {
      await fse.mkdir(chunkPath);
    }

    await fse.move(file.filepath, `${chunkPath}/${name}`);

    this.message('切片上传成功');
  }
  // 文件切片合并
  async mergefile() {
    const { ext, size, hash } = this.ctx.request.body;
    const filePath = path.resolve(this.config.UPLOAD_DIR, `${hash}.${ext}`);
    await this.ctx.service.tools.mergeFile(filePath, hash, size);
    this.success({
      url: `/public/${hash}.${ext}`,
    });
  }
  async checkfile() {
    const { ctx } = this;
    const { ext, hash } = ctx.request.body;
    // 如果public下面有，则证明该文件存在
    // 如果没有，那我们看下有没有它的文件夹，如果有文件夹，则里面可能有它的碎片，如果没有则全量上传
    const filePath = path.resolve(this.config.UPLOAD_DIR, `${hash}.${ext}`);
    let uploaded = false;
    let uploadedList = [];
    if (fse.existsSync(filePath)) {
      // 文件存在
      uploaded = true;
    } else {
      // 尝试读取目录下面有没有文件切片
      uploadedList = await this.getUploadList(path.resolve(this.config.UPLOAD_DIR, hash));
    }
    this.success({
      uploaded,
      uploadedList,
    });
  }
  async getUploadList(dirPath) {
    return fse.existsSync(dirPath)
      ? (await fse.readdir(dirPath)).filter(name => name[0] !== '.') // 读取文件夹下的文件并过滤隐藏文件（.开头的文件）
      : [];
  }
}
module.exports = UtilController;
