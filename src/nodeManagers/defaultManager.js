'use strict'

const CheckModes = {
  Linked: 'linked',
  Independent: 'independent'
}

function mapItemToNode (manager, item, parent = null, prevNode = null) {
  const idProp = manager.treeOptions.idProp
  const id = item[idProp] != null ? item[idProp] : manager.internalLastNodeId
  manager.internalLastNodeId += 1
  const node = {
    item,
    id,
    parent,
    prev: prevNode,
    next: null,
    states: {
      checked: item.checked || false,
      disabled: item.disabled || false,
      opened: item.opened || false,
      visible: true,
      matched: false
    },
    styleClasses: {
      icon: null,
      text: null,
      checkbox: null,
      expander: null
    },
    icon: item.icon || null
  }
  const children = manager.getChildren(item) || []
  const mappedChildren = children.map(x => mapItemToNode(manager, x, node))
  if (manager.treeOptions.autoSort) {
    sortNodes(manager, mappedChildren, manager.treeOptions.sortComparator)
  }
  let prevChild = null
  for (const child of mappedChildren) {
    child.prev = prevChild
    if (prevChild) {
      prevChild.next = child
    }
    prevChild = child
  }

  node.children = mappedChildren
  node.indeterminate = () => {
    const isSomeChildrenChecked = node.children.some(x => x.states.checked || x.indeterminate())
    const isAllChildrenChecked = node.children.every(x => x.states.checked && !x.indeterminate())
    return isSomeChildrenChecked && !isAllChildrenChecked
  }

  node.addChild = child => manager.addChild(node, child)
  node.insertChild = (child, beforeChild) => manager.insertChild(node, child, beforeChild)

  node.expand = withChildren => manager.expand(node, withChildren)
  node.expandChildren = () => manager.expandChildren(node)
  node.collapse = withChildren => manager.collapse(node, withChildren)
  node.collapseChildren = () => manager.collapseChildren(node)

  node.select = () => manager.setSelected(node)
  node.deselect = () => manager.setSelected(null)

  node.show = () => manager.showNode(node)

  node.disable = withChildren => manager.disable(node, withChildren)
  node.disableChildren = () => manager.disableChildren(node)
  node.enable = withChildren => manager.enable(node, withChildren)
  node.enableChildren = () => manager.enableChildren(node)

  node.check = withChildren => manager.check(node, withChildren)
  node.checkChildren = () => manager.checkChildren(node)
  node.uncheck = withChildren => manager.uncheck(node, withChildren)
  node.uncheckChildren = () => manager.uncheckChildren(node)
  node.visible = () => getVisibility(node)

  node.setCheckboxStyle = (checkBoxClasses, withChildren) => manager.setCheckboxStyle(node, checkBoxClasses, withChildren)
  node.resetCheckboxStyle = withChildren => manager.setCheckboxStyle(node, null, withChildren)
  node.setTextStyle = (textClasses, withChildren) => manager.setTextStyle(node, textClasses, withChildren)
  node.resetTextStyle = withChildren => manager.setTextStyle(node, null, withChildren)
  node.setIconStyle = (iconClasses, withChildren) => manager.setIconStyle(node, iconClasses, withChildren)
  node.resetIconStyle = withChildren => manager.setIconStyle(node, null, withChildren)
  node.setExpanderStyle = (expanderClasses, withChildren) => manager.setExpanderStyle(node, expanderClasses, withChildren)
  node.resetExpanderStyle = withChildren => manager.setExpanderStyle(node, null, withChildren)

  node.findParent = selector => manager.findParent(node, selector)
  node.findParents = selector => manager.findParents(node, selector)

  node.getName = () => manager.getName(node)

  return node
}

function isFunction (obj) {
  return (typeof obj === 'function')
}

function getVisibility (node) {
  if (!node) {
    throw new Error('parameter "node" is not set')
  }

  if (!node.states.visible) {
    return false
  }
  if (node.parent && !node.parent.states.opened) {
    return false
  }
  return true
}

function getVisibleNodes () {
  const visibleNodes = []
  this.visitAll(this.items, node => {
    if (node.visible()) {
      visibleNodes.push(node)
    }
  })

  return visibleNodes
}

function visitNodeAndChildren (node, nodeCallback, onlyVisible) {
  if (!node) {
    throw new Error('parameter "node" is not set')
  }
  if (!nodeCallback) {
    throw new Error('parameter "nodeCallback" is not set')
  }

  if (onlyVisible && !node.visible()) {
    return
  }

  const stopVisiting = nodeCallback(node)

  if (stopVisiting === true) {
    return true
  }

  for (const child of node.children) {
    const stopVisiting = visitNodeAndChildren(child, nodeCallback, onlyVisible)
    if (stopVisiting === true) {
      return true
    }
  }
}

function visitAllNodes (nodes, nodeCallback, onlyVisible = false) {
  if (!nodes) {
    throw new Error('parameter "nodes" is not set')
  }
  if (!nodeCallback) {
    throw new Error('parameter "nodeCallback" is not set')
  }

  for (const node of nodes) {
    const stopVisiting = visitNodeAndChildren(node, nodeCallback, onlyVisible)
    if (stopVisiting === true) {
      return
    }
  }
}

function visitAllParents (node, nodeCallback) {
  if (!node) {
    throw new Error('parameter "node" is not set')
  }
  if (!nodeCallback) {
    throw new Error('parameter "nodeCallback" is not set')
  }

  let parent = node.parent
  while (parent) {
    const stopVisiting = nodeCallback(parent)
    if (stopVisiting === true) {
      return
    }
    parent = parent.parent
  }
}

function setCheckboxStyle (node, classList, withChildren = false) {
  if (!node) {
    throw new Error('parameter "node" is not set')
  }

  node.styleClasses.checkbox = classList
  if (withChildren) {
    this.visitAll(node.children, child => {
      child.styleClasses.checkbox = classList
    })
  }
}

function setTextStyle (node, classList, withChildren = false) {
  if (!node) {
    throw new Error('parameter "node" is not set')
  }

  node.styleClasses.text = classList
  if (withChildren) {
    this.visitAll(node.children, child => {
      child.styleClasses.text = classList
    })
  }
}

function setIconStyle (node, classList, withChildren = false) {
  if (!node) {
    throw new Error('parameter "node" is not set')
  }

  node.styleClasses.icon = classList
  if (withChildren) {
    this.visitAll(node.children, child => {
      child.styleClasses.icon = classList
    })
  }
}

function setExpanderStyle (node, classList, withChildren = false) {
  if (!node) {
    throw new Error('parameter "node" is not set')
  }

  node.styleClasses.expander = classList
  if (withChildren) {
    this.visitAll(node.children, child => {
      child.styleClasses.expander = classList
    })
  }
}

function clearFilter () {
  this.options.inSearch = false
  this.visitAll(this.items, node => {
    node.states.visible = true
    node.states.matched = false
  })
  this.collapseAll()
  this.tree.$emit('tree:filter:cleared')
}

function filter (searchObject, options) {
  if (!searchObject) {
    throw new Error('parameter "searchObject" is not set')
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
  this.visitAll(this.items, node => {
    node.states.visible = node.parent && node.parent.states.visible && filterOptions.showChildren
    node.states.matched = false
    const itemName = node.getName()
    if (searchFunc(itemName, node.item)) {
      node.states.visible = true
      node.states.matched = true
      matchedNodes.push(node)
      this.visitAllParents(node, parent => {
        parent.states.visible = true
      })
    }
  })
  this.options.inSearch = true
  this.expandAll()
  this.tree.$emit('tree:filtered', matchedNodes, searchObject)

  return matchedNodes
}

function getCheckedNodes () {
  const checkedNodes = []
  this.visitAll(this.items, node => {
    if (node.states.checked) {
      checkedNodes.push(node)
    }
  })

  return checkedNodes
}

function setAllNodesCheckState (nodes, state, onlyVisible = false) {
  if (!nodes) {
    throw new Error('parameter "nodes" is not set')
  }

  visitAllNodes(nodes, node => {
    node.states.checked = state
  }, onlyVisible)
}

function checkAllNodes () {
  setAllNodesCheckState(this.items, true, false)
  this.tree.$emit('tree:checked:all')
}

function checkVisibleNodes () {
  setAllNodesCheckState(this.items, true, true)
  this.tree.$emit('tree:checked:visible')
}

function uncheckAllNodes () {
  setAllNodesCheckState(this.items, false, false)
  this.tree.$emit('tree:unchecked:all')
}

function uncheckVisibleNodes () {
  setAllNodesCheckState(this.items, false, true)
  this.tree.$emit('tree:unchecked:visible')
}

function setSingleNodeCheckState (manager, node, state) {
  if (!manager) {
    throw new Error('parameter "manager" is not set')
  }

  if (!node) {
    throw new Error('parameter "node" is not set')
  }

  node.states.checked = !!state
  manager.tree.$emit(state ? 'node:checked' : 'node:unchecked', node)
}

function setCheckState (node, state, withChildren = false) {
  if (!node) {
    throw new Error('parameter "node" is not set')
  }

  setSingleNodeCheckState(this, node, state)
  if (withChildren || this.treeOptions.checkMode === CheckModes.Linked) {
    setNodeChildrenCheckState(this, node, state)
  }
  if (this.treeOptions.checkMode === CheckModes.Linked) {
    this.visitAllParents(node, parent => {
      const visibleChildren = parent.children.filter(x => x.visible())
      if (!visibleChildren.length) {
        return
      }
      const checkCounts = visibleChildren.reduce((acc, curr) => {
        acc.checked += curr.states.checked ? 1 : 0
        acc.unchecked += curr.states.checked ? 0 : 1
        acc.indeterminate += curr.indeterminate() ? 1 : 0
        return acc
      }, {
        checked: 0,
        unchecked: 0,
        indeterminate: 0
      })

      if (checkCounts.checked === 0 && checkCounts.indeterminate === 0) {
        setSingleNodeCheckState(this, parent, false)
      }
      if (checkCounts.checked === visibleChildren.length) {
        setSingleNodeCheckState(this, parent, true)
      }
    })
  }
}

function setNodeChildrenCheckState (manager, node, state) {
  if (!manager) {
    throw new Error('parameter "manager" is not set')
  }

  if (!node) {
    throw new Error('parameter "node" is not set')
  }

  visitAllNodes(node.children, child => {
    setSingleNodeCheckState(manager, child, state)
  })
}

function checkNode (node, withChildren = false) {
  if (!node) {
    throw new Error('parameter "node" is not set')
  }

  this.setCheckState(node, true, withChildren)
}

function checkChildren (node) {
  if (!node) {
    throw new Error('parameter "node" is not set')
  }

  if (this.treeOptions.checkMode === CheckModes.Linked) {
    this.setCheckState(node, true, true)
  } else {
    setNodeChildrenCheckState(this, node, true)
  }
}

function uncheckNode (node, withChildren = false) {
  if (!node) {
    throw new Error('parameter "node" is not set')
  }

  this.setCheckState(node, false, withChildren)
}

function uncheckChildren (node) {
  if (!node) {
    throw new Error('parameter "node" is not set')
  }

  if (this.treeOptions.checkMode === CheckModes.Linked) {
    this.setCheckState(node, false, true)
  } else {
    setNodeChildrenCheckState(this, node, false)
  }
}

function setOpenState (node, state, withChildren = false) {
  if (!node) {
    throw new Error('parameter "node" is not set')
  }

  node.states.opened = state
  this.tree.$emit(state ? 'node:expanded' : 'node:collapsed', node)
  if (withChildren) {
    setNodeChildrenOpenState(this, node, state)
  }
}

function setNodeChildrenOpenState (manager, node, state) {
  if (!manager) {
    throw new Error('parameter "manager" is not set')
  }

  if (!node) {
    throw new Error('parameter "node" is not set')
  }

  visitAllNodes(node.children, child => {
    manager.setOpenState(child, state, true)
  })
}

function setAllNodesOpenState (nodes, state) {
  if (!nodes) {
    throw new Error('parameter "nodes" is not set')
  }

  visitAllNodes(nodes, node => {
    node.states.opened = state
  })
}

function expandNode (node, withChildren = false) {
  if (!node) {
    throw new Error('parameter "node" is not set')
  }

  this.setOpenState(node, true, withChildren)
}

function expandChildren (node) {
  if (!node) {
    throw new Error('parameter "node" is not set')
  }

  setNodeChildrenOpenState(this, node, true)
}

function expandAll () {
  setAllNodesOpenState(this.items, true)
  this.tree.$emit('tree:expanded:all')
}

function collapseNode (node, withChildren = false) {
  if (!node) {
    throw new Error('parameter "node" is not set')
  }

  this.setOpenState(node, false, withChildren)
}

function collapseChildren (node) {
  if (!node) {
    throw new Error('parameter "node" is not set')
  }

  setNodeChildrenOpenState(this, node, false)
}

function collapseAll () {
  setAllNodesOpenState(this.items, false)
  if (this.selectedNode && !this.selectedNode.visible()) {
    this.setSelected(null)
  }
  this.tree.$emit('tree:collapsed:all')
}

function setSingleNodeDisableState (manager, node, state) {
  if (!manager) {
    throw new Error('parameter "manager" is not set')
  }

  if (!node) {
    throw new Error('parameter "node" is not set')
  }

  node.states.disabled = state
  if (manager.selectedNode === node && state) {
    manager.setSelected(null)
  }
  if (state) {
    manager.tree.$emit('node:disabled', node)
  } else {
    manager.tree.$emit('node:enabled', node)
  }
}

function setNodeDisableState (manager, node, state, withChildren = false) {
  if (!manager) {
    throw new Error('parameter "manager" is not set')
  }

  if (!node) {
    throw new Error('parameter "node" is not set')
  }

  setSingleNodeDisableState(manager, node, state)
  if (withChildren) {
    visitAllNodes(node.children, child => {
      setSingleNodeDisableState(manager, child, state)
    })
  }
}

function setNodeChildrenDisableState (manager, node, state) {
  if (!manager) {
    throw new Error('parameter "manager" is not set')
  }

  if (!node) {
    throw new Error('parameter "node" is not set')
  }

  visitAllNodes(node.children, child => {
    setSingleNodeDisableState(manager, child, state)
  })
}

function setAllNodesDisableState (manager, nodes, state) {
  if (!manager) {
    throw new Error('parameter "manager" is not set')
  }

  if (!nodes) {
    throw new Error('parameter "nodes" is not set')
  }

  visitAllNodes(nodes, node => {
    node.states.disabled = state
  })
  if (state) {
    manager.setSelected(null)
  }
}

function disable (node, withChildren = false) {
  if (!node) {
    throw new Error('parameter "node" is not set')
  }

  setNodeDisableState(this, node, true, withChildren)
}

function disableChildren (node) {
  if (!node) {
    throw new Error('parameter "node" is not set')
  }

  setNodeChildrenDisableState(this, node, true)
}

function disableAll () {
  setAllNodesDisableState(this, this.items, true)
  this.tree.$emit('tree:disabled:all')
}

function enable (node, withChildren = false) {
  if (!node) {
    throw new Error('parameter "node" is not set')
  }

  setNodeDisableState(this, node, false, withChildren)
}

function enableChildren (node) {
  if (!node) {
    throw new Error('parameter "node" is not set')
  }

  setNodeChildrenDisableState(this, node, false)
}

function enableAll () {
  setAllNodesDisableState(this, this.items, false)
  this.tree.$emit('tree:enabled:all')
}

function getNodeById (id) {
  let foundNode = null
  this.visitAll(this.items, node => {
    if (node.id === id) {
      foundNode = node
    }
  })

  return foundNode
}

function findOne (selector) {
  if (!selector) {
    throw new Error('parameter "selector" is not set')
  }

  if (!isFunction(selector)) {
    throw new Error('selector is not a function')
  }

  let foundNode = null
  this.visitAll(this.items, node => {
    if (selector(node)) {
      foundNode = node
      return true
    }
  })

  return foundNode
}

function findParent (node, selector) {
  if (!node) {
    throw new Error('parameter "node" is not set')
  }

  if (!selector) {
    throw new Error('parameter "selector" is not set')
  }

  if (!isFunction(selector)) {
    throw new Error('selector is not a function')
  }

  let foundParent = null
  this.visitAllParents(node, parent => {
    if (selector(parent)) {
      foundParent = parent
      return true
    }
  })

  return foundParent
}

function findParents (node, selector) {
  if (!node) {
    throw new Error('parameter "node" is not set')
  }

  if (!selector) {
    throw new Error('parameter "selector" is not set')
  }

  if (!isFunction(selector)) {
    throw new Error('selector is not a function')
  }

  const foundParents = []
  this.visitAllParents(node, parent => {
    if (selector(parent)) {
      foundParents.push(parent)
    }
  })

  return foundParents
}

function findAll (selector) {
  if (!selector) {
    throw new Error('parameter "selector" is not set')
  }

  if (!isFunction(selector)) {
    throw new Error('selector is not a function')
  }

  const foundNodes = []
  this.visitAll(this.items, node => {
    if (selector(node)) {
      foundNodes.push(node)
    }
  })

  return foundNodes
}

function showNode (node) {
  if (!node) {
    throw new Error('parameter "node" is not set')
  }

  this.visitAllParents(node, parent => {
    this.expand(parent)
  })
}

function setSelectedNode (node) {
  this.selectedNode = node
  this.tree.$emit('node:selected', node)

  if (!node) {
    return
  }
  if (this.treeOptions.checkOnSelect) {
    this.setCheckState(node, true)
  }
  if (this.treeOptions.openOnSelect) {
    this.expand(node)
  }
}

function getName (node) {
  if (!node) {
    throw new Error('parameter "node" is not set')
  }

  const nameProp = this.treeOptions.nameProp
  if (typeof nameProp === 'function') {
    return nameProp(node.item)
  }
  return node.item[nameProp]
}

function getEditName (node) {
  if (!node) {
    throw new Error('parameter "node" is not set')
  }

  const editNameProp = this.treeOptions.editNameProp || this.treeOptions.nameProp
  if (typeof editNameProp === 'function') {
    throw new Error('"editNameProp" cannot be function')
  }
  return node.item[editNameProp]
}

function setName (node, newName) {
  if (!node) {
    throw new Error('parameter "node" is not set')
  }

  if (!newName) {
    throw new Error('parameter "newName" is not set')
  }

  const editNameProp = this.treeOptions.editNameProp || this.treeOptions.nameProp
  if (typeof editNameProp === 'function') {
    throw new Error('"editNameProp" cannot be function')
  }

  const setNameFunc = this.treeOptions.setNameFunc
  if (!setNameFunc) {
    node.item[editNameProp] = newName
    return
  }
  if (typeof setNameFunc !== 'function') {
    throw new Error('"setNameFunc" must be function')
  }
  setNameFunc(node.item, newName)
}

function getChildren (item) {
  if (!item) {
    throw new Error('parameter "item" is not set')
  }

  const childrenProp = this.treeOptions.childrenProp
  if (typeof childrenProp === 'function') {
    return childrenProp(item)
  }

  return item[childrenProp]
}

function addChild (parent, item) {
  if (!parent) {
    throw new Error('parameter "parent" is not set')
  }

  if (!item) {
    throw new Error('parameter "item" is not set')
  }

  const child = mapItemToNode(this, item, parent)
  parent.children.push(child)
  if (this.treeOptions.autoSort) {
    sortNodes(this, parent.children, this.treeOptions.sortComparator)
  }
  this.tree.$emit('node:child:added', item, child)

  return child
}

function insertChild (parent, item, beforeNode) {
  if (!parent) {
    throw new Error('parameter "parent" is not set')
  }

  if (!item) {
    throw new Error('parameter "item" is not set')
  }

  const child = mapItemToNode(this, item, parent)
  if (beforeNode) {
    const insertIndex = parent.children.indexOf(beforeNode)
    parent.children.splice(insertIndex, 0, child)
  } else {
    parent.children.unshift(child)
  }
  if (this.treeOptions.autoSort) {
    sortNodes(this, parent.children, this.treeOptions.sortComparator)
  }
  this.tree.$emit('node:child:added', item, child)

  return child
}

function removeRootNode (nodes, originalItems, node) {
  const removingIndex = nodes.indexOf(node)
  nodes.splice(removingIndex, 1)
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
  if (!node) {
    throw new Error('parameter "node" is not set')
  }

  const parent = node.parent
  if (!parent) {
    removeRootNode(this.items, this.originalItems, node)
    this.tree.$emit('node:removed', node)
    if (this.selectedNode === node) {
      this.setSelected(null)
    }
    return
  }
  if (isFunction(this.treeOptions.childrenProp)) {
    throw new Error('cannot remove the child item while "childrenProp" is a function')
  }
  const parentItem = parent.item
  const itemChildren = this.getChildren(parentItem)
  removeChildNode(parent, itemChildren, node)
  this.tree.$emit('node:child:removed', node)
  if (this.selectedNode === node) {
    this.setSelected(null)
  }
}

function sortNodes (manager, nodes, comparator) {
  if (!manager) {
    throw new Error('parameter "manager" is not set')
  }

  if (!nodes) {
    throw new Error('parameter "nodes" is not set')
  }

  if (comparator) {
    nodes.sort(comparator)
  } else {
    nodes.sort((node1, node2) => node1.getName().localeCompare(node2.getName()))
  }
}

function sortNodesRecursive (manager, nodes, comparator) {
  if (!manager) {
    throw new Error('parameter "manager" is not set')
  }

  if (!nodes) {
    throw new Error('parameter "nodes" is not set')
  }

  const compareFunc = comparator || manager.treeOptions.sortComparator
  sortNodes(manager, nodes, compareFunc)

  for (const node of nodes) {
    sortNodesRecursive(manager, node.children, comparator)
  }
}

function initialize (treeOptions) {
  if (!treeOptions) {
    throw new Error('parameter "treeOptions" is not set')
  }

  this.treeOptions = treeOptions
}

function DefaultManager (treeComponent) {
  this.tree = treeComponent
  this.treeOptions = null
  this.options = {
    inSearch: false
  }
  this.CheckModes = CheckModes
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
  this.expandChildren = expandChildren.bind(this)
  this.collapse = collapseNode.bind(this)
  this.collapseChildren = collapseChildren.bind(this)
  this.expandAll = expandAll.bind(this)
  this.collapseAll = collapseAll.bind(this)
  this.getById = getNodeById.bind(this)
  this.findOne = findOne.bind(this)
  this.findAll = findAll.bind(this)
  this.findParent = findParent.bind(this)
  this.findParents = findParents.bind(this)
  this.setSelected = setSelectedNode.bind(this)
  this.getVisible = getVisibleNodes.bind(this)
  this.filter = filter.bind(this)
  this.clearFilter = clearFilter.bind(this)
  this.visitAll = visitAllNodes.bind(this)
  this.setCheckState = setCheckState.bind(this)
  this.check = checkNode.bind(this)
  this.checkChildren = checkChildren.bind(this)
  this.uncheck = uncheckNode.bind(this)
  this.uncheckChildren = uncheckChildren.bind(this)
  this.setOpenState = setOpenState.bind(this)
  this.showNode = showNode.bind(this)
  this.visitAllParents = visitAllParents.bind(this)
  this.getName = getName.bind(this)
  this.getEditName = getEditName.bind(this)
  this.setName = setName.bind(this)
  this.getChildren = getChildren.bind(this)
  this.addChild = addChild.bind(this)
  this.insertChild = insertChild.bind(this)
  this.remove = removeNode.bind(this)
  this.disable = disable.bind(this)
  this.disableChildren = disableChildren.bind(this)
  this.disableAll = disableAll.bind(this)
  this.enable = enable.bind(this)
  this.enableChildren = enableChildren.bind(this)
  this.enableAll = enableAll.bind(this)
  this.setCheckboxStyle = setCheckboxStyle.bind(this)
  this.setTextStyle = setTextStyle.bind(this)
  this.setIconStyle = setIconStyle.bind(this)
  this.setExpanderStyle = setExpanderStyle.bind(this)

  this.sort = function (comparator) {
    sortNodesRecursive(this, this.items, comparator)
  }
  this.setNodes = function (items) {
    if (!items) {
      throw new Error('parameter "items" is not set')
    }

    this.originalItems = items
    const nodes = items.map(x => mapItemToNode(this, x))
    if (this.treeOptions.autoSort) {
      sortNodes(this, nodes, this.treeOptions.sortComparator)
    }
    let prevItem = null
    for (const node of nodes) {
      node.prev = prevItem
      if (prevItem) {
        prevItem.next = node
      }
      prevItem = node
    }
    this.items = nodes
  }.bind(this)
}

export default DefaultManager
