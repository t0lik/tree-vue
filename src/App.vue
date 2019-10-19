<template>
  <div id="app">
    <tree :nodes="nodes" ref="tree" :options="treeOptions" 
      @tree:checked:all="onCheckedAll" 
      @tree:filtered="onFiltered"
      @node:disabled="onNodeDisabled"
      @node:enabled="onNodeEnabled">
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
      <div class="button-group">
        <button @click="sortAsc">ascending sort</button>
        <button @click="sortDesc">descending sort</button>
      </div>
      <div class="button-group">
        <button @click="showCheckboxes">show checkboxes</button>
        <button @click="hideCheckboxes">hide checkboxes</button>
      </div>
      <div class="button-group">
        <button @click="setNodes">set first source</button>
        <button @click="setAnotherNodes">set second source</button>
      </div>
      <span class="checked-nodes-text">{{ outputString }}</span>
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
        showCheckbox: true,
        showIcon: true,
        openOnSelect: false,
        autoSort: false,
        styleManager: defaultStyleManager,
        childrenProp: 'kids',
        nameProp: item => `${item.name} (${item.id})`
      },
      selectedNode: null,
      searchString: null,
      descComparator: (item1, item2) => 0 - item1.item.name.localeCompare(item2.item.name),
      ascComparator: (item1, item2) => item1.item.name.localeCompare(item2.item.name),
      nodes: [{
        id: 0,
        name: 'ноль'
      }, {
        id: 1,
        name: 'один',
        icon: 'fa fa-dice-one',
        kids: [{
        id: 3,
        name: 'три',
        icon: 'fa fa-dice-three',
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
        name: 'четыре',
        icon: 'fa fa-dice-four'
      }]
      }, {
        id: 2,
        name: 'два',
        icon: 'fa fa-dice-two'
      }],
      anotherNodes: [{
        id: 0,
        name: 'сто'
      }, {
        id: 1,
        name: 'двести',
        kids: [{
        id: 3,
        name: 'десять',
        kids: [{
        id: 8,
        name: 'один',
        kids: []
      }, {
        id: 9,
        name: 'два'
      }]
      }, {
        id: 4,
        name: 'четыре'
      }]
      }, {
        id: 2,
        name: 'триста'
      }],
      outputString: ''
    }
  },
  computed: {
    nodeManager () {
      if (!this.$refs.tree) {
        return null
      }

      return this.$refs.tree.getNodeManager()
    }
  },
  methods: {
    outputMessage(message) {
      this.outputString += '\n' + message
    },
    getCheckNodes () {
      const checkedNodes = this.nodeManager.getChecked()
      this.outputMessage(JSON.stringify(checkedNodes.map(x => ({
        item: x.item,
        states: x.states
      })), null, 2))
    },
    checkAllNodes () {
      this.nodeManager.checkAll()
    },
    uncheckAllNodes () {
      this.nodeManager.uncheckAll()
    },
    checkVisibleNodes () {
      this.nodeManager.checkVisible()
    },
    expandSelectedNode () {
      this.nodeManager.selectedNode.expand(true)
    },
    collapseSelectedNode () {
      this.nodeManager.selectedNode.collapse(true)
    },
    expandAll () {
      this.nodeManager.expandAll()
    },
    collapseAll () {
      this.nodeManager.collapseAll()
    },
    disableSelectedNode () {
      this.nodeManager.selectedNode.disable()
    },
    disableSelectedNodeWithChildren () {
      this.nodeManager.selectedNode.disable(true)
    },
    enableSelectedNode () {
      this.nodeManager.selectedNode.enable()
    },
    enableSelectedNodeWithChildren () {
      this.nodeManager.selectedNode.enable(true)
    },
    disableAll () {
      this.nodeManager.disableAll()
    },
    enableAll () {
      this.nodeManager.enableAll()
    },
    findById () {
      const foundNode = this.nodeManager.findOne(item => item.item.id === 8)
      foundNode.select()
      foundNode.show()
    },
    addChild () {
      const foundNode = this.nodeManager.findOne(item => item.item.id === 8)
      foundNode.addChild({
        id: 10,
        name: 'десять'
      })
    },
    insertChildAt () {
      const foundNode = this.nodeManager.findOne(item => item.item.id === 8)
      const firstChild = foundNode.children[0]
      foundNode.insertChild({
        id: 10,
        name: 'десять'
      }, firstChild)
    },
    insertChild () {
      const foundNode = this.nodeManager.findOne(item => item.item.id === 8)
      foundNode.insertChild({
        id: 11,
        name: 'одинадцать'
      })
    },
    removeChildNode () {
      const foundNode = this.nodeManager.findOne(item => item.item.id === 8)
      nodeManager.removeNode(foundNode)
    },
    removeRootNode () {
      const foundNode = this.nodeManager.findOne(item => item.item.id === 2)
      nodeManager.removeNode(foundNode)
    },
    startSearch () {
      this.nodeManager.filter(this.searchString)
    },
    startSearchWithChildren () {
      this.nodeManager.filter(this.searchString, { showChildren: true })
    },
    startRegexpSearch () {
      this.nodeManager.filter(new RegExp(this.searchString, 'i'))
    },
    startFuncSearch () {
      this.nodeManager.filter(item => item.name.toLowerCase().indexOf(this.searchString.toLowerCase()) !== -1)
    },
    clearSearch () {
      this.nodeManager.clearFilter()
      this.searchString = ''
    },
    switchToAwesome () {
      this.treeOptions.styleManager = fontawesomeManager
    },
    switchToDefault () {
      this.treeOptions.styleManager = defaultStyleManager
    },
    showCheckboxes () {
      this.treeOptions.showCheckbox = true
    },
    hideCheckboxes () {
      this.treeOptions.showCheckbox = false
    },
    onCheckedAll () {
      this.outputMessage('checked all event is fired')
    },
    onFiltered (matchedNodes, searchString) {
      this.outputMessage(`searchString: ${searchString}
      ${JSON.stringify(matchedNodes.map(x => x.item), null, 2)}`)
    },
    onNodeDisabled (node) {
      this.outputMessage(`disabled node: ${JSON.stringify(node.item, null, 2)}`)
    },
    onNodeEnabled (node) {
      this.outputMessage(this.outputString = `enabled node: ${JSON.stringify(node.item, null, 2)}`)
    },
    sortAsc () {
      this.nodeManager.sort(this.ascComparator)
    },
    sortDesc () {
      this.nodeManager.sort(this.descComparator)
    },
    setNodes () {
      this.nodeManager.setNodes(this.nodes)
    },
    setAnotherNodes () {
      this.nodeManager.setNodes(this.anotherNodes)
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
