<template>
  <div class="treevue-tree">
    <node :options="treeOptions" v-for="item in nodeManager.items" :key="item.id" :node="item" @selected="onItemSelected" :parentClasses="getNodeClasses"/>
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
      selectedItem: null,
      treeOptions: Object.assign({}, this.options, {
        styleManager: fontawesomeManager,
        multiselect: false
      }),
      nodeManager: new DefaultManager()
    }
  },
  computed: {
  },
  mounted () {
    this.nodeManager.setNodes(this.nodes)
    // this.items = this.nodes.map(x => this.mapNodeToItem(x))
  },
  methods: {
    getNodeClasses (item) {
      return {
        selected: this.selectedItem === item
      }
    },
    mapNodeToItem (node) {
      return {
        item: node,
        states: {
          checked: node.checked ||  false,
          disabled: node.disabled ||  false,
          opened: node.opened ||  false
        },
        children: node.children ? node.children.map(x => this.mapNodeToItem(x)) : []
      }
    },
    onItemSelected (item) {
      this.selectedItem = item
    }
  }
}
</script>

<style scoped>

</style>
