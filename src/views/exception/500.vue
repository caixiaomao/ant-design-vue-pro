<template>
  <a-result status="500" title="500" sub-title="对不起，服务器开小差了，请您稍后再试 (●ˇ∀ˇ●)">
    <template #extra>
      <a-button type="primary" @click="toHome">
        返回首页
      </a-button>
    </template>
  </a-result>
</template>

<script>
  export default {
    name: 'Exception500',
    methods: {
      toHome () {
        this.$router.push({ path: '/' })
      }
    }
  }
</script>
