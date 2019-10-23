<template>
  <span class="treevue-node-text" tabindex="-1" @focus="onFocus" ref="text" @dblclick="onMouseDoubleClick">
    {{ title }}
  </span>
</template>

<script>
export default {
  name: 'NodeText',
  props: {
    node: {
      type: Object,
      required: true
    },
    options: {
      type: Object,
      required: true
    },
    title: {
      type: String
    }
  },
  data () {
    return {
    }
  },
  methods: {
    focus () {
      this.$refs.text.focus()
    },
    onFocus (event) {
      this.$emit('node:focused', this.node)
    },
    onMouseDoubleClick (event) {
      if (!this.options.canEdit) {
        return
      }

      this.$emit('startEdit', this.node)
    }
  }
}
</script>

<style scoped>
</style>
