<template>
  <div class="treevue-tree">
    <node :options="treeOptions" :manager="nodeManager" :state="treeState" v-for="item in visibleItems" :key="item.id" :node="item" @selected="onItemSelected" :parentClasses="getNodeClasses"/>
  </div>
</template>

<script>
import Node from './Node'
import fontawesomeManager from '../styleManagers/fontawesomeManager'
import DefaultManager from '../nodeManagers/defaultManager'

export default {
  name: 'Tree',
  props: {
    nodes: {
      type: Array
    },
    options: {
      type: Object
    }
  },
  components: {
    Node
  },
  data () {
    return {
      items: [],
      treeState: {
      },
      treeOptions: Object.assign({}, {
        styleManager: fontawesomeManager,
        multiselect: false,
        checkOnSelect: false
      }, this.options),
      nodeManager: new DefaultManager()
    }
  },
  computed: {
    visibleItems () {
      return this.items.filter(x => this.nodeManager.getVisibility(x))
    }
  },
  mounted () {
    this.nodeManager.initialize(this.treeOptions)
    this.nodeManager.setNodes(this.nodes)
  },
  methods: {
    getCheckedNodes () {
      return this.nodeManager.getCheckedNodes()
    },
    getNodeManager() {
      return this.nodeManager
    },
    getNodeClasses (item) {
      return {
        selected: this.nodeManager.selectedNode === item
      }
    },
    onItemSelected (item) {
      this.nodeManager.setSelected(item)
      console.log('this.nodeManager', this.nodeManager)
      this.$emit('onSelect', item)
      if (this.treeOptions.checkOnSelect) {
        item.states.checked = true
      }
    }
  }
}
</script>

<style scoped>

</style>
