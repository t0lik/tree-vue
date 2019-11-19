/* eslint-disable no-unused-expressions */
import { expect } from 'chai'
import { mount } from '@vue/test-utils'
import Tree from '@/components/TreeVue.vue'

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
      open: true,
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
      open: true,
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
    expect(node.states.open).to.be.true
    expect(node.children[0].states.open).to.be.false
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
    expect(node.states.open).to.be.true
    expect(node.children[0].states.open).to.be.true
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
    expect(node.states.open).to.be.false
    expect(node.children[0].states.open).to.be.true
  })
  it('collapse collapses node itself only', () => {
    const nodes = [{
      id: 1,
      name: 'test',
      open: true,
      children: [{
        id: 3,
        name: 'child1',
        open: true,
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
    expect(node.states.open).to.be.false
    expect(node.children[0].states.open).to.be.true
  })
  it('collapse with withChildren=true collapses node and its children', () => {
    const nodes = [{
      id: 1,
      name: 'test',
      open: true,
      children: [{
        id: 3,
        name: 'child1',
        open: true,
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
    expect(node.states.open).to.be.false
    expect(node.children[0].states.open).to.be.false
  })
  it('collapseChildren collapses node children only', () => {
    const nodes = [{
      id: 1,
      name: 'test',
      open: true,
      children: [{
        id: 3,
        name: 'child1',
        open: true,
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
    expect(node.states.open).to.be.true
    expect(node.children[0].states.open).to.be.false
  })
  it('expandAll expands all nodes', () => {
    const nodes = [{
      id: 1,
      name: 'test',
      open: false,
      children: [{
        id: 3,
        name: 'child1',
        open: false,
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
      open: false,
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
    expect(manager.getById(1).states.open).to.be.true
    expect(manager.getById(3).states.open).to.be.true
    expect(manager.getById(2).states.open).to.be.true
  })
  it('collapseAll collapses all nodes', () => {
    const nodes = [{
      id: 1,
      name: 'test',
      open: true,
      children: [{
        id: 3,
        name: 'child1',
        open: true,
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
      open: true,
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
    expect(manager.getById(1).states.open).to.be.false
    expect(manager.getById(3).states.open).to.be.false
    expect(manager.getById(2).states.open).to.be.false
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
  it('setSelected with treeOptions.openOnSelect=true set node both selected and open', () => {
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
    expect(node.states.open).to.be.true
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
  it('filter sets options.inSearch=true', () => {
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

    manager.filter('node')

    expect(manager.options.inSearch).to.be.true
  })
  it('clearFilter sets options.inSearch=false', () => {
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
    manager.filter('node')

    manager.clearFilter()

    expect(manager.options.inSearch).to.be.false
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
  it('setCheckState with node=null throws Error', () => {
    const nodes = [{
      id: 1,
      name: 'node1',
      open: true,
      children: [{
        id: 3,
        name: 'child1',
        open: true,
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

    expect(() => manager.setCheckState(null, true)).throw('parameter "node" is not set')
  })
  it('setCheckState with state=true checks specified node', () => {
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
    manager.setCheckState(node, true)
    expect(node.states.checked).to.be.true
  })
  it('setCheckState with state=false unchecks specified node', () => {
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
    const manager = getNodeManager(nodes)
    const node = manager.getById(1)
    manager.setCheckState(node, false)
    expect(node.states.checked).to.be.false
  })
  it('setCheckState with state=true and withChildren=true checks specified node and its children', () => {
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
    manager.setCheckState(node, true, true)
    const checkedNodes = manager.getChecked()
    expect(checkedNodes).to.be.lengthOf(4)
    expect(checkedNodes.map(x => x.id)).to.be.members([1, 3, 9, 4])
  })
  it('setCheckState with state=true and treeOptions.CheckModes=Linked checks specified node and its children', () => {
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
    const manager = getNodeManager(nodes, { checkMode: 'linked' })
    const node = manager.getById(1)
    manager.setCheckState(node, true)
    const checkedNodes = manager.getChecked()
    expect(checkedNodes).to.be.lengthOf(4)
    expect(checkedNodes.map(x => x.id)).to.be.members([1, 3, 9, 4])
  })
  it('setCheckState with state=true and treeOptions.CheckModes=Linked checks specified single child node and its open parent', () => {
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
      open: true,
      children: [{
        id: 8,
        name: 'child3'
      }]
    }, {
      id: 5,
      name: 'node3'
    }]
    const manager = getNodeManager(nodes, { checkMode: 'linked' })
    const node = manager.getById(8)
    manager.setCheckState(node, true)
    const checkedNodes = manager.getChecked()
    expect(checkedNodes).to.be.lengthOf(2)
    expect(checkedNodes.map(x => x.id)).to.be.members([2, 8])
  })
  it('setCheckState with state=false and treeOptions.CheckModes=Linked unchecks specified single child node and its open parent', () => {
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
      open: true,
      checked: true,
      children: [{
        id: 8,
        name: 'child3',
        checked: true
      }]
    }, {
      id: 5,
      name: 'node3'
    }]
    const manager = getNodeManager(nodes, { checkMode: 'linked' })
    const node = manager.getById(8)
    manager.setCheckState(node, false)
    const checkedNodes = manager.getChecked()
    expect(checkedNodes).to.be.lengthOf(0)
  })
  it('check checks specified node', () => {
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
    manager.check(node)
    expect(node.states.checked).to.be.true
  })
  it('check with node=null throws Error', () => {
    const nodes = [{
      id: 1,
      name: 'node1',
      open: true,
      children: [{
        id: 3,
        name: 'child1',
        open: true,
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

    expect(() => manager.check(null)).throw('parameter "node" is not set')
  })
  it('check with withChildren=true checks specified node and its children', () => {
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
    manager.check(node, true)
    const checkedNodes = manager.getChecked()
    expect(checkedNodes).to.be.lengthOf(4)
    expect(checkedNodes.map(x => x.id)).to.be.members([1, 3, 9, 4])
  })
  it('checkChildren checks specified node children', () => {
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
    manager.checkChildren(node)
    const checkedNodes = manager.getChecked()
    expect(checkedNodes).to.be.lengthOf(3)
    expect(checkedNodes.map(x => x.id)).to.be.members([3, 9, 4])
  })
  it('checkChildren with node=null throws Error', () => {
    const nodes = [{
      id: 1,
      name: 'node1',
      open: true,
      children: [{
        id: 3,
        name: 'child1',
        open: true,
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

    expect(() => manager.checkChildren(null)).throw('parameter "node" is not set')
  })
  it('uncheck unchecks specified node', () => {
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
    const manager = getNodeManager(nodes)
    const node = manager.getById(1)
    manager.uncheck(node)
    expect(node.states.checked).to.be.false
  })
  it('uncheck with node=null throws Error', () => {
    const nodes = [{
      id: 1,
      name: 'node1',
      open: true,
      children: [{
        id: 3,
        name: 'child1',
        open: true,
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

    expect(() => manager.uncheck(null)).throw('parameter "node" is not set')
  })
  it('uncheck with withChildren=true unchecks specified node and its children', () => {
    const nodes = [{
      id: 1,
      name: 'node1',
      checked: true,
      children: [{
        id: 3,
        name: 'child1',
        checked: true,
        children: [{
          id: 9,
          name: 'grandchild1',
          checked: true
        }]
      }, {
        id: 4,
        name: 'child2',
        checked: true
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
    manager.uncheck(node, true)
    const checkedNodes = manager.getChecked()
    expect(checkedNodes).to.be.lengthOf(0)
  })
  it('uncheckChildren unchecks specified node children', () => {
    const nodes = [{
      id: 1,
      name: 'node1',
      checked: true,
      children: [{
        id: 3,
        name: 'child1',
        checked: true,
        children: [{
          id: 9,
          name: 'grandchild1',
          checked: true
        }]
      }, {
        id: 4,
        name: 'child2',
        checked: true
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
    manager.uncheckChildren(node)
    const checkedNodes = manager.getChecked()
    expect(checkedNodes.map(x => x.id)).to.be.members([1])
  })
  it('uncheckChildren with node=null throws Error', () => {
    const nodes = [{
      id: 1,
      name: 'node1',
      open: true,
      children: [{
        id: 3,
        name: 'child1',
        open: true,
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

    expect(() => manager.uncheckChildren(null)).throw('parameter "node" is not set')
  })
  it('getVisibility with closed node returns false', () => {
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
    expect(manager.getVisibility(node)).to.be.false
  })
  it('getVisibility with open node returns true', () => {
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
    expect(manager.getVisibility(node)).to.be.true
  })
  it('setOpenState with state=true opens specified node', () => {
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
    manager.setOpenState(node, true)
    expect(node.states.open).to.be.true
  })
  it('setOpenState with state=false closes specified node', () => {
    const nodes = [{
      id: 1,
      name: 'node1',
      open: true,
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
    manager.setOpenState(node, false)
    expect(node.states.open).to.be.false
  })
  it('setOpenState with state=true and withChildren=true opens specified node and all its children', () => {
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
    manager.setOpenState(node, true, true)
    expect(node.states.open).to.be.true
    expect(manager.getById(3).states.open).to.be.true
  })
  it('setOpenState with state=false and withChildren=true closes specified node and all its children', () => {
    const nodes = [{
      id: 1,
      name: 'node1',
      open: true,
      children: [{
        id: 3,
        name: 'child1',
        open: true,
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
    manager.setOpenState(node, false, true)
    expect(node.states.open).to.be.false
    expect(manager.getById(3).states.open).to.be.false
  })
  it('setOpenState with node=null throws Error', () => {
    const nodes = [{
      id: 1,
      name: 'node1',
      open: true,
      children: [{
        id: 3,
        name: 'child1',
        open: true,
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

    expect(() => manager.setOpenState(null, true)).throw('parameter "node" is not set')
  })
  it('showNode expands all parents of specified node', () => {
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
    const node = manager.getById(9)
    manager.showNode(node)
    expect(node.visible()).to.be.true
    expect(manager.getById(1).states.open).to.be.true
    expect(manager.getById(3).states.open).to.be.true
  })
  it('showNode with node=null throws Error', () => {
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

    expect(() => manager.showNode(null)).throw('parameter "node" is not set')
  })
  it('visitAllParents iterates through all node parents', () => {
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
    const node = manager.getById(9)
    const visitedNodes = []
    manager.visitAllParents(node, x => { visitedNodes.push(x.id) })
    expect(visitedNodes).to.be.lengthOf(2)
    expect(visitedNodes).to.have.members([1, 3])
  })
  it('visitAllParents with node=null throws Error', () => {
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

    expect(() => manager.visitAllParents(null, x => true)).throw('parameter "node" is not set')
  })
  it('visitAllParents with nodeCallback=null throws Error', () => {
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
    const node = manager.getById(9)

    expect(() => manager.visitAllParents(node, null)).throw('parameter "nodeCallback" is not set')
  })
  it('visitAllParents and callback returning true on first parent iterates through this parent only', () => {
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
    const node = manager.getById(9)
    const visitedNodes = []
    manager.visitAllParents(node, item => {
      visitedNodes.push(item)
      if (item.id === 3) {
        return true
      }
    })
    expect(visitedNodes.map(x => x.id)).to.be.members([3])
  })
  it('visitAllParents on root node does not iterate through any nodes', () => {
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
    manager.visitAllParents(node, item => {
      visitedNodes.push(item)
    })
    expect(visitedNodes).to.be.empty
  })
  it('getName returns item name prop value ', () => {
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
    expect(manager.getName(node)).to.be.eq('node1')
  })
  it('getName with treeOptions.nameProp=title returns item title value ', () => {
    const nodes = [{
      id: 1,
      name: 'node1',
      title: 'title1'
    }, {
      id: 2,
      name: 'node2',
      title: 'title2'
    }, {
      id: 5,
      name: 'node3',
      title: 'title3'
    }]
    const manager = getNodeManager(nodes, {
      nameProp: 'title'
    })
    const node = manager.getById(1)
    expect(manager.getName(node)).to.be.eq(node.item.title)
  })
  it('getName with treeOptions.nameProp=function returns item name function value ', () => {
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
    const manager = getNodeManager(nodes, {
      nameProp: item => item.name + ':' + item.id
    })
    const node = manager.getById(1)
    expect(manager.getName(node)).to.be.eq('node1:1')
  })
  it('getName with node=null throws Error', () => {
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

    expect(() => manager.getName(null)).throw('parameter "node" is not set')
  })
  it('getEditName returns item name prop value ', () => {
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
    expect(manager.getEditName(node)).to.be.eq('node1')
  })
  it('getEditName with treeOptions.editNameProp=id returns item id value ', () => {
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
    const manager = getNodeManager(nodes, {
      editNameProp: 'id'
    })
    const node = manager.getById(1)
    expect(manager.getEditName(node)).to.be.eq(node.id)
  })
  it('getEditName with treeOptions.editNameProp=function throws Error', () => {
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
    const manager = getNodeManager(nodes, {
      editNameProp: item => item.name
    })
    const node = manager.getById(1)
    expect(() => manager.getEditName(node)).throw('"editNameProp" cannot be function')
  })
  it('getEditName with node=null throws Error', () => {
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

    expect(() => manager.getEditName(null)).throw('parameter "node" is not set')
  })
  it('setName with node=null throws Error', () => {
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

    expect(() => manager.setName(null)).throw('parameter "node" is not set')
  })
  it('setName with treeOptions.editNameProp=function throws Error', () => {
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
    const manager = getNodeManager(nodes, {
      editNameProp: item => item.name
    })
    const node = manager.getById(1)
    expect(() => manager.setName(node, '111')).throw('"editNameProp" cannot be function')
  })
  it('setName with newName=null throws Error', () => {
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
    const node = manager.getById(1)

    expect(() => manager.setName(node, null)).throw('parameter "newName" is not set')
  })
  it('setName with newName=test1 sets name prop = test1', () => {
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
    const node = manager.getById(1)
    manager.setName(node, 'test1')
    expect(node.item.name).to.be.eq('test1')
  })
  it('setName with treeOptions.editPropName=title and newName=test1 sets title prop = test1', () => {
    const nodes = [{
      id: 1,
      name: 'node1',
      title: 'title1'
    }, {
      id: 2,
      name: 'node2',
      title: 'title2'
    }, {
      id: 5,
      name: 'node3',
      title: 'title3'
    }]
    const manager = getNodeManager(nodes, {
      editNameProp: 'title'
    })
    const node = manager.getById(1)
    manager.setName(node, 'test1')
    expect(node.item.name).to.be.eq('node1')
    expect(node.item.title).to.be.eq('test1')
  })
  it('setName with setNameFunc=function and newName=test1 sets title prop = test1', () => {
    const nodes = [{
      id: 1,
      name: 'node1',
      title: 'title1'
    }, {
      id: 2,
      name: 'node2',
      title: 'title2'
    }, {
      id: 5,
      name: 'node3',
      title: 'title3'
    }]
    const manager = getNodeManager(nodes, {
      setNameFunc: (item, newName) => {
        item.title = newName
      }
    })
    const node = manager.getById(1)
    manager.setName(node, 'test1')
    expect(node.item.name).to.be.eq('node1')
    expect(node.item.title).to.be.eq('test1')
  })
  it('setName with setNameFunc !=== function throws Error', () => {
    const nodes = [{
      id: 1,
      name: 'node1',
      title: 'title1'
    }, {
      id: 2,
      name: 'node2',
      title: 'title2'
    }, {
      id: 5,
      name: 'node3',
      title: 'title3'
    }]
    const manager = getNodeManager(nodes, {
      setNameFunc: 'title'
    })
    const node = manager.getById(1)

    expect(() => manager.setName(node, 'test1')).throw('"setNameFunc" must be function')
  })
  it('getChildren with item=null throws Error', () => {
    const nodes = [{
      id: 1,
      name: 'node1',
      title: 'title1'
    }, {
      id: 2,
      name: 'node2',
      title: 'title2'
    }, {
      id: 5,
      name: 'node3',
      title: 'title3'
    }]
    const manager = getNodeManager(nodes)

    expect(() => manager.getChildren(null)).throw('parameter "item" is not set')
  })
  it('getChildren returns children prop value', () => {
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
      name: 'node2'
    }, {
      id: 5,
      name: 'node3'
    }]
    const manager = getNodeManager(nodes)

    expect(manager.getChildren(nodes[0])).to.be.eq(nodes[0].children)
  })
  it('getChildren with treeOptions.childrenProp=kids returns kids prop value', () => {
    const nodes = [{
      id: 1,
      name: 'node1',
      kids: [{
        id: 3,
        name: 'child1',
        kids: [{
          id: 9,
          name: 'grandchild1'
        }]
      }, {
        id: 4,
        name: 'child2'
      }]
    }, {
      id: 2,
      name: 'node2'
    }, {
      id: 5,
      name: 'node3'
    }]
    const manager = getNodeManager(nodes, {
      childrenProp: 'kids'
    })

    expect(manager.getChildren(nodes[0])).to.be.eq(nodes[0].kids)
  })
  it('getChildren with treeOptions.childrenProp=function returns kids prop value', () => {
    const nodes = [{
      id: 1,
      name: 'node1',
      kids: [{
        id: 3,
        name: 'child1',
        kids: [{
          id: 9,
          name: 'grandchild1'
        }]
      }, {
        id: 4,
        name: 'child2'
      }]
    }, {
      id: 2,
      name: 'node2'
    }, {
      id: 5,
      name: 'node3'
    }]
    const manager = getNodeManager(nodes, {
      childrenProp: item => item.kids
    })

    expect(manager.getChildren(nodes[0])).to.be.eq(nodes[0].kids)
  })
  it('addChild with parent=null throws Error', () => {
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

    expect(() => manager.addChild(null)).throw('parameter "parent" is not set')
  })
  it('addChild with item=null throws Error', () => {
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

    expect(() => manager.addChild(node, null)).throw('parameter "item" is not set')
  })
  it('addChild adds child node to specified node', () => {
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
    const newChildItem = {
      id: 5,
      name: 'child3'
    }
    const newChild = manager.addChild(node, newChildItem)
    expect(newChild).to.be.not.null
    expect(newChild.parent).to.be.eq(node)
    expect(node.children).to.be.lengthOf(3)
    expect(node.children[2]).to.be.eq(newChild)
    expect(newChild.item).to.be.eq(newChildItem)
    expect(newChild.prev.id).to.be.eq(4)
    expect(newChild.next).to.be.null
    expect(manager.getById(4).next.id).to.be.eq(5)
  })
  it('addChild with treeOptions.autoSort=true adds child node to specified node and sorts all its child nodes', () => {
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
    const manager = getNodeManager(nodes, {
      autoSort: true
    })
    const node = manager.getById(1)
    const newChildItem = {
      id: 5,
      name: 'child0'
    }
    const newChild = manager.addChild(node, newChildItem)
    expect(newChild).to.be.not.null
    expect(newChild.parent).to.be.eq(node)
    expect(node.children).to.be.lengthOf(3)
    expect(node.children[0]).to.be.eq(newChild)
    expect(newChild.item).to.be.eq(newChildItem)
    expect(newChild.prev).to.be.null
    expect(newChild.next.id).to.be.eq(3)
    expect(manager.getById(3).prev.id).to.be.eq(5)
  })
  it('insertChild with parent=null throws Error', () => {
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

    expect(() => manager.insertChild(null)).throw('parameter "parent" is not set')
  })
  it('insertChild with item=null throws Error', () => {
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

    expect(() => manager.insertChild(node, null)).throw('parameter "item" is not set')
  })
  it('insertChild inserts child node as first to specified node', () => {
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
    const newChildItem = {
      id: 5,
      name: 'child3'
    }
    const newChild = manager.insertChild(node, newChildItem)
    expect(newChild).to.be.not.null
    expect(newChild.parent).to.be.eq(node)
    expect(node.children).to.be.lengthOf(3)
    expect(node.children[0]).to.be.eq(newChild)
    expect(newChild.item).to.be.eq(newChildItem)
    expect(newChild.prev).to.be.null
    expect(newChild.next.id).to.be.eq(3)
    expect(manager.getById(3).prev.id).to.be.eq(5)
  })
  it('insertChild with beforeNode=child2 inserts child node as second to specified node', () => {
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
    const child = manager.getById(4)
    const newChildItem = {
      id: 5,
      name: 'child3'
    }
    const newChild = manager.insertChild(node, newChildItem, child)
    expect(newChild).to.be.not.null
    expect(newChild.parent).to.be.eq(node)
    expect(node.children).to.be.lengthOf(3)
    expect(node.children[1]).to.be.eq(newChild)
    expect(newChild.item).to.be.eq(newChildItem)
    expect(newChild.prev.id).to.be.eq(3)
    expect(newChild.next.id).to.be.eq(4)
    expect(manager.getById(3).next.id).to.be.eq(5)
    expect(manager.getById(4).prev.id).to.be.eq(5)
  })
  it('insertChild with treeOptions.autoSort=true and beforeNode=child2 inserts child node as second to specified node and sorts all its child nodes', () => {
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
    const manager = getNodeManager(nodes, {
      autoSort: true
    })
    const node = manager.getById(1)
    const child = manager.getById(4)
    const newChildItem = {
      id: 5,
      name: 'child0'
    }
    const newChild = manager.insertChild(node, newChildItem, child)
    expect(newChild).to.be.not.null
    expect(newChild.parent).to.be.eq(node)
    expect(node.children).to.be.lengthOf(3)
    expect(node.children[0]).to.be.eq(newChild)
    expect(newChild.item).to.be.eq(newChildItem)
    expect(newChild.prev).to.be.null
    expect(newChild.next.id).to.be.eq(3)
    expect(manager.getById(3).prev.id).to.be.eq(5)
  })
  it('remove with item=null throws Error', () => {
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

    expect(() => manager.remove(null)).throw('parameter "node" is not set')
  })
  it('remove child node with treeOptions.childrenProp=function throws Error', () => {
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
    const manager = getNodeManager(nodes, {
      childrenProp: item => item.children
    })

    const node = manager.getById(3)
    expect(() => manager.remove(node)).throw('cannot remove the child item while "childrenProp" is a function')
  })
  it('remove with root node removes node and item from original collection', () => {
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

    manager.remove(node)

    expect(manager.items).to.be.empty
    expect(nodes).to.be.empty
  })
  it('remove with child node removes node and item from original collection', () => {
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
    const node = manager.getById(3)
    const nextNode = node.next

    manager.remove(node)

    expect(manager.getById(1).children).to.be.lengthOf(1)
    expect(manager.getById(1).item.children).to.be.lengthOf(1)
    expect(manager.getById(1).children[0].id).to.be.eq(4)
    expect(manager.getById(1).item.children[0].id).to.be.eq(4)
    expect(nextNode.prev).to.be.null
  })
  it('remove with selected root node removes node and set selectedNode=null', () => {
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
    manager.setSelected(node)
    manager.remove(node)
    expect(manager.selectedNode).to.be.null
  })
  it('remove with selected child node removes node and set selectedNode=null', () => {
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
    const node = manager.getById(3)
    manager.setSelected(node)
    manager.remove(node)
    expect(manager.selectedNode).to.be.null
  })
  it('disable with node=null throws Error', () => {
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
    expect(() => manager.disable(null)).throw('parameter "node" is not set')
  })
  it('disable disables node', () => {
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
    manager.disable(node)
    expect(node.states.disabled).to.be.true
  })
  it('disable with selected node disables node and sets selectedNode=null', () => {
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
    manager.setSelected(node)
    manager.disable(node)
    expect(manager.selectedNode).to.be.null
  })
  it('disable with withChildren=true disables node and its children', () => {
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
    manager.disable(node, true)
    let enabledCount = 0
    manager.visitAll([node], x => {
      if (!x.states.disabled) {
        enabledCount += 1
      }
    })
    expect(enabledCount).to.be.eq(0)
  })
  it('disable with withChildren=true and selected child node disables node and its children and sets selectedNode=null', () => {
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
    const child = manager.getById(3)
    manager.setSelected(child)
    manager.disable(node, true)
    expect(manager.selectedNode).to.be.null
  })
  it('disableChildren with node=null throws Error', () => {
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
    expect(() => manager.disableChildren(null)).throw('parameter "node" is not set')
  })
  it('disableChildren disables all node children', () => {
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
    manager.disableChildren(node)
    let enabledCount = 0
    manager.visitAll(node.children, x => {
      if (!x.states.disabled) {
        enabledCount += 1
      }
    })
    expect(enabledCount).to.be.eq(0)
    expect(node.states.disabled).to.be.false
  })
  it('disableChildren with selected child node disables node and its children and sets selectedNode=null', () => {
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
    const child = manager.getById(3)
    manager.setSelected(child)
    manager.disableChildren(node)
    expect(manager.selectedNode).to.be.null
  })
  it('disableAll disables all nodes', () => {
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
    manager.disableAll()
    let enabledCount = 0
    manager.visitAll(manager.items, x => {
      if (!x.states.disabled) {
        enabledCount += 1
      }
    })
    expect(enabledCount).to.be.eq(0)
  })
  it('disableAll with selected node disables all nodes and sets selectedNode=null', () => {
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
    manager.setSelected(node)
    manager.disableAll()
    expect(manager.selectedNode).to.be.null
  })
  it('enable with node=null throws Error', () => {
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
    expect(() => manager.enable(null)).throw('parameter "node" is not set')
  })
  it('enable enables node', () => {
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
    manager.enable(node)
    expect(node.states.disabled).to.be.false
  })
  it('enable with withChildren=true enables node and its children', () => {
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
        name: 'child2',
        disabled: true
      }]
    }]
    const manager = getNodeManager(nodes)
    const node = manager.getById(1)
    manager.enable(node, true)
    let disabledCount = 0
    manager.visitAll([node], x => {
      if (x.states.disabled) {
        disabledCount += 1
      }
    })
    expect(disabledCount).to.be.eq(0)
  })
  it('enableChildren with node=null throws Error', () => {
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
    expect(() => manager.enableChildren(null)).throw('parameter "node" is not set')
  })
  it('enableChildren enables all node children', () => {
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
        name: 'child2',
        disabled: true
      }]
    }]
    const manager = getNodeManager(nodes)
    const node = manager.getById(1)
    manager.enableChildren(node)
    let disabledCount = 0
    manager.visitAll(node.children, x => {
      if (x.states.disabled) {
        disabledCount += 1
      }
    })
    expect(disabledCount).to.be.eq(0)
    expect(node.states.disabled).to.be.true
  })
  it('enableAll enables all nodes', () => {
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
        name: 'child2',
        disabled: true
      }]
    }]
    const manager = getNodeManager(nodes)
    manager.enableAll()
    let disabledCount = 0
    manager.visitAll(manager.items, x => {
      if (x.states.disabled) {
        disabledCount += 1
      }
    })
    expect(disabledCount).to.be.eq(0)
  })
  it('setCheckboxStyle with node=null throws Error', () => {
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
    expect(() => manager.setCheckboxStyle(null)).throw('parameter "node" is not set')
  })
  it('setCheckboxStyle sets checkbox style for node', () => {
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
    manager.setCheckboxStyle(node, 'test-class')
    expect(node.styleClasses.checkbox).to.be.eq('test-class')
  })
  it('setCheckboxStyle with withChildren=true sets checkbox style for node and its children', () => {
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
    manager.setCheckboxStyle(node, 'test-class', true)
    let nodesWithoutStyle = 0
    manager.visitAll([node], x => {
      if (x.styleClasses.checkbox == null || x.styleClasses.checkbox !== 'test-class') {
        nodesWithoutStyle += 1
      }
    })
    expect(nodesWithoutStyle).to.be.eq(0)
  })
  it('setTextStyle with node=null throws Error', () => {
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
    expect(() => manager.setTextStyle(null)).throw('parameter "node" is not set')
  })
  it('setTextStyle sets text style for node', () => {
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
    manager.setTextStyle(node, 'test-class')
    expect(node.styleClasses.text).to.be.eq('test-class')
  })
  it('setTextStyle with withChildren=true sets text style for node and its children', () => {
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
    manager.setTextStyle(node, 'test-class', true)
    let nodesWithoutStyle = 0
    manager.visitAll([node], x => {
      if (x.styleClasses.text == null || x.styleClasses.text !== 'test-class') {
        nodesWithoutStyle += 1
      }
    })
    expect(nodesWithoutStyle).to.be.eq(0)
  })
  it('setIconStyle with node=null throws Error', () => {
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
    expect(() => manager.setIconStyle(null)).throw('parameter "node" is not set')
  })
  it('setIconStyle sets icon style for node', () => {
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
    manager.setIconStyle(node, 'test-class')
    expect(node.styleClasses.icon).to.be.eq('test-class')
  })
  it('setIconStyle with withChildren=true sets icon style for node and its children', () => {
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
    manager.setIconStyle(node, 'test-class', true)
    let nodesWithoutStyle = 0
    manager.visitAll([node], x => {
      if (x.styleClasses.icon == null || x.styleClasses.icon !== 'test-class') {
        nodesWithoutStyle += 1
      }
    })
    expect(nodesWithoutStyle).to.be.eq(0)
  })
  it('setExpanderStyle with node=null throws Error', () => {
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
    expect(() => manager.setExpanderStyle(null)).throw('parameter "node" is not set')
  })
  it('setExpanderStyle sets expander style for node', () => {
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
    manager.setExpanderStyle(node, 'test-class')
    expect(node.styleClasses.expander).to.be.eq('test-class')
  })
  it('setExpanderStyle with withChildren=true sets expander style for node and its children', () => {
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
    manager.setExpanderStyle(node, 'test-class', true)
    let nodesWithoutStyle = 0
    manager.visitAll([node], x => {
      if (x.styleClasses.expander == null || x.styleClasses.expander !== 'test-class') {
        nodesWithoutStyle += 1
      }
    })
    expect(nodesWithoutStyle).to.be.eq(0)
  })
  it('sort sorts all nodes', () => {
    const nodes = [{
      id: 1,
      name: 'node2',
      children: [{
        id: 3,
        name: 'child2'
      }, {
        id: 4,
        name: 'child1'
      }]
    }, {
      id: 2,
      name: 'node1'
    }]
    const manager = getNodeManager(nodes)
    manager.sort()
    expect(manager.items[0].id).to.be.eq(2)
    expect(manager.items[1].id).to.be.eq(1)
    expect(manager.items[1].children[0].id).to.be.eq(4)
    expect(manager.items[1].children[1].id).to.be.eq(3)
  })
  it('sort with comparator by id prop sorts all nodes by id', () => {
    const nodes = [{
      id: 2,
      name: 'node2',
      children: [{
        id: 4,
        name: 'child2'
      }, {
        id: 3,
        name: 'child1'
      }]
    }, {
      id: 1,
      name: 'node1'
    }]
    const manager = getNodeManager(nodes)
    manager.sort((item1, item2) => item1.id - item2.id)
    expect(manager.items[0].id).to.be.eq(1)
    expect(manager.items[1].id).to.be.eq(2)
    expect(manager.items[1].children[0].id).to.be.eq(3)
    expect(manager.items[1].children[1].id).to.be.eq(4)
  })
  it('setNodes with items=null throws Error', () => {
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
    expect(() => manager.setNodes(null)).throw('parameter "items" is not set')
  })
  it('setNodes sets nodes to new items', () => {
    const items = [{
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
    const anotherItems = [{
      id: 10,
      name: 'node10',
      children: [{
        id: 11,
        name: 'child11'
      }, {
        id: 14,
        name: 'child12'
      }]
    }, {
      id: 15,
      name: 'node15'
    }]
    const manager = getNodeManager(items)
    manager.setNodes(anotherItems)
    const anotherNodeIdList = []
    manager.visitAll(manager.items, x => {
      anotherNodeIdList.push(x.id)
    })
    expect(anotherNodeIdList).to.be.members([10, 11, 14, 15])
  })
  it('setNodes with treeOptions.autoSort=true sets nodes to new items and sorts them', () => {
    const items = [{
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
    const anotherItems = [{
      id: 10,
      name: 'node15',
      children: [{
        id: 11,
        name: 'child12'
      }, {
        id: 14,
        name: 'child11'
      }]
    }, {
      id: 15,
      name: 'node10'
    }]
    const manager = getNodeManager(items, {
      autoSort: true
    })
    manager.setNodes(anotherItems)
    expect(manager.items[0].id).to.be.eq(15)
    expect(manager.items[1].id).to.be.eq(10)
    expect(manager.items[1].children[0].id).to.be.eq(14)
    expect(manager.items[1].children[1].id).to.be.eq(11)
  })
})
