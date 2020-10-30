import antd from 'ant-design-vue/es/locale-provider/zh_CN'
import momentCN from 'moment/locale/zh-cn'

const components = {
  antLocale: antd,
  momentName: 'zh-cn',
  momentLocale: momentCN
}

const locale = {
  'message': '-',
  'menu.home': '主页',
  'menu.dashboard': '仪表盘',
  'menu.dashboard.analysis': '分析页',
  'menu.dashboard.monitor': '监控页',
  'menu.dashboard.workplace': '工作台',

  'app.setting.pagestyle': '整体风格设置',
  'app.setting.pagestyle.light': '明亮主题',
  'app.setting.pagestyle.dark': '黑暗主题',
  'app.setting.pagestyle.realdark': '真暗黑主题',
  'app.setting.themecolor': '主题色',
  'app.setting.navigationmode': '导航模式',
  'app.setting.content-width': '内容区域宽度',
  'app.setting.fixedheader': '固定头部',
  'app.setting.fixedsidebar': '固定侧边栏',
  'app.setting.sidemenu': '侧边栏菜单布局',
  'app.setting.topmenu': '顶部菜单布局',
  'app.setting.content-width.fixed': '固定',
  'app.setting.content-width.fluid': '自适应',
  'app.setting.othersettings': '其它设置',
  'app.setting.weakmode': '色弱模式',
  'app.setting.copy': '拷贝设置',
  'app.setting.loading': '加载主题',
  'app.setting.copyinfo': '拷贝成功，请替换 defaultSettings in src/models/setting.js',
  'app.setting.production.hint': '设置面板仅在开发环境中展示，生产环境请手动修改配置'
}

export default {
  ...components,
  ...locale
}
