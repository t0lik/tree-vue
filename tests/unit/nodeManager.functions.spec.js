/* eslint-disable no-unused-expressions */
import { expect } from 'chai'
import { mount } from '@vue/test-utils'
import Tree from '@/components/Tree.vue'

describe('nodeManager functions', () => {
  function getNodeManager (nodes, options = {}) {
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
  it('findOne finds first node matching by criteria func', () => {
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
  it('findAll finds all nodes matching by criteria func', () => {
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
    const foundNodes = manager.findAll(x => x.item.name.indexOf('test') !== -1)
    expect(foundNodes).to.be.lengthOf(3)
    expect(foundNodes.map(x => x.id)).to.be.members([1, 2, 5])
    const foundChildren = manager.findAll(x => x.item.name.indexOf('grand') !== -1)
    expect(foundChildren).to.be.lengthOf(3)
    expect(foundChildren.map(x => x.id)).to.be.members([6, 9, 8])
  })
  it('findParent finds nearest parent node matching by criteria func', () => {
    const nodes = [{
      id: 1,
      name: 'grandparent',
      children: [{
        id: 3,
        name: 'parent1',
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
      name: 'parent2',
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
    const grandChild = manager.getById(6)
    const foundGrandParent = manager.findParent(grandChild, x => x.item.name.indexOf('grandparent') !== -1)
    expect(foundGrandParent.id).to.be.eq(1)
    const foundParent = manager.findParent(grandChild, x => x.item.name.indexOf('parent') !== -1)
    expect(foundParent.id).to.be.eq(3)
  })
  it('findParents finds all parent nodes matching by criteria func', () => {
    const nodes = [{
      id: 1,
      name: 'grandparent',
      children: [{
        id: 3,
        name: 'parent1',
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
      name: 'parent2',
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
    const grandChild = manager.getById(6)
    const foundGrandParents = manager.findParents(grandChild, x => x.item.name.indexOf('grandparent') !== -1)
    expect(foundGrandParents).to.be.lengthOf(1)
    expect(foundGrandParents[0].id).to.be.eq(1)
    const foundParents = manager.findParents(grandChild, x => x.item.name.indexOf('parent') !== -1)
    expect(foundParents).to.be.lengthOf(2)
    expect(foundParents[0].id).to.be.eq(3)
    expect(foundParents[1].id).to.be.eq(1)
  })
  it('setSelected with node sets it as selected', () => {
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
    const options = {
      checkOnSelect: false
    }
    const manager = getNodeManager(nodes, options)
    const node = manager.getById(2)
    manager.setSelected(node)
    expect(manager.selectedNode).to.be.eq(node)
  })
  it('setSelected with treeOptions.checkOnSelect=true set node both selected and checked', () => {
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
    const options = {
      checkOnSelect: true
    }
    const manager = getNodeManager(nodes, options)
    const node = manager.getById(4)
    manager.setSelected(node)
    expect(manager.selectedNode).to.be.eq(node)
    expect(node.states.checked).to.be.true
  })
  it('setSelected with treeOptions.openOnSelect=true set node both selected and opened', () => {
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
    const options = {
      openOnSelect: true
    }
    const manager = getNodeManager(nodes, options)
    const node = manager.getById(1)
    manager.setSelected(node)
    expect(manager.selectedNode).to.be.eq(node)
    expect(node.states.opened).to.be.true
  })
  it('getVisible returns all visible nodes', () => {
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
    const manager = getNodeManager(nodes)
    manager.filter('test')
    const visibleNodes = manager.getVisible()
    expect(visibleNodes.length).to.be.eq(3)
    expect(visibleNodes.map(x => x.id)).to.have.members([1, 2, 5])
  })
  it('filter with no text throws Error', () => {
    const nodes = [{
      id: 1,
      name: 'node1'
    }, {
      id: 2,
      name: 'node2'
    }, {
      id: 5,
      name: 'node3'
    }]
    const manager = getNodeManager(nodes)
    expect(() => manager.filter(null)).throw('parameter "searchObject" is not set')
  })
  it('filter with simple text returns matched nodes', () => {
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
    const manager = getNodeManager(nodes)
    const matchedNodes = manager.filter('node')
    expect(matchedNodes.map(x => x.id)).to.be.members([1, 2, 5])
  })
  it('filter with regexp returns matched nodes', () => {
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
    const manager = getNodeManager(nodes)
    const matchedNodes = manager.filter(/node[12]/)
    expect(matchedNodes.map(x => x.id)).to.be.members([1, 2])
  })
  it('filter with function returns matched nodes', () => {
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
    const manager = getNodeManager(nodes)
    const matchedNodes = manager.filter(x => x.name.indexOf('node') !== -1 && x.id > 1)
    expect(matchedNodes.map(x => x.id)).to.be.members([2, 5])
  })
  it('filter with simple text in UPPERCASE returns case insensitive matched nodes ', () => {
    const nodes = [{
      id: 1,
      name: 'Node1',
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
      name: 'nOde2',
      children: [{
        id: 8,
        name: 'child3'
      }]
    }, {
      id: 5,
      name: 'noDe3'
    }]
    const manager = getNodeManager(nodes)
    const matchedNodes = manager.filter('NODE')
    expect(matchedNodes.map(x => x.id)).to.be.members([1, 2, 5])
  })
  it('filter with simple text sets matched nodes and their parents as visible', () => {
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
    const manager = getNodeManager(nodes)
    manager.filter('child')
    const visibleNodes = manager.getVisible()
    expect(visibleNodes).to.be.lengthOf(6)
    expect(visibleNodes.map(x => x.id)).to.have.members([1, 2, 3, 4, 8, 9])
  })
  it('filter with showChildren=true sets matched nodes and their children as visible', () => {
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
    const manager = getNodeManager(nodes)
    manager.filter('node', { showChildren: true })
    const visibleNodes = manager.getVisible()
    expect(visibleNodes).to.be.lengthOf(7)
    expect(visibleNodes.map(x => x.id)).to.have.members([1, 2, 3, 4, 5, 8, 9])
  })
  it('clearFilter restores visibility to all non-matched nodes after last filter call', () => {
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
    const manager = getNodeManager(nodes)
    manager.filter('child1')
    manager.clearFilter()
    const visibleNodes = manager.getVisible()
    expect(visibleNodes).to.be.lengthOf(3)
    expect(visibleNodes.map(x => x.id)).to.have.members([1, 2, 5])
  })
  it('visitAll with default options iterates through all passed nodes', () => {
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
    const manager = getNodeManager(nodes)
    const visitedNodes = []
    manager.visitAll(manager.items, x => { visitedNodes.push(x.id) })
    expect(visitedNodes).to.be.lengthOf(7)
    expect(visitedNodes).to.have.members([1, 2, 3, 4, 5, 8, 9])
  })
  it('visitAll with onlyVisible=true iterates through all passed and visible nodes', () => {
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
    const manager = getNodeManager(nodes)
    const visitedNodes = []
    manager.visitAll(manager.items, x => { visitedNodes.push(x.id) }, true)
    expect(visitedNodes).to.be.lengthOf(3)
    expect(visitedNodes).to.have.members([1, 2, 5])
  })
  it('visitAll with null as passed nodes throws Error', () => {
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
    const manager = getNodeManager(nodes)
    const visitedNodes = []
    expect(() => manager.visitAll(null, x => { visitedNodes.push(x.id) })).throw('parameter "nodes" is not set')
  })
  it('visitAll with null as passed callback throws Error', () => {
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
    const manager = getNodeManager(nodes)
    expect(() => manager.visitAll(manager.items, null)).throw('parameter "nodeCallback" is not set')
  })
  it('visitAll and callback returning true on first child iterates through node and its first child only', () => {
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
    const manager = getNodeManager(nodes)
    const node = manager.getById(1)
    const visitedNodes = []
    manager.visitAll([node], item => {
      visitedNodes.push(item)
      if (item.id === 3) {
        return true
      }
    })
    expect(visitedNodes.map(x => x.id)).to.be.members([1, 3])
  })
})
