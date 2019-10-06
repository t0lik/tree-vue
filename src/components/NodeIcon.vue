<template>
  <i class="treevue-node-icon" :class="iconClass" @click.stop="onClick"></i>
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
.treevue-default-arrow {
  height: 22px;
  width: 1.25em;
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
