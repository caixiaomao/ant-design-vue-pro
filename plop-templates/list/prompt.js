import isEmpty from 'lodash.isempty'
module.exports = {
  description: '列表模块',
  prompts: [
    {
      type: 'input',
      name: 'name',
      message: '请输入模块名称：',
      validate (value) {
        if (isEmpty(value)) {
          return '模块名称不能为空'
        }
        return true
      }
    },
    {
      type: 'checkbox',
      name: 'blocks',
      message: '请选择模块组件：',
      choices: [
        {
          name: 'template',
          value: 'template',
          checked: true
        },
        {
          name: 'script',
          value: 'script',
          checked: true
        },
        {
          name: 'style',
          value: 'style',
          checked: true
        }
      ],
      validate (value) {
        if (value.indexOf('script') === -1 || value.indexOf('template') === -1) {
          return 'script 和 template 必须选择！'
        }
        return true
      }
    }
  ],
  actions: data => {
    // 首字母大写
    const properCaseName = '{{properCase name}}'
    // 全小写
    const lowerCaseName = '{{lowerCase name}}'
    const actions = [
      {
        type: 'add',
        path: `src/views/${properCaseName}/index.vue`,
        templateFile: 'plop-templates/list/list.hbs',
        data: {
          name: name,
          template: data.blocks.includes('template'),
          script: data.blocks.includes('script'),
          style: data.blocks.includes('style')
        }
      },
      {
        type: 'add',
        path: `src/api/${lowerCaseName}.js`,
        templateFile: 'plop-templates/list/api.hbs',
        data: {
          name: name
        }
      }
    ]
    return actions
  }
}
