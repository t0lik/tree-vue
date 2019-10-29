'use strict'
/* eslint-disable no-unused-expressions */
import { expect } from 'chai'
import { mount } from '@vue/test-utils'
import Tree from '@/components/Tree.vue'
// import Node from '@/components/Node.vue'

describe('keyboard mixin', () => {
  function clickFirstFoundNodeText (wrapper) {
    const clickableText = wrapper.find('.treevue-tree-node .treevue-node-text')
    clickableText.trigger('click')
    clickableText.trigger('focus')
  }

  function clickFirstFoundChildNodeText (wrapper) {
    const clickableText = wrapper.find('.treevue-tree-node-child .treevue-tree-node .treevue-node-text')
    clickableText.trigger('click')
    clickableText.trigger('focus')
  }

  function expectSelectedNodeId (wrapper, nodeId) {
    expect(wrapper.vm.nodeManager.selectedNode).to.be.not.null
    expect(wrapper.vm.nodeManager.selectedNode.item.id).to.be.eq(nodeId)
  }

  function expectSecondSelectedEventWithNodeId (wrapper, nodeId) {
    expect(wrapper.emitted()['node:selected'].length).to.be.eq(2)
    const lastEventIndex = 1
    expect(wrapper.emitted()['node:selected'][lastEventIndex]).to.be.not.null
    expect(wrapper.emitted()['node:selected'][lastEventIndex][0]).to.be.not.null
    expect(wrapper.emitted()['node:selected'][lastEventIndex][0].item.id).to.be.eq(nodeId)
  }

  function expectFirstSelectedEventWithNodeId (wrapper, nodeId) {
    expect(wrapper.emitted()['node:selected'].length).to.be.eq(1)
    const lastEventIndex = 0
    expect(wrapper.emitted()['node:selected'][lastEventIndex]).to.be.not.null
    expect(wrapper.emitted()['node:selected'][lastEventIndex][0]).to.be.not.null
    expect(wrapper.emitted()['node:selected'][lastEventIndex][0].item.id).to.be.eq(nodeId)
  }

  it('key Down on first node selects second node', done => {
    const nodes = [{
      id: 1,
      name: 'name'
    }, {
      id: 2,
      name: 'name2'
    }]
    const options = {
      checkOnSelect: false
    }
    const wrapper = mount(Tree, { propsData: { nodes, options } })

    wrapper.vm.$nextTick(() => {
      clickFirstFoundNodeText(wrapper)
      wrapper.trigger('keydown.down')
      wrapper.vm.$nextTick(() => {
        expectSelectedNodeId(wrapper, 2)
        expectSecondSelectedEventWithNodeId(wrapper, 2)
        done()
      })
    })
  })
  it('key Down on first node selects next enabled sibling', done => {
    const nodes = [{
      id: 1,
      name: 'name'
    }, {
      id: 2,
      disabled: true,
      name: 'name2'
    }, {
      id: 3,
      name: 'name3'
    }]
    const options = {
      checkOnSelect: false
    }
    const wrapper = mount(Tree, { propsData: { nodes, options } })

    wrapper.vm.$nextTick(() => {
      clickFirstFoundNodeText(wrapper)
      wrapper.trigger('keydown.down')
      wrapper.vm.$nextTick(() => {
        expectSelectedNodeId(wrapper, 3)
        expectSecondSelectedEventWithNodeId(wrapper, 3)
        done()
      })
    })
  })
  it('key Down on first opened node selects first its child', done => {
    const nodes = [{
      id: 1,
      name: 'name',
      opened: true,
      children: [{
        id: 4,
        name: 'child1'
      }]
    }, {
      id: 2,
      name: 'name2'
    }, {
      id: 3,
      name: 'name3'
    }]
    const options = {
      checkOnSelect: false
    }
    const wrapper = mount(Tree, { propsData: { nodes, options } })
    clickFirstFoundNodeText(wrapper)
    wrapper.trigger('keydown.down')

    wrapper.vm.$nextTick(() => {
      expectSelectedNodeId(wrapper, 4)
      expectSecondSelectedEventWithNodeId(wrapper, 4)
      done()
    })
  })
  it('key Down on closed node with children selects next sibling', done => {
    const nodes = [{
      id: 1,
      name: 'name',
      opened: false,
      children: [{
        id: 4,
        name: 'child1'
      }]
    }, {
      id: 2,
      name: 'name2'
    }, {
      id: 3,
      name: 'name3'
    }]
    const options = {
      checkOnSelect: false
    }
    const wrapper = mount(Tree, { propsData: { nodes, options } })
    clickFirstFoundNodeText(wrapper)
    wrapper.trigger('keydown.down')

    wrapper.vm.$nextTick(() => {
      expectSelectedNodeId(wrapper, 2)
      expectSecondSelectedEventWithNodeId(wrapper, 2)
      done()
    })
  })
  it('key Down on last child node selects next parent', done => {
    const nodes = [{
      id: 1,
      name: 'name',
      opened: true,
      children: [{
        id: 4,
        name: 'child1'
      }]
    }, {
      id: 2,
      name: 'name2'
    }, {
      id: 3,
      name: 'name3'
    }]
    const options = {
      checkOnSelect: false
    }
    const wrapper = mount(Tree, { propsData: { nodes, options } })
    clickFirstFoundChildNodeText(wrapper)
    wrapper.trigger('keydown.down')

    wrapper.vm.$nextTick(() => {
      expectSelectedNodeId(wrapper, 2)
      expectSecondSelectedEventWithNodeId(wrapper, 2)
      done()
    })
  })
  it('key Down on first node selects next available node', done => {
    const nodes = [{
      id: 1,
      name: 'name',
      opened: true,
      children: [{
        id: 4,
        disabled: true,
        name: 'child1'
      }]
    }, {
      id: 2,
      disabled: true,
      name: 'name2'
    }, {
      id: 3,
      name: 'name3'
    }]
    const options = {
      checkOnSelect: false
    }
    const wrapper = mount(Tree, { propsData: { nodes, options } })
    clickFirstFoundNodeText(wrapper)
    wrapper.trigger('keydown.down')

    wrapper.vm.$nextTick(() => {
      expectSelectedNodeId(wrapper, 3)
      expectSecondSelectedEventWithNodeId(wrapper, 3)
      done()
    })
  })
  it('key Down on second node does not change selected node', done => {
    const nodes = [{
      id: 1,
      name: 'name'
    }, {
      id: 2,
      name: 'name2'
    }]
    const options = {
      checkOnSelect: false
    }
    const wrapper = mount(Tree, { propsData: { nodes, options } })

    wrapper.vm.$nextTick(() => {
      const clickableNodes = wrapper.findAll('.treevue-tree-node')
      expect(clickableNodes.length).to.be.eq(2)
      const secondNode = clickableNodes.at(1)
      const clickableText = secondNode.find('.treevue-tree-node .treevue-node-text')
      clickableText.trigger('click')
      clickableText.trigger('focus')
      wrapper.trigger('keydown.down')
      wrapper.vm.$nextTick(() => {
        expectSelectedNodeId(wrapper, 2)
        expectFirstSelectedEventWithNodeId(wrapper, 2)
        done()
      })
    })
  })
  it('key Up on second node selects first node', done => {
    const nodes = [{
      id: 1,
      name: 'name'
    }, {
      id: 2,
      name: 'name2'
    }]
    const options = {
      checkOnSelect: false
    }
    const wrapper = mount(Tree, { propsData: { nodes, options } })

    wrapper.vm.$nextTick(() => {
      const clickableNodes = wrapper.findAll('.treevue-tree-node')
      expect(clickableNodes.length).to.be.eq(2)
      const secondNode = clickableNodes.at(1)
      clickFirstFoundNodeText(secondNode)

      wrapper.trigger('keydown.up')
      wrapper.vm.$nextTick(() => {
        expectSelectedNodeId(wrapper, 1)
        expectSecondSelectedEventWithNodeId(wrapper, 1)
        done()
      })
    })
  })
  it('key Up on first node does not change selected node', done => {
    const nodes = [{
      id: 1,
      name: 'name'
    }, {
      id: 2,
      name: 'name2'
    }]
    const options = {
      checkOnSelect: false
    }
    const wrapper = mount(Tree, { propsData: { nodes, options } })

    wrapper.vm.$nextTick(() => {
      clickFirstFoundNodeText(wrapper)
      wrapper.trigger('keydown.up')

      wrapper.vm.$nextTick(() => {
        expectSelectedNodeId(wrapper, 1)
        expectFirstSelectedEventWithNodeId(wrapper, 1)
        done()
      })
    })
  })
})
