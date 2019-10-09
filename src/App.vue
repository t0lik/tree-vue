<template>
  <div id="app">
    <tree :nodes="nodes" ref="tree" :options="treeOptions"/>
    <div class="button-group">
      <button @click="getCheckNodes">get checked</button>
      <button @click="checkAllNodes">check all</button>
      <button @click="uncheckAllNodes">uncheck all</button>
      <button @click="checkVisibleNodes">check visible</button>
      <button @click="expandSelectedNode">expand selected</button>
      <button @click="expandAll">expand all</button>
      <button @click="collapseSelectedNode">collapse selected</button>
      <button @click="collapseAll">collapse all</button>
      <button @click="findById">find by id = 8 and select</button>
      <button @click="addChild">find by id = 8 and add child</button>
      <button @click="insertChildAt">find by id = 8 and insert child before first child node</button>
      <button @click="insertChild">find by id = 8 and insert child to be first</button>
      <button @click="removeChildNode">find child by id = 8 and remove</button>
      <button @click="removeRootNode">find root node by id = 2 and remove</button>
      <div class="search-group">
        <input v-model="searchString" />
        <button @click="startSearch">search by Text</button>
        <button @click="startRegexpSearch">search by Regexp</button>
        <button @click="startFuncSearch">search by function</button>
        <button @click="clearSearch">clear</button>
      </div>
      <div class="style-group">
        <button @click="switchToAwesome">fontawesome</button>
        <button @click="switchToDefault">defaultStyle</button>
      </div>
      <span class="checked-nodes-text">{{ checkedNodesString }}</span>
    </div>
  </div>
</template>

<script>
import Tree from './components/Tree'
import fontawesomeManager from './styleManagers/fontawesomeManager'
import defaultStyleManager from './styleManagers/defaultStyleManager'

export default {
  name: 'app',
  components: {
    Tree
  },
  data () {
    return {
      treeOptions: {
        checkOnSelect: false,
        styleManager: defaultStyleManager,
        childrenProp: 'kids',
        nameProp: item => `${item.name} (${item.id})`
      },
      selectedNode: null,
      searchString: null,
      nodes: [{
        id: 0,
        name: 'ноль'
      }, {
        id: 1,
        name: 'один',
        kids: [{
        id: 3,
        name: 'три',
        kids: [{
        id: 8,
        name: 'восемьдесят восемь тысяч семьсот пятьдесят два',
        kids: []
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
    expandSelectedNode () {
      const nodeManager = this.$refs.tree.getNodeManager()
      nodeManager.expand(nodeManager.selectedNode, true)
    },
    collapseSelectedNode () {
      const nodeManager = this.$refs.tree.getNodeManager()
      nodeManager.collapse(nodeManager.selectedNode, true)
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
      const foundNode = nodeManager.findOne(item => item.item.id === 8)
      nodeManager.setSelected(foundNode)
      nodeManager.showNode(foundNode)
    },
    addChild () {
      const nodeManager = this.$refs.tree.getNodeManager()
      const foundNode = nodeManager.findOne(item => item.item.id === 8)
      foundNode.addChild({
        id: 10,
        name: 'десять'
      })
    },
    insertChildAt () {
      const nodeManager = this.$refs.tree.getNodeManager()
      const foundNode = nodeManager.findOne(item => item.item.id === 8)
      const firstChild = foundNode.children[0]
      foundNode.insertChild({
        id: 10,
        name: 'десять'
      }, firstChild)
    },
    insertChild () {
      const nodeManager = this.$refs.tree.getNodeManager()
      const foundNode = nodeManager.findOne(item => item.item.id === 8)
      foundNode.insertChild({
        id: 11,
        name: 'одинадцать'
      })
    },
    removeChildNode () {
      const nodeManager = this.$refs.tree.getNodeManager()
      const foundNode = nodeManager.findOne(item => item.item.id === 8)
      nodeManager.removeNode(foundNode)
    },
    removeRootNode () {
      const nodeManager = this.$refs.tree.getNodeManager()
      const foundNode = nodeManager.findOne(item => item.item.id === 2)
      nodeManager.removeNode(foundNode)
    },
    startSearch () {
      const nodeManager = this.$refs.tree.getNodeManager()
      nodeManager.filter(this.searchString)
    },
    startRegexpSearch () {
      const nodeManager = this.$refs.tree.getNodeManager()
      nodeManager.filter(new RegExp(this.searchString, 'i'))
    },
    startFuncSearch () {
      const nodeManager = this.$refs.tree.getNodeManager()
      nodeManager.filter(item => item.name.toLowerCase().indexOf(this.searchString.toLowerCase()) !== -1)
    },
    clearSearch () {
      const nodeManager = this.$refs.tree.getNodeManager()
      nodeManager.clearFilter()
      this.searchString = ''
    },
    switchToAwesome () {
      this.treeOptions.styleManager = fontawesomeManager
    },
    switchToDefault () {
      this.treeOptions.styleManager = defaultStyleManager
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
.button-group {
  width: 200px;
  display: flex;
  flex-direction: column;
}
.search-group {
  display: flex;  
}
.style-group {
  display: flex;  
}
</style>
