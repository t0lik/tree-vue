/* eslint-disable no-unused-expressions */
// import { expect } from 'chai'
import { mount } from '@vue/test-utils'
import Tree from '@/components/TreeVue.vue'
import sinon from 'sinon'

describe('storage node functions', () => {
  function getStorage (nodes, options = {}) {
    const wrapper = mount(Tree, {
      propsData: { nodes, options }
    })

    return wrapper.vm.storage
  }
  it('addChild calls storage.addChild', () => {
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
    const storage = getStorage(nodes)
    const node = storage.getById(1)
    const mock = sinon.mock(storage)
    const newItem = { id: 10, name: 'node10' }
    mock.expects('addChild').once().withArgs(node, newItem)

    node.addChild(newItem)

    mock.verify()
  })
  it('insertChild calls storage.insertChild', () => {
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
    const storage = getStorage(nodes)
    const node = storage.getById(1)
    const childNode = storage.getById(3)
    const mock = sinon.mock(storage)
    const newItem = { id: 10, name: 'node10' }
    mock.expects('insertChild').once().withArgs(node, newItem, childNode)

    node.insertChild(newItem, childNode)

    mock.verify()
  })
  it('expand with withChildren=false calls storage.expand with withChildren=false', () => {
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
    const storage = getStorage(nodes)
    const node = storage.getById(1)
    const mock = sinon.mock(storage)
    const withChildren = false
    mock.expects('expand').once().withArgs(node, withChildren)

    node.expand(withChildren)

    mock.verify()
  })
  it('expand with withChildren=true calls storage.expand with withChildren=true', () => {
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
    const storage = getStorage(nodes)
    const node = storage.getById(1)
    const mock = sinon.mock(storage)
    const withChildren = true
    mock.expects('expand').once().withArgs(node, withChildren)

    node.expand(withChildren)

    mock.verify()
  })
  it('expandChildren calls storage.expandChildren', () => {
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
    const storage = getStorage(nodes)
    const node = storage.getById(1)
    const mock = sinon.mock(storage)
    mock.expects('expandChildren').once().withArgs(node)

    node.expandChildren()

    mock.verify()
  })
  it('collapse with withChildren=false calls storage.collapse with withChildren=false', () => {
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
    const storage = getStorage(nodes)
    const node = storage.getById(1)
    const mock = sinon.mock(storage)
    const withChildren = false
    mock.expects('collapse').once().withArgs(node, withChildren)

    node.collapse(withChildren)

    mock.verify()
  })
  it('collapse with withChildren=true calls storage.collapse with withChildren=true', () => {
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
    const storage = getStorage(nodes)
    const node = storage.getById(1)
    const mock = sinon.mock(storage)
    const withChildren = true
    mock.expects('collapse').once().withArgs(node, withChildren)

    node.collapse(withChildren)

    mock.verify()
  })
  it('collapseChildren calls storage.collapseChildren', () => {
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
    const storage = getStorage(nodes)
    const node = storage.getById(1)
    const mock = sinon.mock(storage)
    mock.expects('collapseChildren').once().withArgs(node)

    node.collapseChildren()

    mock.verify()
  })
  it('select calls storage.setSelected with specified node', () => {
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
    const storage = getStorage(nodes)
    const node = storage.getById(1)
    const mock = sinon.mock(storage)
    mock.expects('setSelected').once().withArgs(node)

    node.select()

    mock.verify()
  })
  it('deselect calls storage.setSelected with null', () => {
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
    const storage = getStorage(nodes)
    const node = storage.getById(1)
    node.select()
    const mock = sinon.mock(storage)
    mock.expects('setSelected').once().withArgs(null)

    node.deselect()

    mock.verify()
  })
  it('show calls storage.showNode with specified node', () => {
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
    const storage = getStorage(nodes)
    const node = storage.getById(3)
    const mock = sinon.mock(storage)
    mock.expects('showNode').once().withArgs(node)

    node.show()

    mock.verify()
  })
  it('disable with withChildren=false calls storage.disable with withChildren=false', () => {
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
    const storage = getStorage(nodes)
    const node = storage.getById(1)
    const mock = sinon.mock(storage)
    const withChildren = false
    mock.expects('disable').once().withArgs(node, withChildren)

    node.disable(withChildren)

    mock.verify()
  })
  it('disable with withChildren=true calls storage.disable with withChildren=true', () => {
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
    const storage = getStorage(nodes)
    const node = storage.getById(1)
    const mock = sinon.mock(storage)
    const withChildren = true
    mock.expects('disable').once().withArgs(node, withChildren)

    node.disable(withChildren)

    mock.verify()
  })
  it('disableChildren calls storage.disableChildren', () => {
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
    const storage = getStorage(nodes)
    const node = storage.getById(1)
    const mock = sinon.mock(storage)
    mock.expects('disableChildren').once().withArgs(node)

    node.disableChildren()

    mock.verify()
  })
  it('enable with withChildren=false calls storage.enable with withChildren=false', () => {
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
    const storage = getStorage(nodes)
    const node = storage.getById(1)
    const mock = sinon.mock(storage)
    const withChildren = false
    mock.expects('enable').once().withArgs(node, withChildren)

    node.enable(withChildren)

    mock.verify()
  })
  it('enable with withChildren=true calls storage.enable with withChildren=true', () => {
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
    const storage = getStorage(nodes)
    const node = storage.getById(1)
    const mock = sinon.mock(storage)
    const withChildren = true
    mock.expects('enable').once().withArgs(node, withChildren)

    node.enable(withChildren)

    mock.verify()
  })
  it('enableChildren calls storage.enableChildren', () => {
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
    const storage = getStorage(nodes)
    const node = storage.getById(1)
    const mock = sinon.mock(storage)
    mock.expects('enableChildren').once().withArgs(node)

    node.enableChildren()

    mock.verify()
  })
  it('check with withChildren=false calls storage.check with withChildren=false', () => {
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
    const storage = getStorage(nodes)
    const node = storage.getById(1)
    const mock = sinon.mock(storage)
    const withChildren = false
    mock.expects('check').once().withArgs(node, withChildren)

    node.check(withChildren)

    mock.verify()
  })
  it('check with withChildren=true calls storage.check with withChildren=true', () => {
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
    const storage = getStorage(nodes)
    const node = storage.getById(1)
    const mock = sinon.mock(storage)
    const withChildren = true
    mock.expects('check').once().withArgs(node, withChildren)

    node.check(withChildren)

    mock.verify()
  })
  it('checkChildren calls storage.checkChildren', () => {
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
    const storage = getStorage(nodes)
    const node = storage.getById(1)
    const mock = sinon.mock(storage)
    mock.expects('checkChildren').once().withArgs(node)

    node.checkChildren()

    mock.verify()
  })
  it('uncheck with withChildren=false calls storage.uncheck with withChildren=false', () => {
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
    const storage = getStorage(nodes)
    const node = storage.getById(1)
    const mock = sinon.mock(storage)
    const withChildren = false
    mock.expects('uncheck').once().withArgs(node, withChildren)

    node.uncheck(withChildren)

    mock.verify()
  })
  it('uncheck with withChildren=true calls storage.uncheck with withChildren=true', () => {
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
    const storage = getStorage(nodes)
    const node = storage.getById(1)
    const mock = sinon.mock(storage)
    const withChildren = true
    mock.expects('uncheck').once().withArgs(node, withChildren)

    node.uncheck(withChildren)

    mock.verify()
  })
  it('uncheckChildren calls storage.uncheckChildren', () => {
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
    const storage = getStorage(nodes)
    const node = storage.getById(1)
    const mock = sinon.mock(storage)
    mock.expects('uncheckChildren').once().withArgs(node)

    node.uncheckChildren()

    mock.verify()
  })
  it('visible() calls storage.getVisibility', () => {
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
    const storage = getStorage(nodes)
    const node = storage.getById(3)
    const mock = sinon.mock(storage)
    mock.expects('getVisibility').once().withArgs(node)

    node.visible()

    mock.verify()
  })
  it('setCheckboxStyle with withChildren=false calls storage.setCheckboxStyle with withChildren=false', () => {
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
    const storage = getStorage(nodes)
    const node = storage.getById(1)
    const mock = sinon.mock(storage)
    const withChildren = false
    const checkboxClasses = 'test-class'
    mock.expects('setCheckboxStyle').once().withArgs(node, checkboxClasses, withChildren)

    node.setCheckboxStyle(checkboxClasses, withChildren)

    mock.verify()
  })
  it('setCheckboxStyle with withChildren=true calls storage.setCheckboxStyle with withChildren=true', () => {
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
    const storage = getStorage(nodes)
    const node = storage.getById(1)
    const mock = sinon.mock(storage)
    const withChildren = true
    const checkboxClasses = 'test-class'
    mock.expects('setCheckboxStyle').once().withArgs(node, checkboxClasses, withChildren)

    node.setCheckboxStyle(checkboxClasses, withChildren)

    mock.verify()
  })
  it('resetCheckboxStyle with withChildren=false calls storage.setCheckboxStyle with classList=null and with withChildren=false ', () => {
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
    const storage = getStorage(nodes)
    const node = storage.getById(1)
    const mock = sinon.mock(storage)
    const withChildren = false
    mock.expects('setCheckboxStyle').once().withArgs(node, null, withChildren)

    node.resetCheckboxStyle(withChildren)

    mock.verify()
  })
  it('resetCheckboxStyle with withChildren=true calls storage.setCheckboxStyle with classList=null and with withChildren=true ', () => {
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
    const storage = getStorage(nodes)
    const node = storage.getById(1)
    const mock = sinon.mock(storage)
    const withChildren = true
    mock.expects('setCheckboxStyle').once().withArgs(node, null, withChildren)

    node.resetCheckboxStyle(withChildren)

    mock.verify()
  })
  it('setTextStyle with withChildren=false calls storage.setTextStyle with withChildren=false', () => {
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
    const storage = getStorage(nodes)
    const node = storage.getById(1)
    const mock = sinon.mock(storage)
    const withChildren = false
    const textClasses = 'test-class'
    mock.expects('setTextStyle').once().withArgs(node, textClasses, withChildren)

    node.setTextStyle(textClasses, withChildren)

    mock.verify()
  })
  it('setTextStyle with withChildren=true calls storage.setTextStyle with withChildren=true', () => {
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
    const storage = getStorage(nodes)
    const node = storage.getById(1)
    const mock = sinon.mock(storage)
    const withChildren = true
    const textClasses = 'test-class'
    mock.expects('setTextStyle').once().withArgs(node, textClasses, withChildren)

    node.setTextStyle(textClasses, withChildren)

    mock.verify()
  })
  it('resetTextStyle with withChildren=false calls storage.setTextStyle with classList=null and with withChildren=false ', () => {
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
    const storage = getStorage(nodes)
    const node = storage.getById(1)
    const mock = sinon.mock(storage)
    const withChildren = false
    mock.expects('setTextStyle').once().withArgs(node, null, withChildren)

    node.resetTextStyle(withChildren)

    mock.verify()
  })
  it('resetTextStyle with withChildren=true calls storage.setTextStyle with classList=null and with withChildren=true ', () => {
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
    const storage = getStorage(nodes)
    const node = storage.getById(1)
    const mock = sinon.mock(storage)
    const withChildren = true
    mock.expects('setTextStyle').once().withArgs(node, null, withChildren)

    node.resetTextStyle(withChildren)

    mock.verify()
  })
  it('setIconStyle with withChildren=false calls storage.setIconStyle with withChildren=false', () => {
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
    const storage = getStorage(nodes)
    const node = storage.getById(1)
    const mock = sinon.mock(storage)
    const withChildren = false
    const iconClasses = 'test-class'
    mock.expects('setIconStyle').once().withArgs(node, iconClasses, withChildren)

    node.setIconStyle(iconClasses, withChildren)

    mock.verify()
  })
  it('setIconStyle with withChildren=true calls storage.setIconStyle with withChildren=true', () => {
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
    const storage = getStorage(nodes)
    const node = storage.getById(1)
    const mock = sinon.mock(storage)
    const withChildren = true
    const iconClasses = 'test-class'
    mock.expects('setIconStyle').once().withArgs(node, iconClasses, withChildren)

    node.setIconStyle(iconClasses, withChildren)

    mock.verify()
  })
  it('resetIconStyle with withChildren=false calls storage.setIconStyle with classList=null and with withChildren=false ', () => {
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
    const storage = getStorage(nodes)
    const node = storage.getById(1)
    const mock = sinon.mock(storage)
    const withChildren = false
    mock.expects('setIconStyle').once().withArgs(node, null, withChildren)

    node.resetIconStyle(withChildren)

    mock.verify()
  })
  it('resetIconStyle with withChildren=true calls storage.setIconStyle with classList=null and with withChildren=true ', () => {
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
    const storage = getStorage(nodes)
    const node = storage.getById(1)
    const mock = sinon.mock(storage)
    const withChildren = true
    mock.expects('setIconStyle').once().withArgs(node, null, withChildren)

    node.resetIconStyle(withChildren)

    mock.verify()
  })
  it('setExpanderStyle with withChildren=false calls storage.setExpanderStyle with withChildren=false', () => {
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
    const storage = getStorage(nodes)
    const node = storage.getById(1)
    const mock = sinon.mock(storage)
    const withChildren = false
    const expanderClasses = 'test-class'
    mock.expects('setExpanderStyle').once().withArgs(node, expanderClasses, withChildren)

    node.setExpanderStyle(expanderClasses, withChildren)

    mock.verify()
  })
  it('setExpanderStyle with withChildren=true calls storage.setExpanderStyle with withChildren=true', () => {
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
    const storage = getStorage(nodes)
    const node = storage.getById(1)
    const mock = sinon.mock(storage)
    const withChildren = true
    const expanderClasses = 'test-class'
    mock.expects('setExpanderStyle').once().withArgs(node, expanderClasses, withChildren)

    node.setExpanderStyle(expanderClasses, withChildren)

    mock.verify()
  })
  it('resetExpanderStyle with withChildren=false calls storage.setExpanderStyle with classList=null and with withChildren=false ', () => {
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
    const storage = getStorage(nodes)
    const node = storage.getById(1)
    const mock = sinon.mock(storage)
    const withChildren = false
    mock.expects('setExpanderStyle').once().withArgs(node, null, withChildren)

    node.resetExpanderStyle(withChildren)

    mock.verify()
  })
  it('resetExpanderStyle with withChildren=true calls storage.setExpanderStyle with classList=null and with withChildren=true ', () => {
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
    const storage = getStorage(nodes)
    const node = storage.getById(1)
    const mock = sinon.mock(storage)
    const withChildren = true
    mock.expects('setExpanderStyle').once().withArgs(node, null, withChildren)

    node.resetExpanderStyle(withChildren)

    mock.verify()
  })
  it('findParent calls storage.findParent', () => {
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
    const storage = getStorage(nodes)
    const node = storage.getById(3)
    const mock = sinon.mock(storage)
    const selector = parent => parent.name.indexOf('node') !== -1
    mock.expects('findParent').once().withArgs(node, selector)

    node.findParent(selector)

    mock.verify()
  })
  it('findParents calls storage.findParents', () => {
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
    const storage = getStorage(nodes)
    const node = storage.getById(3)
    const mock = sinon.mock(storage)
    const selector = parent => parent.name.indexOf('node') !== -1
    mock.expects('findParents').once().withArgs(node, selector)

    node.findParents(selector)

    mock.verify()
  })
  it('getName calls storage.getName', () => {
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
    const storage = getStorage(nodes)
    const node = storage.getById(3)
    const mock = sinon.mock(storage)
    mock.expects('getName').once().withArgs(node)

    node.getName()

    mock.verify()
  })
})
