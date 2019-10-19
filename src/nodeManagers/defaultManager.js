'use strict'

function mapNodeToItem (node, parent = null) {
  const idProp = this.treeOptions.idProp
  const id = node[idProp] != null ? node[idProp] : this.internalLastNodeId
  this.internalLastNodeId += 1
  const item = {
    item: node,
    id,
    parent,
    states: {
      checked: node.checked || false,
      disabled: node.disabled || false,
      opened: node.opened || false,
      visible: true,
      matched: false
    },
    icon: node.icon || null
  }
  const children = this.getChildren(node)
  item.children = children ? children.map(x => this.mapNodeToItem(x, item)) : []
  if (this.treeOptions.autoSort) {
    this.sortNodes(item.children, this.treeOptions.sortComparator)
  }
  item.states.isIndeterminate = () => {
    const isSomeChildrenChecked = item.children.some(x => x.states.checked)
    const isAllChildrenChecked = item.children.every(x => x.states.checked)
    return isSomeChildrenChecked && !isAllChildrenChecked
  }

  item.addChild = child => this.addChild(item, child)
  item.insertChild = (child, beforeChild) => this.insertChild(item, child, beforeChild)
  item.expand = withChildren => this.expand(item, withChildren)
  item.collapse = withChildren => this.collapse(item, withChildren)
  item.select = () => this.setSelected(item)
  item.deselect = () => this.setSelected(null)
  item.show = () => this.showNode(item)
  item.disable = withChildren => this.disable(item, withChildren)
  item.enable = withChildren => this.enable(item, withChildren)
  item.check = withChildren => this.check(item, withChildren)
  item.uncheck = withChildren => this.uncheck(item, withChildren)

  return item
}

function isFunction (obj) {
  return (typeof obj === 'function')
}

function getVisibility (node) {
  if (!node.states.visible) {
    return false
  }
  if (node.parent && !node.parent.states.opened) {
    return false
  }
  return true
}

function visitNodeAndChildren (item, itemCallback, onlyVisible) {
  if (onlyVisible && !this.getVisibility(item)) {
    return
  }

  itemCallback(item)

  for (const child of item.children) {
    this.visitNodeAndChildren(child, itemCallback, onlyVisible)
  }
}

function visitAllNodes (items, itemCallback, onlyVisible = false) {
  for (const item of items) {
    this.visitNodeAndChildren(item, itemCallback, onlyVisible)
  }
}

function visitAllParents (item, itemCallback) {
  let parent = item.parent
  while (parent) {
    itemCallback(parent)
    parent = parent.parent
  }
}

function clearFilter () {
  this.options.inSearch = false
  this.visitAll(this.items, item => {
    item.states.visible = true
    item.states.matched = false
  })
  this.tree.$emit('tree:filter:cleared')
}

function filter (searchObject, options) {
  if (!searchObject) {
    return
  }

  const filterOptions = Object.assign({
    showChildren: false
  }, options || {})

  this.options.inSearch = false
  let searchFunc = name => name.toLowerCase().indexOf(searchObject.toLowerCase()) !== -1
  if (searchObject instanceof RegExp) {
    searchFunc = name => searchObject.test(name)
  } else if (isFunction(searchObject)) {
    searchFunc = (name, item) => searchObject(item)
  }
  const matchedNodes = []
  this.visitAll(this.items, item => {
    item.states.visible = item.parent && item.parent.states.visible && filterOptions.showChildren
    item.states.matched = false
    const itemName = this.getName(item)
    if (searchFunc(itemName, item.item)) {
      item.states.visible = true
      item.states.matched = true
      matchedNodes.push(item)
      this.visitAllParents(item, parent => {
        parent.states.visible = true
      })
    }
  })
  this.options.inSearch = true
  this.expandAll()
  this.tree.$emit('tree:filtered', matchedNodes, searchObject)
}

function getCheckedNodes () {
  const checkedNodes = []
  this.visitAll(this.items, item => {
    if (item.states.checked) {
      checkedNodes.push(item)
    }
  })

  return checkedNodes
}

function setAllNodesCheckState (items, state, onlyVisible = false) {
  this.visitAll(items, item => {
    item.states.checked = state
  }, onlyVisible)
}

function checkAllNodes (onlyVisible = false) {
  this.setAllNodesCheckState(this.items, true, onlyVisible)
  this.tree.$emit('tree:checked:all')
}

function checkVisibleNodes () {
  this.setAllNodesCheckState(this.items, true, true)
  this.tree.$emit('tree:checked:visible')
}

function uncheckAllNodes (onlyVisible = false) {
  this.setAllNodesCheckState(this.items, false, onlyVisible)
  this.tree.$emit('tree:unchecked:all')
}

function uncheckVisibleNodes () {
  this.setAllNodesCheckState(this.items, false, true)
  this.tree.$emit('tree:unchecked:visible')
}

function setNodeCheckState (item, state, withChildren = false) {
  item.states.checked = state
  this.tree.$emit(state ? 'node:checked' : 'node:unchecked', item)
  if (withChildren) {
    this.visitAll(item.children, child => {
      this.setNodeCheckState(child, state, true)
    })
  }
}

function checkNode (node, withChildren = false) {
  this.setNodeCheckState(node, true, withChildren)
}

function uncheckNode (node, withChildren = false) {
  this.setNodeCheckState(node, false, withChildren)
}

function setNodeOpenState (item, state, withChildren = false) {
  item.states.opened = state
  this.tree.$emit(state ? 'node:expand' : 'node:collapse', item)
  if (withChildren) {
    this.visitAll(item.children, child => {
      this.setNodeOpenState(child, state, true)
    })
  }
}

function setAllNodesOpenState (items, state) {
  this.visitAll(items, item => {
    item.states.opened = state
  })
}

function expandNode (node, withChildren = false) {
  this.setNodeOpenState(node, true, withChildren)
}

function expandAll () {
  this.setAllNodesOpenState(this.items, true)
  this.tree.$emit('tree:expand:all')
}

function collapseNode (node, withChildren = false) {
  this.setNodeOpenState(node, false, withChildren)
}

function collapseAll () {
  this.setAllNodesOpenState(this.items, false)
  if (this.selectedNode && !this.getVisibility(this.selectedNode)) {
    this.setSelected(null)
  }
  this.tree.$emit('tree:collapse:all')
}

function setSingleNodeDisableState (item, state) {
  item.states.disabled = state
  if (this.selectedNode === item && state) {
    this.setSelected(null)
  }
  if (state) {
    this.tree.$emit('node:disabled', item)
  } else {
    this.tree.$emit('node:enabled', item)
  }
}

function setNodeDisableState (item, state, withChildren = false) {
  this.setSingleNodeDisableState(item, state)
  if (withChildren) {
    this.visitAll(item.children, child => {
      this.setSingleNodeDisableState(child, state)
    })
  }
}

function setAllNodesDisableState (items, state) {
  this.visitAll(items, item => {
    item.states.disabled = state
  })
  if (state) {
    this.setSelected(null)
  }
}

function disable (node, withChildren = false) {
  this.setNodeDisableState(node, true, withChildren)
}

function disableAll () {
  this.setAllNodesDisableState(this.items, true)
  this.tree.$emit('tree:disabled:all')
}

function enable (node, withChildren = false) {
  this.setNodeDisableState(node, false, withChildren)
}

function enableAll () {
  this.setAllNodesDisableState(this.items, false)
  this.tree.$emit('tree:enabled:all')
}

function getNodeById (id) {
  let foundNode = null
  this.visitAll(this.items, item => {
    if (item.id === id) {
      foundNode = item
    }
  })

  return foundNode
}

function findOne (selector) {
  if (!isFunction(selector)) {
    throw new Error('selector is not a function')
  }

  let foundNode = null
  this.visitAll(this.items, item => {
    if (selector(item)) {
      foundNode = item
    }
  })

  return foundNode
}

function findAll (selector) {
  if (!isFunction(selector)) {
    throw new Error('selector is not a function')
  }

  const foundNodes = []
  this.visitAll(this.items, item => {
    if (selector(item)) {
      foundNodes.push(item)
    }
  })

  return foundNodes
}

function showNode (node) {
  this.visitAllParents(node, item => {
    this.expand(item)
  })
}

function setSelectedNode (node) {
  this.selectedNode = node
  this.tree.$emit('node:selected', node)
  if (!node) {
    return
  }
  if (this.treeOptions.checkOnSelect) {
    this.setNodeCheckState(node, true)
  }
  if (this.treeOptions.openOnSelect) {
    this.expand(node)
  }
}

function getName (node) {
  const nameProp = this.treeOptions.nameProp
  if (typeof nameProp === 'function') {
    return nameProp(node.item)
  }
  return node.item[nameProp]
}

function getChildren (node) {
  const childrenProp = this.treeOptions.childrenProp
  if (typeof childrenProp === 'function') {
    return childrenProp(node)
  }

  return node[childrenProp]
}

function addChild (parent, node) {
  const child = this.mapNodeToItem(node, parent)
  parent.children.push(child)
  if (this.treeOptions.autoSort) {
    this.sortNodes(parent.children, this.treeOptions.sortComparator)
  }
  this.tree.$emit('node:child:added', node, child)
}

function insertChild (parent, node, beforeNode) {
  const child = this.mapNodeToItem(node, parent)
  if (beforeNode) {
    const insertIndex = parent.children.indexOf(beforeNode)
    parent.children.splice(insertIndex, 0, child)
  } else {
    parent.children.unshift(child)
  }
  if (this.treeOptions.autoSort) {
    this.sortNodes(parent.children, this.treeOptions.sortComparator)
  }
  this.tree.$emit('node:child:added', node, child)
}

function removeRootNode (items, originalItems, node) {
  const removingIndex = items.indexOf(node)
  items.splice(removingIndex, 1)
  const item = node.item
  const removingItemIndex = originalItems.indexOf(item)
  originalItems.splice(removingItemIndex, 1)
  this.tree.$emit('node:child:removed', node)
}

function removeChildNode (parent, itemChildren, node) {
  const removingIndex = parent.children.indexOf(node)
  parent.children.splice(removingIndex, 1)
  const removingItemIndex = itemChildren.indexOf(node.item)
  itemChildren.splice(removingItemIndex, 1)
  this.tree.$emit('node:child:removed', node)
}

function removeNode (node) {
  // TODO: учесть что children могут быть функцией
  const parent = node.parent
  if (!parent) {
    this.removeRootNode(this.items, this.originalItems, node)
    if (this.selectedNode === node) {
      this.setSelected(null)
    }
    return
  }
  const parentItem = parent.item
  const itemChildren = this.getChildren(parentItem)
  this.removeChildNode(parent, itemChildren, node)
  if (this.selectedNode === node) {
    this.setSelected(null)
  }
}

function sortNodes (nodes, comparator) {
  if (comparator) {
    nodes.sort(comparator)
  } else {
    nodes.sort((node1, node2) => this.getName(node1).localeCompare(this.getName(node2)))
  }
}

function sortNodesRecursive (nodes, comparator) {
  const compareFunc = comparator || this.treeOptions.sortComparator
  this.sortNodes(nodes, compareFunc)

  for (const item of nodes) {
    this.sortNodesRecursive(item.children, comparator)
  }
}

function initialize (treeOptions) {
  this.treeOptions = treeOptions
}

function DefaultManager (treeComponent) {
  this.tree = treeComponent
  this.treeOptions = null
  this.options = {
    inSearch: false
  }
  this.selectedNode = null
  this.originalItems = []
  this.items = []
  this.internalLastNodeId = 0
  this.initialize = initialize.bind(this)
  this.getChecked = getCheckedNodes.bind(this)
  this.checkAll = checkAllNodes.bind(this)
  this.checkVisible = checkVisibleNodes.bind(this)
  this.uncheckAll = uncheckAllNodes.bind(this)
  this.uncheckVisible = uncheckVisibleNodes.bind(this)
  this.expand = expandNode.bind(this)
  this.collapse = collapseNode.bind(this)
  this.expandAll = expandAll.bind(this)
  this.collapseAll = collapseAll.bind(this)
  this.getById = getNodeById.bind(this)
  this.findOne = findOne.bind(this)
  this.findAll = findAll.bind(this)
  this.setSelected = setSelectedNode.bind(this)
  this.getVisibility = getVisibility.bind(this)
  this.visitNodeAndChildren = visitNodeAndChildren.bind(this)
  this.filter = filter.bind(this)
  this.clearFilter = clearFilter.bind(this)
  this.visitAll = visitAllNodes.bind(this)
  this.setAllNodesCheckState = setAllNodesCheckState.bind(this)
  this.setNodeCheckState = setNodeCheckState.bind(this)
  this.check = checkNode.bind(this)
  this.uncheck = uncheckNode.bind(this)
  this.setAllNodesOpenState = setAllNodesOpenState.bind(this)
  this.setNodeOpenState = setNodeOpenState.bind(this)
  this.showNode = showNode.bind(this)
  this.visitAllParents = visitAllParents.bind(this)
  this.mapNodeToItem = mapNodeToItem.bind(this)
  this.getName = getName.bind(this)
  this.getChildren = getChildren.bind(this)
  this.addChild = addChild.bind(this)
  this.insertChild = insertChild.bind(this)
  this.removeRootNode = removeRootNode.bind(this)
  this.removeChildNode = removeChildNode.bind(this)
  this.removeNode = removeNode.bind(this)
  this.setSingleNodeDisableState = setSingleNodeDisableState.bind(this)
  this.setNodeDisableState = setNodeDisableState.bind(this)
  this.setAllNodesDisableState = setAllNodesDisableState.bind(this)
  this.disable = disable.bind(this)
  this.disableAll = disableAll.bind(this)
  this.enable = enable.bind(this)
  this.enableAll = enableAll.bind(this)
  this.sortNodes = sortNodes.bind(this)
  this.sortNodesRecursive = sortNodesRecursive.bind(this)
  this.sort = function (comparator) {
    this.sortNodesRecursive(this.items, comparator)
  }
  this.setNodes = function (nodes) {
    this.originalItems = nodes
    const items = nodes.map(x => this.mapNodeToItem(x))
    if (this.treeOptions.autoSort) {
      this.sortNodes(items, this.treeOptions.sortComparator)
    }
    this.items = items
  }.bind(this)
}

export default DefaultManager
