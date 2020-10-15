# 开发文档

## 面包屑导航处理
### 不使用 page-header-wrapper 或者参照如下配置
- title： false，不显示面包屑下面的标题
- breadcrumb：false，不显示面包屑
- content：页面说明
```
<page-header-wrapper :title="false" :breadcrumb="false" content="用户管理">
```