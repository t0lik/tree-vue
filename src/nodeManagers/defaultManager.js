'use strict'

function mapNodeToItem (node, parent) {
  const item = {
    item: node,
    parent,
    states: {
      checked: node.checked ||  false,
      disabled: node.disabled ||  false,
      opened: node.opened ||  false,
      filtered: false,
      filterMatched: false
    }
  }
  item.children = node.children ? node.children.map(x => mapNodeToItem(x, item)) : []

  return item
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
function filter (searchString) {
  if(!searchString) {
    return
  }

  this.options.inSearch = false
  this.visitAll(this.items, item => {
    item.states.filtered = false
    item.states.filterMatched = false
  if (item.item.name.toLowerCase().indexOf(searchString.toLowerCase()) !== -1) {
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
    if (item.item.id === id) {
      foundNode = item
    }
  })

  return foundNode
}

function findOne (selector) {
  let foundNode = null
  this.visitAll(this.items, item => {
    if (selector(item)) {
      foundNode = item
    }
  })

  return foundNode
}

function findAll (selector) {
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

  this.setNodes = function (nodes) {
    this.items = nodes.map(x => mapNodeToItem(x))
  }
}

export default DefaultManager