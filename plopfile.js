// plop 代码生成入口配置文件
const listGenerator = require('./plop-templates/list/prompt')
module.exports = function (plop) {
  plop.setGenerator('list', listGenerator)
}
