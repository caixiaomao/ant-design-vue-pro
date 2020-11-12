import isempty from 'lodash.isempty'

const config = {
  description: '列表模块',
  prompts: [
    {
      type: 'input',
      name: 'name',
      message: '请输入模块名称：',
      validate (value) {
        if (isempty(value)) {
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
          checked: true,
          disabled: '默认'
        },
        {
          name: 'script',
          value: 'script',
          checked: true,
          disabled: '默认'
        },
        {
          name: 'style',
          value: 'style',
          checked: false
        }
      ]
    },
    {
      type: 'list',
      name: 'form_type',
      message: '请选择表单模式：',
      choices: [
        {
          name: 'modal 模式',
          value: 'modal'
        },
        {
          name: 'drawer 模式',
          value: 'drawer'
        }
      ]
    }
  ],
  actions: data => {
    const actions = [
      {
        type: 'add',
        path: `src/api/{{ lowerCase name }}.js`,
        templateFile: 'plop-templates/list/api.hbs',
        abortOnFail: false,
        data: {
          name: '{{ properCase name }}'
        }
      }
    ]
    // 表单模式，默认 modal 模式
    // drawer 模式
    if (data.form_type === 'drawer') {
      actions.push(
        {
          type: 'add',
          path: `src/views/{{ lowerCase name }}/index.vue`,
          templateFile: 'plop-templates/list/list-drawer.hbs',
          data: {
            name: '{{ properCase name }}',
            style: data.blocks.includes('style')
          }
        }
      )
    } else {
      actions.push(
        {
          type: 'add',
          path: `src/views/{{ lowerCase name }}/index.vue`,
          templateFile: 'plop-templates/list/list-modal.hbs',
          data: {
            name: '{{ properCase name }}',
            style: data.blocks.includes('style')
          }
       }
      )
    }
    return actions
  }
}

const isEmpty = function (value) {
  if (value === '' || value === undefined || value === null || value.trim() === '') {
    return true
  }
  return false
}

module.exports = config
