<template>
  <div class="treevue-tree">
    <node :styleManager="treeOptions.styleManager" v-for="item in items" :key="item.id" :node="item"/>
  </div>
</template>

<script>
import Node from './Node'
import fontawesomeManager from '../styleManagers/fontawesomeManager'

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
      treeOptions: Object.assign({}, this.options, {
        styleManager: fontawesomeManager
      })
    }
  },
  computed: {
    nodeItems () {
      return this.nodes.map(x => this.mapNodeToItem(x))
    }
  },
  mounted () {
    this.items = this.nodes.map(x => this.mapNodeToItem(x))
  },
  methods: {
    mapNodeToItem (node) {
      return {
        item: node,
        states: {
          checked: node.checked ||  false,
          disabled: node.disabled ||  false,
          opened: node.opened ||  false,
          selected: node.selected ||  false
        },
        children: node.children ? node.children.map(x => this.mapNodeToItem(x)) : []
      }
    }
  }
}
</script>

<style scoped>
</style>
