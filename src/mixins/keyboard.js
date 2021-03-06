'use strict'

const Keys = {
  Space: ' ',
  Delete: 'Delete',
  Left: 'ArrowLeft',
  Up: 'ArrowUp',
  Right: 'ArrowRight',
  Down: 'ArrowDown',
  F2: 'F2'
}

const navigationKeys = [Keys.Left, Keys.Right, Keys.Up, Keys.Down, Keys.Space]

function getAvailableNodes (tree) {
  const availableNodes = []
  tree.storage.visitAll(tree.storage.nodes, item => {
    if (item.visible() && !item.states.disabled) {
      availableNodes.push(item)
    }
  })

  return availableNodes
}

function findAvailablePrevNode (tree, node) {
  const availableNodes = getAvailableNodes(tree)
  let prevNode = null
  for (const nodeItem of availableNodes) {
    if (nodeItem === node) {
      break
    }

    prevNode = nodeItem
  }

  return prevNode
}

function findAvailableNextNode (tree, node) {
  const availableNodes = getAvailableNodes(tree)
  let currNodeFound = false
  for (const nodeItem of availableNodes) {
    if (currNodeFound) {
      return nodeItem
    }
    if (nodeItem === node) {
      currNodeFound = true
    }
  }

  return null
}

function moveLeft (tree, node) {
  if (node.states.open) {
    node.collapse()
  } else {
    const parent = node.parent

    if (parent) {
      tree.setFocusedNode(parent)
    }
  }
}

function moveRight (tree, node) {
  if (!node.states.open) {
    node.expand()
  } else {
    const firstChild = node.children.find(x => !x.states.disabled && x.visible())

    if (firstChild) {
      tree.setFocusedNode(firstChild)
    }
  }
}

function moveUp (tree, node) {
  const prevNode = node.prev
  if (prevNode && prevNode.visible() && !prevNode.states.disabled && !prevNode.children.some(x => x.visible() && !x.states.disabled)) {
    tree.setFocusedNode(prevNode)
    return
  }
  const parent = node.parent
  if (!prevNode && parent && parent.visible() && !parent.states.disabled) {
    tree.setFocusedNode(parent)
    return
  }
  const foundPrevNode = findAvailablePrevNode(tree, node)
  if (!foundPrevNode) {
    return
  }

  tree.setFocusedNode(foundPrevNode)
}

function moveDown (tree, node) {
  if (node.states.open) {
    const firstAvailableChild = node.children[0]
    if (firstAvailableChild && firstAvailableChild.visible() && !firstAvailableChild.states.disabled) {
      tree.setFocusedNode(firstAvailableChild)
      return
    }
  }
  const nextNode = node.next
  if (!node.states.open && nextNode && nextNode.visible() && !nextNode.states.disabled) {
    tree.setFocusedNode(nextNode)
    return
  }
  const parent = node.parent
  if (!nextNode && parent && parent.next && parent.next.visible() && !parent.next.states.disabled) {
    tree.setFocusedNode(parent.next)
    return
  }
  const foundNextNode = findAvailableNextNode(tree, node)
  if (!foundNextNode) {
    return
  }

  tree.setFocusedNode(foundNextNode)
}

function switchNode (node) {
  if (!node.visible() || node.states.disabled) {
    return
  }
  if (node.states.checked) {
    node.uncheck()
  } else {
    node.check()
  }
}

function removeNode (tree, node) {
  if (!tree.treeOptions.canDelete) {
    return
  }

  tree.storage.remove(node)
}

function editNode (tree, node) {
  if (!tree.treeOptions.canEdit) {
    return
  }
  const nodeComponents = tree.treeState.nodes
  const nodeComponentToEdit = nodeComponents[node.id]
  nodeComponentToEdit.startEdit()
}

function navigate (event) {
  if (!this.focusedNode) {
    return
  }

  const nodeComponents = this.treeState.nodes
  const nodeComponentToEdit = nodeComponents[this.focusedNode.id]
  if (nodeComponentToEdit && nodeComponentToEdit.editorMode) {
    return
  }
  const key = event.key
  if (navigationKeys.includes(key)) {
    event.preventDefault()
    event.stopPropagation()
  }

  switch (key) {
    case Keys.Left:
      moveLeft(this, this.focusedNode)
      break
    case Keys.Right:
      moveRight(this, this.focusedNode)
      break
    case Keys.Up:
      moveUp(this, this.focusedNode)
      break
    case Keys.Down:
      moveDown(this, this.focusedNode)
      break
    case Keys.Space:
      switchNode(this.focusedNode)
      break
    case Keys.Delete:
      removeNode(this, this.focusedNode)
      break
    case Keys.F2:
      editNode(this, this.focusedNode)
      break
  }
}

export default {
  methods: {
    navigate
  }
}
