<template>
  <page-header-wrapper :title="false">
    <a-card :bordered="false">
      <div class="table-page-search-wrapper">
        <a-form layout="inline">
          <a-row :gutter="48">
            <a-col :md="8" :sm="24">
              <a-form-item label="客户端名称">
                <a-input v-model="queryParam.name" placeholder="客户端名称"/>
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-item label="客户端id">
                <a-input v-model="queryParam.clientId" placeholder="客户端id"/>
              </a-form-item>
            </a-col>
            <template v-if="advanced">
              <a-col :md="8" :sm="24">
                <a-form-item label="客户端secret">
                  <a-input v-model="queryParam.clientSecret" placeholder="客户端secret"/>
                </a-form-item>
              </a-col>
              <a-col :md="8" :sm="24">
                <a-form-item label="是否自动授权">
                  <a-select v-model="queryParam.autoapprove" placeholder="请选择">
                    <a-select-option value="">全部</a-select-option>
                    <a-select-option :value="true">是</a-select-option>
                    <a-select-option :value="false">否</a-select-option>
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
        <template slot="common" slot-scope="text, record, index">
          <ellipsis :length="10" tooltip>{{ text }}</ellipsis>
        </template>
        <template slot="status" slot-scope="text, record, index">
          <a-tag v-if="text === true" color="blue">是</a-tag>
          <a-tag v-else-if="text === false" color="red">否</a-tag>
        </template>
        <template slot="action" slot-scope="text, record, index">
          <a-button type="primary" size="small" @click="handleEdit(record)">编辑</a-button>
          <a-divider type="vertical" />
          <a-dropdown>
            <a-menu slot="overlay">
              <a-menu-item @click="resetClientSecret(record)">
                重置secret
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
        :width="650"
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
            label="名称"
            required
            prop="name"
            :labelCol="labelCol"
            :wrapperCol="wrapperCol"
          >
            <a-input
              v-model="formData.name"
              placeholder="请输入客户端名称"
            />
          </a-form-model-item>
          <a-form-model-item
            ref="clientId"
            label="客户端id"
            prop="clientId"
          >
            <a-input
              v-model="formData.clientId"
              placeholder="请输入客户端id"
            />
          </a-form-model-item>
          <a-form-model-item
            ref="clientSecret"
            prop="clientSecret"
            v-if="!this.editMode"
          >
            <span slot="label">
              客户端secret&nbsp;
              <a-tooltip title="由系统自动生成">
                <a-icon type="question-circle-o" />
              </a-tooltip>
            </span>
            <a-input
              v-model="formData.clientSecret"
              placeholder="由系统自动生成"
              :disabled="true"
            />
          </a-form-model-item>
          <a-form-model-item
            ref="accessTokenValidity"
            label="令牌有效期"
            prop="accessTokenValidity"
          >
            <a-input-number
              v-model="formData.accessTokenValidity"
              :defaultValue="1"
              :max="9999999"
              placeholder="请输入令牌有效期"
            />
          </a-form-model-item>
          <a-form-model-item
            ref="refreshTokenValidity"
            label="刷新令牌有效期"
            prop="refreshTokenValidity"
          >
            <a-input-number
              v-model="formData.refreshTokenValidity"
              :defaultValue="1"
              :max="9999999"
              placeholder="请输入刷新令牌有效期"
            />
          </a-form-model-item>
          <a-form-model-item
            ref="authorizedGrantTypes"
            label="授权方式"
            prop="authorizedGrantTypes"
          >
            <a-select
              mode="multiple"
              placeholder="请选择授权方式"
              v-model="formData.authorizedGrantTypes"
            >
              <a-select-option key="password">用户密码</a-select-option>
              <a-select-option key="refresh_token">刷新令牌</a-select-option>
              <a-select-option key="authorization_code">授权码</a-select-option>
              <a-select-option key="client_credentials">客户端认证</a-select-option>
              <a-select-option key="implicit">简化模式</a-select-option>
              <a-select-option key="mobile">手机登录</a-select-option>
            </a-select>
          </a-form-model-item>
          <a-form-model-item
            ref="scope"
            label="权限范围"
            prop="scope"
          >
            <a-input
              v-model="formData.scope"
              placeholder="请输入权限范围"
            />
          </a-form-model-item>
          <a-form-model-item
            ref="webServerRedirectUri"
            label="重定向地址"
            prop="webServerRedirectUri"
          >
            <a-input
              v-model="formData.webServerRedirectUri"
              placeholder="请输入重定向地址"
            />
          </a-form-model-item>
          <a-form-model-item
            ref="autoapprove"
            label="自动授权"
            prop="autoapprove"
          >
            <a-switch
              checked-children="是"
              un-checked-children="否"
              v-model="formData.autoapprove"
            />
          </a-form-model-item>
          <a-form-model-item
            ref="resourceIds"
            label="资源id"
            prop="resourceIds"
          >
            <a-textarea
              :rows="3"
              v-model="formData.resourceIds"
              placeholder="请输入资源id"
            />
          </a-form-model-item>
          <a-form-model-item
            ref="additionalInformation"
            label="附加信息"
            prop="additionalInformation"
          >
            <a-textarea
              :rows="3"
              v-model="formData.additionalInformation"
              placeholder="请输入附加信息"
            />
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
        </div></a-drawer>
    </a-card>
  </page-header-wrapper>
</template>

<script>
import { STable, Ellipsis, IconSelector } from '@/components'
import { listByPage, deleteById, add, update, resetClientSecret } from '@/api/system/client'
import { formatPageParams } from '@/utils/pageUtil'
import * as _ from 'lodash'

export default {
  name: 'Client',
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
        clientId: '',
        clientSecret: '',
        scope: '',
        resourceIds: '',
        accessTokenValidity: 3600,
        refreshTokenValidity: 7200,
        authorizedGrantTypes: [],
        webServerRedirectUri: '',
        autoapprove: true,
        additionalInformation: '',
        description: ''
      },
      // 默认数据
      defaultFormData: {
        name: '',
        clientId: '',
        clientSecret: '',
        scope: '',
        resourceIds: '',
        accessTokenValidity: 3600,
        refreshTokenValidity: 7200,
        authorizedGrantTypes: ['password', 'refresh_token'],
        webServerRedirectUri: '',
        autoapprove: true,
        additionalInformation: '',
        description: ''
      },
      rules: {
        name: [
          { required: true, message: '请输入客户端名称', trigger: 'blur' },
          { max: 50, message: '客户端名称长度不能超过50', trigger: 'blur' }
        ],
        clientId: [
          { required: true, message: '请输入客户端id', trigger: 'blur' },
          { max: 100, message: '客户端id长度不能超过100', trigger: 'blur' }
        ],
        authorizedGrantTypes: [
          { required: true, message: '授权方式不能为空', trigger: 'blur' }
        ],
        webServerRedirectUri: [
          { required: true, message: '重定向地址不能为空', trigger: 'blur' },
          { max: 200, message: '重定向地址长度不能超过200', trigger: 'blur' }
        ],
        accessTokenValidity: [
          { required: true, message: '令牌有效期不能为空', trigger: 'blur' }
        ],
        refreshTokenValidity: [
          { required: true, message: '刷新令牌有效期不能为空', trigger: 'blur' }
        ],
        description: [
          { max: 200, message: '描述长度不能超过200', trigger: 'blur' }
        ]
      },
      // 高级搜索 展开/关闭
      advanced: false,
      // 查询参数
      queryParam: {
        name: '',
        clientId: '',
        clientSecret: '',
        autoapprove: ''
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
          sorter: true,
          align: 'left',
          scopedSlots: { customRender: 'common' }
        },
        {
          title: '客户端id',
          dataIndex: 'clientId',
          align: 'left',
          width: 150,
          scopedSlots: { customRender: 'common' }
        },
        {
          title: '自动授权',
          dataIndex: 'autoapprove',
          align: 'center',
          width: 150,
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
      editMode: false
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
      if (_.isNil(record.authorizedGrantTypes)) {
        record.authorizedGrantTypes = []
      } else {
        record.authorizedGrantTypes = record.authorizedGrantTypes.split(',')
      }
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
      this.formData = _.cloneDeep(this.defaultFormData)
    },
    handleOk (e) {
      const that = this
      this.confirmLoading = true
      this.$refs.form.validate((valid) => {
        if (valid) {
          // 修改
          const data = _.cloneDeep(this.formData)
          data.authorizedGrantTypes = _.join(data.authorizedGrantTypes, ',')
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
              const { status, message, data } = res
              if (status === 1) {
                this.$message.success('新增成功')
                this.drawerVisible = false
                this.clearData()
                this.refreshTable()
                that.$success({
                  title: '新增客户端成功',
                  content: `客户端secret：${data}，请妥善保管！`,
                  okText: '确定'
                })
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
    resetClientSecret (record) {
      const that = this
      this.$confirm({
        title: '确定重置？',
        content: '重置secret将由系统随机生成，请谨慎操作！',
        okText: '确定',
        okType: 'danger',
        cancelText: '取消',
        onOk () {
          if (record.id) {
            resetClientSecret(record.id).then(res => {
              const { status, message, data } = res
              if (status === 1) {
                that.$message.success('重置secret成功')
                that.$success({
                  title: '重置secret成功',
                  content: `新secret：${data}，请妥善保管！`,
                  okText: '确定'
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
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
