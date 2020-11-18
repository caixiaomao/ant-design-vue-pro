<template>
  <a-drawer
    title="字典项"
    :width="950"
    :visible="itemDrawerVisible"
    :maskClosable="false"
    :destroyOnClose="true"
    @close="itemDrawerClose"
  >
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="48">
          <a-col :md="8" :sm="24">
            <a-form-item label="名称">
              <a-input v-model="queryItemParam.name" placeholder="名称"/>
            </a-form-item>
          </a-col>
          <a-col :md="8" :sm="24">
            <a-form-item label="编码">
              <a-input v-model="queryItemParam.code" placeholder="编码"/>
            </a-form-item>
          </a-col>
          <template v-if="itemAdvanced">
            <a-col :md="8" :sm="24">
              <a-form-item label="状态">
                <a-select v-model="queryItemParam.status" placeholder="请选择">
                  <a-select-option value="">全部</a-select-option>
                  <a-select-option :value="1">启用</a-select-option>
                  <a-select-option :value="0">禁用</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
          </template>
          <a-col :md="!itemAdvanced && 8 || 24" :sm="24">
            <span class="table-page-search-submitButtons" :style="itemAdvanced && { float: 'right', overflow: 'hidden' } || {} ">
              <a-button type="primary" @click="$refs.itemTable.refresh(true)">查询</a-button>
              <a-button style="margin-left: 8px" @click="() => queryItemParam = {status: ''}">重置</a-button>
              <a style="margin-left: 8px" @click="toggleItemAdvanced">
                {{ itemAdvanced ? '收起' : '展开' }}
                <a-icon :type="itemAdvanced ? 'up' : 'down'"/>
              </a>
            </span>
          </a-col>
        </a-row>
      </a-form>
    </div>

    <div class="table-operator">
      <a-button type="primary" icon="plus" @click="handleItemAdd">新增</a-button>
    </div>

    <s-table
      ref="itemTable"
      size="default"
      :columns="itemColumns"
      :rowKey="(record) => record.id"
      :data="loadItemData"
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
        <a-tag v-if="text === 1" color="blue">启用</a-tag>
        <a-tag v-else-if="text === 0" color="red">禁用</a-tag>
      </template>
      <template slot="action" slot-scope="text, record, index">
        <a-button type="primary" size="small" @click="handleItemEdit(record)">编辑</a-button>
        <a-divider type="vertical" />
        <a-dropdown>
          <a-menu slot="overlay">
            <a-menu-item v-if="record.status === 0" @click="updateItemStatus(record)">
              启用
            </a-menu-item>
            <a-menu-item v-if="record.status === 1" @click="updateItemStatus(record)">
              禁用
            </a-menu-item>
            <a-menu-item @click="handleItemDelete(record)">
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
      <a-button @click="itemDrawerClose">
        关闭
      </a-button>
    </div>

    <a-drawer
      :title="modalItemTitle"
      :width="600"
      :visible="drawerItemEditVisible"
      :maskClosable="false"
      @close="drawerItemEditClose"
    >
      <a-form-model
        ref="itemForm"
        layout="vertical"
        :form="itemForm"
        :model="itemFormData"
        :rules="itemRules"
        :labelCol="labelCol"
        :wrapperCol="wrapperCol"
      >
        <a-form-model-item
          ref="name"
          label="字典项名称"
          prop="name"
        >
          <a-input
            v-model="itemFormData.name"
            placeholder="请输入字典项名称"
          />
        </a-form-model-item>
        <a-form-model-item
          ref="code"
          label="字典项编码"
          required
          prop="code"
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
        >
          <a-input
            v-model="itemFormData.code"
            placeholder="请输入字典项编码"
          />
        </a-form-model-item>
        <a-form-model-item
          ref="status"
          label="是否启用"
          prop="status"
        >
          <a-radio-group v-model="itemFormData.status" :default-value="1">
            <a-radio :value="1">
              是
            </a-radio>
            <a-radio :value="0">
              否
            </a-radio>
          </a-radio-group>
        </a-form-model-item>
        <a-form-model-item
          ref="sort"
          label="排序"
          prop="sort"
        >
          <a-input-number
            v-model="itemFormData.sort"
            :defaultValue="1"
            :max="9999"
            placeholder="请输入排序"
          />
        </a-form-model-item>
        <a-form-model-item
          ref="description"
          label="描述"
          prop="description"
        >
          <a-textarea
            :rows="3"
            v-model="itemFormData.description"
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
        <a-button :style="{ marginRight: '10px' }" @click="drawerItemEditClose">
          取消
        </a-button>
        <a-button :loading="confirmItemLoading" type="primary" @click="handleItemOk">
          确定
        </a-button>
      </div>
    </a-drawer>
  </a-drawer>
</template>

<script>
import { STable, Ellipsis, IconSelector } from '@/components'
// eslint-disable-next-line no-unused-vars
import { listItemByPage, addItem, editItem, deleteItemById, updateItemStatus } from '@/api/dict_item'
import { formatPageParams } from '@/utils/pageUtil'
import * as _ from 'lodash'
export default {
  name: 'DictItem',
  components: {
    STable,
    Ellipsis,
    IconSelector
  },
  props: {
    dictId: {
      type: Number,
      required: true
    },
    showDictItem: {
      type: Boolean,
      required: false,
      default: false
    }
  },
  mounted () {
    this.refreshItemTable()
  },
  data () {
    return {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 5 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 }
      },
      loading: false,
      itemDrawerVisible: false,
      itemColumns: [
        {
          title: '序号',
          dataIndex: 'id',
          align: 'center',
          width: 80,
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
          width: 100,
          align: 'center'
        },
        {
          title: '状态',
          dataIndex: 'status',
          align: 'center',
          width: 60,
          scopedSlots: { customRender: 'status' }
        },
        {
          title: '排序',
          dataIndex: 'sort',
          width: 80,
          sorter: true,
          align: 'center'
        },
        {
          title: '创建时间',
          dataIndex: 'createTime',
          align: 'center',
          width: 130,
          scopedSlots: { customRender: 'common' }
        },
        {
          title: '修改时间',
          dataIndex: 'updateTime',
          align: 'center',
          width: 130,
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
      itemAdvanced: false,
      drawerItemEditVisible: false,
      queryItemParam: {
        name: '',
        code: '',
        status: ''
      },
      itemForm: this.$form.createForm(this),
      // 表单数据
      itemFormData: {
        name: '',
        code: '',
        status: 1,
        description: '',
        sort: 1
      },
      itemDefaultFormData: {
        name: '',
        code: '',
        status: 1,
        description: '',
        sort: 1
      },
      itemRules: {
        code: [
          { required: true, message: '请输入字典项编码', trigger: 'blur' },
          { max: 30, message: '字典编码长度不能超过30', trigger: 'blur' }
        ],
        name: [
          { required: true, message: '请输入字典项名称', trigger: 'blur' },
          { max: 30, message: '字典名称长度不能超过30', trigger: 'blur' }
        ],
        status: [
          { required: true, message: '排序不能为空', trigger: 'blur' }
        ],
        description: [
          { max: 100, message: '描述长度不能超过100', trigger: 'blur' }
        ]
      },
      currentDict: {},
      currentItemRecord: {},
      editItemMode: false,
      modalItemTitle: '',
      confirmItemLoading: false
    }
  },
  methods: {
    itemDrawerClose () {
      this.itemDrawerVisible = false
      this.$emit('destroyClose')
    },
    toggleItemAdvanced () {
      this.itemAdvanced = !this.itemAdvanced
    },
    drawerItemEditClose () {
      this.drawerItemEditVisible = false
    },
    loadItemData (params) {
      this.loading = true
      const pageParams = formatPageParams(params)
      const _params = Object.assign(this.queryItemParam, pageParams)
      _params.dictId = this.dictId
      return listItemByPage(_params).then(res => {
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
    handleItemAdd () {
      this.modalItemTitle = '新增字典项'
      this.drawerItemEditVisible = true
      this.editItemMode = false
      this.currentItemRecord = {}
      this.itemFormData = _.cloneDeep(this.itemDefaultFormData)
    },
    handleItemOk (e) {
      this.confirmItemLoading = true
      this.$refs.itemForm.validate((valid) => {
        if (valid) {
          // 修改
          const data = _.cloneDeep(this.itemFormData)
          data.dictId = this.dictId
          if (this.currentItemRecord.id) {
            data.id = this.currentItemRecord.id
            editItem(data).then(res => {
              const { status, message } = res
              this.confirmItemLoading = false
              if (status === 1) {
                this.$message.success('修改成功')
                this.drawerItemEditVisible = false
                this.clearData()
                this.refreshItemTable()
              } else {
                this.$message.error(message)
              }
            }).catch(err => {
              this.confirmItemLoading = false
              console.error(err)
            })
          } else {
            addItem(data).then(res => {
              this.confirmItemLoading = false
              const { status, message } = res
              if (status === 1) {
                this.$message.success('新增成功')
                this.drawerItemEditVisible = false
                this.clearData()
                this.refreshItemTable()
              } else {
                this.$message.error(message)
              }
            }).catch(err => {
              this.confirmItemLoading = false
              console.error(err)
            })
          }
        } else {
          this.$message.warn('数据填写有误，请检查')
          this.confirmItemLoading = false
        }
      })
    },
    updateItemStatus (record) {
      const params = { id: record.id }
      let defaultMessage = '修改状态成功'
      if (record.status === 1) {
        params.status = 0
        defaultMessage = '禁用成功'
      } else {
        params.status = 1
        defaultMessage = '启用成功'
      }
      updateItemStatus(params).then(res => {
        const { status, message } = res
        if (status === 1) {
          this.$message.success(defaultMessage)
          this.refreshItemTable()
        } else {
          this.$message.error(message)
        }
      }).catch(err => {
        console.error(err)
      })
    },
    handleItemDelete (record) {
      const that = this
      this.$confirm({
        title: '确定删除？',
        content: '删除后无法恢复，请谨慎操作！',
        okText: '确定',
        okType: 'danger',
        cancelText: '取消',
        onOk () {
          if (record.id) {
            deleteItemById(record.id).then(res => {
              const { status, message } = res
              if (status === 1) {
                that.$message.success('删除成功')
                that.refreshItemTable()
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
    handleItemEdit (record) {
      this.modalItemTitle = '修改字典项'
      this.drawerItemEditVisible = true
      this.editItemMode = true
      this.currentItemRecord = record
      this.itemFormData = _.cloneDeep(record)
    },
    refreshItemTable () {
      this.$refs.itemTable.refresh()
    },
    clearData () {
    }
  },
  watch: {
    showDictItem: function (val) {
      this.itemDrawerVisible = val
    }
  }
}
</script>

<style scoped>

</style>
