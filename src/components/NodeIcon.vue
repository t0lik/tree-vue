<template>
  <i class="treevue-node-icon" :class="iconClass" />
</template>

<script>
export default {
  name: 'NodeIcon',
  props: {
    iconClass: {
      type: [String, Object]
    }
  },
  data () {
    return {
    }
  }
}
</script>

<style scoped>
.treevue-node-icon {
  font-size: 18px;
  width: 18px;
  height: 18px;
}
</style>
