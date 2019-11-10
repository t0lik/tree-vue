<template>
  <input class="treevue-node-inut" :value="editValue" @input="onInput" @blur="confirmEdit" @keyup="onKeyUp"/>
</template>

<script>
export default {
  name: 'NodeInput',
  props: {
    value: {
      type: String
    }
  },
  data () {
    return {
      editValue: this.value
    }
  },
  methods: {
    onInput (event) {
      this.editValue = event.target.value
    },
    confirmEdit() {
      this.$emit('input', this.editValue)
    },
    onKeyUp (event) {
      if (event.key === 'Enter') {
        this.confirmEdit()
      }
    }
  }
}
</script>

<style scoped>
</style>
