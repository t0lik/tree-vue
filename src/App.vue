<template>
  <div id="app">
    <tree :nodes="nodes" ref="tree" :options="{ checkOnSelect: true }" @onSelect="onSelect"/>
    <div>
      <button @click="getCheckNodes">get checked</button>
      <button @click="checkAllNodes">check all</button>
      <button @click="uncheckAllNodes">uncheck all</button>
      <button @click="checkVisibleNodes">check visible</button>
      <button @click="expandSelectedNode">expand selected</button>
      <button @click="expandAll">expand all</button>
      <button @click="collapseSelectedNode">collapse selected</button>
      <button @click="collapseAll">collapse all</button>
      <button @click="findById">find by id = 3 and select</button>
    </div>
    <span class="checked-nodes-text">{{ checkedNodesString }}</span>
  </div>
</template>

<script>
import Tree from './components/Tree'

export default {
  name: 'app',
  components: {
    Tree
  },
  data () {
    return {
      selectedNode: null,
      nodes: [{
        id: 0,
        name: 'ноль'
      }, {
        id: 1,
        name: 'один',
        children: [{
        id: 3,
        name: 'три',
        children: [{
        id: 8,
        name: 'восемьдесят восемь тысяч триста пятдесят два'
      }, {
        id: 9,
        name: 'девять'
      }]
      }, {
        id: 4,
        name: 'четыре'
      }]
      }, {
        id: 2,
        name: 'два'
      }],
      checkedNodesString: ''
    }
  },
  methods: {
    getCheckNodes () {
      const nodeManager = this.$refs.tree.getNodeManager()
      const checkedNodes = nodeManager.getChecked()
      this.checkedNodesString = JSON.stringify(checkedNodes.map(x => ({
        item: x.item,
        states: x.states
      })), null, 2)
    },
    checkAllNodes () {
      const nodeManager = this.$refs.tree.getNodeManager()
      nodeManager.checkAll()
    },
    uncheckAllNodes () {
      const nodeManager = this.$refs.tree.getNodeManager()
      nodeManager.uncheckAll()
    },
    checkVisibleNodes () {
      const nodeManager = this.$refs.tree.getNodeManager()
      nodeManager.checkVisible()
    },
    onSelect (item) {
      this.selectedNode = item
    },
    expandSelectedNode () {
      const nodeManager = this.$refs.tree.getNodeManager()
      nodeManager.expand(this.selectedNode, true)
    },
    collapseSelectedNode () {
      const nodeManager = this.$refs.tree.getNodeManager()
      nodeManager.collapse(this.selectedNode, true)
    },
    expandAll () {
      const nodeManager = this.$refs.tree.getNodeManager()
      nodeManager.expandAll()
    },
    collapseAll () {
      const nodeManager = this.$refs.tree.getNodeManager()
      nodeManager.collapseAll()
    },
    findById () {
      const nodeManager = this.$refs.tree.getNodeManager()
      const foundNode = nodeManager.getById(3)
      nodeManager.setSelected(foundNode)
    }
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  margin-left: 50px;
  color: #2c3e50;
  margin-top: 60px;
}
.checked-nodes-text {
  white-space: pre-wrap
}
</style>
