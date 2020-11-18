<template>
  <a-modal
    title="角色菜单"
    :visible="visible"
    :confirm-loading="confirmLoading"
    :destroyOnClose="true"
    :maskClosable="false"
    @ok="handleOk"
    @cancel="handleCancle"
  >
    <a-tree
      v-model="checkedKeys"
      :maskClosable="false"
      checkable
      :replaceFields="{children:'children', title:'title', key:'id'}"
      :auto-expand-parent="true"
      :selected-keys="selectedKeys"
      :tree-data="treeData"
      :afterClose="afterClose"
    />
  </a-modal>
</template>

<script>
import { listTree, listMenusByRoleId } from '@/api/menu'
import * as _ from 'lodash'
export default {
  name: 'RoleMenu',
  props: {
    roleId: {
      type: Number,
      required: true
    },
    showRoleMenu: {
      type: Boolean,
      required: false,
      default: false
    }
  },
  data () {
    return {
      visible: false,
      confirmLoading: false,
      selectedKeys: [],
      checkedKeys: [],
      treeData: []
    }
  },
  mounted () {
    console.log('RoleMenu mounted')
    this.listTreeData()
    this.listMenusByRoleId()
  },
  methods: {
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
              ids.push(item.id)
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
    handleOk (e) {
    },
    handleCancle (e) {
      this.visible = false
      this.$emit('clearShowRoleMenu')
    },
    afterClose () {
      this.$emit('clearShowRoleMenu')
      this.treeData = []
      this.checkedKeys = []
      this.showRoleMenu = []
    }
  },
  watch: {
    showRoleMenu: function (val) {
      this.$forceUpdate()
      this.visible = val
    }
  }
}
</script>

<style scoped>

</style>
