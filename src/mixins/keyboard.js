'use strict'

const Keys = {
  Space: 32,
  Delete: 46,
  Enter: 13,
  Esc: 27,
  Left: 37,
  Up: 38,
  Right: 39,
  Down: 40
}

const navigationKeys = [Keys.Left, Keys.Right, Keys.Up, Keys.Down, Keys.Space]

function getAvailableNodes (tree) {
  const availableNodes = []
  tree.nodeManager.visitAll(tree.nodeManager.items, item => {
    if (item.visible() && !item.states.disabled) {
      availableNodes.push(item)
    }
  })

  return availableNodes
}

function findAvailablePrevNode (tree, node) {
  if (!node) {
    return null
  }

  const availableNodes = getAvailableNodes(tree)
  let prevNode = null
  for (const nodeItem of availableNodes) {
    if (nodeItem === node) {
      return prevNode
    }

    prevNode = nodeItem
  }

  return null
}

function findAvailableNextNode (tree, node) {
  if (!node) {
    return null
  }

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
  if (node.states.opened) {
    node.collapse()
  } else {
    const parent = node.parent

    if (parent) {
      tree.setFocusedNode(parent)
    }
  }
}

function moveRight (tree, node) {
  if (!node.states.opened) {
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
  if (node.states.opened) {
    const firstAvailableChild = node.children[0]
    if (firstAvailableChild && firstAvailableChild.visible() && !firstAvailableChild.states.disabled) {
      tree.setFocusedNode(firstAvailableChild)
      return
    }
  }
  const nextNode = node.next
  if (!node.states.opened && nextNode && nextNode.visible() && !nextNode.states.disabled) {
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

function navigate (event) {
  if (!this.focusedNode) {
    return
  }

  const keyCode = event.keyCode

  if (navigationKeys.includes(keyCode)) {
    event.preventDefault()
    event.stopPropagation()
  }

  switch (keyCode) {
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
  }
}

export default {
  methods: {
    navigate
  }
}
