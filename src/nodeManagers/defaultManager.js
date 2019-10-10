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
      checked: node.checked ||  false,
      disabled: node.disabled ||  false,
      opened: node.opened ||  false,
      filtered: false,
      filterMatched: false
    }
  }
  const children = this.getChildren(node)
  item.children = children ? children.map(x => this.mapNodeToItem(x, item)) : []

  item.states.isIndeterminate = () => {
    const isSomeChildrenChecked = item.children.some(x => x.states.checked)
    const isAllChildrenChecked = item.children.every(x => x.states.checked)
    return isSomeChildrenChecked && !isAllChildrenChecked
  }

  item.addChild = child => this.addChild(item, child)
  item.insertChild = (child, beforeChild) => this.insertChild(item, child, beforeChild)

  return item
}

function isFunction (obj) {
  return (typeof obj === 'function')
}

function getVisibility (node) {
  if (this.options.inSearch && !node.states.filtered) {
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
    item.states.filtered = false
    item.states.filterMatched = false
  })
}
function filter (searchObject, options) {
  if(!searchObject) {
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
  this.visitAll(this.items, item => {
    item.states.filtered = item.parent && item.parent.states.filtered && filterOptions.showChildren
    item.states.filterMatched = false
    const itemName = this.getName(item)
    if (searchFunc(itemName, item.item)) {
      item.states.filtered = true
      item.states.filterMatched = true
      this.visitAllParents(item, parent => {
        parent.states.filtered = true
      })
    }
  })
  this.options.inSearch = true
  this.expandAll()
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
}

function checkVisibleNodes () {
  this.setAllNodesCheckState(this.items, true, true)
}

function uncheckAllNodes (onlyVisible = false) {
  this.setAllNodesCheckState(this.items, false, onlyVisible)
}

function uncheckVisibleNodes () {
  this.setAllNodesCheckState(this.items, false, true)
}

function setNodeOpenState (item, state, withChildren = false) {
  item.states.opened = state
  if (withChildren) {
    this.visitAll(item.children, item => {
      item.states.opened = state
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
}

function collapseNode (node, withChildren = false) {
  this.setNodeOpenState(node, false, withChildren)
}

function collapseAll () {
  this.setAllNodesOpenState(this.items, false)
  if (this.selectedNode && !this.getVisibility(this.selectedNode)) {
    this.selectedNode = null
  }
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
  if (this.treeOptions.checkOnSelect) {
    node.states.checked = true
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
  const nodeItem = this.mapNodeToItem(node, parent)
  parent.children.push(nodeItem)
}

function insertChild (parent, node, beforeNode) {
  const nodeItem = this.mapNodeToItem(node, parent)
  if (beforeNode) {
    const insertIndex = parent.children.indexOf(beforeNode)
    parent.children.splice(insertIndex, 0, nodeItem)
  } else {
    parent.children.unshift(nodeItem)
  }
}

function removeRootNode (items, originalItems, node) {
  const removingIndex = items.indexOf(node)
  items.splice(removingIndex, 1)
  const item = node.item
  const removingItemIndex = originalItems.indexOf(item)
  originalItems.splice(removingItemIndex, 1)
}

function removeChildNode (parent, itemChildren, node) {
  const removingIndex = parent.children.indexOf(node)
  parent.children.splice(removingIndex, 1)
  const removingItemIndex = itemChildren.indexOf(node.item)
  itemChildren.splice(removingItemIndex, 1)
}
function removeNode (node) {
  // TODO: учесть что children могут быть функцией
  const parent = node.parent
  if (!parent) {
    removeRootNode(this.items, this.originalItems, node)
    if (this.selectedNode === node) {
      this.selectedNode = null
    }
    return
  }
  const parentItem = parent.item
  const itemChildren = this.getChildren(parentItem)
  removeChildNode(parent, itemChildren, node)
  if (this.selectedNode === node) {
    this.selectedNode = null
  }
}

function initialize (treeOptions) {
  this.treeOptions = treeOptions
}

function DefaultManager () {
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
  this.setAllNodesOpenState = setAllNodesOpenState.bind(this)
  this.setNodeOpenState = setNodeOpenState.bind(this)
  this.showNode = showNode.bind(this)
  this.visitAllParents = visitAllParents.bind(this)
  this.mapNodeToItem = mapNodeToItem.bind(this)
  this.getName = getName.bind(this)
  this.getChildren = getChildren.bind(this)
  this.addChild = addChild.bind(this)
  this.insertChild = insertChild.bind(this)
  this.removeNode = removeNode.bind(this)

  this.setNodes = function (nodes) {
    this.originalItems = nodes
    this.items = nodes.map(x => this.mapNodeToItem(x))
  }.bind(this)
}

export default DefaultManager