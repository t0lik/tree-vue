<template>
  <div class="treevue-tree">
    <node :options="treeOptions" :manager="nodeManager" :state="treeState" v-for="item in visibleItems" :key="item.id" :node="item" @selected="onItemSelected" :parentClasses="getNodeClasses"/>
  </div>
</template>

<script>
import Node from './Node'
import defaultStyleManager from '../styleManagers/defaultStyleManager'
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
      treeState: {
      },
      treeOptions: Object.assign({}, {
        styleManager: defaultStyleManager,
        multiselect: false,
        checkOnSelect: false,
        idProp: 'id_',
        nameProp: 'name'
      }, this.options),
      nodeManager: new DefaultManager()
    }
  },
  watch: {
    'options.styleManager' (newValue) {
      this.treeOptions.styleManager = this.options.styleManager
    }
  },
  computed: {
    visibleItems () {
      return this.nodeManager.items.filter(x => this.nodeManager.getVisibility(x))
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
