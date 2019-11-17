/* eslint-disable no-unused-expressions */
// import { expect } from 'chai'
import { mount } from '@vue/test-utils'
import Tree from '@/components/TreeView.vue'
import sinon from 'sinon'

describe('nodeManager node functions', () => {
  function getNodeManager (nodes, options = {}) {
    const wrapper = mount(Tree, {
      propsData: { nodes, options }
    })

    return wrapper.vm.nodeManager
  }
  it('addChild calls nodeManager.addChild', () => {
    const nodes = [{
      id: 1,
      name: 'node1',
      children: [{
        id: 3,
        name: 'child1'
      }, {
        id: 4,
        name: 'child2'
      }]
    }]
    const manager = getNodeManager(nodes)
    const node = manager.getById(1)
    const mock = sinon.mock(manager)
    const newItem = { id: 10, name: 'node10' }
    mock.expects('addChild').once().withArgs(node, newItem)

    node.addChild(newItem)

    mock.verify()
  })
  it('insertChild calls nodeManager.insertChild', () => {
    const nodes = [{
      id: 1,
      name: 'node1',
      children: [{
        id: 3,
        name: 'child1'
      }, {
        id: 4,
        name: 'child2'
      }]
    }]
    const manager = getNodeManager(nodes)
    const node = manager.getById(1)
    const childNode = manager.getById(3)
    const mock = sinon.mock(manager)
    const newItem = { id: 10, name: 'node10' }
    mock.expects('insertChild').once().withArgs(node, newItem, childNode)

    node.insertChild(newItem, childNode)

    mock.verify()
  })
  it('expand with withChildren=false calls nodeManager.expand with withChildren=false', () => {
    const nodes = [{
      id: 1,
      name: 'node1',
      children: [{
        id: 3,
        name: 'child1'
      }, {
        id: 4,
        name: 'child2'
      }]
    }]
    const manager = getNodeManager(nodes)
    const node = manager.getById(1)
    const mock = sinon.mock(manager)
    const withChildren = false
    mock.expects('expand').once().withArgs(node, withChildren)

    node.expand(withChildren)

    mock.verify()
  })
  it('expand with withChildren=true calls nodeManager.expand with withChildren=true', () => {
    const nodes = [{
      id: 1,
      name: 'node1',
      children: [{
        id: 3,
        name: 'child1'
      }, {
        id: 4,
        name: 'child2'
      }]
    }]
    const manager = getNodeManager(nodes)
    const node = manager.getById(1)
    const mock = sinon.mock(manager)
    const withChildren = true
    mock.expects('expand').once().withArgs(node, withChildren)

    node.expand(withChildren)

    mock.verify()
  })
  it('expandChildren calls nodeManager.expandChildren', () => {
    const nodes = [{
      id: 1,
      name: 'node1',
      children: [{
        id: 3,
        name: 'child1'
      }, {
        id: 4,
        name: 'child2'
      }]
    }]
    const manager = getNodeManager(nodes)
    const node = manager.getById(1)
    const mock = sinon.mock(manager)
    mock.expects('expandChildren').once().withArgs(node)

    node.expandChildren()

    mock.verify()
  })
  it('collapse with withChildren=false calls nodeManager.collapse with withChildren=false', () => {
    const nodes = [{
      id: 1,
      name: 'node1',
      open: true,
      children: [{
        id: 3,
        name: 'child1'
      }, {
        id: 4,
        name: 'child2'
      }]
    }]
    const manager = getNodeManager(nodes)
    const node = manager.getById(1)
    const mock = sinon.mock(manager)
    const withChildren = false
    mock.expects('collapse').once().withArgs(node, withChildren)

    node.collapse(withChildren)

    mock.verify()
  })
  it('collapse with withChildren=true calls nodeManager.collapse with withChildren=true', () => {
    const nodes = [{
      id: 1,
      name: 'node1',
      open: true,
      children: [{
        id: 3,
        name: 'child1'
      }, {
        id: 4,
        name: 'child2'
      }]
    }]
    const manager = getNodeManager(nodes)
    const node = manager.getById(1)
    const mock = sinon.mock(manager)
    const withChildren = true
    mock.expects('collapse').once().withArgs(node, withChildren)

    node.collapse(withChildren)

    mock.verify()
  })
  it('collapseChildren calls nodeManager.collapseChildren', () => {
    const nodes = [{
      id: 1,
      name: 'node1',
      open: true,
      children: [{
        id: 3,
        name: 'child1'
      }, {
        id: 4,
        name: 'child2'
      }]
    }]
    const manager = getNodeManager(nodes)
    const node = manager.getById(1)
    const mock = sinon.mock(manager)
    mock.expects('collapseChildren').once().withArgs(node)

    node.collapseChildren()

    mock.verify()
  })
  it('select calls nodeManager.setSelected with specified node', () => {
    const nodes = [{
      id: 1,
      name: 'node1',
      open: true,
      children: [{
        id: 3,
        name: 'child1'
      }, {
        id: 4,
        name: 'child2'
      }]
    }]
    const manager = getNodeManager(nodes)
    const node = manager.getById(1)
    const mock = sinon.mock(manager)
    mock.expects('setSelected').once().withArgs(node)

    node.select()

    mock.verify()
  })
  it('deselect calls nodeManager.setSelected with null', () => {
    const nodes = [{
      id: 1,
      name: 'node1',
      children: [{
        id: 3,
        name: 'child1'
      }, {
        id: 4,
        name: 'child2'
      }]
    }]
    const manager = getNodeManager(nodes)
    const node = manager.getById(1)
    node.select()
    const mock = sinon.mock(manager)
    mock.expects('setSelected').once().withArgs(null)

    node.deselect()

    mock.verify()
  })
  it('show calls nodeManager.showNode with specified node', () => {
    const nodes = [{
      id: 1,
      name: 'node1',
      open: true,
      children: [{
        id: 3,
        name: 'child1'
      }, {
        id: 4,
        name: 'child2'
      }]
    }]
    const manager = getNodeManager(nodes)
    const node = manager.getById(3)
    const mock = sinon.mock(manager)
    mock.expects('showNode').once().withArgs(node)

    node.show()

    mock.verify()
  })
  it('disable with withChildren=false calls nodeManager.disable with withChildren=false', () => {
    const nodes = [{
      id: 1,
      name: 'node1',
      open: true,
      children: [{
        id: 3,
        name: 'child1'
      }, {
        id: 4,
        name: 'child2'
      }]
    }]
    const manager = getNodeManager(nodes)
    const node = manager.getById(1)
    const mock = sinon.mock(manager)
    const withChildren = false
    mock.expects('disable').once().withArgs(node, withChildren)

    node.disable(withChildren)

    mock.verify()
  })
  it('disable with withChildren=true calls nodeManager.disable with withChildren=true', () => {
    const nodes = [{
      id: 1,
      name: 'node1',
      open: true,
      children: [{
        id: 3,
        name: 'child1'
      }, {
        id: 4,
        name: 'child2'
      }]
    }]
    const manager = getNodeManager(nodes)
    const node = manager.getById(1)
    const mock = sinon.mock(manager)
    const withChildren = true
    mock.expects('disable').once().withArgs(node, withChildren)

    node.disable(withChildren)

    mock.verify()
  })
  it('disableChildren calls nodeManager.disableChildren', () => {
    const nodes = [{
      id: 1,
      name: 'node1',
      open: true,
      children: [{
        id: 3,
        name: 'child1'
      }, {
        id: 4,
        name: 'child2'
      }]
    }]
    const manager = getNodeManager(nodes)
    const node = manager.getById(1)
    const mock = sinon.mock(manager)
    mock.expects('disableChildren').once().withArgs(node)

    node.disableChildren()

    mock.verify()
  })
  it('enable with withChildren=false calls nodeManager.enable with withChildren=false', () => {
    const nodes = [{
      id: 1,
      name: 'node1',
      disabled: true,
      children: [{
        id: 3,
        name: 'child1'
      }, {
        id: 4,
        name: 'child2'
      }]
    }]
    const manager = getNodeManager(nodes)
    const node = manager.getById(1)
    const mock = sinon.mock(manager)
    const withChildren = false
    mock.expects('enable').once().withArgs(node, withChildren)

    node.enable(withChildren)

    mock.verify()
  })
  it('enable with withChildren=true calls nodeManager.enable with withChildren=true', () => {
    const nodes = [{
      id: 1,
      name: 'node1',
      disabled: true,
      children: [{
        id: 3,
        name: 'child1',
        disabled: true
      }, {
        id: 4,
        name: 'child2'
      }]
    }]
    const manager = getNodeManager(nodes)
    const node = manager.getById(1)
    const mock = sinon.mock(manager)
    const withChildren = true
    mock.expects('enable').once().withArgs(node, withChildren)

    node.enable(withChildren)

    mock.verify()
  })
  it('enableChildren calls nodeManager.enableChildren', () => {
    const nodes = [{
      id: 1,
      name: 'node1',
      children: [{
        id: 3,
        name: 'child1',
        disabled: true
      }, {
        id: 4,
        name: 'child2',
        disabled: true
      }]
    }]
    const manager = getNodeManager(nodes)
    const node = manager.getById(1)
    const mock = sinon.mock(manager)
    mock.expects('enableChildren').once().withArgs(node)

    node.enableChildren()

    mock.verify()
  })
  it('check with withChildren=false calls nodeManager.check with withChildren=false', () => {
    const nodes = [{
      id: 1,
      name: 'node1',
      children: [{
        id: 3,
        name: 'child1'
      }, {
        id: 4,
        name: 'child2'
      }]
    }]
    const manager = getNodeManager(nodes)
    const node = manager.getById(1)
    const mock = sinon.mock(manager)
    const withChildren = false
    mock.expects('check').once().withArgs(node, withChildren)

    node.check(withChildren)

    mock.verify()
  })
  it('check with withChildren=true calls nodeManager.check with withChildren=true', () => {
    const nodes = [{
      id: 1,
      name: 'node1',
      children: [{
        id: 3,
        name: 'child1'
      }, {
        id: 4,
        name: 'child2'
      }]
    }]
    const manager = getNodeManager(nodes)
    const node = manager.getById(1)
    const mock = sinon.mock(manager)
    const withChildren = true
    mock.expects('check').once().withArgs(node, withChildren)

    node.check(withChildren)

    mock.verify()
  })
  it('checkChildren calls nodeManager.checkChildren', () => {
    const nodes = [{
      id: 1,
      name: 'node1',
      children: [{
        id: 3,
        name: 'child1',
        disabled: true
      }, {
        id: 4,
        name: 'child2',
        disabled: true
      }]
    }]
    const manager = getNodeManager(nodes)
    const node = manager.getById(1)
    const mock = sinon.mock(manager)
    mock.expects('checkChildren').once().withArgs(node)

    node.checkChildren()

    mock.verify()
  })
  it('uncheck with withChildren=false calls nodeManager.uncheck with withChildren=false', () => {
    const nodes = [{
      id: 1,
      name: 'node1',
      checked: true,
      children: [{
        id: 3,
        name: 'child1'
      }, {
        id: 4,
        name: 'child2'
      }]
    }]
    const manager = getNodeManager(nodes)
    const node = manager.getById(1)
    const mock = sinon.mock(manager)
    const withChildren = false
    mock.expects('uncheck').once().withArgs(node, withChildren)

    node.uncheck(withChildren)

    mock.verify()
  })
  it('uncheck with withChildren=true calls nodeManager.uncheck with withChildren=true', () => {
    const nodes = [{
      id: 1,
      name: 'node1',
      checked: true,
      children: [{
        id: 3,
        name: 'child1',
        checked: true
      }, {
        id: 4,
        name: 'child2'
      }]
    }]
    const manager = getNodeManager(nodes)
    const node = manager.getById(1)
    const mock = sinon.mock(manager)
    const withChildren = true
    mock.expects('uncheck').once().withArgs(node, withChildren)

    node.uncheck(withChildren)

    mock.verify()
  })
  it('uncheckChildren calls nodeManager.uncheckChildren', () => {
    const nodes = [{
      id: 1,
      name: 'node1',
      children: [{
        id: 3,
        name: 'child1',
        checked: true
      }, {
        id: 4,
        name: 'child2',
        checked: true
      }]
    }]
    const manager = getNodeManager(nodes)
    const node = manager.getById(1)
    const mock = sinon.mock(manager)
    mock.expects('uncheckChildren').once().withArgs(node)

    node.uncheckChildren()

    mock.verify()
  })
  it('visible() calls nodeManager.getVisibility', () => {
    const nodes = [{
      id: 1,
      name: 'node1',
      children: [{
        id: 3,
        name: 'child1'
      }, {
        id: 4,
        name: 'child2'
      }]
    }, {
      id: 2,
      name: 'node2',
      children: [{
        id: 8,
        name: 'child3'
      }]
    }, {
      id: 5,
      name: 'node3'
    }]
    const manager = getNodeManager(nodes)
    const node = manager.getById(3)
    const mock = sinon.mock(manager)
    mock.expects('getVisibility').once().withArgs(node)

    node.visible()

    mock.verify()
  })
  it('setCheckboxStyle with withChildren=false calls nodeManager.setCheckboxStyle with withChildren=false', () => {
    const nodes = [{
      id: 1,
      name: 'node1',
      checked: true,
      children: [{
        id: 3,
        name: 'child1',
        checked: true
      }, {
        id: 4,
        name: 'child2'
      }]
    }]
    const manager = getNodeManager(nodes)
    const node = manager.getById(1)
    const mock = sinon.mock(manager)
    const withChildren = false
    const checkboxClasses = 'test-class'
    mock.expects('setCheckboxStyle').once().withArgs(node, checkboxClasses, withChildren)

    node.setCheckboxStyle(checkboxClasses, withChildren)

    mock.verify()
  })
  it('setCheckboxStyle with withChildren=true calls nodeManager.setCheckboxStyle with withChildren=true', () => {
    const nodes = [{
      id: 1,
      name: 'node1',
      checked: true,
      children: [{
        id: 3,
        name: 'child1',
        checked: true
      }, {
        id: 4,
        name: 'child2'
      }]
    }]
    const manager = getNodeManager(nodes)
    const node = manager.getById(1)
    const mock = sinon.mock(manager)
    const withChildren = true
    const checkboxClasses = 'test-class'
    mock.expects('setCheckboxStyle').once().withArgs(node, checkboxClasses, withChildren)

    node.setCheckboxStyle(checkboxClasses, withChildren)

    mock.verify()
  })
  it('resetCheckboxStyle with withChildren=false calls nodeManager.setCheckboxStyle with classList=null and with withChildren=false ', () => {
    const nodes = [{
      id: 1,
      name: 'node1',
      checked: true,
      children: [{
        id: 3,
        name: 'child1',
        checked: true
      }, {
        id: 4,
        name: 'child2'
      }]
    }]
    const manager = getNodeManager(nodes)
    const node = manager.getById(1)
    const mock = sinon.mock(manager)
    const withChildren = false
    mock.expects('setCheckboxStyle').once().withArgs(node, null, withChildren)

    node.resetCheckboxStyle(withChildren)

    mock.verify()
  })
  it('resetCheckboxStyle with withChildren=true calls nodeManager.setCheckboxStyle with classList=null and with withChildren=true ', () => {
    const nodes = [{
      id: 1,
      name: 'node1',
      checked: true,
      children: [{
        id: 3,
        name: 'child1',
        checked: true
      }, {
        id: 4,
        name: 'child2'
      }]
    }]
    const manager = getNodeManager(nodes)
    const node = manager.getById(1)
    const mock = sinon.mock(manager)
    const withChildren = true
    mock.expects('setCheckboxStyle').once().withArgs(node, null, withChildren)

    node.resetCheckboxStyle(withChildren)

    mock.verify()
  })
  it('setTextStyle with withChildren=false calls nodeManager.setTextStyle with withChildren=false', () => {
    const nodes = [{
      id: 1,
      name: 'node1',
      checked: true,
      children: [{
        id: 3,
        name: 'child1',
        checked: true
      }, {
        id: 4,
        name: 'child2'
      }]
    }]
    const manager = getNodeManager(nodes)
    const node = manager.getById(1)
    const mock = sinon.mock(manager)
    const withChildren = false
    const textClasses = 'test-class'
    mock.expects('setTextStyle').once().withArgs(node, textClasses, withChildren)

    node.setTextStyle(textClasses, withChildren)

    mock.verify()
  })
  it('setTextStyle with withChildren=true calls nodeManager.setTextStyle with withChildren=true', () => {
    const nodes = [{
      id: 1,
      name: 'node1',
      checked: true,
      children: [{
        id: 3,
        name: 'child1',
        checked: true
      }, {
        id: 4,
        name: 'child2'
      }]
    }]
    const manager = getNodeManager(nodes)
    const node = manager.getById(1)
    const mock = sinon.mock(manager)
    const withChildren = true
    const textClasses = 'test-class'
    mock.expects('setTextStyle').once().withArgs(node, textClasses, withChildren)

    node.setTextStyle(textClasses, withChildren)

    mock.verify()
  })
  it('resetTextStyle with withChildren=false calls nodeManager.setTextStyle with classList=null and with withChildren=false ', () => {
    const nodes = [{
      id: 1,
      name: 'node1',
      checked: true,
      children: [{
        id: 3,
        name: 'child1',
        checked: true
      }, {
        id: 4,
        name: 'child2'
      }]
    }]
    const manager = getNodeManager(nodes)
    const node = manager.getById(1)
    const mock = sinon.mock(manager)
    const withChildren = false
    mock.expects('setTextStyle').once().withArgs(node, null, withChildren)

    node.resetTextStyle(withChildren)

    mock.verify()
  })
  it('resetTextStyle with withChildren=true calls nodeManager.setTextStyle with classList=null and with withChildren=true ', () => {
    const nodes = [{
      id: 1,
      name: 'node1',
      checked: true,
      children: [{
        id: 3,
        name: 'child1',
        checked: true
      }, {
        id: 4,
        name: 'child2'
      }]
    }]
    const manager = getNodeManager(nodes)
    const node = manager.getById(1)
    const mock = sinon.mock(manager)
    const withChildren = true
    mock.expects('setTextStyle').once().withArgs(node, null, withChildren)

    node.resetTextStyle(withChildren)

    mock.verify()
  })
  it('setIconStyle with withChildren=false calls nodeManager.setIconStyle with withChildren=false', () => {
    const nodes = [{
      id: 1,
      name: 'node1',
      checked: true,
      children: [{
        id: 3,
        name: 'child1',
        checked: true
      }, {
        id: 4,
        name: 'child2'
      }]
    }]
    const manager = getNodeManager(nodes)
    const node = manager.getById(1)
    const mock = sinon.mock(manager)
    const withChildren = false
    const iconClasses = 'test-class'
    mock.expects('setIconStyle').once().withArgs(node, iconClasses, withChildren)

    node.setIconStyle(iconClasses, withChildren)

    mock.verify()
  })
  it('setIconStyle with withChildren=true calls nodeManager.setIconStyle with withChildren=true', () => {
    const nodes = [{
      id: 1,
      name: 'node1',
      checked: true,
      children: [{
        id: 3,
        name: 'child1',
        checked: true
      }, {
        id: 4,
        name: 'child2'
      }]
    }]
    const manager = getNodeManager(nodes)
    const node = manager.getById(1)
    const mock = sinon.mock(manager)
    const withChildren = true
    const iconClasses = 'test-class'
    mock.expects('setIconStyle').once().withArgs(node, iconClasses, withChildren)

    node.setIconStyle(iconClasses, withChildren)

    mock.verify()
  })
  it('resetIconStyle with withChildren=false calls nodeManager.setIconStyle with classList=null and with withChildren=false ', () => {
    const nodes = [{
      id: 1,
      name: 'node1',
      checked: true,
      children: [{
        id: 3,
        name: 'child1',
        checked: true
      }, {
        id: 4,
        name: 'child2'
      }]
    }]
    const manager = getNodeManager(nodes)
    const node = manager.getById(1)
    const mock = sinon.mock(manager)
    const withChildren = false
    mock.expects('setIconStyle').once().withArgs(node, null, withChildren)

    node.resetIconStyle(withChildren)

    mock.verify()
  })
  it('resetIconStyle with withChildren=true calls nodeManager.setIconStyle with classList=null and with withChildren=true ', () => {
    const nodes = [{
      id: 1,
      name: 'node1',
      checked: true,
      children: [{
        id: 3,
        name: 'child1',
        checked: true
      }, {
        id: 4,
        name: 'child2'
      }]
    }]
    const manager = getNodeManager(nodes)
    const node = manager.getById(1)
    const mock = sinon.mock(manager)
    const withChildren = true
    mock.expects('setIconStyle').once().withArgs(node, null, withChildren)

    node.resetIconStyle(withChildren)

    mock.verify()
  })
  it('setExpanderStyle with withChildren=false calls nodeManager.setExpanderStyle with withChildren=false', () => {
    const nodes = [{
      id: 1,
      name: 'node1',
      checked: true,
      children: [{
        id: 3,
        name: 'child1',
        checked: true
      }, {
        id: 4,
        name: 'child2'
      }]
    }]
    const manager = getNodeManager(nodes)
    const node = manager.getById(1)
    const mock = sinon.mock(manager)
    const withChildren = false
    const expanderClasses = 'test-class'
    mock.expects('setExpanderStyle').once().withArgs(node, expanderClasses, withChildren)

    node.setExpanderStyle(expanderClasses, withChildren)

    mock.verify()
  })
  it('setExpanderStyle with withChildren=true calls nodeManager.setExpanderStyle with withChildren=true', () => {
    const nodes = [{
      id: 1,
      name: 'node1',
      checked: true,
      children: [{
        id: 3,
        name: 'child1',
        checked: true
      }, {
        id: 4,
        name: 'child2'
      }]
    }]
    const manager = getNodeManager(nodes)
    const node = manager.getById(1)
    const mock = sinon.mock(manager)
    const withChildren = true
    const expanderClasses = 'test-class'
    mock.expects('setExpanderStyle').once().withArgs(node, expanderClasses, withChildren)

    node.setExpanderStyle(expanderClasses, withChildren)

    mock.verify()
  })
  it('resetExpanderStyle with withChildren=false calls nodeManager.setExpanderStyle with classList=null and with withChildren=false ', () => {
    const nodes = [{
      id: 1,
      name: 'node1',
      checked: true,
      children: [{
        id: 3,
        name: 'child1',
        checked: true
      }, {
        id: 4,
        name: 'child2'
      }]
    }]
    const manager = getNodeManager(nodes)
    const node = manager.getById(1)
    const mock = sinon.mock(manager)
    const withChildren = false
    mock.expects('setExpanderStyle').once().withArgs(node, null, withChildren)

    node.resetExpanderStyle(withChildren)

    mock.verify()
  })
  it('resetExpanderStyle with withChildren=true calls nodeManager.setExpanderStyle with classList=null and with withChildren=true ', () => {
    const nodes = [{
      id: 1,
      name: 'node1',
      checked: true,
      children: [{
        id: 3,
        name: 'child1',
        checked: true
      }, {
        id: 4,
        name: 'child2'
      }]
    }]
    const manager = getNodeManager(nodes)
    const node = manager.getById(1)
    const mock = sinon.mock(manager)
    const withChildren = true
    mock.expects('setExpanderStyle').once().withArgs(node, null, withChildren)

    node.resetExpanderStyle(withChildren)

    mock.verify()
  })
  it('findParent calls nodeManager.findParent', () => {
    const nodes = [{
      id: 1,
      name: 'node1',
      checked: true,
      children: [{
        id: 3,
        name: 'child1',
        checked: true
      }, {
        id: 4,
        name: 'child2'
      }]
    }]
    const manager = getNodeManager(nodes)
    const node = manager.getById(3)
    const mock = sinon.mock(manager)
    const selector = parent => parent.name.indexOf('node') !== -1
    mock.expects('findParent').once().withArgs(node, selector)

    node.findParent(selector)

    mock.verify()
  })
  it('findParents calls nodeManager.findParents', () => {
    const nodes = [{
      id: 1,
      name: 'node1',
      checked: true,
      children: [{
        id: 3,
        name: 'child1',
        checked: true
      }, {
        id: 4,
        name: 'child2'
      }]
    }]
    const manager = getNodeManager(nodes)
    const node = manager.getById(3)
    const mock = sinon.mock(manager)
    const selector = parent => parent.name.indexOf('node') !== -1
    mock.expects('findParents').once().withArgs(node, selector)

    node.findParents(selector)

    mock.verify()
  })
  it('getName calls nodeManager.getName', () => {
    const nodes = [{
      id: 1,
      name: 'node1',
      checked: true,
      children: [{
        id: 3,
        name: 'child1',
        checked: true
      }, {
        id: 4,
        name: 'child2'
      }]
    }]
    const manager = getNodeManager(nodes)
    const node = manager.getById(3)
    const mock = sinon.mock(manager)
    mock.expects('getName').once().withArgs(node)

    node.getName()

    mock.verify()
  })
})
