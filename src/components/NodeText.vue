<template>
  <span class="treevue-node-text">
    {{ title }}
  </span>
</template>

<script>
export default {
  name: 'NodeText',
  props: {
    title: {
      type: String
    }
  },
  data () {
    return {
    }
  },
  methods: {
  }
}
</script>

<style scoped>
</style>
