<template>
  <page-header-wrapper :title="false">
    <a-card :bordered="false">
      <div class="table-page-search-wrapper">
        <a-form layout="inline">
          <a-row :gutter="48">
            <a-col :md="8" :sm="24">
              <a-form-item label="菜单名称">
                <a-input v-model="queryParam.name" placeholder="菜单名称"/>
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-item label="菜单标题">
                <a-input v-model="queryParam.title" placeholder="菜单标题"/>
              </a-form-item>
            </a-col>
            <template v-if="advanced">
              <a-col :md="8" :sm="24">
                <a-form-item label="菜单编码">
                  <a-input v-model="queryParam.code" placeholder="菜单编码"/>
                </a-form-item>
              </a-col>
              <a-col :md="8" :sm="24">
                <a-form-item label="菜单状态">
                  <a-select v-model="queryParam.status" placeholder="请选择">
                    <a-select-option value="">全部</a-select-option>
                    <a-select-option :value="1">启用</a-select-option>
                    <a-select-option :value="0">禁用</a-select-option>
                  </a-select>
                </a-form-item>
              </a-col>
              <a-col :md="8" :sm="24">
                <a-form-item label="菜单路径">
                  <a-input v-model="queryParam.path" placeholder="菜单路径"/>
                </a-form-item>
              </a-col>
              <a-col :md="8" :sm="24">
                <a-form-item label="菜单组件">
                  <a-input v-model="queryParam.component" placeholder="菜单组件"/>
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
        <template slot="_title" slot-scope="text, record, index">
          <ellipsis :length="20" tooltip>{{ text }}</ellipsis>
        </template>
        <template slot="common" slot-scope="text, record, index">
          <ellipsis :length="10" tooltip>{{ text }}</ellipsis>
        </template>
        <template slot="icon" slot-scope="text, record, index">
          <a-tooltip :title="text">
            <a-icon :type="text" :style="{ fontSize: '18px', color: '#08c' }" />
          </a-tooltip>
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
              <a-menu-item @click="handleAddChild(record)">
                子菜单
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
            ref="parentTitle"
            label="上级菜单"
            :labelCol="labelCol"
            :wrapperCol="wrapperCol"
            v-if="parentMenu.id"
          >
            <span>{{ parentMenu.title }}</span>
          </a-form-model-item>
          <a-form-model-item
            ref="title"
            label="菜单标题"
            required
            prop="title"
            :labelCol="labelCol"
            :wrapperCol="wrapperCol"
          >
            <a-input
              v-model="formData.title"
              placeholder="请输入菜单标题"
            />
          </a-form-model-item>
          <a-form-model-item
            ref="name"
            label="菜单名称"
            prop="name"
          >
            <a-input
              v-model="formData.name"
              placeholder="请输入菜单名称"
            />
          </a-form-model-item>
          <a-form-model-item
            ref="path"
            label="菜单路径"
            prop="path"
          >
            <a-input
              v-model="formData.path"
              placeholder="请输入菜单路径"
            />
          </a-form-model-item>
          <a-form-model-item
            ref="component"
            label="菜单组件"
            prop="component"
          >
            <a-input
              v-model="formData.component"
              placeholder="请输入菜单组件"
            />
          </a-form-model-item>
          <a-form-model-item
            ref="redirect"
            label="重定向路径"
            prop="redirect"
          >
            <a-input
              v-model="formData.redirect"
              placeholder="请输入重定向路径"
            />
          </a-form-model-item>
          <a-form-model-item
            ref="icon"
            label="菜单图标"
            prop="icon"
          >
            <a-input-search
              placeholder="请选择菜单图标"
              enter-button
              @search="searchIcon"
              v-model="formData.icon"
              @click="searchIcon"
            />
          </a-form-model-item>
          <a-form-model-item
            ref="sort"
            label="菜单排序"
            prop="sort"
          >
            <a-input-number
              v-model="formData.sort"
              :defaultValue="1"
              :max="9999"
              placeholder="请输入菜单排序"
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
            ref="keepAlive"
            label="是否缓存"
            prop="hidden"
          >
            <a-radio-group v-model="formData.keepAlive" :default-value="0">
              <a-radio :value="1">
                是
              </a-radio>
              <a-radio :value="0">
                否
              </a-radio>
            </a-radio-group>
          </a-form-model-item>
          <a-form-model-item
            ref="hidden"
            label="是否隐藏"
            prop="hidden"
          >
            <a-radio-group v-model="formData.hidden" :default-value="0">
              <a-radio :value="1">
                是
              </a-radio>
              <a-radio :value="0">
                否
              </a-radio>
            </a-radio-group>
          </a-form-model-item>
          <a-form-model-item
            ref="hideChildren"
            label="是否隐藏子菜单"
            prop="hideChildren"
          >
            <a-radio-group v-model="formData.hideChildren" :default-value="0">
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
            label="菜单描述"
            prop="description"
          >
            <a-textarea
              :rows="3"
              v-model="formData.description"
              placeholder="请输入菜单描述"
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

      <a-modal
        v-model="iconModalVisible"
        title="选择图标"
        okText="确定"
        cancelText="取消"
        :width="800"
        :destroyOnClose="false"
        :maskClosable="false"
        @ok="iconOk"
        @cancel="iconModalVisible = false"
      >
        <icon-selector
          v-model="selectedIcon"
          @change="handleIconChange" />
      </a-modal>
    </a-card>
  </page-header-wrapper>
</template>

<script>
import { STable, Ellipsis, IconSelector } from '@/components'
import { listByTreePage, deleteById, add, update, updateStatus, getMenuById } from '@/api/system/menu'
import { formatPageParams } from '@/utils/pageUtil'

export default {
  name: 'Menu',
  components: {
    STable,
    Ellipsis,
    IconSelector
  },
  props: {},
  data () {
    return {
      selectedIcon: '',
      loading: false,
      iconModalVisible: false,
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
      formData: {
        name: '',
        title: '',
        path: '',
        icon: '',
        component: '',
        redirect: '',
        hidden: 0,
        hideChildren: 0,
        keepAlive: 0,
        status: 1,
        sort: 1,
        description: ''
      },
      defaultFormData: {
        name: '',
        title: '',
        path: '',
        icon: '',
        component: '',
        redirect: '',
        hidden: 0,
        hideChildren: 0,
        keepAlive: 0,
        status: 1,
        sort: 1,
        description: ''
      },
      rules: {
        title: [
          { required: true, message: '请输入菜单标题', trigger: 'blur' },
          { max: 30, message: '菜单标题长度不能超过30', trigger: 'blur' }
        ],
        name: [
          { required: true, message: '请输入菜单名称', trigger: 'blur' },
          { max: 30, message: '菜单名称长度不能超过30', trigger: 'blur' }
        ],
        path: [
          { required: true, message: '请输入菜单路径', trigger: 'blur' },
          { max: 100, message: '菜单路径长度不能超过100', trigger: 'blur' }
        ],
        component: [
          { required: true, message: '请输入菜单组件', trigger: 'blur' },
          { max: 100, message: '菜单组件长度不能超过100', trigger: 'blur' }
        ],
        hidden: [
          { required: true, message: '是否隐藏不能为空', trigger: 'blur' }
        ],
        hideChildren: [
          { required: true, message: '是否隐藏子菜单不能为空', trigger: 'blur' }
        ],
        keepAlive: [
          { required: true, message: '是否缓存不能为空', trigger: 'blur' }
        ],
        status: [
          { required: true, message: '是否启用不能为空', trigger: 'blur' }
        ],
        sort: [
          { required: true, message: '菜单排序不能为空', trigger: 'blur' }
        ],
        description: [
          { max: 100, message: '菜单描述长度不能超过100', trigger: 'blur' }
        ]
      },
      // 高级搜索 展开/关闭
      advanced: false,
      // 查询参数
      queryParam: {
        name: '',
        title: '',
        code: '',
        path: '',
        component: '',
        status: ''
      },
      // 表头
      columns: [
        {
          title: '标题',
          dataIndex: 'title',
          align: 'left',
          scopedSlots: { customRender: '_title' }
        },
        {
          title: '名称',
          dataIndex: 'name',
          align: 'left',
          width: 150,
          scopedSlots: { customRender: 'common' }
        },
        {
          title: '图标',
          dataIndex: 'icon',
          align: 'center',
          width: 100,
          scopedSlots: { customRender: 'icon' }
        },
        {
          title: '状态',
          dataIndex: 'status',
          align: 'center',
          sorter: true,
          width: 80,
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
          width: '200px',
          dataIndex: 'action',
          align: 'center',
          scopedSlots: { customRender: 'action' }
        }
      ],
      currentRecord: {},
      editMode: false,
      parentMenu: {}
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
      return listByTreePage(Object.assign(this.queryParam, pageParams)).then(res => {
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
      getMenuById(record.id).then(res => {
        const { status, message, data } = res
        if (status === 1) {
          this.formData = data
        } else {
          this.$message.error(message)
        }
      }).catch(err => {
        console.error(err)
      })
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
            // 新增子菜单
            if (this.parentMenu) {
              data.parentId = this.parentMenu.id
            }
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
    searchIcon () {
      this.iconModalVisible = true
    },
    iconOk () {
      if (!this.selectedIcon) {
        this.$message.warn('请选择图标')
        return
      }
      this.formData.icon = this.selectedIcon
      this.iconModalVisible = false
    },
    handleIconChange (icon) {
      this.selectedIcon = icon
    },
    handleAddChild (record) {
      this.modalTitle = '新增子菜单'
      this.drawerVisible = true
      this.editMode = false
      this.currentRecord = {}
      this.parentMenu = record
      this.formData = Object.assign({}, this.defaultFormData)
    },
    // 清除缓存的数据
    clearData () {
      this.currentRecord = {}
      this.parentMenu = {}
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
