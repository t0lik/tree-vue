<template>
  <div id="app">
    <tree :nodes="nodes" ref="tree" :options="treeOptions">
      <!-- <template #text="slotProps">
        <label :class="slotProps.textClasses"> {{ slotProps.nodeText }}</label>
      </template> -->
    </tree>
    <div class="button-container">
      <div class="button-group">
        <button @click="getCheckNodes">get checked</button>
        <button @click="checkAllNodes">check all</button>
        <button @click="uncheckAllNodes">uncheck all</button>
        <button @click="checkVisibleNodes">check visible</button>
      </div>
      <div class="button-group">
        <button @click="expandSelectedNode">expand selected</button>
        <button @click="expandAll">expand all</button>
        <button @click="collapseSelectedNode">collapse selected</button>
        <button @click="collapseAll">collapse all</button>
      </div>
      <div class="button-group">
        <button @click="disableSelectedNode">disable selected</button>
        <button @click="disableSelectedNodeWithChildren">disable selected with chldren</button>
        <button @click="disableAll">disable all</button>
        <button @click="enableSelectedNode">enable selected</button>
        <button @click="enableSelectedNodeWithChildren">enable selected with children</button>
        <button @click="enableAll">enable all</button>
      </div>
      <button @click="findById">find by id = 8 and select</button>
      <div class="button-group">
        <button @click="addChild">find by id = 8 and add child</button>
        <button @click="insertChildAt">find by id = 8 and insert child before first child node</button>
        <button @click="insertChild">find by id = 8 and insert child to be first</button>
        <button @click="removeChildNode">find child by id = 8 and remove</button>
        <button @click="removeRootNode">find root node by id = 2 and remove</button>
      </div>
      <div class="button-group">
        <input v-model="searchString" />
        <button @click="startSearch">search by Text</button>
        <button @click="startSearchWithChildren">search by Text (show children)</button>
        <button @click="startRegexpSearch">search by Regexp</button>
        <button @click="startFuncSearch">search by function</button>
        <button @click="clearSearch">clear</button>
      </div>
      <div class="button-group">
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
      nodeManager.selectedNode.expand(true)
    },
    collapseSelectedNode () {
      const nodeManager = this.$refs.tree.getNodeManager()
      nodeManager.selectedNode.collapse(true)
    },
    expandAll () {
      const nodeManager = this.$refs.tree.getNodeManager()
      nodeManager.expandAll()
    },
    collapseAll () {
      const nodeManager = this.$refs.tree.getNodeManager()
      nodeManager.collapseAll()
    },
    disableSelectedNode () {
      const nodeManager = this.$refs.tree.getNodeManager()
      nodeManager.selectedNode.disable()
    },
    disableSelectedNodeWithChildren () {
      const nodeManager = this.$refs.tree.getNodeManager()
      nodeManager.selectedNode.disable(true)
    },
    enableSelectedNode () {
      const nodeManager = this.$refs.tree.getNodeManager()
      nodeManager.selectedNode.enable()
    },
    enableSelectedNodeWithChildren () {
      const nodeManager = this.$refs.tree.getNodeManager()
      nodeManager.selectedNode.enable(true)
    },
    disableAll () {
      const nodeManager = this.$refs.tree.getNodeManager()
      nodeManager.disableAll()
    },
    enableAll () {
      const nodeManager = this.$refs.tree.getNodeManager()
      nodeManager.enableAll()
    },
    findById () {
      const nodeManager = this.$refs.tree.getNodeManager()
      const foundNode = nodeManager.findOne(item => item.item.id === 8)
      foundNode.select()
      foundNode.show()
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
    startSearchWithChildren () {
      const nodeManager = this.$refs.tree.getNodeManager()
      nodeManager.filter(this.searchString, { showChildren: true })
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
.button-container {
  width: 200px;
  display: flex;
  flex-direction: column;
}
.button-group {
  display: flex;  
}
.button-group button {
  min-height: 35px;  
}
.button-group button{
  min-width: 150px;  
}
</style>
