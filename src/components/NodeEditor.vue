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
    manager: {
      type: Object,
      required: true
    },
    text: {
      type: String
    }
  },
  data () {
    return {
      editText: this.manager.getEditName(this.node)
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
      this.manager.setName(this.node, this.editText)
      this.$emit('stopEdit')
    },
    onBlur () {
      this.confirmEdit()
    },
    onKeyUp (event) {
      if (event.keyCode === 13) {
        this.confirmEdit()
      }
      if (event.keyCode === 27) {
        this.cancelEdit()
      }
    }
  }
}
</script>

<style scoped>
</style>
