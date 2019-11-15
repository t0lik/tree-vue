<template>
  <i class="treevue-node-expander" :class="expanderClass" @click.stop="onClick"></i>
</template>

<script>
export default {
  name: 'NodeExpander',
  props: {
    value: {
      type: Boolean
    },
    disabled: {
      type: Boolean,
      default: false
    },
    icons: {
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
      return this.icons.closedIcon
    },
    openIcon () {
      return this.icons.openIcon
    },
    expanderClass () {
      return this.value ? this.openIcon : this.closedIcon
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
.treevue-default-arrow {
  height: 22px;
  width: 20px;
  position: relative;
}

.treevue-default-arrow:after {
  display: block;
  content: '';
  border: 1.5px solid #494646;
  position: absolute;
  border-left: 0;
  border-top: 0;
  left: 5px;
  top: 46%;
  height: 9px;
  width: 9px;
  transform: rotate(-45deg) translateY(-50%) translateX(0);
  transition: transform .10s;
  transform-origin: center;
}

.expanded.treevue-default-arrow:after {
  top: 50%;
  transform: rotate(45deg) translateY(-50%) translateX(-5px);
}

</style>
