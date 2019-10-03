<template>
  <i class="treevue-node-checkbox" :class="checkClass" @click.stop="onClick"></i>
</template>

<script>
export default {
  name: 'NodeCheckbox',
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
    checkedIcon () {
      return this.styleManager.checkedIcon
    },
    uncheckedIcon () {
      return this.styleManager.uncheckedIcon
    },
    partiallyCheckedIcon () {
      return this.styleManager.partialCheckedIcon
    },
    checkClass () {
      return this.value ? this.checkedIcon : this.uncheckedIcon
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
.treevue-node-checkbox {
  font-size: 18px;
}
.treevue-node-checkbox.disabled {
  color: rgb(206, 212, 218)
}
</style>
