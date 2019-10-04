<template>
  <!-- <input type="text" readonly :value="title" class="treevue-node-text" @keydown="onKeyDown" @focus="onFocus"/> -->
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
    onFocus () {
      setTimeout(() => {
        this.$el.setSelectionRange(0, 0)
      }, 0)
      this.$emit('selectRequested')
    },
    onKeyDown(event) {
      if (event.keyCode === 32) {
        this.$emit('сhangeRequested')
      }
      if (event.keyCode === 9) {
        return
      }
      event.preventDefault()
    }
  }
}
</script>

<style scoped>
input.treevue-node-text {
  border: none;
  background-color: inherit;
}
</style>
