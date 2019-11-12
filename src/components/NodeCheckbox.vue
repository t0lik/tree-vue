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
    node: {
      type: Object,
      required: true
    },
    disabled: {
      type: Boolean,
      default: false
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
      return this.styleManager.partiallyCheckedIcon
    },
    checkClass () {
      if (this.node.indeterminate()) {
        return this.partiallyCheckedIcon
      }
      return this.value ? this.checkedIcon : this.uncheckedIcon
    }
  },
  methods: {
    onClick () {
      if (this.disabled) {
        return
      }

      this.$emit('input', !this.value)
    }
  }
}
</script>

<style scoped>
.treevue-node-checkbox {
  font-size: 18px;
}
.treevue-default-checkbox {
  height: 18px;
  width: 18px;
  position: relative;
  border: 2px solid #494646;
}

.treevue-default-checkbox:after {
  display: block;
  content: '';
  position: absolute;
  left: 0px;
  top: 24%;
  height: 12px;
  width: 12px;
}

.treevue-default-checkbox.checked:after {
  border: 2px solid #494646;
  border-top: 0;
  border-left: 0;
  transform-origin: center;
  box-sizing: content-box;
  transform: rotate(45deg) scaleY(1);
  left: 32%;
  top: 9%;
  height: 50%;
  width: 25%;
}
.treevue-default-checkbox.indeterminate:after {
  background: #494646;
  box-sizing: content-box;
  left: 2px;
  top: 2px;
  height: 75%;
  width: 75%;
}
.treevue-node-checkbox.disabled {
  color: rgb(206, 212, 218)
}
</style>
