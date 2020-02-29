<template>
  <div id="app">
    <tree :items="nodes" ref="tree" :options="treeOptions"
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
        <label>filter</label>
        <input v-model="searchString" />
        <button @click="startSearch">by Text</button>
        <button @click="startSearchWithChildren">by Text (show children)</button>
        <button @click="startRegexpSearch">by Regexp</button>
        <button @click="startFuncSearch">by function</button>
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
        <label>edit</label>
        <button @click="enableEdit">enable</button>
        <button @click="disableEdit">disable</button>
      </div>
      <div class="button-group">
        <label>delete</label>
        <button @click="enableDelete">enable</button>
        <button @click="disableDelete">disable</button>
      </div>
      <div class="button-group">
        <label>text style</label>
        <button @click="setSelectedNodeTextStyle">selected</button>
        <button @click="setSelectedNodeTextStyleWithChildren">selected with children</button>
        <button @click="resetSelectedNodeTextStyle">reset</button>
        <button @click="resetSelectedNodeTextStyleWithChildren">reset with children</button>
        <button @click="setDefaultNodeTextStyle">default</button>
        <button @click="resetDefaultNodeTextStyle">reset default</button>
      </div>
      <div class="button-group">
        <label>icon style</label>
        <button @click="setSelectedNodeIconStyle">selected</button>
        <button @click="setSelectedNodeIconStyleWithChildren">selected with children</button>
        <button @click="resetSelectedNodeIconStyle">reset</button>
        <button @click="resetSelectedNodeIconStyleWithChildren">reset with children</button>
        <button @click="setDefaultIconStyle">default</button>
        <button @click="resetDefaultIconStyle">reset default</button>
      </div>
      <div class="button-group">
        <label>checkbox style</label>
        <button @click="setSelectedNodeCheckboxStyle">selected</button>
        <button @click="setSelectedNodeCheckboxStyleWithChildren">selected with children</button>
        <button @click="resetSelectedNodeCheckboxStyle">reset</button>
        <button @click="resetSelectedNodeCheckboxStyleWithChildren">reset with children</button>
        <button @click="setDefaultCheckboxStyle">default</button>
        <button @click="resetDefaultCheckboxStyle">reset default</button>
      </div>
      <div class="button-group">
        <label>expander style</label>
        <button @click="setSelectedNodeExpanderStyle">selected</button>
        <button @click="setSelectedNodeExpanderStyleWithChildren">selected with children</button>
        <button @click="resetSelectedNodeExpanderStyle">reset</button>
        <button @click="resetSelectedNodeExpanderStyleWithChildren">reset with children</button>
        <button @click="setDefaultExpanderStyle">default</button>
        <button @click="resetDefaultExpanderStyle">reset default</button>
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
import Tree from './components/TreeVue'
import icons from './icons'

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
        checkMode: 'linked',
        icons: icons.defaultIcons,
        childrenProp: 'kids',
        idProp: 'id_',
        nameProp: item => `${item.name} (${item.id})`,
        editNameProp: 'name',
        canEdit: false,
        canDelete: false,
        styleClasses: {
          icon: null,
          text: null,
          checkbox: null,
          expander: null
        }
      },
      selectedNode: null,
      searchString: null,
      descComparator: (item1, item2) => 0 - item1.item.name.localeCompare(item2.item.name),
      ascComparator: (item1, item2) => item1.item.name.localeCompare(item2.item.name),
      nodes: [{
        id: 0,
        name: 'zero'
      }, {
        id: 1,
        name: 'one',
        icon: 'fa fa-dice-one',
        kids: [{
          id: 3,
          name: 'three',
          icon: 'fa fa-dice-three',
          kids: [{
            id: 8,
            name: 'eighty eight thousand seven hundred fifty two',
            kids: []
          }, {
            id: 9,
            name: 'nine'
          }]
        }, {
          id: 4,
          name: 'four',
          icon: 'fa fa-dice-four',
          kids: [{
            id: 5,
            name: 'five',
            icon: 'fa fa-dice-five',
            kids: []
          }, {
            id: 6,
            name: 'six',
            icon: 'fa fa-dice-six',
            kids: []
          }]
        }]
      }, {
        id: 2,
        name: 'two',
        icon: 'fa fa-dice-two'
      }],
      anotherNodes: [{
        id: 0,
        name: 'one hundred'
      }, {
        id: 1,
        name: 'two hundred',
        kids: [{
          id: 3,
          name: 'ten',
          kids: [{
            id: 8,
            name: 'one',
            kids: []
          }, {
            id: 9,
            name: 'two'
          }]
        }, {
          id: 4,
          name: 'four'
        }]
      }, {
        id: 2,
        name: 'thre hundred'
      }],
      testItems: [{
        name: 'item1'
      }, {
        name: 'item2',
        children: [{
          name: 'child1'
        }, {
          name: 'child2'
        }]
      }],
      outputString: ''
    }
  },
  computed: {
    storage () {
      if (!this.$refs.tree) {
        return null
      }

      return this.$refs.tree.getStorage()
    }
  },
  methods: {
    outputMessage (message) {
      this.outputString += '\n' + message
    },
    getCheckNodes () {
      const checkedNodes = this.storage.getChecked()
      this.outputMessage(JSON.stringify(checkedNodes.map(x => ({
        item: x.item,
        states: x.states
      })), null, 2))
    },
    checkAllNodes () {
      this.storage.checkAll()
    },
    uncheckAllNodes () {
      this.storage.uncheckAll()
    },
    checkVisibleNodes () {
      this.storage.checkVisible()
    },
    uncheckVisibleNodes () {
      this.storage.uncheckVisible()
    },
    checkSelectedNode () {
      this.storage.selectedNode.check(false)
    },
    checkSelectedNodeWithChildren () {
      this.storage.selectedNode.check(true)
    },
    checkSelectedNodeChildren () {
      this.storage.selectedNode.checkChildren()
    },
    uncheckSelectedNode () {
      this.storage.selectedNode.uncheck(false)
    },
    uncheckSelectedNodeWithChildren () {
      this.storage.selectedNode.uncheck(true)
    },
    uncheckSelectedNodeChildren () {
      this.storage.selectedNode.uncheckChildren()
    },
    expandSelectedNode () {
      this.storage.selectedNode.expand(false)
    },
    expandSelectedNodeWithChildren () {
      this.storage.selectedNode.expand(true)
    },
    expandSelectedNodeChildren () {
      this.storage.selectedNode.expandChildren()
    },
    collapseSelectedNode () {
      this.storage.selectedNode.collapse(false)
    },
    collapseSelectedNodeWithChildren () {
      this.storage.selectedNode.collapse(true)
    },
    collapseSelectedNodeChildren () {
      this.storage.selectedNode.collapseChildren()
    },
    expandAll () {
      this.storage.expandAll()
    },
    collapseAll () {
      this.storage.collapseAll()
    },
    disableSelectedNode () {
      this.storage.selectedNode.disable()
    },
    disableSelectedNodeWithChildren () {
      this.storage.selectedNode.disable(true)
    },
    disableSelectedNodeChildren () {
      this.storage.selectedNode.disableChildren()
    },
    enableSelectedNode () {
      this.storage.selectedNode.enable()
    },
    enableSelectedNodeWithChildren () {
      this.storage.selectedNode.enable(true)
    },
    enableSelectedNodeChildren () {
      this.storage.selectedNode.enableChildren()
    },
    disableAll () {
      this.storage.disableAll()
    },
    enableAll () {
      this.storage.enableAll()
    },
    findById () {
      const foundNode = this.storage.findOne(item => item.item.id === 8)
      foundNode.select()
      foundNode.show()
    },
    addChild () {
      const foundNode = this.storage.findOne(item => item.item.id === 8)
      foundNode.addChild({
        id: 10,
        name: 'десять'
      })
    },
    insertChildAt () {
      const foundNode = this.storage.findOne(item => item.item.id === 8)
      const firstChild = foundNode.children[0]
      foundNode.insertChild({
        id: 10,
        name: 'десять'
      }, firstChild)
    },
    insertChild () {
      const foundNode = this.storage.findOne(item => item.item.id === 8)
      foundNode.insertChild({
        id: 11,
        name: 'одинадцать'
      })
    },
    removeChildNode () {
      const foundNode = this.storage.findOne(item => item.item.id === 8)
      this.storage.remove(foundNode)
    },
    removeRootNode () {
      const foundNode = this.storage.findOne(item => item.item.id === 2)
      this.storage.remove(foundNode)
    },
    startSearch () {
      this.storage.filter(this.searchString)
    },
    startSearchWithChildren () {
      this.storage.filter(this.searchString, { showChildren: true })
    },
    startRegexpSearch () {
      this.storage.filter(new RegExp(this.searchString, 'i'))
    },
    startFuncSearch () {
      this.storage.filter(item => item.name.toLowerCase().indexOf(this.searchString.toLowerCase()) !== -1)
    },
    clearSearch () {
      this.storage.clearFilter()
      this.searchString = ''
    },
    switchToAwesome () {
      this.treeOptions.icons = icons.fontawesome
    },
    switchToDefault () {
      this.treeOptions.icons = icons.defaultIcons
    },
    showCheckboxes () {
      this.treeOptions.showCheckbox = true
    },
    hideCheckboxes () {
      this.treeOptions.showCheckbox = false
    },
    setSelectedNodeTextStyle () {
      this.storage.selectedNode.setTextStyle('custom-text')
    },
    setSelectedNodeTextStyleWithChildren () {
      this.storage.selectedNode.setTextStyle('custom-text', true)
    },
    resetSelectedNodeTextStyle () {
      this.storage.selectedNode.resetTextStyle()
    },
    resetSelectedNodeTextStyleWithChildren () {
      this.storage.selectedNode.resetTextStyle(true)
    },
    setDefaultNodeTextStyle () {
      this.treeOptions.styleClasses.text = 'all-custom-text'
    },
    resetDefaultNodeTextStyle () {
      this.treeOptions.styleClasses.text = null
    },
    setSelectedNodeIconStyle () {
      this.storage.selectedNode.setIconStyle('custom-icon')
    },
    setSelectedNodeIconStyleWithChildren () {
      this.storage.selectedNode.setIconStyle('custom-icon', true)
    },
    resetSelectedNodeIconStyle () {
      this.storage.selectedNode.resetIconStyle()
    },
    resetSelectedNodeIconStyleWithChildren () {
      this.storage.selectedNode.resetIconStyle(true)
    },
    setDefaultIconStyle () {
      this.treeOptions.styleClasses.icon = 'all-custom-icon'
    },
    resetDefaultIconStyle () {
      this.treeOptions.styleClasses.icon = null
    },
    setSelectedNodeCheckboxStyle () {
      this.storage.selectedNode.setCheckboxStyle('custom-checkbox')
    },
    setSelectedNodeCheckboxStyleWithChildren () {
      this.storage.selectedNode.setCheckboxStyle('custom-checkbox', true)
    },
    resetSelectedNodeCheckboxStyle () {
      this.storage.selectedNode.resetCheckboxStyle()
    },
    resetSelectedNodeCheckboxStyleWithChildren () {
      this.storage.selectedNode.resetCheckboxStyle(true)
    },
    setDefaultCheckboxStyle () {
      this.treeOptions.styleClasses.checkbox = 'all-custom-checkbox'
    },
    resetDefaultCheckboxStyle () {
      this.treeOptions.styleClasses.checkbox = null
    },
    setSelectedNodeExpanderStyle () {
      this.storage.selectedNode.setExpanderStyle('custom-expander')
    },
    setSelectedNodeExpanderStyleWithChildren () {
      this.storage.selectedNode.setExpanderStyle('custom-expander', true)
    },
    resetSelectedNodeExpanderStyle () {
      this.storage.selectedNode.resetExpanderStyle()
    },
    resetSelectedNodeExpanderStyleWithChildren () {
      this.storage.selectedNode.resetExpanderStyle(true)
    },
    setDefaultExpanderStyle () {
      this.treeOptions.styleClasses.expander = 'all-custom-expander'
    },
    resetDefaultExpanderStyle () {
      this.treeOptions.styleClasses.expander = null
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
      this.storage.sort(this.ascComparator)
    },
    sortDesc () {
      this.storage.sort(this.descComparator)
    },
    setNodes () {
      this.storage.setNodes(this.nodes)
    },
    setAnotherNodes () {
      this.storage.setNodes(this.anotherNodes)
    },
    enableEdit () {
      this.treeOptions.canEdit = true
    },
    disableEdit () {
      this.treeOptions.canEdit = false
    },
    enableDelete () {
      this.treeOptions.canDelete = true
    },
    disableDelete () {
      this.treeOptions.canDelete = false
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
  margin-top: 40px;
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
.all-custom-text {
  color: olive;
}
.all-custom-icon {
  color: olive;
}
.treevue-node-checkbox.all-custom-checkbox {
  border-color: olive;
}
.treevue-node-checkbox.all-custom-checkbox.checked:after {
  border-color: olive;
}
.treevue-node-checkbox.all-custom-checkbox.indeterminate:after {
  background: olive;
}
.treevue-node-expander.all-custom-expander:after {
  border-color: olive;
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
