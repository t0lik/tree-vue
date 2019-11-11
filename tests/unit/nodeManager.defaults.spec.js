/* eslint-disable no-unused-expressions */
import { expect } from 'chai'
import { mount } from '@vue/test-utils'
import Tree from '@/components/Tree.vue'

describe('nodeManager default item states', () => {
  function getNodeManager (nodes, options) {
    const wrapper = mount(Tree, {
      propsData: { nodes, options }
    })

    return wrapper.vm.nodeManager
  }
  it('item count equals source item count', () => {
    const nodes = [{
      id: 1,
      name: 'test'
    }, {
      id: 2,
      name: 'Test2'
    }]
    const options = {
      checkOnSelect: false
    }
    const manager = getNodeManager(nodes, options)
    expect(manager.items.length).to.be.eq(nodes.length)
  })
  it('node has source item prop that equals to source item', () => {
    const nodes = [{
      id: 1,
      name: 'test'
    }, {
      id: 2,
      name: 'Test2'
    }]
    const options = {
      checkOnSelect: false
    }
    const manager = getNodeManager(nodes, options)
    expect(manager.items[0].item).to.be.eq(nodes[0])
  })
  it('node has id equals to source item id', () => {
    const nodes = [{
      id: 1,
      name: 'test'
    }, {
      id: 2,
      name: 'Test2'
    }]
    const options = {
      checkOnSelect: false
    }
    const manager = getNodeManager(nodes, options)
    expect(manager.items[0].id).to.be.eq(nodes[0].id)
  })
  it('node has id not equals to source item id when idProp not equals to id prop in source item', () => {
    const nodes = [{
      id: 1,
      name: 'test'
    }, {
      id: 2,
      name: 'Test2'
    }]
    const options = {
      checkOnSelect: false,
      idProp: 'id2'
    }
    const manager = getNodeManager(nodes, options)
    expect(manager.items[0].id).to.be.not.eq(nodes[0].id)
  })
  it('first node has next prop equals to second one', () => {
    const nodes = [{
      id: 1,
      name: 'test'
    }, {
      id: 2,
      name: 'Test2'
    }]
    const options = {
      checkOnSelect: false
    }
    const manager = getNodeManager(nodes, options)
    expect(manager.items[0].next).to.be.eq(manager.items[1])
  })
  it('last node has next prop equals to null', () => {
    const nodes = [{
      id: 1,
      name: 'test'
    }, {
      id: 2,
      name: 'Test2'
    }]
    const options = {
      checkOnSelect: false
    }
    const manager = getNodeManager(nodes, options)
    expect(manager.items[1].next).to.be.null
  })
  it('second node has prev prop equals to first one', () => {
    const nodes = [{
      id: 1,
      name: 'test'
    }, {
      id: 2,
      name: 'Test2'
    }]
    const options = {
      checkOnSelect: false
    }
    const manager = getNodeManager(nodes, options)
    expect(manager.items[1].prev).to.be.eq(manager.items[0])
  })
  it('first node has prev prop equals to null', () => {
    const nodes = [{
      id: 1,
      name: 'test'
    }, {
      id: 2,
      name: 'Test2'
    }]
    const options = {
      checkOnSelect: false
    }
    const manager = getNodeManager(nodes, options)
    expect(manager.items[0].prev).to.be.null
  })
  it('child item has parent prop equals to its parent', () => {
    const nodes = [{
      id: 1,
      name: 'test',
      children: [{
        id: 4,
        name: 'child1'
      }]
    }, {
      id: 2,
      name: 'Test2'
    }]
    const options = {
      checkOnSelect: false
    }
    const manager = getNodeManager(nodes, options)
    expect(manager.getById(4).parent).to.be.not.null
    expect(manager.getById(4).parent).to.be.eq(manager.getById(1))
  })
  it('parent item has two children', () => {
    const nodes = [{
      id: 1,
      name: 'test',
      children: [{
        id: 4,
        name: 'child1'
      }, {
        id: 5,
        name: 'child2'
      }]
    }, {
      id: 2,
      name: 'Test2'
    }]
    const options = {
      checkOnSelect: false
    }
    const manager = getNodeManager(nodes, options)
    expect(manager.getById(1).children).to.be.not.null
    expect(manager.getById(1).children.length).to.be.eq(2)
    expect(manager.getById(1).children[0].id).to.be.eq(4)
    expect(manager.getById(1).children[1].id).to.be.eq(5)
  })
  it('item has default states', () => {
    const nodes = [{
      id: 1,
      name: 'test'
    }]
    const options = {
      checkOnSelect: false
    }
    const manager = getNodeManager(nodes, options)
    const node = manager.getById(1)
    expect(node).to.be.not.null
    expect(node.states).to.be.not.null
    expect(node.states.checked).to.be.false
    expect(node.states.disabled).to.be.false
    expect(node.states.open).to.be.false
    expect(node.states.visible).to.be.true
    expect(node.states.matched).to.be.false
  })
  it('all children have default states', () => {
    const nodes = [{
      id: 1,
      name: 'test',
      children: [{
        id: 2,
        name: 'child1'
      }, {
        id: 3,
        name: 'child2'
      }
      ]
    }]
    const options = {
      checkOnSelect: false
    }
    const manager = getNodeManager(nodes, options)
    const node = manager.getById(1)
    expect(node).to.be.not.null
    for (const child of node.children) {
      expect(child).to.deep.include({
        states: {
          checked: false,
          disabled: false,
          open: false,
          visible: true,
          matched: false
        }
      })
    }
  })
  it('item has default styleClasses', () => {
    const nodes = [{
      id: 1,
      name: 'test'
    }]
    const options = {
      checkOnSelect: false
    }
    const manager = getNodeManager(nodes, options)
    const node = manager.getById(1)
    expect(node).to.be.not.null
    expect(node.styleClasses).to.be.not.null
    expect(node.styleClasses.icon).to.be.null
    expect(node.styleClasses.text).to.be.null
    expect(node.styleClasses.checkbox).to.be.null
    expect(node.styleClasses.expander).to.be.null
  })
  it('item children have default styleClasses', () => {
    const nodes = [{
      id: 1,
      name: 'test'
    }]
    const options = {
      checkOnSelect: false
    }
    const manager = getNodeManager(nodes, options)
    const node = manager.getById(1)
    expect(node).to.be.not.null
    expect(node.children).to.be.not.null
    for (const child of node.children) {
      expect(child.styleClasses).to.be.not.null
      expect(child).to.deep.include({
        styleClasses: {
          icon: null,
          text: null,
          checkbox: null,
          expander: null
        }
      })
    }
  })
  it('item has default icon class', () => {
    const nodes = [{
      id: 1,
      name: 'test'
    }]
    const options = {
      checkOnSelect: false
    }
    const manager = getNodeManager(nodes, options)
    const node = manager.getById(1)
    expect(node).to.be.not.null
    expect(node.icon).to.be.null
  })
  it('item children have default icon class', () => {
    const nodes = [{
      id: 1,
      name: 'test'
    }]
    const options = {
      checkOnSelect: false
    }
    const manager = getNodeManager(nodes, options)
    const node = manager.getById(1)
    for (const child of node.children) {
      expect(child.icon).to.be.null
    }
  })
  it('checked item has states.checked === true', () => {
    const nodes = [{
      id: 1,
      name: 'test',
      checked: true
    }]
    const options = {
      checkOnSelect: false
    }
    const manager = getNodeManager(nodes, options)
    const node = manager.getById(1)
    expect(node).to.be.not.null
    expect(node.states).to.be.not.null
    expect(node.states.checked).to.be.true
    expect(node.states.disabled).to.be.false
    expect(node.states.open).to.be.false
    expect(node.states.visible).to.be.true
    expect(node.states.matched).to.be.false
  })
  it('disabled item has states.disabled === true', () => {
    const nodes = [{
      id: 1,
      name: 'test',
      disabled: true
    }]
    const options = {
      checkOnSelect: false
    }
    const manager = getNodeManager(nodes, options)
    const node = manager.getById(1)
    expect(node).to.be.not.null
    expect(node.states).to.be.not.null
    expect(node.states.checked).to.be.false
    expect(node.states.disabled).to.be.true
    expect(node.states.open).to.be.false
    expect(node.states.visible).to.be.true
    expect(node.states.matched).to.be.false
  })
  it('open item has states.open === true', () => {
    const nodes = [{
      id: 1,
      name: 'test',
      open: true
    }]
    const options = {
      checkOnSelect: false
    }
    const manager = getNodeManager(nodes, options)
    const node = manager.getById(1)
    expect(node).to.be.not.null
    expect(node.states).to.be.not.null
    expect(node.states.checked).to.be.false
    expect(node.states.disabled).to.be.false
    expect(node.states.open).to.be.true
    expect(node.states.visible).to.be.true
    expect(node.states.matched).to.be.false
  })
  it('item with custom icon class has icon === custom class', () => {
    const nodes = [{
      id: 1,
      name: 'test',
      icon: 'fa fa-plus'
    }]
    const options = {
      checkOnSelect: false
    }
    const manager = getNodeManager(nodes, options)
    const node = manager.getById(1)
    expect(node).to.be.not.null
    expect(node.icon).to.be.eq('fa fa-plus')
  })
  // TODO: test for visible()
  it('item is in the indeterminate state when some but not all its children are checked', () => {
    const nodes = [{
      id: 1,
      name: 'test',
      children: [{
        id: 2,
        name: 'child1',
        checked: true
      }, {
        id: 3,
        name: 'child2'
      }]
    }]
    const options = {
      checkOnSelect: false
    }
    const manager = getNodeManager(nodes, options)
    const node = manager.getById(1)
    expect(node).to.be.not.null
    expect(node.indeterminate()).to.be.eq(true)
  })
  it('item is not in the indeterminate state when all its children are checked', () => {
    const nodes = [{
      id: 1,
      name: 'test',
      children: [{
        id: 2,
        name: 'child1',
        checked: true
      }, {
        id: 3,
        name: 'child2',
        checked: true
      }]
    }]
    const options = {
      checkOnSelect: false
    }
    const manager = getNodeManager(nodes, options)
    const node = manager.getById(1)
    expect(node).to.be.not.null
    expect(node.indeterminate()).to.be.eq(false)
  })
  it('item is not in the indeterminate state when all its children are unchecked', () => {
    const nodes = [{
      id: 1,
      name: 'test',
      children: [{
        id: 2,
        name: 'child1'
      }, {
        id: 3,
        name: 'child2'
      }]
    }]
    const options = {
      checkOnSelect: false
    }
    const manager = getNodeManager(nodes, options)
    const node = manager.getById(1)
    expect(node).to.be.not.null
    expect(node.indeterminate()).to.be.eq(false)
  })
  it('items is not sorted when treeOptions.autoSort = false', () => {
    const nodes = [{
      id: 1,
      name: 'test2',
      children: [{
        id: 2,
        name: 'child2'
      }, {
        id: 3,
        name: 'child1'
      }]
    }, {
      id: 4,
      name: 'test1'
    }]
    const options = {
      autoSort: false
    }
    const manager = getNodeManager(nodes, options)
    expect(manager.items[0].id).to.be.eq(1)
    expect(manager.items[1].id).to.be.eq(4)
    const children = manager.items[0].children
    expect(children[0].id).to.be.eq(2)
    expect(children[1].id).to.be.eq(3)
  })
  it('items is sorted when treeOptions.autoSort = true', () => {
    const nodes = [{
      id: 1,
      name: 'test2',
      children: [{
        id: 2,
        name: 'child2'
      }, {
        id: 3,
        name: 'child1'
      }]
    }, {
      id: 4,
      name: 'test1'
    }]
    const options = {
      autoSort: true
    }
    const manager = getNodeManager(nodes, options)
    expect(manager.items[0].id).to.be.eq(4)
    expect(manager.items[1].id).to.be.eq(1)
    const children = manager.items[1].children
    expect(children[0].id).to.be.eq(3)
    expect(children[1].id).to.be.eq(2)
  })
})
