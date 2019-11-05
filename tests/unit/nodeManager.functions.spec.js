/* eslint-disable no-unused-expressions */
import { expect } from 'chai'
import { mount } from '@vue/test-utils'
import Tree from '@/components/Tree.vue'

describe('nodeManager functions', () => {
  function getNodeManager (nodes, options) {
    const wrapper = mount(Tree, {
      propsData: { nodes, options }
    })

    return wrapper.vm.nodeManager
  }
  it('getChecked returns all checked nodes', () => {
    const nodes = [{
      id: 1,
      name: 'test',
      checked: true,
      children: [{
        id: 3,
        name: 'child1'
      }, {
        id: 4,
        name: 'child2',
        checked: true
      }]
    }, {
      id: 2,
      name: 'test2'
    }, {
      id: 5,
      name: 'test3',
      checked: true
    }]
    const options = {
      checkOnSelect: false
    }
    const manager = getNodeManager(nodes, options)
    const checkedNodes = manager.getChecked()
    expect(checkedNodes.length).to.be.eq(3)
    expect(checkedNodes.map(x => x.id)).to.have.members([1, 4, 5])
  })
  it('checkAll checks all nodes', () => {
    const nodes = [{
      id: 1,
      name: 'test',
      children: [{
        id: 3,
        name: 'child1'
      }, {
        id: 4,
        name: 'child2'
      }]
    }, {
      id: 2,
      name: 'test2'
    }, {
      id: 5,
      name: 'test3'
    }]
    const options = {
      checkOnSelect: false
    }
    const manager = getNodeManager(nodes, options)
    manager.checkAll()
    const checkedNodes = manager.getChecked()
    expect(checkedNodes.length).to.be.eq(5)
    expect(checkedNodes.map(x => x.id)).to.have.members([1, 3, 4, 2, 5])
  })
  it('checkVisible does not check invisible child nodes', () => {
    const nodes = [{
      id: 1,
      name: 'test',
      children: [{
        id: 3,
        name: 'child1'
      }, {
        id: 4,
        name: 'child2'
      }]
    }, {
      id: 2,
      name: 'test2'
    }, {
      id: 5,
      name: 'test3'
    }]
    const options = {
      checkOnSelect: false
    }
    const manager = getNodeManager(nodes, options)
    manager.checkVisible()
    const checkedNodes = manager.getChecked()
    expect(checkedNodes.length).to.be.eq(3)
    expect(checkedNodes.map(x => x.id)).to.have.members([1, 2, 5])
  })
  it('checkVisible checks visible child nodes', () => {
    const nodes = [{
      id: 1,
      name: 'test',
      opened: true,
      children: [{
        id: 3,
        name: 'child1'
      }, {
        id: 4,
        name: 'child2'
      }]
    }, {
      id: 2,
      name: 'test2'
    }, {
      id: 5,
      name: 'test3'
    }]
    const options = {
      checkOnSelect: false
    }
    const manager = getNodeManager(nodes, options)
    manager.checkVisible()
    const checkedNodes = manager.getChecked()
    expect(checkedNodes.length).to.be.eq(5)
    expect(checkedNodes.map(x => x.id)).to.have.members([1, 2, 3, 4, 5])
  })
  it('uncheckAll unchecks all nodes', () => {
    const nodes = [{
      id: 1,
      name: 'test',
      checked: true,
      children: [{
        id: 3,
        name: 'child1',
        checked: true
      }, {
        id: 4,
        name: 'child2'
      }]
    }, {
      id: 2,
      name: 'test2',
      checked: true
    }, {
      id: 5,
      name: 'test3'
    }]
    const options = {
      checkOnSelect: false
    }
    const manager = getNodeManager(nodes, options)
    manager.uncheckAll()
    const checkedNodes = manager.getChecked()
    expect(checkedNodes).to.be.empty
  })
  it('uncheckVisible does not uncheck invisible child nodes', () => {
    const nodes = [{
      id: 1,
      name: 'test',
      children: [{
        id: 3,
        name: 'child1',
        checked: true
      }, {
        id: 4,
        name: 'child2'
      }]
    }, {
      id: 2,
      name: 'test2',
      checked: true
    }, {
      id: 5,
      name: 'test3'
    }]
    const options = {
      checkOnSelect: false
    }
    const manager = getNodeManager(nodes, options)
    manager.uncheckVisible()
    const checkedNodes = manager.getChecked()
    expect(checkedNodes.length).to.be.eq(1)
    expect(checkedNodes.map(x => x.id)).to.have.members([3])
  })
  it('uncheckVisible unchecks visible child nodes', () => {
    const nodes = [{
      id: 1,
      name: 'test',
      opened: true,
      children: [{
        id: 3,
        name: 'child1',
        checked: true
      }, {
        id: 4,
        name: 'child2'
      }]
    }, {
      id: 2,
      name: 'test2',
      checked: true
    }, {
      id: 5,
      name: 'test3'
    }]
    const options = {
      checkOnSelect: false
    }
    const manager = getNodeManager(nodes, options)
    manager.uncheckVisible()
    const checkedNodes = manager.getChecked()
    expect(checkedNodes).to.be.empty
  })
  it('expand expands node itself only', () => {
    const nodes = [{
      id: 1,
      name: 'test',
      children: [{
        id: 3,
        name: 'child1',
        children: [{
          id: 6,
          name: 'grandchild1'
        }]
      }, {
        id: 4,
        name: 'child2'
      }]
    }, {
      id: 2,
      name: 'test2'
    }, {
      id: 5,
      name: 'test3'
    }]
    const options = {
      checkOnSelect: false
    }
    const manager = getNodeManager(nodes, options)
    const node = manager.getById(1)
    manager.expand(node)
    expect(node.states.opened).to.be.true
    expect(node.children[0].states.opened).to.be.false
  })
  it('expand with withChildren=true expands node and its children', () => {
    const nodes = [{
      id: 1,
      name: 'test',
      children: [{
        id: 3,
        name: 'child1',
        children: [{
          id: 6,
          name: 'grandchild1'
        }]
      }, {
        id: 4,
        name: 'child2'
      }]
    }, {
      id: 2,
      name: 'test2'
    }, {
      id: 5,
      name: 'test3'
    }]
    const options = {
      checkOnSelect: false
    }
    const manager = getNodeManager(nodes, options)
    const node = manager.getById(1)
    manager.expand(node, true)
    expect(node.states.opened).to.be.true
    expect(node.children[0].states.opened).to.be.true
  })
  it('expandChildren expands node children only', () => {
    const nodes = [{
      id: 1,
      name: 'test',
      children: [{
        id: 3,
        name: 'child1',
        children: [{
          id: 6,
          name: 'grandchild1'
        }]
      }, {
        id: 4,
        name: 'child2'
      }]
    }, {
      id: 2,
      name: 'test2'
    }, {
      id: 5,
      name: 'test3'
    }]
    const options = {
      checkOnSelect: false
    }
    const manager = getNodeManager(nodes, options)
    const node = manager.getById(1)
    manager.expandChildren(node)
    expect(node.states.opened).to.be.false
    expect(node.children[0].states.opened).to.be.true
  })
  it('collapse collapses node itself only', () => {
    const nodes = [{
      id: 1,
      name: 'test',
      opened: true,
      children: [{
        id: 3,
        name: 'child1',
        opened: true,
        children: [{
          id: 6,
          name: 'grandchild1'
        }]
      }, {
        id: 4,
        name: 'child2'
      }]
    }, {
      id: 2,
      name: 'test2'
    }, {
      id: 5,
      name: 'test3'
    }]
    const options = {
      checkOnSelect: false
    }
    const manager = getNodeManager(nodes, options)
    const node = manager.getById(1)
    manager.collapse(node)
    expect(node.states.opened).to.be.false
    expect(node.children[0].states.opened).to.be.true
  })
  it('collapse with withChildren=true collapses node and its children', () => {
    const nodes = [{
      id: 1,
      name: 'test',
      opened: true,
      children: [{
        id: 3,
        name: 'child1',
        opened: true,
        children: [{
          id: 6,
          name: 'grandchild1'
        }]
      }, {
        id: 4,
        name: 'child2'
      }]
    }, {
      id: 2,
      name: 'test2'
    }, {
      id: 5,
      name: 'test3'
    }]
    const options = {
      checkOnSelect: false
    }
    const manager = getNodeManager(nodes, options)
    const node = manager.getById(1)
    manager.collapse(node, true)
    expect(node.states.opened).to.be.false
    expect(node.children[0].states.opened).to.be.false
  })
  it('collapseChildren collapses node children only', () => {
    const nodes = [{
      id: 1,
      name: 'test',
      opened: true,
      children: [{
        id: 3,
        name: 'child1',
        opened: true,
        children: [{
          id: 6,
          name: 'grandchild1'
        }]
      }, {
        id: 4,
        name: 'child2'
      }]
    }, {
      id: 2,
      name: 'test2'
    }, {
      id: 5,
      name: 'test3'
    }]
    const options = {
      checkOnSelect: false
    }
    const manager = getNodeManager(nodes, options)
    const node = manager.getById(1)
    manager.collapseChildren(node)
    expect(node.states.opened).to.be.true
    expect(node.children[0].states.opened).to.be.false
  })
  it('expandAll expands all nodes', () => {
    const nodes = [{
      id: 1,
      name: 'test',
      opened: false,
      children: [{
        id: 3,
        name: 'child1',
        opened: false,
        children: [{
          id: 6,
          name: 'grandchild1'
        }]
      }, {
        id: 4,
        name: 'child2'
      }]
    }, {
      id: 2,
      name: 'test2',
      opened: false,
      children: [{
        id: 8,
        name: 'grandchild2'
      }]
    }, {
      id: 5,
      name: 'test3'
    }]
    const options = {
      checkOnSelect: false
    }
    const manager = getNodeManager(nodes, options)
    manager.expandAll()
    expect(manager.getById(1).states.opened).to.be.true
    expect(manager.getById(3).states.opened).to.be.true
    expect(manager.getById(2).states.opened).to.be.true
  })
  it('collapseAll collapses all nodes', () => {
    const nodes = [{
      id: 1,
      name: 'test',
      opened: true,
      children: [{
        id: 3,
        name: 'child1',
        opened: true,
        children: [{
          id: 6,
          name: 'grandchild1'
        }]
      }, {
        id: 4,
        name: 'child2'
      }]
    }, {
      id: 2,
      name: 'test2',
      opened: true,
      children: [{
        id: 8,
        name: 'grandchild2'
      }]
    }, {
      id: 5,
      name: 'test3'
    }]
    const options = {
      checkOnSelect: false
    }
    const manager = getNodeManager(nodes, options)
    manager.collapseAll()
    expect(manager.getById(1).states.opened).to.be.false
    expect(manager.getById(3).states.opened).to.be.false
    expect(manager.getById(2).states.opened).to.be.false
  })
  it('getById gets node by its id', () => {
    const nodes = [{
      id: 1,
      name: 'test',
      children: [{
        id: 3,
        name: 'child1',
        children: [{
          id: 6,
          name: 'grandchild1'
        }]
      }, {
        id: 4,
        name: 'child2'
      }]
    }, {
      id: 2,
      name: 'test2',
      children: [{
        id: 8,
        name: 'grandchild2'
      }]
    }, {
      id: 5,
      name: 'test3'
    }]
    const options = {
      checkOnSelect: false
    }
    const manager = getNodeManager(nodes, options)
    manager.collapseAll()
    expect(manager.getById(1).id).to.be.eq(1)
    expect(manager.getById(3).id).to.be.eq(3)
    expect(manager.getById(6).id).to.be.eq(6)
    expect(manager.getById(4).id).to.be.eq(4)
    expect(manager.getById(2).id).to.be.eq(2)
    expect(manager.getById(8).id).to.be.eq(8)
  })
  it('findOne find first node matching by criteria func', () => {
    const nodes = [{
      id: 1,
      name: 'test',
      children: [{
        id: 3,
        name: 'child1',
        children: [{
          id: 6,
          name: 'grandchild1'
        }, {
          id: 9,
          name: 'grandchild3'
        }]
      }, {
        id: 4,
        name: 'child2'
      }]
    }, {
      id: 2,
      name: 'test2',
      children: [{
        id: 8,
        name: 'grandchild2'
      }]
    }, {
      id: 5,
      name: 'test3'
    }]
    const options = {
      checkOnSelect: false
    }
    const manager = getNodeManager(nodes, options)
    const foundNode = manager.findOne(x => x.item.name.indexOf('test') !== -1)
    expect(foundNode.id).to.be.eq(1)
    const foundChild = manager.findOne(x => x.item.name.indexOf('grand') !== -1)
    expect(foundChild.id).to.be.eq(6)
  })
})
