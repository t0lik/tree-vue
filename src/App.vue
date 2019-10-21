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
        <label>check</label>
        <button @click="checkSelectedNode">selected</button>
        <button @click="checkSelectedNodeWithChildren">selected with children</button>
        <button @click="checkSelectedNodeChildren">selected node children</button>
        <button @click="checkAllNodes">all</button>
        <button @click="checkVisibleNodes">visible</button>
        <button @click="getCheckNodes">get checked</button>
      </div>
      <div class="button-group">
        <label>uncheck</label>
        <button @click="uncheckSelectedNode">selected</button>
        <button @click="uncheckSelectedNodeWithChildren">selected with children</button>
        <button @click="uncheckSelectedNodeChildren">selected node children</button>
        <button @click="uncheckAllNodes">all</button>
        <button @click="uncheckVisibleNodes">visible</button>
      </div>
      <div class="button-group">
        <label>expand</label>
        <button @click="expandSelectedNode">selected</button>
        <button @click="expandSelectedNodeWithChildren">selected with children</button>
        <button @click="expandSelectedNodeChildren">selected node children</button>
        <button @click="expandAll">all</button>
      </div>
      <div class="button-group">
        <label>collapse</label>
        <button @click="collapseSelectedNode">selected</button>
        <button @click="collapseSelectedNodeWithChildren">selected with children</button>
        <button @click="collapseSelectedNodeChildren">selected node children</button>
        <button @click="collapseAll">all</button>
      </div>
      <div class="button-group">
        <label>disable</label>
        <button @click="disableSelectedNode">selected</button>
        <button @click="disableSelectedNodeWithChildren">selected with chldren</button>
        <button @click="disableSelectedNodeChildren">selected node chldren</button>
        <button @click="disableAll">all</button>
      </div>
      <div class="button-group">
        <label>enable</label>
        <button @click="enableSelectedNode">selected</button>
        <button @click="enableSelectedNodeWithChildren">selected with children</button>
        <button @click="enableSelectedNodeChildren">selected node children</button>
        <button @click="enableAll">all</button>
      </div>
      <div class="button-group">
        <label>find by id</label>
        <button @click="findById">id = 8 and select</button>
      </div>
      <div class="button-group">
        <label>find by id and add/remove children</label>
        <button @click="addChild">id=8: add child</button>
        <button @click="insertChildAt">id=8: insert child before first child node</button>
        <button @click="insertChild">id=8: insert child to be first</button>
        <button @click="removeChildNode">remove child id = 8</button>
        <button @click="removeRootNode">remove root node id = 2</button>
      </div>
      <div class="button-group">
        <label>search</label>
        <input v-model="searchString" />
        <button @click="startSearch">search by Text</button>
        <button @click="startSearchWithChildren">search by Text (show children)</button>
        <button @click="startRegexpSearch">search by Regexp</button>
        <button @click="startFuncSearch">search by function</button>
        <button @click="clearSearch">clear</button>
      </div>
      <div class="button-group">
        <label>checkbox and expander theme</label>
        <button @click="switchToAwesome">fontawesome</button>
        <button @click="switchToDefault">default</button>
      </div>
      <div class="button-group">
        <label>sort</label>
        <button @click="sortAsc">ascending</button>
        <button @click="sortDesc">descending</button>
      </div>
      <div class="button-group">
        <label>checkboxes</label>
        <button @click="showCheckboxes">show</button>
        <button @click="hideCheckboxes">hide</button>
      </div>
      <div class="button-group">
        <label>text style</label>
        <button @click="setSelectedNodeTextStyle">selected</button>
        <button @click="setSelectedNodeTextStyleWithChildren">selected with children</button>
        <button @click="resetSelectedNodeTextStyle">reset</button>
        <button @click="resetSelectedNodeTextStyleWithChildren">reset with children</button>
      </div>
      <div class="button-group">
        <label>icon style</label>
        <button @click="setSelectedNodeIconStyle">selected</button>
        <button @click="setSelectedNodeIconStyleWithChildren">selected with children</button>
        <button @click="resetSelectedNodeIconStyle">reset</button>
        <button @click="resetSelectedNodeIconStyleWithChildren">reset with children</button>
      </div>
      <div class="button-group">
        <label>checkbox style</label>
        <button @click="setSelectedNodeCheckboxStyle">selected</button>
        <button @click="setSelectedNodeCheckboxStyleWithChildren">selected with children</button>
        <button @click="resetSelectedNodeCheckboxStyle">reset</button>
        <button @click="resetSelectedNodeCheckboxStyleWithChildren">reset with children</button>
      </div>
      <div class="button-group">
        <label>expander style</label>
        <button @click="setSelectedNodeExpanderStyle">selected</button>
        <button @click="setSelectedNodeExpanderStyleWithChildren">selected with children</button>
        <button @click="resetSelectedNodeExpanderStyle">reset</button>
        <button @click="resetSelectedNodeExpanderStyleWithChildren">reset with children</button>
      </div>
      <div class="button-group">
        <label>source</label>
        <button @click="setNodes">first</button>
        <button @click="setAnotherNodes">second</button>
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
        icon: 'fa fa-dice-four',
        kids: [{
        id: 5,
        name: 'пять',
        icon: 'fa fa-dice-five',
        kids: []
      }, {
        id: 6,
        name: 'шесть',
        icon: 'fa fa-dice-six',
        kids: []
      }]
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
    uncheckVisibleNodes () {
      this.nodeManager.uncheckVisible()
    },
    checkSelectedNode () {
      this.nodeManager.selectedNode.check(false)
    },
    checkSelectedNodeWithChildren () {
      this.nodeManager.selectedNode.check(true)
    },
    checkSelectedNodeChildren () {
      this.nodeManager.selectedNode.checkChildren()
    },
    uncheckSelectedNode () {
      this.nodeManager.selectedNode.uncheck(false)
    },
    uncheckSelectedNodeWithChildren () {
      this.nodeManager.selectedNode.uncheck(true)
    },
    uncheckSelectedNodeChildren () {
      this.nodeManager.selectedNode.uncheckChildren()
    },
    expandSelectedNode () {
      this.nodeManager.selectedNode.expand(false)
    },
    expandSelectedNodeWithChildren () {
      this.nodeManager.selectedNode.expand(true)
    },
    expandSelectedNodeChildren () {
      this.nodeManager.selectedNode.expandChildren()
    },
    collapseSelectedNode () {
      this.nodeManager.selectedNode.collapse(false)
    },
    collapseSelectedNodeWithChildren () {
      this.nodeManager.selectedNode.collapse(true)
    },
    collapseSelectedNodeChildren () {
      this.nodeManager.selectedNode.collapseChildren()
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
    disableSelectedNodeChildren () {
      this.nodeManager.selectedNode.disableChildren()
    },
    enableSelectedNode () {
      this.nodeManager.selectedNode.enable()
    },
    enableSelectedNodeWithChildren () {
      this.nodeManager.selectedNode.enable(true)
    },
    enableSelectedNodeChildren () {
      this.nodeManager.selectedNode.enableChildren()
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
    setSelectedNodeTextStyle () {
      this.nodeManager.selectedNode.setTextStyle('custom-text')
    },
    setSelectedNodeTextStyleWithChildren () {
      this.nodeManager.selectedNode.setTextStyle('custom-text', true)
    },
    resetSelectedNodeTextStyle () {
      this.nodeManager.selectedNode.resetTextStyle()
    },
    resetSelectedNodeTextStyleWithChildren () {
      this.nodeManager.selectedNode.resetTextStyle(true)
    },
    setSelectedNodeIconStyle () {
      this.nodeManager.selectedNode.setIconStyle('custom-icon')
    },
    setSelectedNodeIconStyleWithChildren () {
      this.nodeManager.selectedNode.setIconStyle('custom-icon', true)
    },
    resetSelectedNodeIconStyle () {
      this.nodeManager.selectedNode.resetIconStyle()
    },
    resetSelectedNodeIconStyleWithChildren () {
      this.nodeManager.selectedNode.resetIconStyle(true)
    },
    setSelectedNodeCheckboxStyle () {
      this.nodeManager.selectedNode.setCheckboxStyle('custom-checkbox')
    },
    setSelectedNodeCheckboxStyleWithChildren () {
      this.nodeManager.selectedNode.setCheckboxStyle('custom-checkbox', true)
    },
    resetSelectedNodeCheckboxStyle () {
      this.nodeManager.selectedNode.resetCheckboxStyle()
    },
    resetSelectedNodeCheckboxStyleWithChildren () {
      this.nodeManager.selectedNode.resetCheckboxStyle(true)
    },
    setSelectedNodeExpanderStyle () {
      this.nodeManager.selectedNode.setExpanderStyle('custom-expander')
    },
    setSelectedNodeExpanderStyleWithChildren () {
      this.nodeManager.selectedNode.setExpanderStyle('custom-expander', true)
    },
    resetSelectedNodeExpanderStyle () {
      this.nodeManager.selectedNode.resetExpanderStyle()
    },
    resetSelectedNodeExpanderStyleWithChildren () {
      this.nodeManager.selectedNode.resetExpanderStyle(true)
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
.button-group label {
  align-self: center;
  margin-right: 10px;
  min-width: 150px;
}
.button-group button{
  min-width: 150px;
}
.custom-text {
  color: red;
}
.custom-icon {
  color: red;
}
.treevue-node-checkbox.custom-checkbox {
  border-color: red;
}
.treevue-node-checkbox.custom-checkbox.checked:after {
  border-color: red;
}
.treevue-node-checkbox.custom-checkbox.indeterminate:after {
  background: red;
}
.treevue-node-expander.custom-expander:after {
  border-color: red;
}
</style>
