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
    const firstChild = node.children.find(x => !x.states.disabled && x.states.visible)

    if (firstChild) {
      tree.setFocusedNode(firstChild)
    }
  }
}

function moveUp (tree, node) {
  let prevNode = node.prev
  let foundPrevNode = null
  while (prevNode) {
    if (prevNode.states.visible && !prevNode.states.disabled) {
      foundPrevNode = prevNode
      break
    }
    prevNode = prevNode.prev
  }

  if (!foundPrevNode) {
    return
  }

  tree.setFocusedNode(foundPrevNode)
}

function moveDown (tree, node) {
  let nextNode = node.next
  let foundNextNode = null
  while (nextNode) {
    if (nextNode.states.visible && !nextNode.states.disabled) {
      foundNextNode = nextNode
      break
    }
    nextNode = nextNode.next
  }
  if (!foundNextNode) {
    return
  }

  tree.setFocusedNode(foundNextNode)
}

function switchNode (node) {
  if (!node.states.visible || node.states.disabled) {
    return
  }
  if (node.states.checked) {
    node.uncheck()
  } else {
    node.check()
  }
}

function navigate (event) {
  const keyCode = event.keyCode
  console.log('navigate', this.focusedNode, keyCode)
  if (!this.focusedNode) {
    return
  }
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
