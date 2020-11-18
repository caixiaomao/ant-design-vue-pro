<template>
  <a-modal
    title="角色菜单"
    :visible="visible"
    :confirm-loading="confirmLoading"
    :destroyOnClose="true"
    @ok="handleOk"
    @cancel="handleCancle"
  >
    <p>{{roleId}}</p>
  </a-modal>
</template>

<script>
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
      confirmLoading: false
    }
  },
  methods: {
    modalClose () {
      this.visible = false
    },
    handleOk (e) {
    },
    handleCancle (e) {
      this.visible = false
      this.$emit('clearShowRoleMenu')
    }
  },
  watch: {
    showRoleMenu: function (val) {
      this.visible = val
    }
  }
}
</script>

<style scoped>

</style>
