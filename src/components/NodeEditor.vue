<template>
  <input class="treevue-node-editor" type="text" :value="editText" @input="onInput" @keyup="onKeyUp" @blur="onBlur" ref="editInput"/>
</template>

<script>
export default {
  name: 'NodeEditor',
  props: {
    node: {
      type: Object,
      required: true
    },
    storage: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      editText: this.storage.getEditName(this.node)
    }
  },
  mounted () {
    this.$nextTick(() => {
      this.$refs.editInput.focus()
    })
  },
  methods: {
    onInput (event) {
      this.editText = event.target.value
    },
    cancelEdit () {
      this.$emit('stopEdit')
    },
    confirmEdit () {
      this.storage.setName(this.node, this.editText)
      this.$emit('stopEdit')
    },
    onBlur () {
      this.confirmEdit()
    },
    onKeyUp (event) {
      if (event.key === 'Enter') {
        this.confirmEdit()
      }
      if (event.key === 'Escape') {
        this.cancelEdit()
      }
    }
  }
}
</script>

<style scoped>
</style>
