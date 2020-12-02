<template>
  <page-header-wrapper :title="false" content="在线用户">
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
              <a-form-item label="编码">
                <a-input v-model="queryParam.username" placeholder="用户名"/>
              </a-form-item>
            </a-col>
            <template v-if="advanced">
              <a-col :md="8" :sm="24">
                <a-form-item label="编码">
                  <a-input v-model="queryParam.clientId" placeholder="客户端"/>
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
        <a-button type="primary" icon="reload" @click="loadData">刷新</a-button>
      </div>

      <a-table
        ref="table"
        size="default"
        :columns="columns"
        :rowKey="(record) => record.id"
        :data-source="dataSource"
        :loading="loading"
        :showPagination="false"
      >
        <template slot="index" slot-scope="text, record, index">
          {{ index + 1 }}
        </template>
        <template slot="common" slot-scope="text, record, index">
          <ellipsis :length="10" tooltip>{{ text }}</ellipsis>
        </template>
        <template slot="action" slot-scope="text, record">
          <a-button type="primary" size="small" @click="info(record)">详情</a-button>
          <a-divider type="vertical" />
          <a-button type="danger" size="small" @click="forceLogout(record)">下线</a-button>
        </template>
      </a-table>

      <!--编辑对话框-->
      <a-modal
        v-model="visible"
        title="详情"
        okText="确定"
        cancelText="取消"
        :width="800"
        :destroyOnClose="false"
        :maskClosable="false"
        :confirmLoading="confirmLoading"
        @cancel="visible = false"
      >
        <a-card :bordered="false">
          <a-descriptions title="用户信息">
            <a-descriptions-item label="用户id">{{ currentRecord.id }}</a-descriptions-item>
            <a-descriptions-item label="姓名">{{ currentRecord.name }}</a-descriptions-item>
            <a-descriptions-item label="用户名">{{ currentRecord.username }}</a-descriptions-item>
          </a-descriptions>
          <a-divider />
          <a-descriptions title="令牌信息" :column="2">
            <a-descriptions-item label="客户端">{{ currentRecord.clientId }}</a-descriptions-item>
            <a-descriptions-item label="授权类型">
              {{ currentRecord.grantType }}
            </a-descriptions-item>
            <a-descriptions-item label="令牌">
              {{ currentRecord.accessToken }}
            </a-descriptions-item>
            <a-descriptions-item label="令牌有效期">
              {{ currentRecord.tokenExpireTime }}
            </a-descriptions-item>
            <a-descriptions-item label="刷新令牌">
              {{ currentRecord.refreshToken }}
            </a-descriptions-item>
            <a-descriptions-item label="刷新令牌有效期">
              {{ currentRecord.refreshTokenExpireTime }}
            </a-descriptions-item>
          </a-descriptions>
        </a-card>

        <template slot="footer">
          <a-button @click="visible = false">
            关闭
          </a-button>
        </template>
      </a-modal>
    </a-card>
  </page-header-wrapper>
</template>

<script>
import { STable, Ellipsis } from '@/components'
import { onlineUsers, forceLogout } from '@/api/system/login'
export default {
  name: 'OnlineUser',
  components: {
    STable,
    Ellipsis
  },
  props: {},
  data () {
    return {
      loading: false,
      visible: false,
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
      // 高级搜索 展开/关闭
      advanced: false,
      // 查询参数
      queryParam: {
        name: '',
        username: '',
        clientId: ''
      },
      dataSource: [],
      // 表头
      columns: [
        {
          title: '序号',
          dataIndex: 'id',
          width: 100,
          align: 'center',
          scopedSlots: { customRender: 'index' }
        },
        {
          title: '姓名',
          dataIndex: 'name',
          align: 'center',
          width: 150
        },
        {
          title: '用户名',
          dataIndex: 'username',
          align: 'center'
        },
        {
          title: '客户端',
          dataIndex: 'clientId',
          align: 'center',
          width: 250
        },
        {
          title: '授权类型',
          dataIndex: 'grantType',
          align: 'center',
          width: 200
        },
        /* {
          title: '令牌',
          dataIndex: 'accessToken',
          align: 'center',
          width: 150,
          scopedSlots: { customRender: 'common' }
        },
        {
          title: '刷新令牌',
          dataIndex: 'refreshToken',
          align: 'center',
          width: 150,
          scopedSlots: { customRender: 'common' }
        },
        {
          title: '令牌过期时间',
          dataIndex: 'tokenExpireTime',
          align: 'center',
          width: 200,
          scopedSlots: { customRender: 'common' }
        },
        {
          title: '刷新令牌过期时间',
          dataIndex: 'refreshTokenExpireTime',
          align: 'center',
          width: 200,
          scopedSlots: { customRender: 'common' }
        }, */
        {
          title: '操作',
          width: 200,
          dataIndex: 'action',
          scopedSlots: { customRender: 'action' }
        }
      ],
      currentRecord: {}
    }
  },
  created () {
    this.loadData({})
  },
  mounted () {},
  methods: {
    toggleAdvanced () {
      this.advanced = !this.advanced
    },
    // 加载数据方法 必须为 Promise 对象
    loadData (params) {
      this.loading = true
      if (params.sortOrder === 'ascend') {
        params.sortOrder = 'asc'
      }
      if (params.sortOrder === 'descend') {
        params.sortOrder = 'desc'
      }
      if (params.sortField === 'createTime') {
        params.sortField = 'create_time'
      }
      params.pageNum = params.pageNo
      delete params.pageNo
      onlineUsers(Object.assign({}, this.queryParam)).then(res => {
        const { status, data, message } = res
        if (status === 1) {
          this.dataSource = data
          this.loading = false
        } else {
          this.$message.error(message)
        }
      }).catch(err => {
        this.loading = false
        console.error(err)
        this.$message.error(err.message || '请求数据错误')
      })
    },
    info (record) {
      this.currentRecord = record
      this.visible = true
    },
    forceLogout (record) {
      const that = this
      this.$confirm({
        title: '确定强制下线？',
        content: '强制下线可能会影响用户数据，请谨慎操作！',
        okText: '确定',
        okType: 'danger',
        cancelText: '取消',
        onOk () {
          if (record.accessToken) {
            forceLogout({ token: record.accessToken }).then(res => {
              const { status, message } = res
              if (status === 1) {
                that.$message.success('强制下线成功')
              } else {
                that.$message.error(message)
              }
            }).catch(err => {
              console.error(err)
            })
          } else {
            that.$message.error('令牌为空')
          }
        },
        onCancel () {
        }
      })
    },
    refreshTable () {
      // 新增/修改 成功时，重载列表
      this.$refs.table.refresh()
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
