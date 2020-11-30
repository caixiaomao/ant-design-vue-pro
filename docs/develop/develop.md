# 开发文档

## 面包屑导航处理
### 不使用 page-header-wrapper 或者参照如下配置
- title： false，不显示面包屑下面的标题
- breadcrumb：false，不显示面包屑
- content：页面说明
```
<page-header-wrapper :title="false" :breadcrumb="false" content="用户管理">
```

## ant-design-vue 组件懒加载
### 修改如下配置文件
```
src/core/lazy_use.js
```

## 屏蔽正在切换主题的提示
修改 node_modules/@ant-design-vue/pro-layout/es/utils/dynamicTheme.js 文件

## 框架全局配置
修改主题、语言等设置，修改 src/core/bootstrap.js 文件

## mockjs 示例
http://mockjs.com/examples.html

## table 注意事项
- table customRender 插槽名称不要写 title， 这是 table 标题栏的默认插槽名称
```
scopedSlots: { customRender: '_title' }
```

## 用户菜单
根据 src/store/index.js 中引入的 permission 权限，有两种方案：
- 前端配置菜单，根据后台返回的用户角色筛选 (src/store/modules/permission.js)
- 菜单由后端动态配置和返回，在前端动态组装菜单树 （src/store/modules/async-router.js）