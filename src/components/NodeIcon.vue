<template>
  <i class="treevue-node-icon" :class="iconClass" @click="onClick"></i>
</template>

<script>
export default {
  name: 'NodeIcon',
  props: {
    value: {
      type: Boolean
    },
    styleManager: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
    }
  },
  computed: {
    closedIcon () {
      return this.styleManager.closedIcon
    },
    openIcon () {
      return this.styleManager.openIcon
    },
    iconClass () {
      return this.value ? this.openIcon : this.closedIcon
    }
  },
  methods: {
    onClick () {
      this.$emit('input', !this.value)
    }
  }
}
</script>

<style scoped>
</style>
