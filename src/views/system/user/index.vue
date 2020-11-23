<template>
  <page-header-wrapper :title="false">
    <a-card :bordered="false">
      <div class="table-page-search-wrapper">
        <a-form layout="inline">
          <a-row :gutter="48">
            <a-col :md="8" :sm="24">
              <a-form-item label="名称">
                <a-input v-model="queryParam.name" placeholder="名称"/>
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-item label="账号">
                <a-input v-model="queryParam.username" placeholder="账号"/>
              </a-form-item>
            </a-col>
            <template v-if="advanced">
              <a-col :md="8" :sm="24">
                <a-form-item label="手机">
                  <a-input v-model="queryParam.phone" placeholder="手机"/>
                </a-form-item>
              </a-col>
              <a-col :md="8" :sm="24">
                <a-form-item label="邮箱">
                  <a-input v-model="queryParam.email" placeholder="邮箱"/>
                </a-form-item>
              </a-col>
              <a-col :md="8" :sm="24">
                <a-form-item label="状态">
                  <a-select v-model="queryParam.status" placeholder="请选择">
                    <a-select-option value="">全部</a-select-option>
                    <a-select-option :value="1">正常</a-select-option>
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
          <a-tag v-if="text === 1" color="blue">正常</a-tag>
          <a-tag v-else-if="text === 0" color="red">禁用</a-tag>
        </template>
        <template slot="action" slot-scope="text, record, index">
          <a-button type="primary" size="small" @click="handleEdit(record)">编辑</a-button>
          <a-divider type="vertical" />
          <a-dropdown>
            <a-menu slot="overlay">
              <a-menu-item @click="editRoles(record)">
                角色
              </a-menu-item>
              <a-menu-item @click="resetPassword(record)">
                重置密码
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
            label="姓名"
            required
            prop="name"
            :labelCol="labelCol"
            :wrapperCol="wrapperCol"
          >
            <a-input
              v-model="formData.name"
              placeholder="请输入姓名"
            />
          </a-form-model-item>
          <a-form-model-item
            ref="username"
            label="账号"
            prop="username"
          >
            <a-input
              v-model="formData.username"
              placeholder="请输入账号"
            />
          </a-form-model-item>
          <a-form-model-item
            v-if="!editMode"
            ref="password"
            prop="password"
          >
            <span slot="label">
              密码
              <a-tooltip title="请输入字母、数字、特殊符号等">
                <a-icon type="question-circle-o" />
              </a-tooltip>
            </span>
            <a-input-password
              v-model="formData.password"
              placeholder="请输入密码"
            />
          </a-form-model-item>
          <a-form-model-item
            ref="phone"
            label="手机"
            prop="phone"
          >
            <a-input-number
              v-model="formData.phone"
              placeholder="请输入手机"
              style="width: 200px"
            />
          </a-form-model-item>
          <a-form-model-item
            ref="email"
            label="邮箱"
            prop="email"
          >
            <a-input
              v-model="formData.email"
              placeholder="请输入邮箱"
            />
          </a-form-model-item>
          <a-form-model-item
            ref="sex"
            label="性别"
            prop="sex"
          >
            <a-radio-group v-model="formData.sex" :default-value="1">
              <a-radio :value="1">
                男
              </a-radio>
              <a-radio :value="0">
                女
              </a-radio>
            </a-radio-group>
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
    </a-card>

    <!-- 用户角色 -->
    <a-modal
      title="用户角色"
      :visible="roleVisible"
      :confirm-loading="roleConfirmLoading"
      :destroyOnClose="true"
      :maskClosable="false"
      @ok="handleRoleOk"
      @cancel="handleRoleCancle"
    >
      <a-select
        mode="multiple"
        placeholder="请选择角色"
        style="width: 400px"
        v-model="userRoles"
      >
        <a-select-option v-for="item in roles" :key="item.id">
          {{ item.name }}
        </a-select-option>
      </a-select>
    </a-modal>
  </page-header-wrapper>
</template>

<script>import { STable, Ellipsis, IconSelector } from '@/components'
import { listByPage, deleteById, add, edit, updateStatus, resetPassword, updateRoles } from '@/api/system/user'
// eslint-disable-next-line no-unused-vars
import { listRolesByUserId, list } from '@/api/system/role'
import { formatPageParams } from '@/utils/pageUtil'
import * as _ from 'lodash'
import md5 from 'md5'
export default {
  name: 'User',
  components: {
    STable,
    Ellipsis,
    IconSelector
  },
  props: {},
  data () {
    return {
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
        username: '',
        password: '',
        status: 1,
        phone: '',
        sex: 1,
        email: '',
        birthday: ''
      },
      // 默认数据
      defaultFormData: {
        name: '',
        username: '',
        password: '',
        status: 1,
        phone: '',
        sex: 1,
        email: '',
        birthday: ''
      },
      rules: {
        username: [
          { required: true, whitespace: true, message: '请输入账号', trigger: 'blur' },
          { max: 30, message: '账号长度不能超过30', trigger: 'blur' }
        ],
        name: [
          { required: true, message: '请输入姓名', trigger: 'blur' },
          { max: 10, message: '姓名长度不能超过10', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { max: 20, message: '密码长度不能超过20', trigger: 'blur' }
        ],
        phone: [
          { required: true, message: '手机号不能为空', trigger: 'blur' },
          { required: true, len: 11, message: '手机长度必须是11位', trigger: 'blur' }
        ],
        email: [
          { required: true, type: 'email', message: '邮箱为空或者格式错误', trigger: 'blur' },
          { max: 50, message: '邮箱长度不能超过50', trigger: 'blur' }
        ],
        sex: [
          { required: true, message: '性别不能为空', trigger: 'blur' }
        ]
      },
      // 高级搜索 展开/关闭
      advanced: false,
      // 查询参数
      queryParam: {
        name: '',
        username: '',
        phone: '',
        email: '',
        status: ''
      },
      // 表头
      columns: [
        {
          title: '序号',
          dataIndex: 'id',
          align: 'center',
          width: 100,
          scopedSlots: { customRender: 'index' }
        },
        {
          title: '名称',
          dataIndex: 'name',
          align: 'center',
          scopedSlots: { customRender: '_title' }
        },
        {
          title: '账号',
          dataIndex: 'username',
          align: 'center',
          width: 100
        },
        {
          title: '手机',
          dataIndex: 'phone',
          align: 'left',
          width: 150
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
      roleVisible: false,
      roleConfirmLoading: false,
      userRoles: [],
      roles: [],
      currentUser: {}
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
      this.formData = _.cloneDeep(record)
    },
    handleAdd () {
      this.modalTitle = '新增'
      this.drawerVisible = true
      this.editMode = false
      this.currentRecord = {}
      this.formData = _.cloneDeep(this.defaultFormData)
    },
    handleOk (e) {
      this.confirmLoading = true
      this.$refs.form.validate((valid) => {
        if (valid) {
          // 修改
          const data = _.cloneDeep(this.formData)
          if (this.currentRecord.id) {
            data.id = this.currentRecord.id
            edit(data).then(res => {
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
            data.password = md5(data.password)
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
      this.editMode = false
    },
    resetPassword (record) {
      const that = this
      this.$confirm({
        title: '确定重置密码？',
        content: '重置密码将由系统生成随机密码，请谨慎操作！',
        okText: '确定',
        okType: 'danger',
        cancelText: '取消',
        onOk () {
          if (record.id) {
            resetPassword(record.id).then(res => {
              const { status, message, data } = res
              if (status === 1) {
                that.$message.success('重置密码成功')
                that.$success({
                  title: '重置密码成功',
                  content: `新密码：${data}，请妥善保管！`
                })
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
    handleRoleOk () {
      const data = {}
      data.userId = this.currentUser.id
      data.roles = this.userRoles
      updateRoles(data).then(res => {
        const { status, message } = res
        if (status === 1) {
          this.roleVisible = false
          this.$message.success('修改用户角色成功')
        } else {
          this.$message.error(message)
        }
      }).catch(err => {
        console.error(err)
      })
    },
    handleRoleCancle () {
      this.roleVisible = false
    },
    editRoles (record) {
      this.currentUser = record
      this.roleVisible = true
      this.listRoles()
      this.listRolesByUserId(record)
    },
    listRoles () {
      list({}).then(res => {
        const { status, message, data } = res
        if (status === 1) {
          if (_.isNil(data)) {
            this.roles = []
          } else {
            this.roles = data
          }
        } else {
          this.$message.error(message)
        }
      }).catch(err => {
        console.error(err)
      })
    },
    listRolesByUserId (record) {
      listRolesByUserId({ userId: record.id }).then(res => {
        const { status, message, data } = res
        if (status === 1) {
          if (_.isNil(data)) {
            this.userRoles = []
          } else {
            const userRoles = []
            data.forEach(item => {
              userRoles.push(item.id)
            })
            this.userRoles = userRoles
          }
        } else {
          this.$message.error(message)
        }
      }).catch(err => {
        console.error(err)
      })
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
