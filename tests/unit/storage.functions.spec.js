/* eslint-disable no-unused-expressions */
import { expect } from 'chai'
import { mount } from '@vue/test-utils'
import Tree from '@/components/TreeVue.vue'

describe('storage functions', () => {
  function getStorage (items, options = {}) {
    const wrapper = mount(Tree, {
      propsData: { items, options }
    })

    return wrapper.vm.storage
  }
  it('initialize with treeOptions=null throws Error', () => {
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
    const storage = getStorage(nodes, options)

    expect(() => storage.initialize(null)).throw('parameter "treeOptions" is not set')
  })
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
    const storage = getStorage(nodes, options)
    const checkedNodes = storage.getChecked()
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
    const storage = getStorage(nodes, options)
    storage.checkAll()
    const checkedNodes = storage.getChecked()
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
    const storage = getStorage(nodes, options)
    storage.checkVisible()
    const checkedNodes = storage.getChecked()
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
    const storage = getStorage(nodes, options)
    storage.checkVisible()
    const checkedNodes = storage.getChecked()
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
    const storage = getStorage(nodes, options)
    storage.uncheckAll()
    const checkedNodes = storage.getChecked()
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
    const storage = getStorage(nodes, options)
    storage.uncheckVisible()
    const checkedNodes = storage.getChecked()
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
    const storage = getStorage(nodes, options)
    storage.uncheckVisible()
    const checkedNodes = storage.getChecked()
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
    const storage = getStorage(nodes, options)
    const node = storage.getById(1)
    storage.expand(node)
    expect(node.states.open).to.be.true
    expect(node.children[0].states.open).to.be.false
  })
  it('expand with node=null throws Error', () => {
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
    const storage = getStorage(nodes, options)

    expect(() => storage.expand(null)).throw('parameter "node" is not set')
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
    const storage = getStorage(nodes, options)
    const node = storage.getById(1)
    storage.expand(node, true)
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
    const storage = getStorage(nodes, options)
    const node = storage.getById(1)
    storage.expandChildren(node)
    expect(node.states.open).to.be.false
    expect(node.children[0].states.open).to.be.true
  })
  it('expandChildren with node=null throws Error', () => {
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
    const storage = getStorage(nodes, options)

    expect(() => storage.expandChildren(null)).throw('parameter "node" is not set')
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
    const storage = getStorage(nodes, options)
    const node = storage.getById(1)
    storage.collapse(node)
    expect(node.states.open).to.be.false
    expect(node.children[0].states.open).to.be.true
  })
  it('collapse with node=null throws Error', () => {
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
    const storage = getStorage(nodes, options)

    expect(() => storage.collapse(null)).throw('parameter "node" is not set')
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
    const storage = getStorage(nodes, options)
    const node = storage.getById(1)
    storage.collapse(node, true)
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
    const storage = getStorage(nodes, options)
    const node = storage.getById(1)
    storage.collapseChildren(node)
    expect(node.states.open).to.be.true
    expect(node.children[0].states.open).to.be.false
  })
  it('collapseChildren with node=null throws Error', () => {
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
    const storage = getStorage(nodes, options)

    expect(() => storage.collapseChildren(null)).throw('parameter "node" is not set')
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
    const storage = getStorage(nodes, options)
    storage.expandAll()
    expect(storage.getById(1).states.open).to.be.true
    expect(storage.getById(3).states.open).to.be.true
    expect(storage.getById(2).states.open).to.be.true
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
    const storage = getStorage(nodes, options)
    storage.collapseAll()
    expect(storage.getById(1).states.open).to.be.false
    expect(storage.getById(3).states.open).to.be.false
    expect(storage.getById(2).states.open).to.be.false
  })
  it('collapseAll with selected child node collapses all nodes and sets selected node = null', () => {
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
    const storage = getStorage(nodes, options)
    const childNode = storage.getById(3)
    storage.setSelected(childNode)
    storage.collapseAll()
    expect(storage.getById(1).states.open).to.be.false
    expect(storage.getById(3).states.open).to.be.false
    expect(storage.getById(2).states.open).to.be.false
    expect(storage.selectedNode).to.be.null
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
    const storage = getStorage(nodes, options)
    storage.collapseAll()
    expect(storage.getById(1).id).to.be.eq(1)
    expect(storage.getById(3).id).to.be.eq(3)
    expect(storage.getById(6).id).to.be.eq(6)
    expect(storage.getById(4).id).to.be.eq(4)
    expect(storage.getById(2).id).to.be.eq(2)
    expect(storage.getById(8).id).to.be.eq(8)
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
    const storage = getStorage(nodes, options)
    const foundNode = storage.findOne(x => x.item.name.indexOf('test') !== -1)
    expect(foundNode.id).to.be.eq(1)
    const foundChild = storage.findOne(x => x.item.name.indexOf('grand') !== -1)
    expect(foundChild.id).to.be.eq(6)
  })
  it('findOne with selector=null throws Error', () => {
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
    const storage = getStorage(nodes, options)
    expect(() => storage.findOne(null)).throw('parameter "selector" is not set')
  })
  it('findOne with selector !== function throws Error', () => {
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
    const storage = getStorage(nodes, options)
    expect(() => storage.findOne('test')).throw('parameter "selector" is not a function')
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
    const storage = getStorage(nodes, options)
    const foundNodes = storage.findAll(x => x.item.name.indexOf('test') !== -1)
    expect(foundNodes).to.be.lengthOf(3)
    expect(foundNodes.map(x => x.id)).to.be.members([1, 2, 5])
    const foundChildren = storage.findAll(x => x.item.name.indexOf('grand') !== -1)
    expect(foundChildren).to.be.lengthOf(3)
    expect(foundChildren.map(x => x.id)).to.be.members([6, 9, 8])
  })
  it('findAll with selector=null throws Error', () => {
    const nodes = [{
      id: 1,
      name: 'test'
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
    const storage = getStorage(nodes, options)
    expect(() => storage.findAll(null)).throw('parameter "selector" is not set')
  })
  it('findAll with selector !== function throws Error', () => {
    const nodes = [{
      id: 1,
      name: 'test'
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
    const storage = getStorage(nodes, options)
    expect(() => storage.findAll('test')).throw('parameter "selector" is not a function')
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
    const storage = getStorage(nodes, options)
    const grandChild = storage.getById(6)
    const foundGrandParent = storage.findParent(grandChild, x => x.item.name.indexOf('grandparent') !== -1)
    expect(foundGrandParent.id).to.be.eq(1)
    const foundParent = storage.findParent(grandChild, x => x.item.name.indexOf('parent') !== -1)
    expect(foundParent.id).to.be.eq(3)
  })
  it('findParent with node=null throws Error', () => {
    const nodes = [{
      id: 1,
      name: 'grandparent'
    }, {
      id: 2,
      name: 'parent2'
    }, {
      id: 5,
      name: 'test3'
    }]
    const options = {
      checkOnSelect: false
    }
    const storage = getStorage(nodes, options)

    expect(() => storage.findParent(null, x => x.item.name.indexOf('grandparent') !== -1)).throw('parameter "node" is not set')
  })
  it('findParent with selector=null throws Error', () => {
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
      name: 'parent2'
    }, {
      id: 5,
      name: 'test3'
    }]
    const options = {
      checkOnSelect: false
    }
    const storage = getStorage(nodes, options)
    const grandChild = storage.getById(6)

    expect(() => storage.findParent(grandChild, null)).throw('parameter "selector" is not set')
  })
  it('findParent with selector !== function throws Error', () => {
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
      name: 'parent2'
    }, {
      id: 5,
      name: 'test3'
    }]
    const options = {
      checkOnSelect: false
    }
    const storage = getStorage(nodes, options)
    const grandChild = storage.getById(6)

    expect(() => storage.findParent(grandChild, 'test')).throw('parameter "selector" is not a function')
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
    const storage = getStorage(nodes, options)
    const grandChild = storage.getById(6)
    const foundGrandParents = storage.findParents(grandChild, x => x.item.name.indexOf('grandparent') !== -1)
    expect(foundGrandParents).to.be.lengthOf(1)
    expect(foundGrandParents[0].id).to.be.eq(1)
    const foundParents = storage.findParents(grandChild, x => x.item.name.indexOf('parent') !== -1)
    expect(foundParents).to.be.lengthOf(2)
    expect(foundParents[0].id).to.be.eq(3)
    expect(foundParents[1].id).to.be.eq(1)
  })
  it('findParents with node=null throws Error', () => {
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
    const storage = getStorage(nodes, options)
    expect(() => storage.findParents(null, x => x.item.name.indexOf('grandparent') !== -1)).throw('parameter "node" is not set')
  })
  it('findParents with selector=null throws Error', () => {
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
    const storage = getStorage(nodes, options)
    const grandChild = storage.getById(6)
    expect(() => storage.findParents(grandChild, null)).throw('parameter "selector" is not set')
  })
  it('findParents with selector !== function throws Error', () => {
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
    const storage = getStorage(nodes, options)
    const grandChild = storage.getById(6)
    expect(() => storage.findParents(grandChild, 'test')).throw('parameter "selector" is not a function')
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
    const storage = getStorage(nodes, options)
    const node = storage.getById(2)
    storage.setSelected(node)
    expect(storage.selectedNode).to.be.eq(node)
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
    const storage = getStorage(nodes, options)
    const node = storage.getById(4)
    storage.setSelected(node)
    expect(storage.selectedNode).to.be.eq(node)
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
    const storage = getStorage(nodes, options)
    const node = storage.getById(1)
    storage.setSelected(node)
    expect(storage.selectedNode).to.be.eq(node)
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
    const storage = getStorage(nodes)
    storage.filter('test')
    const visibleNodes = storage.getVisible()
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
    const storage = getStorage(nodes)
    expect(() => storage.filter(null)).throw('parameter "searchObject" is not set')
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
    const storage = getStorage(nodes)
    const matchedNodes = storage.filter('node')
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
    const storage = getStorage(nodes)

    storage.filter('node')

    expect(storage.options.inSearch).to.be.true
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
    const storage = getStorage(nodes)
    storage.filter('node')

    storage.clearFilter()

    expect(storage.options.inSearch).to.be.false
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
    const storage = getStorage(nodes)
    const matchedNodes = storage.filter(/node[12]/)
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
    const storage = getStorage(nodes)
    const matchedNodes = storage.filter(x => x.name.indexOf('node') !== -1 && x.id > 1)
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
    const storage = getStorage(nodes)
    const matchedNodes = storage.filter('NODE')
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
    const storage = getStorage(nodes)
    storage.filter('child')
    const visibleNodes = storage.getVisible()
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
    const storage = getStorage(nodes)
    storage.filter('node', { showChildren: true })
    const visibleNodes = storage.getVisible()
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
    const storage = getStorage(nodes)
    storage.filter('child1')
    storage.clearFilter()
    const visibleNodes = storage.getVisible()
    expect(visibleNodes).to.be.lengthOf(3)
    expect(visibleNodes.map(x => x.id)).to.have.members([1, 2, 5])
  })
  it('clearFilter does nothing if no filter was applied', () => {
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
      open: true,
      children: [{
        id: 8,
        name: 'child3'
      }]
    }, {
      id: 5,
      name: 'node3'
    }]
    const storage = getStorage(nodes)
    storage.clearFilter()
    const visibleNodes = storage.getVisible()
    expect(visibleNodes).to.be.lengthOf(7)
    expect(visibleNodes.map(x => x.id)).to.have.members([1, 3, 9, 4, 2, 8, 5])
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
    const storage = getStorage(nodes)
    const visitedNodes = []
    storage.visitAll(storage.nodes, x => { visitedNodes.push(x.id) })
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
    const storage = getStorage(nodes)
    const visitedNodes = []
    storage.visitAll(storage.nodes, x => { visitedNodes.push(x.id) }, true)
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
    const storage = getStorage(nodes)
    const visitedNodes = []
    expect(() => storage.visitAll(null, x => { visitedNodes.push(x.id) })).throw('parameter "nodes" is not set')
  })
  it('visitAll with null in passed node array throws Error', () => {
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
    const storage = getStorage(nodes)
    const visitedNodes = []
    expect(() => storage.visitAll([null], x => { visitedNodes.push(x.id) })).throw('parameter "node" is not set')
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
    const storage = getStorage(nodes)
    expect(() => storage.visitAll(storage.nodes, null)).throw('parameter "nodeCallback" is not set')
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
    const storage = getStorage(nodes)
    const node = storage.getById(1)
    const visitedNodes = []
    storage.visitAll([node], item => {
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
    const storage = getStorage(nodes)

    expect(() => storage.setCheckState(null, true)).throw('parameter "node" is not set')
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
    const storage = getStorage(nodes)
    const node = storage.getById(1)
    storage.setCheckState(node, true)
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
    const storage = getStorage(nodes)
    const node = storage.getById(1)
    storage.setCheckState(node, false)
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
    const storage = getStorage(nodes)
    const node = storage.getById(1)
    storage.setCheckState(node, true, true)
    const checkedNodes = storage.getChecked()
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
    const storage = getStorage(nodes, { checkMode: 'linked' })
    const node = storage.getById(1)
    storage.setCheckState(node, true)
    const checkedNodes = storage.getChecked()
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
    const storage = getStorage(nodes, { checkMode: 'linked' })
    const node = storage.getById(8)
    storage.setCheckState(node, true)
    const checkedNodes = storage.getChecked()
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
    const storage = getStorage(nodes, { checkMode: 'linked' })
    const node = storage.getById(8)
    storage.setCheckState(node, false)
    const checkedNodes = storage.getChecked()
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
    const storage = getStorage(nodes)
    const node = storage.getById(1)
    storage.check(node)
    expect(node.states.checked).to.be.true
  })
  it('check checks child node only with options.checkMode="linked" and collapsed parent node', () => {
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
    const storage = getStorage(nodes, {
      checkMode: 'linked'
    })
    const node = storage.getById(3)
    const parentNode = storage.getById(1)
    storage.check(node)
    expect(node.states.checked).to.be.true
    expect(parentNode.states.checked).to.be.false
  })
  it('check with options.checkMode="linked" checks child node and set open parent node check state to indeterminate', () => {
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
          name: 'grandchild1',
          checked: true,
          open: true
        }, {
          id: 10,
          name: 'grandchild2'
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
    const storage = getStorage(nodes, {
      checkMode: 'linked'
    })
    const node = storage.getById(4)
    const parentNode = storage.getById(1)
    storage.check(node)
    expect(node.states.checked).to.be.true
    expect(parentNode.indeterminate()).to.be.true
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
    const storage = getStorage(nodes)

    expect(() => storage.check(null)).throw('parameter "node" is not set')
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
    const storage = getStorage(nodes)
    const node = storage.getById(1)
    storage.check(node, true)
    const checkedNodes = storage.getChecked()
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
    const storage = getStorage(nodes)
    const node = storage.getById(1)
    storage.checkChildren(node)
    const checkedNodes = storage.getChecked()
    expect(checkedNodes).to.be.lengthOf(3)
    expect(checkedNodes.map(x => x.id)).to.be.members([3, 9, 4])
  })
  it('checkChildren with options.checkMode="linked" checks specified node children and node itself', () => {
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
    const storage = getStorage(nodes, {
      checkMode: 'linked'
    })
    const node = storage.getById(1)
    storage.checkChildren(node)
    const checkedNodes = storage.getChecked()
    expect(checkedNodes).to.be.lengthOf(4)
    expect(checkedNodes.map(x => x.id)).to.be.members([1, 3, 9, 4])
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
    const storage = getStorage(nodes)

    expect(() => storage.checkChildren(null)).throw('parameter "node" is not set')
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
    const storage = getStorage(nodes)
    const node = storage.getById(1)
    storage.uncheck(node)
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
    const storage = getStorage(nodes)

    expect(() => storage.uncheck(null)).throw('parameter "node" is not set')
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
    const storage = getStorage(nodes)
    const node = storage.getById(1)
    storage.uncheck(node, true)
    const checkedNodes = storage.getChecked()
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
    const storage = getStorage(nodes)
    const node = storage.getById(1)
    storage.uncheckChildren(node)
    const checkedNodes = storage.getChecked()
    expect(checkedNodes.map(x => x.id)).to.be.members([1])
  })
  it('uncheckChildren with options.checkMode="linked" unchecks specified node children and node itself', () => {
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
    const storage = getStorage(nodes, {
      checkMode: 'linked'
    })
    const node = storage.getById(1)
    storage.uncheckChildren(node)
    const checkedNodes = storage.getChecked()
    expect(checkedNodes.map(x => x.id)).to.be.empty
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
    const storage = getStorage(nodes)

    expect(() => storage.uncheckChildren(null)).throw('parameter "node" is not set')
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
    const storage = getStorage(nodes)
    const node = storage.getById(3)
    expect(storage.getVisibility(node)).to.be.false
  })
  it('getVisibility with null throws Error', () => {
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
    const storage = getStorage(nodes)
    expect(() => storage.getVisibility(null)).throw('parameter "node" is not set')
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
    const storage = getStorage(nodes)
    const node = storage.getById(3)
    expect(storage.getVisibility(node)).to.be.true
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
    const storage = getStorage(nodes)
    const node = storage.getById(1)
    storage.setOpenState(node, true)
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
    const storage = getStorage(nodes)
    const node = storage.getById(1)
    storage.setOpenState(node, false)
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
    const storage = getStorage(nodes)
    const node = storage.getById(1)
    storage.setOpenState(node, true, true)
    expect(node.states.open).to.be.true
    expect(storage.getById(3).states.open).to.be.true
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
    const storage = getStorage(nodes)
    const node = storage.getById(1)
    storage.setOpenState(node, false, true)
    expect(node.states.open).to.be.false
    expect(storage.getById(3).states.open).to.be.false
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
    const storage = getStorage(nodes)

    expect(() => storage.setOpenState(null, true)).throw('parameter "node" is not set')
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
    const storage = getStorage(nodes)
    const node = storage.getById(9)
    storage.showNode(node)
    expect(node.visible()).to.be.true
    expect(storage.getById(1).states.open).to.be.true
    expect(storage.getById(3).states.open).to.be.true
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
    const storage = getStorage(nodes)

    expect(() => storage.showNode(null)).throw('parameter "node" is not set')
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
    const storage = getStorage(nodes)
    const node = storage.getById(9)
    const visitedNodes = []
    storage.visitAllParents(node, x => { visitedNodes.push(x.id) })
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
    const storage = getStorage(nodes)

    expect(() => storage.visitAllParents(null, x => true)).throw('parameter "node" is not set')
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
    const storage = getStorage(nodes)
    const node = storage.getById(9)

    expect(() => storage.visitAllParents(node, null)).throw('parameter "nodeCallback" is not set')
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
    const storage = getStorage(nodes)
    const node = storage.getById(9)
    const visitedNodes = []
    storage.visitAllParents(node, item => {
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
    const storage = getStorage(nodes)
    const node = storage.getById(1)
    const visitedNodes = []
    storage.visitAllParents(node, item => {
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
    const storage = getStorage(nodes)
    const node = storage.getById(1)
    expect(storage.getName(node)).to.be.eq('node1')
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
    const storage = getStorage(nodes, {
      nameProp: 'title'
    })
    const node = storage.getById(1)
    expect(storage.getName(node)).to.be.eq(node.item.title)
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
    const storage = getStorage(nodes, {
      nameProp: item => item.name + ':' + item.id
    })
    const node = storage.getById(1)
    expect(storage.getName(node)).to.be.eq('node1:1')
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
    const storage = getStorage(nodes)

    expect(() => storage.getName(null)).throw('parameter "node" is not set')
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
    const storage = getStorage(nodes)
    const node = storage.getById(1)
    expect(storage.getEditName(node)).to.be.eq('node1')
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
    const storage = getStorage(nodes, {
      editNameProp: 'id'
    })
    const node = storage.getById(1)
    expect(storage.getEditName(node)).to.be.eq(node.id)
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
    const storage = getStorage(nodes, {
      editNameProp: item => item.name
    })
    const node = storage.getById(1)
    expect(() => storage.getEditName(node)).throw('"editNameProp" cannot be function')
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
    const storage = getStorage(nodes)

    expect(() => storage.getEditName(null)).throw('parameter "node" is not set')
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
    const storage = getStorage(nodes)

    expect(() => storage.setName(null)).throw('parameter "node" is not set')
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
    const storage = getStorage(nodes, {
      editNameProp: item => item.name
    })
    const node = storage.getById(1)
    expect(() => storage.setName(node, '111')).throw('"editNameProp" cannot be function')
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
    const storage = getStorage(nodes)
    const node = storage.getById(1)

    expect(() => storage.setName(node, null)).throw('parameter "newName" is not set')
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
    const storage = getStorage(nodes)
    const node = storage.getById(1)
    storage.setName(node, 'test1')
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
    const storage = getStorage(nodes, {
      editNameProp: 'title'
    })
    const node = storage.getById(1)
    storage.setName(node, 'test1')
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
    const storage = getStorage(nodes, {
      setNameFunc: (item, newName) => {
        item.title = newName
      }
    })
    const node = storage.getById(1)
    storage.setName(node, 'test1')
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
    const storage = getStorage(nodes, {
      setNameFunc: 'title'
    })
    const node = storage.getById(1)

    expect(() => storage.setName(node, 'test1')).throw('"setNameFunc" must be function')
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
    const storage = getStorage(nodes)

    expect(() => storage.getChildren(null)).throw('parameter "item" is not set')
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
    const storage = getStorage(nodes)

    expect(storage.getChildren(nodes[0])).to.be.eq(nodes[0].children)
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
    const storage = getStorage(nodes, {
      childrenProp: 'kids'
    })

    expect(storage.getChildren(nodes[0])).to.be.eq(nodes[0].kids)
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
    const storage = getStorage(nodes, {
      childrenProp: item => item.kids
    })

    expect(storage.getChildren(nodes[0])).to.be.eq(nodes[0].kids)
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
    const storage = getStorage(nodes)

    expect(() => storage.addChild(null)).throw('parameter "parent" is not set')
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
    const storage = getStorage(nodes)
    const node = storage.getById(1)

    expect(() => storage.addChild(node, null)).throw('parameter "item" is not set')
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
    const storage = getStorage(nodes)
    const node = storage.getById(1)
    const newChildItem = {
      id: 5,
      name: 'child3'
    }
    const newChild = storage.addChild(node, newChildItem)
    expect(newChild).to.be.not.null
    expect(newChild.parent).to.be.eq(node)
    expect(node.children).to.be.lengthOf(3)
    expect(node.children[2]).to.be.eq(newChild)
    expect(newChild.item).to.be.eq(newChildItem)
    expect(newChild.prev.id).to.be.eq(4)
    expect(newChild.next).to.be.null
    expect(storage.getById(4).next.id).to.be.eq(5)
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
    const storage = getStorage(nodes, {
      autoSort: true
    })
    const node = storage.getById(1)
    const newChildItem = {
      id: 5,
      name: 'child0'
    }
    const newChild = storage.addChild(node, newChildItem)
    expect(newChild).to.be.not.null
    expect(newChild.parent).to.be.eq(node)
    expect(node.children).to.be.lengthOf(3)
    expect(node.children[0]).to.be.eq(newChild)
    expect(newChild.item).to.be.eq(newChildItem)
    expect(newChild.prev).to.be.null
    expect(newChild.next.id).to.be.eq(3)
    expect(storage.getById(3).prev.id).to.be.eq(5)
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
    const storage = getStorage(nodes)

    expect(() => storage.insertChild(null)).throw('parameter "parent" is not set')
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
    const storage = getStorage(nodes)
    const node = storage.getById(1)

    expect(() => storage.insertChild(node, null)).throw('parameter "item" is not set')
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
    const storage = getStorage(nodes)
    const node = storage.getById(1)
    const newChildItem = {
      id: 5,
      name: 'child3'
    }
    const newChild = storage.insertChild(node, newChildItem)
    expect(newChild).to.be.not.null
    expect(newChild.parent).to.be.eq(node)
    expect(node.children).to.be.lengthOf(3)
    expect(node.children[0]).to.be.eq(newChild)
    expect(newChild.item).to.be.eq(newChildItem)
    expect(newChild.prev).to.be.null
    expect(newChild.next.id).to.be.eq(3)
    expect(storage.getById(3).prev.id).to.be.eq(5)
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
    const storage = getStorage(nodes)
    const node = storage.getById(1)
    const child = storage.getById(4)
    const newChildItem = {
      id: 5,
      name: 'child3'
    }
    const newChild = storage.insertChild(node, newChildItem, child)
    expect(newChild).to.be.not.null
    expect(newChild.parent).to.be.eq(node)
    expect(node.children).to.be.lengthOf(3)
    expect(node.children[1]).to.be.eq(newChild)
    expect(newChild.item).to.be.eq(newChildItem)
    expect(newChild.prev.id).to.be.eq(3)
    expect(newChild.next.id).to.be.eq(4)
    expect(storage.getById(3).next.id).to.be.eq(5)
    expect(storage.getById(4).prev.id).to.be.eq(5)
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
    const storage = getStorage(nodes, {
      autoSort: true
    })
    const node = storage.getById(1)
    const child = storage.getById(4)
    const newChildItem = {
      id: 5,
      name: 'child0'
    }
    const newChild = storage.insertChild(node, newChildItem, child)
    expect(newChild).to.be.not.null
    expect(newChild.parent).to.be.eq(node)
    expect(node.children).to.be.lengthOf(3)
    expect(node.children[0]).to.be.eq(newChild)
    expect(newChild.item).to.be.eq(newChildItem)
    expect(newChild.prev).to.be.null
    expect(newChild.next.id).to.be.eq(3)
    expect(storage.getById(3).prev.id).to.be.eq(5)
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
    const storage = getStorage(nodes)

    expect(() => storage.remove(null)).throw('parameter "node" is not set')
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
    const storage = getStorage(nodes, {
      childrenProp: item => item.children
    })

    const node = storage.getById(3)
    expect(() => storage.remove(node)).throw('cannot remove the child item while "childrenProp" is a function')
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
    const storage = getStorage(nodes)
    const node = storage.getById(1)

    storage.remove(node)

    expect(storage.nodes).to.be.empty
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
    const storage = getStorage(nodes)
    const node = storage.getById(3)
    const nextNode = node.next

    storage.remove(node)

    expect(storage.getById(1).children).to.be.lengthOf(1)
    expect(storage.getById(1).item.children).to.be.lengthOf(1)
    expect(storage.getById(1).children[0].id).to.be.eq(4)
    expect(storage.getById(1).item.children[0].id).to.be.eq(4)
    expect(nextNode.prev).to.be.null
  })
  it('remove with child node removes node and relinks prev child node and next child node to each other', () => {
    const nodes = [{
      id: 1,
      name: 'node1',
      children: [{
        id: 3,
        name: 'child1'
      }, {
        id: 4,
        name: 'child2'
      }, {
        id: 5,
        name: 'child3'
      }]
    }]
    const storage = getStorage(nodes)
    const node = storage.getById(4)
    const prevNode = storage.getById(3)
    const nextNode = storage.getById(5)

    storage.remove(node)

    expect(storage.getById(1).children).to.be.lengthOf(2)
    expect(storage.getById(1).item.children).to.be.lengthOf(2)
    expect(storage.getById(1).children[0].id).to.be.eq(3)
    expect(storage.getById(1).item.children[0].id).to.be.eq(3)
    expect(nextNode.prev).to.be.eq(prevNode)
    expect(prevNode.next).to.be.eq(nextNode)
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
    const storage = getStorage(nodes)
    const node = storage.getById(1)
    storage.setSelected(node)
    storage.remove(node)
    expect(storage.selectedNode).to.be.null
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
    const storage = getStorage(nodes)
    const node = storage.getById(3)
    storage.setSelected(node)
    storage.remove(node)
    expect(storage.selectedNode).to.be.null
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
    const storage = getStorage(nodes)
    expect(() => storage.disable(null)).throw('parameter "node" is not set')
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
    const storage = getStorage(nodes)
    const node = storage.getById(1)
    storage.disable(node, false)
    expect(node.states.disabled).to.be.true
  })
  it('disable with omitted withChildren disables node', () => {
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
    storage.disable(node)
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
    const storage = getStorage(nodes)
    const node = storage.getById(1)
    storage.setSelected(node)
    storage.disable(node)
    expect(storage.selectedNode).to.be.null
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
    const storage = getStorage(nodes)
    const node = storage.getById(1)
    storage.disable(node, true)
    let enabledCount = 0
    storage.visitAll([node], x => {
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
    const storage = getStorage(nodes)
    const node = storage.getById(1)
    const child = storage.getById(3)
    storage.setSelected(child)
    storage.disable(node, true)
    expect(storage.selectedNode).to.be.null
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
    const storage = getStorage(nodes)
    expect(() => storage.disableChildren(null)).throw('parameter "node" is not set')
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
    const storage = getStorage(nodes)
    const node = storage.getById(1)
    storage.disableChildren(node)
    let enabledCount = 0
    storage.visitAll(node.children, x => {
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
    const storage = getStorage(nodes)
    const node = storage.getById(1)
    const child = storage.getById(3)
    storage.setSelected(child)
    storage.disableChildren(node)
    expect(storage.selectedNode).to.be.null
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
    const storage = getStorage(nodes)
    storage.disableAll()
    let enabledCount = 0
    storage.visitAll(storage.nodes, x => {
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
    const storage = getStorage(nodes)
    const node = storage.getById(1)
    storage.setSelected(node)
    storage.disableAll()
    expect(storage.selectedNode).to.be.null
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
    const storage = getStorage(nodes)
    expect(() => storage.enable(null)).throw('parameter "node" is not set')
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
    const storage = getStorage(nodes)
    const node = storage.getById(1)
    storage.enable(node, false)
    expect(node.states.disabled).to.be.false
  })
  it('enable with omitted withChldren enables node', () => {
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
    storage.enable(node)
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
    const storage = getStorage(nodes)
    const node = storage.getById(1)
    storage.enable(node, true)
    let disabledCount = 0
    storage.visitAll([node], x => {
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
    const storage = getStorage(nodes)
    expect(() => storage.enableChildren(null)).throw('parameter "node" is not set')
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
    const storage = getStorage(nodes)
    const node = storage.getById(1)
    storage.enableChildren(node)
    let disabledCount = 0
    storage.visitAll(node.children, x => {
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
    const storage = getStorage(nodes)
    storage.enableAll()
    let disabledCount = 0
    storage.visitAll(storage.nodes, x => {
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
    const storage = getStorage(nodes)
    expect(() => storage.setCheckboxStyle(null)).throw('parameter "node" is not set')
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
    const storage = getStorage(nodes)
    const node = storage.getById(1)
    storage.setCheckboxStyle(node, 'test-class')
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
    const storage = getStorage(nodes)
    const node = storage.getById(1)
    storage.setCheckboxStyle(node, 'test-class', true)
    let nodesWithoutStyle = 0
    storage.visitAll([node], x => {
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
    const storage = getStorage(nodes)
    expect(() => storage.setTextStyle(null)).throw('parameter "node" is not set')
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
    const storage = getStorage(nodes)
    const node = storage.getById(1)
    storage.setTextStyle(node, 'test-class')
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
    const storage = getStorage(nodes)
    const node = storage.getById(1)
    storage.setTextStyle(node, 'test-class', true)
    let nodesWithoutStyle = 0
    storage.visitAll([node], x => {
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
    const storage = getStorage(nodes)
    expect(() => storage.setIconStyle(null)).throw('parameter "node" is not set')
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
    const storage = getStorage(nodes)
    const node = storage.getById(1)
    storage.setIconStyle(node, 'test-class')
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
    const storage = getStorage(nodes)
    const node = storage.getById(1)
    storage.setIconStyle(node, 'test-class', true)
    let nodesWithoutStyle = 0
    storage.visitAll([node], x => {
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
    const storage = getStorage(nodes)
    expect(() => storage.setExpanderStyle(null)).throw('parameter "node" is not set')
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
    const storage = getStorage(nodes)
    const node = storage.getById(1)
    storage.setExpanderStyle(node, 'test-class')
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
    const storage = getStorage(nodes)
    const node = storage.getById(1)
    storage.setExpanderStyle(node, 'test-class', true)
    let nodesWithoutStyle = 0
    storage.visitAll([node], x => {
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
    const storage = getStorage(nodes)
    storage.sort()
    expect(storage.nodes[0].id).to.be.eq(2)
    expect(storage.nodes[1].id).to.be.eq(1)
    expect(storage.nodes[1].children[0].id).to.be.eq(4)
    expect(storage.nodes[1].children[1].id).to.be.eq(3)
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
    const storage = getStorage(nodes)
    storage.sort((item1, item2) => item1.id - item2.id)
    expect(storage.nodes[0].id).to.be.eq(1)
    expect(storage.nodes[1].id).to.be.eq(2)
    expect(storage.nodes[1].children[0].id).to.be.eq(3)
    expect(storage.nodes[1].children[1].id).to.be.eq(4)
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
    const storage = getStorage(nodes)
    expect(() => storage.setNodes(null)).throw('parameter "items" is not set')
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
    const storage = getStorage(items)
    storage.setNodes(anotherItems)
    const anotherNodeIdList = []
    storage.visitAll(storage.nodes, x => {
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
    const storage = getStorage(items, {
      autoSort: true
    })
    storage.setNodes(anotherItems)
    expect(storage.nodes[0].id).to.be.eq(15)
    expect(storage.nodes[1].id).to.be.eq(10)
    expect(storage.nodes[1].children[0].id).to.be.eq(14)
    expect(storage.nodes[1].children[1].id).to.be.eq(11)
  })
})
