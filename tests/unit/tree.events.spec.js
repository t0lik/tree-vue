'use strict'
/* eslint-disable no-unused-expressions */
import { expect } from 'chai'
import { mount } from '@vue/test-utils'
import Tree from '@/components/Tree.vue'

describe('Tree.vue events', () => {
  it('click on node emits node:clicked', done => {
    const nodes = [{
      id: 1,
      name: 'name'
    }]
    const options = {
    }
    const wrapper = mount(Tree, { propsData: { nodes, options } })
    const clickableNode = wrapper.find('.treevue-tree-node')
    clickableNode.trigger('click')
    wrapper.vm.$nextTick(() => {
      expect(wrapper.emitted()['node:clicked'][0]).to.be.not.null
      expect(wrapper.emitted()['node:clicked'][0][0]).to.be.not.null
      expect(wrapper.emitted()['node:clicked'][0][0].item).to.be.eq(nodes[0])
      done()
    })
  })
  it('click on node text emits node:selected', done => {
    const nodes = [{
      id: 1,
      name: 'name'
    }]
    const options = {
    }
    const wrapper = mount(Tree, { propsData: { nodes, options } })
    const clickableText = wrapper.find('.treevue-tree-node .treevue-node-text')
    clickableText.trigger('click')
    wrapper.vm.$nextTick(() => {
      expect(wrapper.emitted()['node:selected'][0]).to.be.not.null
      expect(wrapper.emitted()['node:selected'][0][0]).to.be.not.null
      expect(wrapper.emitted()['node:selected'][0][0].item).to.be.eq(nodes[0])
      done()
    })
  })
  it('setFocusedNode emits node:selected', () => {
    const nodes = [{
      id: 1,
      name: 'name'
    }, {
      id: 2,
      name: 'name2'
    }]
    const options = {
    }
    const wrapper = mount(Tree, { propsData: { nodes, options } })
    const secondNode = wrapper.vm.nodeManager.getById(2)
    wrapper.vm.setFocusedNode(secondNode)
    expect(wrapper.emitted()['node:selected'][0]).to.be.not.null
  })
  it('nodeManager.clearFilter emits tree:filter:cleared', () => {
    const nodes = [{
      id: 1,
      name: 'node1',
      children: [{
        id: 3,
        name: 'child1',
        children: [{
          id: 9,
          name: 'grandchild1'
        }]
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
    const options = { }
    const wrapper = mount(Tree, { propsData: { nodes, options } })
    const manager = wrapper.vm.nodeManager
    manager.filter('child1')
    manager.clearFilter()
    expect(wrapper.emitted()['tree:filter:cleared']).to.be.lengthOf(1)
    expect(wrapper.emitted()['tree:filter:cleared'][0]).to.be.not.null
  })
  it('nodeManager.filter emits tree:filtered', () => {
    const nodes = [{
      id: 1,
      name: 'node1',
      children: [{
        id: 3,
        name: 'child1',
        children: [{
          id: 9,
          name: 'grandchild1'
        }]
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
    const options = { }
    const wrapper = mount(Tree, { propsData: { nodes, options } })
    const manager = wrapper.vm.nodeManager
    manager.filter('node')
    manager.clearFilter()
    expect(wrapper.emitted()['tree:filtered']).to.be.lengthOf(1)
    expect(wrapper.emitted()['tree:filtered'][0][0].map(x => x.id)).to.be.members([1, 2, 5])
    expect(wrapper.emitted()['tree:filtered'][0][1]).to.be.eq('node')
  })
  it('nodeManager.checkAll emits tree:checked:all', () => {
    const nodes = [{
      id: 1,
      name: 'node1',
      children: [{
        id: 3,
        name: 'child1',
        children: [{
          id: 9,
          name: 'grandchild1'
        }]
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
    const options = { }
    const wrapper = mount(Tree, { propsData: { nodes, options } })
    const manager = wrapper.vm.nodeManager
    manager.checkAll()
    expect(wrapper.emitted()['tree:checked:all']).to.be.lengthOf(1)
  })
  it('nodeManager.checkVisible emits tree:checked:visible', () => {
    const nodes = [{
      id: 1,
      name: 'node1',
      children: [{
        id: 3,
        name: 'child1',
        children: [{
          id: 9,
          name: 'grandchild1'
        }]
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
    const options = { }
    const wrapper = mount(Tree, { propsData: { nodes, options } })
    const manager = wrapper.vm.nodeManager
    manager.checkVisible()
    expect(wrapper.emitted()['tree:checked:visible']).to.be.lengthOf(1)
  })
  it('nodeManager.uncheckAll emits tree:unchecked:all', () => {
    const nodes = [{
      id: 1,
      name: 'node1',
      children: [{
        id: 3,
        name: 'child1',
        children: [{
          id: 9,
          name: 'grandchild1'
        }]
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
    const options = { }
    const wrapper = mount(Tree, { propsData: { nodes, options } })
    const manager = wrapper.vm.nodeManager
    manager.uncheckAll()
    expect(wrapper.emitted()['tree:unchecked:all']).to.be.lengthOf(1)
  })
  it('nodeManager.uncheckVisible emits tree:unchecked:visible', () => {
    const nodes = [{
      id: 1,
      name: 'node1',
      children: [{
        id: 3,
        name: 'child1',
        children: [{
          id: 9,
          name: 'grandchild1'
        }]
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
    const options = { }
    const wrapper = mount(Tree, { propsData: { nodes, options } })
    const manager = wrapper.vm.nodeManager
    manager.uncheckVisible()
    expect(wrapper.emitted()['tree:unchecked:visible']).to.be.lengthOf(1)
  })
  it('nodeManager.check emits node:checked', () => {
    const nodes = [{
      id: 1,
      name: 'node1',
      children: [{
        id: 3,
        name: 'child1',
        children: [{
          id: 9,
          name: 'grandchild1'
        }]
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
    const options = { }
    const wrapper = mount(Tree, { propsData: { nodes, options } })
    const manager = wrapper.vm.nodeManager
    const node = manager.getById(1)
    manager.check(node)
    expect(wrapper.emitted()['node:checked']).to.be.lengthOf(1)
    expect(wrapper.emitted()['node:checked'][0][0]).to.be.eq(node)
  })
  it('nodeManager.uncheck emits node:unchecked', () => {
    const nodes = [{
      id: 1,
      name: 'node1',
      checked: true,
      children: [{
        id: 3,
        name: 'child1',
        children: [{
          id: 9,
          name: 'grandchild1'
        }]
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
    const options = { }
    const wrapper = mount(Tree, { propsData: { nodes, options } })
    const manager = wrapper.vm.nodeManager
    const node = manager.getById(1)
    manager.uncheck(node)
    expect(wrapper.emitted()['node:unchecked']).to.be.lengthOf(1)
    expect(wrapper.emitted()['node:unchecked'][0][0]).to.be.eq(node)
  })
  it('nodeManager.expand emits node:expanded', () => {
    const nodes = [{
      id: 1,
      name: 'node1',
      children: [{
        id: 3,
        name: 'child1',
        children: [{
          id: 9,
          name: 'grandchild1'
        }]
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
    const options = { }
    const wrapper = mount(Tree, { propsData: { nodes, options } })
    const manager = wrapper.vm.nodeManager
    const node = manager.getById(1)
    manager.expand(node)
    expect(wrapper.emitted()['node:expanded']).to.be.lengthOf(1)
    expect(wrapper.emitted()['node:expanded'][0][0]).to.be.eq(node)
  })
  it('nodeManager.collapse emits node:collapsed', () => {
    const nodes = [{
      id: 1,
      name: 'node1',
      opened: true,
      children: [{
        id: 3,
        name: 'child1',
        children: [{
          id: 9,
          name: 'grandchild1'
        }]
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
    const options = { }
    const wrapper = mount(Tree, { propsData: { nodes, options } })
    const manager = wrapper.vm.nodeManager
    const node = manager.getById(1)
    manager.collapse(node)
    expect(wrapper.emitted()['node:collapsed']).to.be.lengthOf(1)
    expect(wrapper.emitted()['node:collapsed'][0][0]).to.be.eq(node)
  })
  it('nodeManager.expandAll emits tree:expanded:all', () => {
    const nodes = [{
      id: 1,
      name: 'node1',
      children: [{
        id: 3,
        name: 'child1',
        children: [{
          id: 9,
          name: 'grandchild1'
        }]
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
    const options = { }
    const wrapper = mount(Tree, { propsData: { nodes, options } })
    const manager = wrapper.vm.nodeManager
    manager.expandAll()
    expect(wrapper.emitted()['tree:expanded:all']).to.be.lengthOf(1)
  })
  it('nodeManager.collapseAll emits tree:collapsed:all', () => {
    const nodes = [{
      id: 1,
      name: 'node1',
      children: [{
        id: 3,
        name: 'child1',
        children: [{
          id: 9,
          name: 'grandchild1'
        }]
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
    const options = { }
    const wrapper = mount(Tree, { propsData: { nodes, options } })
    const manager = wrapper.vm.nodeManager
    manager.collapseAll()
    expect(wrapper.emitted()['tree:collapsed:all']).to.be.lengthOf(1)
  })
  it('nodeManager.disable emits node:disabled', () => {
    const nodes = [{
      id: 1,
      name: 'node1',
      children: [{
        id: 3,
        name: 'child1',
        children: [{
          id: 9,
          name: 'grandchild1'
        }]
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
    const options = { }
    const wrapper = mount(Tree, { propsData: { nodes, options } })
    const manager = wrapper.vm.nodeManager
    const node = manager.getById(1)
    manager.disable(node)
    expect(wrapper.emitted()['node:disabled']).to.be.lengthOf(1)
    expect(wrapper.emitted()['node:disabled'][0][0]).to.be.eq(node)
  })
  it('nodeManager.disable on selected node emits node:selected with null param', () => {
    const nodes = [{
      id: 1,
      name: 'node1',
      children: [{
        id: 3,
        name: 'child1',
        children: [{
          id: 9,
          name: 'grandchild1'
        }]
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
    const options = { }
    const wrapper = mount(Tree, { propsData: { nodes, options } })
    const manager = wrapper.vm.nodeManager
    const node = manager.getById(1)
    manager.setSelected(node)
    manager.disable(node)
    expect(wrapper.emitted()['node:selected']).to.be.lengthOf(2)
    expect(wrapper.emitted()['node:selected'][0][0]).to.be.eq(node)
    expect(wrapper.emitted()['node:selected'][1][0]).to.be.eq(null)
  })
  it('nodeManager.enable emits node:enabled', () => {
    const nodes = [{
      id: 1,
      name: 'node1',
      children: [{
        id: 3,
        name: 'child1',
        children: [{
          id: 9,
          name: 'grandchild1'
        }]
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
    const options = { }
    const wrapper = mount(Tree, { propsData: { nodes, options } })
    const manager = wrapper.vm.nodeManager
    const node = manager.getById(1)
    manager.enable(node)
    expect(wrapper.emitted()['node:enabled']).to.be.lengthOf(1)
    expect(wrapper.emitted()['node:enabled'][0][0]).to.be.eq(node)
  })
  it('nodeManager.disableAll emits tree:disabled:all', () => {
    const nodes = [{
      id: 1,
      name: 'node1',
      children: [{
        id: 3,
        name: 'child1',
        children: [{
          id: 9,
          name: 'grandchild1'
        }]
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
    const options = { }
    const wrapper = mount(Tree, { propsData: { nodes, options } })
    const manager = wrapper.vm.nodeManager
    manager.disableAll()
    expect(wrapper.emitted()['tree:disabled:all']).to.be.lengthOf(1)
  })
  it('nodeManager.disableAll with selected node emits node:selected with null param', () => {
    const nodes = [{
      id: 1,
      name: 'node1',
      children: [{
        id: 3,
        name: 'child1',
        children: [{
          id: 9,
          name: 'grandchild1'
        }]
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
    const options = { }
    const wrapper = mount(Tree, { propsData: { nodes, options } })
    const manager = wrapper.vm.nodeManager
    const node = manager.getById(1)
    manager.setSelected(node)
    manager.disableAll()
    expect(wrapper.emitted()['node:selected']).to.be.lengthOf(2)
    expect(wrapper.emitted()['node:selected'][0][0]).to.be.eq(node)
    expect(wrapper.emitted()['node:selected'][1][0]).to.be.eq(null)
  })
  it('nodeManager.enableAll emits tree:enabled:all', () => {
    const nodes = [{
      id: 1,
      name: 'node1',
      children: [{
        id: 3,
        name: 'child1',
        children: [{
          id: 9,
          name: 'grandchild1'
        }]
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
    const options = { }
    const wrapper = mount(Tree, { propsData: { nodes, options } })
    const manager = wrapper.vm.nodeManager
    manager.enableAll()
    expect(wrapper.emitted()['tree:enabled:all']).to.be.lengthOf(1)
  })
  it('nodeManager.setSelected emits node:selected', () => {
    const nodes = [{
      id: 1,
      name: 'node1',
      children: [{
        id: 3,
        name: 'child1',
        children: [{
          id: 9,
          name: 'grandchild1'
        }]
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
    const options = { }
    const wrapper = mount(Tree, { propsData: { nodes, options } })
    const manager = wrapper.vm.nodeManager
    const node = manager.getById(1)
    manager.setSelected(node)
    expect(wrapper.emitted()['node:selected']).to.be.lengthOf(1)
    expect(wrapper.emitted()['node:selected'][0][0]).to.be.eq(node)
  })
  it('nodeManager.setSelected with null emits node:selected with null param', () => {
    const nodes = [{
      id: 1,
      name: 'node1',
      children: [{
        id: 3,
        name: 'child1',
        children: [{
          id: 9,
          name: 'grandchild1'
        }]
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
    const options = { }
    const wrapper = mount(Tree, { propsData: { nodes, options } })
    const manager = wrapper.vm.nodeManager
    manager.setSelected(null)
    expect(wrapper.emitted()['node:selected']).to.be.lengthOf(1)
    expect(wrapper.emitted()['node:selected'][0][0]).to.be.null
  })
  it('nodeManager.addChild emits node:child:added', () => {
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
    const options = { }
    const wrapper = mount(Tree, { propsData: { nodes, options } })
    const manager = wrapper.vm.nodeManager
    const node = manager.getById(1)
    const newChildItem = {
      id: 5,
      name: 'child3'
    }
    const newChild = manager.addChild(node, newChildItem)

    expect(wrapper.emitted()['node:child:added']).to.be.lengthOf(1)
    expect(wrapper.emitted()['node:child:added'][0][0]).to.be.eq(newChildItem)
    expect(wrapper.emitted()['node:child:added'][0][1]).to.be.eq(newChild)
  })
  it('nodeManager.insertChild emits node:child:added', () => {
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
    const options = { }
    const wrapper = mount(Tree, { propsData: { nodes, options } })
    const manager = wrapper.vm.nodeManager
    const node = manager.getById(1)
    const newChildItem = {
      id: 5,
      name: 'child3'
    }
    const newChild = manager.insertChild(node, newChildItem)

    expect(wrapper.emitted()['node:child:added']).to.be.lengthOf(1)
    expect(wrapper.emitted()['node:child:added'][0][0]).to.be.eq(newChildItem)
    expect(wrapper.emitted()['node:child:added'][0][1]).to.be.eq(newChild)
  })
  it('nodeManager.remove on root node emits node:removed', () => {
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
    const options = { }
    const wrapper = mount(Tree, { propsData: { nodes, options } })
    const manager = wrapper.vm.nodeManager
    const node = manager.getById(1)
    manager.remove(node)

    expect(wrapper.emitted()['node:removed']).to.be.lengthOf(1)
    expect(wrapper.emitted()['node:removed'][0][0]).to.be.eq(node)
  })
  it('nodeManager.remove on child node emits node:child:removed', () => {
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
    const options = { }
    const wrapper = mount(Tree, { propsData: { nodes, options } })
    const manager = wrapper.vm.nodeManager
    const node = manager.getById(3)
    manager.remove(node)

    expect(wrapper.emitted()['node:child:removed']).to.be.lengthOf(1)
    expect(wrapper.emitted()['node:child:removed'][0][0]).to.be.eq(node)
  })
})
