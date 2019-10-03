'use strict'

function mapNodeToItem (node) {
  return {
    item: node,
    states: {
      checked: node.checked ||  false,
      disabled: node.disabled ||  false,
      opened: node.opened ||  false
    },
    children: node.children ? node.children.map(x => mapNodeToItem(x)) : []
  }
}

function DefaultManager (intitalNodes) {
  if (intitalNodes) {
    this.items = intitalNodes.map(x => mapNodeToItem(x))
  } else {
    this.items = []
  }

  this.setNodes = function (nodes) {
    this.items = nodes.map(x => mapNodeToItem(x))
  }
}

export default DefaultManager