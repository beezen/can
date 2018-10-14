const path = require('path');
const pkg = require('../../package.json');
const version = pkg.version; // 项目版本
const srcPath = path.resolve(process.cwd(), 'src'); // 源文件路径
const distPath = path.resolve(process.cwd(), 'dist'); // 构建文件路径
const entryPath = path.resolve(srcPath, 'entries'); // 入口页面路径
const componentPath = path.resolve(srcPath, 'components'); // 业务组件路径

module.exports = {
  version: version,
  srcPath: srcPath,
  distPath: distPath,
  componentPath: componentPath,
  entryPath: entryPath,
};