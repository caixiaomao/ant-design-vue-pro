<template>
  <a-result status="403" title="403" sub-title="您无权访问此页面 o(￣┰￣*)ゞ">
    <template #extra>
      <a-button type="primary" @click="toHome">
        返回首页
      </a-button>
    </template>
  </a-result>
</template>

<script>
export default {
  name: 'Exception403',
  methods: {
    toHome () {
      this.$router.push({ path: '/' })
    }
  }
}
</script>
