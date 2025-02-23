<template>
  <page-header-wrapper :title="false">
    <a-card :bordered="false">
      <div class="table-page-search-wrapper">
        <a-form layout="inline">
          <a-row :gutter="48">
            <a-col :md="8" :sm="24">
              <a-form-item label="角色名称">
                <a-input v-model="queryParam.name" placeholder="角色名称"/>
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-item label="角色编码">
                <a-input v-model="queryParam.code" placeholder="角色编码"/>
              </a-form-item>
            </a-col>
            <template v-if="advanced">
              <a-col :md="8" :sm="24">
                <a-form-item label="状态">
                  <a-select v-model="queryParam.status" placeholder="请选择">
                    <a-select-option value="">全部</a-select-option>
                    <a-select-option :value="1">启用</a-select-option>
                    <a-select-option :value="0">禁用</a-select-option>
                  </a-select>
                </a-form-item>
              </a-col>
            </template>
            <a-col :md="!advanced && 8 || 24" :sm="24">
              <span class="table-page-search-submitButtons" :style="advanced && { float: 'right', overflow: 'hidden' } || {} ">
                <a-button type="primary" @click="$refs.table.refresh(true)">查询</a-button>
                <a-button style="margin-left: 8px" @click="() => queryParam = {status: ''}">重置</a-button>
                <a style="margin-left: 8px" @click="toggleAdvanced">
                  {{ advanced ? '收起' : '展开' }}
                  <a-icon :type="advanced ? 'up' : 'down'"/>
                </a>
              </span>
            </a-col>
          </a-row>
        </a-form>
      </div>

      <div class="table-operator">
        <a-button type="primary" icon="plus" @click="handleAdd">新增</a-button>
      </div>

      <s-table
        ref="table"
        size="default"
        :columns="columns"
        :rowKey="(record) => record.id"
        :data="loadData"
        :loading="loading"
        :showPagination="true"
      >
        <template slot="index" slot-scope="text, record, index">
          {{ index + 1 }}
        </template>
        <template slot="_title" slot-scope="text, record, index">
          <ellipsis :length="20" tooltip>{{ text }}</ellipsis>
        </template>
        <template slot="common" slot-scope="text, record, index">
          <ellipsis :length="10" tooltip>{{ text }}</ellipsis>
        </template>
        <template slot="status" slot-scope="text, record, index">
          <a-tag v-if="text === 1" color="blue">启用</a-tag>
          <a-tag v-else-if="text === 0" color="red">禁用</a-tag>
        </template>
        <template slot="action" slot-scope="text, record, index">
          <a-button type="primary" size="small" @click="handleEdit(record)">编辑</a-button>
          <a-divider type="vertical" />
          <a-dropdown>
            <a-menu slot="overlay">
              <a-menu-item @click="editMenus(record)">
                菜单
              </a-menu-item>
              <a-menu-item v-if="record.status === 0" @click="updateStatus(record)">
                启用
              </a-menu-item>
              <a-menu-item v-if="record.status === 1" @click="updateStatus(record)">
                禁用
              </a-menu-item>
              <a-menu-item @click="handleDelete(record)">
                删除
              </a-menu-item>
            </a-menu>
            <a-button size="small">
              更多
              <a-icon type="down" />
            </a-button>
          </a-dropdown>
        </template>
      </s-table>

      <a-drawer
        :title="modalTitle"
        :width="600"
        :visible="drawerVisible"
        :maskClosable="false"
        @close="drawerClose"
      >
        <a-form-model
          ref="form"
          layout="vertical"
          :form="form"
          :model="formData"
          :rules="rules"
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
        >
          <a-form-model-item
            ref="name"
            label="角色名称"
            prop="name"
          >
            <a-input
              v-model="formData.name"
              placeholder="请输入角色名称"
            />
          </a-form-model-item>
          <a-form-model-item
            ref="code"
            label="角色编码"
            required
            prop="code"
            :labelCol="labelCol"
            :wrapperCol="wrapperCol"
          >
            <a-input
              v-model="formData.code"
              placeholder="请输入角色编码"
            />
          </a-form-model-item>
          <a-form-model-item
            ref="sort"
            label="排序"
            prop="sort"
          >
            <a-input-number
              v-model="formData.sort"
              :defaultValue="1"
              :max="9999"
              placeholder="请输入排序"
            />
          </a-form-model-item>
          <a-form-model-item
            ref="status"
            label="是否启用"
            prop="status"
          >
            <a-radio-group v-model="formData.status" :default-value="1">
              <a-radio :value="1">
                是
              </a-radio>
              <a-radio :value="0">
                否
              </a-radio>
            </a-radio-group>
          </a-form-model-item>
          <a-form-model-item
            ref="description"
            label="描述"
            prop="description"
          >
            <a-textarea
              :rows="3"
              v-model="formData.description"
              placeholder="请输入描述"
            />
          </a-form-model-item>
        </a-form-model>
        <div
          :style="{
            position: 'absolute',
            right: 0,
            bottom: 0,
            width: '100%',
            borderTop: '1px solid #e9e9e9',
            padding: '10px 16px',
            background: '#fff',
            textAlign: 'right',
            zIndex: 1,
          }"
        >
          <a-button :style="{ marginRight: '10px' }" @click="drawerClose">
            取消
          </a-button>
          <a-button :loading="confirmLoading" type="primary" @click="handleOk">
            确定
          </a-button>
        </div>
      </a-drawer>
      <!-- 角色菜单 -->
      <a-modal
        title="角色菜单"
        :visible="visible"
        :confirm-loading="confirmLoading"
        :destroyOnClose="true"
        :maskClosable="false"
        @afterClose="afterClose"
        @ok="handleRoleMenuOk"
        @cancel="handleCancle"
      >
        <a-tree
          v-model="checkedKeys"
          :maskClosable="false"
          checkable
          :replace-fields="{children:'children', title:'title', key:'id'}"
          :auto-expand-parent="false"
          :tree-data="treeData"
          :checkStrictly="true"
          @check="onCheck"
        />
      </a-modal>
    </a-card>
  </page-header-wrapper>
</template>

<script>
import { STable, Ellipsis, IconSelector } from '@/components'
// eslint-disable-next-line no-unused-vars
import { listByPage, deleteById, add, update, updateStatus, addMenus } from '@/api/system/role'
import { formatPageParams } from '@/utils/pageUtil'
import { listMenusByRoleId, listTree } from '@/api/system/menu'
import * as _ from 'lodash'

export default {
  name: 'Role',
  components: {
    STable,
    Ellipsis,
    IconSelector
  },
  props: {},
  data () {
    return {
      roleId: 0,
      loading: false,
      drawerVisible: false,
      confirmLoading: false,
      modalTitle: '',
      labelCol: {
        xs: { span: 24 },
        sm: { span: 5 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 }
      },
      form: this.$form.createForm(this),
      // 表单数据
      formData: {
        name: '',
        code: '',
        status: 1,
        sort: 1,
        description: ''
      },
      // 默认数据
      defaultFormData: {
        name: '',
        code: '',
        status: 1,
        sort: 1,
        description: ''
      },
      rules: {
        code: [
          { required: true, message: '请输入角色编码', trigger: 'blur' },
          { max: 30, message: '角色编码长度不能超过30', trigger: 'blur' }
        ],
        name: [
          { required: true, message: '请输入角色名称', trigger: 'blur' },
          { max: 30, message: '角色名称长度不能超过30', trigger: 'blur' }
        ],
        sort: [
          { required: true, message: '排序不能为空', trigger: 'blur' }
        ],
        status: [
          { required: true, message: '排序不能为空', trigger: 'blur' }
        ],
        description: [
          { max: 100, message: '描述长度不能超过100', trigger: 'blur' }
        ]
      },
      // 高级搜索 展开/关闭
      advanced: false,
      // 查询参数
      queryParam: {
        name: '',
        code: '',
        status: ''
      },
      // 表头
      columns: [
        {
          title: '序号',
          dataIndex: 'id',
          align: 'center',
          scopedSlots: { customRender: 'index' }
        },
        {
          title: '名称',
          dataIndex: 'name',
          align: 'left',
          scopedSlots: { customRender: 'common' }
        },
        {
          title: '编码',
          dataIndex: 'code',
          align: 'left',
          width: 150,
          scopedSlots: { customRender: 'common' }
        },
        {
          title: '状态',
          dataIndex: 'status',
          align: 'center',
          sorter: true,
          width: 100,
          scopedSlots: { customRender: 'status' }
        },
        {
          title: '创建时间',
          dataIndex: 'createTime',
          align: 'center',
          width: 150,
          scopedSlots: { customRender: 'common' }
        },
        {
          title: '修改时间',
          dataIndex: 'updateTime',
          align: 'center',
          width: 150,
          scopedSlots: { customRender: 'common' }
        },
        {
          title: '操作',
          width: 200,
          dataIndex: 'action',
          align: 'center',
          scopedSlots: { customRender: 'action' }
        }
      ],
      currentRecord: {},
      editMode: false,
      visible: false,
      checkedKeys: [],
      treeData: [],
      checkedNodes: []
    }
  },
  mounted () {},
  methods: {
    toggleAdvanced () {
      this.advanced = !this.advanced
    },
    // 加载数据方法 必须为 Promise 对象
    loadData (params) {
      this.loading = true
      const pageParams = formatPageParams(params)
      return listByPage(Object.assign(this.queryParam, pageParams)).then(res => {
        const { status, data, message } = res
        if (status === 1) {
          return data
        } else {
          this.$message.error(message)
        }
        this.loading = false
      }).catch(err => {
        this.loading = false
        console.error(err)
        this.$message.error(err.message || '请求数据错误')
      })
    },
    updateStatus (record) {
      const params = { id: record.id }
      let defaultMessage = '修改状态成功'
      if (record.status === 1) {
        params.status = 0
        defaultMessage = '禁用成功'
      } else {
        params.status = 1
        defaultMessage = '启用成功'
      }
      updateStatus(params).then(res => {
        const { status, message } = res
        if (status === 1) {
          this.$message.success(defaultMessage)
          this.refreshTable()
        } else {
          this.$message.error(message)
        }
      }).catch(err => {
        console.error(err)
      })
    },
    handleDelete (record) {
      const that = this
      this.$confirm({
        title: '确定删除？',
        content: '删除后无法恢复，请谨慎操作！',
        okText: '确定',
        okType: 'danger',
        cancelText: '取消',
        onOk () {
          if (record.id) {
            deleteById(record.id).then(res => {
              const { status, message } = res
              if (status === 1) {
                that.$message.success('删除成功')
                that.refreshTable()
              } else {
                that.$message.error(message)
              }
            }).catch(err => {
              console.error(err)
            })
          } else {
            that.$message.error('id为空')
          }
        },
        onCancel () {
        }
      })
    },
    handleEdit (record) {
      this.modalTitle = '修改'
      this.drawerVisible = true
      this.editMode = true
      this.currentRecord = record
      this.formData = record
    },
    handleAdd () {
      this.modalTitle = '新增'
      this.drawerVisible = true
      this.editMode = false
      this.currentRecord = {}
      this.formData = Object.assign({}, this.defaultFormData)
    },
    handleOk (e) {
      this.confirmLoading = true
      this.$refs.form.validate((valid) => {
        if (valid) {
          // 修改
          const data = Object.assign({}, this.formData)
          if (this.currentRecord.id) {
            data.id = this.currentRecord.id
            update(data).then(res => {
              const { status, message } = res
              this.confirmLoading = false
              if (status === 1) {
                this.$message.success('修改成功')
                this.drawerVisible = false
                this.clearData()
                this.refreshTable()
              } else {
                this.$message.error(message)
              }
            }).catch(err => {
              this.confirmLoading = false
              console.error(err)
            })
          } else {
            add(data).then(res => {
              this.confirmLoading = false
              const { status, message } = res
              if (status === 1) {
                this.$message.success('新增成功')
                this.drawerVisible = false
                this.clearData()
                this.refreshTable()
              } else {
                this.$message.error(message)
              }
            }).catch(err => {
              this.confirmLoading = false
              console.error(err)
            })
          }
        } else {
          this.$message.warn('数据填写有误，请检查')
          this.confirmLoading = false
        }
      })
    },
    refreshTable () {
      this.$refs.table.refresh()
    },
    drawerClose () {
      this.drawerVisible = false
      this.clearData()
    },
    // 清除缓存的数据
    clearData () {
      this.currentRecord = {}
      this.parentMenu = {}
    },
    editMenus (record) {
      this.roleId = record.id
      this.visible = true
      this.listTreeData()
      this.listMenusByRoleId()
    },
    listTreeData () {
      listTree({}).then(res => {
        const { status, message, data } = res
        if (status === 1) {
          this.treeData = data
        } else {
          this.$message.error(message)
        }
      }).catch(err => {
        this.confirmLoading = false
        console.error(err)
      })
    },
    listMenusByRoleId () {
      listMenusByRoleId(this.roleId).then(res => {
        const { status, message, data } = res
        if (status === 1) {
          if (!_.isNil(data)) {
            const ids = []
            data.forEach(item => {
              // 菜单树中是字符串
              ids.push(item.id + '')
            })
            this.checkedKeys = ids
          }
        } else {
          this.$message.error(message)
        }
      }).catch(err => {
        this.confirmLoading = false
        console.error(err)
      })
    },
    handleRoleMenuOk (e) {
      const data = { roleId: this.roleId, menus: [] }
      const menus = []
      this.checkedNodes.forEach(item => {
        menus.push({ menuId: item.data.props.id })
      })
      data.menus = _.uniqBy(menus, 'menuId')
      addMenus(data).then(res => {
        const { status, message } = res
        if (status === 1) {
          this.$message.success('添加菜单成功')
          this.visible = false
        } else {
          this.$message.error(message)
        }
      }).catch(err => {
        this.confirmLoading = false
        console.error(err)
      })
    },
    handleCancle (e) {
      this.visible = false
    },
    afterClose () {
      this.treeData = []
      this.checkedKeys = []
      this.showRoleMenu = []
    },
    onCheck (checkedKeys, e) {
      this.checkedNodes = e.checkedNodes
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
