/* eslint-disable no-unused-expressions */
import { expect } from 'chai'
import { mount } from '@vue/test-utils'
import Tree from '@/components/Tree.vue'
import sinon from 'sinon'

describe('nodeManager node functions', () => {
  function getNodeManager (nodes, options = {}) {
    const wrapper = mount(Tree, {
      propsData: { nodes, options }
    })

    return wrapper.vm.nodeManager
  }
  it('visible() with closed node returns false', () => {
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
    expect(node.visible()).to.be.false
  })
  it('visible() with open node returns true', () => {
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
    expect(node.visible()).to.be.true
  })
  it('addChild with item calls nodeManager.addChild', () => {
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
    const mock = sinon.mock(manager)
    const newItem = { id: 10, name: 'node10' }
    mock.expects('addChild').once()

    node.addChild(node, newItem)

    mock.verify()
    // expect(addChildMock.once()).to.be.true
  })
})
