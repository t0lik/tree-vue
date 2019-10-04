'use strict'

function mapNodeToItem (node, parent) {
  const item = {
    item: node,
    parent,
    states: {
      checked: node.checked ||  false,
      disabled: node.disabled ||  false,
      opened: node.opened ||  false,
      filtered: false
    }
  }
  item.children = node.children ? node.children.map(x => mapNodeToItem(x, item)) : []

  return item
}

function getVisibility (node) {
  if (this.options.inSearch && !node.states.filtered) {
    return false
  }

  return true
}

function visitNodeAndChildren (item, itemCallback, onlyVisible) {
  itemCallback(item)
  if (onlyVisible && !item.states.opened) {
    return
  }
  for (const child of item.children) {
    visitNodeAndChildren(child, itemCallback, onlyVisible)
  }
}

function visitAllNodes (items, itemCallback, onlyVisible = false) {
  for (const item of items) {
    visitNodeAndChildren(item, itemCallback, onlyVisible)
  }
}

function getCheckedNodes () {
  const checkedNodes = []
  visitAllNodes(this.items, item => {
    if (item.states.checked) {
      checkedNodes.push(item)
    }
  })

  return checkedNodes
}

function setAllNodesCheckState (items, state, onlyVisible = false) {
  visitAllNodes(items, item => {
    item.states.checked = state
  }, onlyVisible)
}

function checkAllNodes (onlyVisible = false) {
  setAllNodesCheckState(this.items, true, onlyVisible)
}

function checkVisibleNodes () {
  setAllNodesCheckState(this.items, true, true)
}

function uncheckAllNodes (onlyVisible = false) {
  setAllNodesCheckState(this.items, false, onlyVisible)
}

function uncheckVisibleNodes () {
  setAllNodesCheckState(this.items, false, true)
}

function setNodeOpenState (item, state, withChildren = false) {
  item.states.opened = state
  if (withChildren) {
    visitAllNodes(item.children, item => {
      item.states.opened = state
    })
  }
}

function setAllNodesOpenState (items, state) {
  visitAllNodes(items, item => {
    item.states.opened = state
  })
}

function expandNode (node, withChildren = false) {
  setNodeOpenState(node, true, withChildren)
}

function expandAll () {
  setAllNodesOpenState(this.items, true)
}

function collapseNode (node, withChildren = false) {
  setNodeOpenState(node, false, withChildren)
}

function collapseAll () {
  setAllNodesOpenState(this.items, false)
}

function getNodeById (id) {
  let foundNode = null
  visitAllNodes(this.items, item => {
    if (item.item.id === id) {
      foundNode = item
    }
  })

  return foundNode
}

function findOne (selector) {
  let foundNode = null
  visitAllNodes(this.items, item => {
    if (selector(item)) {
      foundNode = item
    }
  })

  return foundNode
}

function findAll (selector) {
  const foundNodes = []
  visitAllNodes(this.items, item => {
    if (selector(item)) {
      foundNodes.push(item)
    }
  })

  return foundNodes
}

function setSelectedNode (node) {
  this.selectedNode = node
  if (this.treeOptions.checkOnSelect) {
    node.states.checked = true
  }
}

function initialize (treeOptions) {
  this.treeOptions = treeOptions
}

function DefaultManager (initialNodes) {
  this.treeOptions = null
  this.options = {
    inSearch: false
  }
  this.selectedNode = null
  if (initialNodes) {
    this.items = initialNodes.map(x => mapNodeToItem(x))
  } else {
    this.items = []
  }
  this.initialize = initialize
  this.getChecked = getCheckedNodes
  this.checkAll = checkAllNodes
  this.checkVisible = checkVisibleNodes
  this.uncheckAll = uncheckAllNodes
  this.uncheckVisible = uncheckVisibleNodes
  this.expand = expandNode
  this.collapse = collapseNode
  this.expandAll = expandAll
  this.collapseAll = collapseAll
  this.getById = getNodeById
  this.findOne = findOne
  this.findAll = findAll
  this.setSelected = setSelectedNode
  this.getVisibility = getVisibility

  this.setNodes = function (nodes) {
    this.items = nodes.map(x => mapNodeToItem(x))
  }
}

export default DefaultManager