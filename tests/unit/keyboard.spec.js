'use strict'
/* eslint-disable no-unused-expressions */
import { expect } from 'chai'
import { mount } from '@vue/test-utils'
import Tree from '@/components/TreeView.vue'
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
      wrapper.trigger('keydown', {
        key: 'ArrowDown'
      })
      wrapper.vm.$nextTick(() => {
        expectSelectedNodeId(wrapper, 2)
        expectSecondSelectedEventWithNodeId(wrapper, 2)
        done()
      })
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
      wrapper.trigger('keydown', {
        key: 'ArrowDown'
      })

      wrapper.vm.$nextTick(() => {
        expectSelectedNodeId(wrapper, 2)
        expectFirstSelectedEventWithNodeId(wrapper, 2)
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
      wrapper.trigger('keydown', {
        key: 'ArrowDown'
      })
      wrapper.vm.$nextTick(() => {
        expectSelectedNodeId(wrapper, 3)
        expectSecondSelectedEventWithNodeId(wrapper, 3)
        done()
      })
    })
  })
  it('key Down on first open node selects first its child', done => {
    const nodes = [{
      id: 1,
      name: 'name',
      open: true,
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
    wrapper.trigger('keydown', {
      key: 'ArrowDown'
    })

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
      open: false,
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
    wrapper.trigger('keydown', {
      key: 'ArrowDown'
    })

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
      open: true,
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
    wrapper.trigger('keydown', {
      key: 'ArrowDown'
    })

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
      open: true,
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
    wrapper.trigger('keydown', {
      key: 'ArrowDown'
    })

    wrapper.vm.$nextTick(() => {
      expectSelectedNodeId(wrapper, 3)
      expectSecondSelectedEventWithNodeId(wrapper, 3)
      done()
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

      wrapper.trigger('keydown', {
        key: 'ArrowUp'
      })
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
      wrapper.trigger('keydown', {
        key: 'ArrowUp'
      })

      wrapper.vm.$nextTick(() => {
        expectSelectedNodeId(wrapper, 1)
        expectFirstSelectedEventWithNodeId(wrapper, 1)
        done()
      })
    })
  })
  it('key Up on last node selects previous enabled sibling', done => {
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

    const clickableNodes = wrapper.findAll('.treevue-tree-node')
    expect(clickableNodes.length).to.be.eq(3)
    const secondNode = clickableNodes.at(2)
    const clickableText = secondNode.find('.treevue-tree-node .treevue-node-text')
    clickableText.trigger('click')
    clickableText.trigger('focus')
    wrapper.vm.$nextTick(() => {
      wrapper.trigger('keydown', {
        key: 'ArrowUp'
      })
      wrapper.vm.$nextTick(() => {
        expectSelectedNodeId(wrapper, 1)
        expectSecondSelectedEventWithNodeId(wrapper, 1)
        done()
      })
    })
  })
  it('key Up on last node selects first prev sibing child', done => {
    const nodes = [{
      id: 1,
      name: 'name'
    }, {
      id: 2,
      name: 'name2',
      open: true,
      children: [{
        id: 4,
        name: 'child1'
      }]
    }, {
      id: 3,
      name: 'name3'
    }]
    const options = {
      checkOnSelect: false
    }
    const wrapper = mount(Tree, { propsData: { nodes, options } })
    const clickableNodes = wrapper.findAll('.treevue-tree-root-node > .treevue-tree-node')
    expect(clickableNodes.length).to.be.eq(3)
    const thirdNode = clickableNodes.at(2)
    const clickableText = thirdNode.find('.treevue-tree-node .treevue-node-text')
    clickableText.trigger('click')
    clickableText.trigger('focus')

    wrapper.vm.$nextTick(() => {
      wrapper.trigger('keydown', {
        key: 'ArrowUp'
      })

      wrapper.vm.$nextTick(() => {
        expectSelectedNodeId(wrapper, 4)
        expectSecondSelectedEventWithNodeId(wrapper, 4)
        done()
      })
    })
  })
  it('key Up on last node selects next closed sibling with children', done => {
    const nodes = [{
      id: 1,
      name: 'name'
    }, {
      id: 2,
      name: 'name2',
      open: false,
      children: [{
        id: 4,
        name: 'child1'
      }]
    }, {
      id: 3,
      name: 'name3'
    }]
    const options = {
      checkOnSelect: false
    }
    const wrapper = mount(Tree, { propsData: { nodes, options } })
    const clickableNodes = wrapper.findAll('.treevue-tree-root-node > .treevue-tree-node')
    expect(clickableNodes.length).to.be.eq(3)
    const thirdNode = clickableNodes.at(2)
    const clickableText = thirdNode.find('.treevue-tree-node .treevue-node-text')
    clickableText.trigger('click')
    clickableText.trigger('focus')

    wrapper.vm.$nextTick(() => {
      wrapper.trigger('keydown', {
        key: 'ArrowUp'
      })

      wrapper.vm.$nextTick(() => {
        expectSelectedNodeId(wrapper, 2)
        expectSecondSelectedEventWithNodeId(wrapper, 2)
        done()
      })
    })
  })
  it('key Up on first child node selects its parent', done => {
    const nodes = [{
      id: 1,
      name: 'name'
    }, {
      id: 2,
      name: 'name2',
      open: true,
      children: [{
        id: 4,
        name: 'child1'
      }]
    }, {
      id: 3,
      name: 'name3'
    }]
    const options = {
      checkOnSelect: false
    }
    const wrapper = mount(Tree, { propsData: { nodes, options } })
    clickFirstFoundChildNodeText(wrapper)
    wrapper.trigger('keydown', {
      key: 'ArrowUp'
    })

    wrapper.vm.$nextTick(() => {
      expectSelectedNodeId(wrapper, 2)
      expectSecondSelectedEventWithNodeId(wrapper, 2)
      done()
    })
  })
  it('key Left on open node collapses it', done => {
    const nodes = [{
      id: 1,
      name: 'name',
      open: true,
      children: [{
        id: 4,
        name: 'child1'
      }]
    }, {
      id: 2,
      name: 'name2'
    }]
    const options = {
      checkOnSelect: false
    }
    const wrapper = mount(Tree, { propsData: { nodes, options } })
    clickFirstFoundNodeText(wrapper)
    wrapper.trigger('keydown', {
      key: 'ArrowLeft'
    })

    wrapper.vm.$nextTick(() => {
      expectSelectedNodeId(wrapper, 1)
      expect(wrapper.vm.nodeManager.selectedNode.states.open).to.be.false

      done()
    })
  })
  it('key Left on child node selectes its parent', done => {
    const nodes = [{
      id: 1,
      name: 'name',
      open: true,
      children: [{
        id: 4,
        name: 'child1'
      }]
    }, {
      id: 2,
      name: 'name2'
    }]
    const options = {
      checkOnSelect: false
    }
    const wrapper = mount(Tree, { propsData: { nodes, options } })
    clickFirstFoundChildNodeText(wrapper)
    wrapper.trigger('keydown', {
      key: 'ArrowLeft'
    })

    wrapper.vm.$nextTick(() => {
      expectSelectedNodeId(wrapper, 1)
      expectSecondSelectedEventWithNodeId(wrapper, 1)

      done()
    })
  })
  it('key Left on root node does nothing', done => {
    const nodes = [{
      id: 1,
      name: 'name'
    }, {
      id: 2,
      name: 'name2',
      open: false,
      children: [{
        id: 4,
        name: 'child1'
      }]
    }]
    const options = {
      checkOnSelect: false
    }
    const wrapper = mount(Tree, { propsData: { nodes, options } })
    const clickableNodes = wrapper.findAll('.treevue-tree-node')
    expect(clickableNodes.length).to.be.eq(2)
    const secondNode = clickableNodes.at(1)
    const clickableText = secondNode.find('.treevue-tree-node .treevue-node-text')
    clickableText.trigger('click')
    clickableText.trigger('focus')
    wrapper.trigger('keydown', {
      key: 'ArrowLeft'
    })

    wrapper.vm.$nextTick(() => {
      expectSelectedNodeId(wrapper, 2)
      expectFirstSelectedEventWithNodeId(wrapper, 2)

      done()
    })
  })
  it('key Right on closed node expands it', done => {
    const nodes = [{
      id: 1,
      name: 'name',
      open: false,
      children: [{
        id: 4,
        name: 'child1'
      }]
    }, {
      id: 2,
      name: 'name2'
    }]
    const options = {
      checkOnSelect: false
    }
    const wrapper = mount(Tree, { propsData: { nodes, options } })
    clickFirstFoundNodeText(wrapper)
    wrapper.trigger('keydown', {
      key: 'ArrowRight'
    })

    wrapper.vm.$nextTick(() => {
      expectSelectedNodeId(wrapper, 1)
      expect(wrapper.vm.nodeManager.selectedNode.states.open).to.be.true

      done()
    })
  })
  it('key Right on open node selectes its first enabled child', done => {
    const nodes = [{
      id: 1,
      name: 'name',
      open: true,
      children: [{
        id: 4,
        name: 'child1',
        disabled: true
      }, {
        id: 5,
        name: 'child2'
      }]
    }, {
      id: 2,
      name: 'name2'
    }]
    const options = {
      checkOnSelect: false
    }
    const wrapper = mount(Tree, { propsData: { nodes, options } })
    clickFirstFoundNodeText(wrapper)
    wrapper.trigger('keydown', {
      key: 'ArrowRight'
    })

    wrapper.vm.$nextTick(() => {
      expectSelectedNodeId(wrapper, 5)
      expectSecondSelectedEventWithNodeId(wrapper, 5)

      done()
    })
  })
  it('key Right on open node with disabled children does nothing', done => {
    const nodes = [{
      id: 1,
      name: 'name',
      open: true,
      children: [{
        id: 4,
        name: 'child1',
        disabled: true
      }, {
        id: 5,
        name: 'child2',
        disabled: true
      }]
    }, {
      id: 2,
      name: 'name2'
    }]
    const options = {
      checkOnSelect: false
    }
    const wrapper = mount(Tree, { propsData: { nodes, options } })
    clickFirstFoundNodeText(wrapper)
    wrapper.trigger('keydown', {
      key: 'ArrowRight'
    })

    wrapper.vm.$nextTick(() => {
      expectSelectedNodeId(wrapper, 1)
      expectFirstSelectedEventWithNodeId(wrapper, 1)

      done()
    })
  })
  it('key Space on disabled node does nothing', done => {
    const nodes = [{
      id: 1,
      name: 'name',
      checked: false,
      disabled: true
    }, {
      id: 2,
      name: 'name2'
    }]
    const options = {
      checkOnSelect: false
    }
    const wrapper = mount(Tree, { propsData: { nodes, options } })
    clickFirstFoundNodeText(wrapper)
    wrapper.trigger('keydown', {
      key: ' '
    })

    wrapper.vm.$nextTick(() => {
      expect(wrapper.vm.nodeManager.getById(1).states.checked).to.be.false

      done()
    })
  })
  it('key Space on unchecked node checks it', done => {
    const nodes = [{
      id: 1,
      name: 'name',
      checked: false
    }, {
      id: 2,
      name: 'name2'
    }]
    const options = {
      checkOnSelect: false
    }
    const wrapper = mount(Tree, { propsData: { nodes, options } })
    clickFirstFoundNodeText(wrapper)
    wrapper.trigger('keydown', {
      key: ' '
    })

    wrapper.vm.$nextTick(() => {
      expect(wrapper.vm.nodeManager.getById(1).states.checked).to.be.true

      done()
    })
  })
  it('key Space on checked node unchecks it', done => {
    const nodes = [{
      id: 1,
      name: 'name',
      checked: true
    }, {
      id: 2,
      name: 'name2'
    }]
    const options = {
      checkOnSelect: false
    }
    const wrapper = mount(Tree, { propsData: { nodes, options } })
    clickFirstFoundNodeText(wrapper)
    wrapper.trigger('keydown', {
      key: ' '
    })

    wrapper.vm.$nextTick(() => {
      expect(wrapper.vm.nodeManager.getById(1).states.checked).to.be.false

      done()
    })
  })
  it('key Del on node deletes it with canDelete option checked', done => {
    const nodes = [{
      id: 1,
      name: 'name'
    }, {
      id: 2,
      name: 'name2'
    }]
    const options = {
      checkOnSelect: false,
      canDelete: true
    }
    const wrapper = mount(Tree, { propsData: { nodes, options } })
    clickFirstFoundNodeText(wrapper)

    wrapper.vm.$nextTick(() => {
      wrapper.trigger('keydown', {
        key: 'Delete'
      })
      expect(wrapper.vm.nodeManager.items.length).to.be.eq(1)
      expect(wrapper.vm.nodeManager.getById(1)).to.be.null

      done()
    })
  })
  it('key Del on node does nothing with canDelete option unchecked', done => {
    const nodes = [{
      id: 1,
      name: 'name'
    }, {
      id: 2,
      name: 'name2'
    }]
    const options = {
      checkOnSelect: false,
      canDelete: false
    }
    const wrapper = mount(Tree, { propsData: { nodes, options } })
    clickFirstFoundNodeText(wrapper)

    wrapper.vm.$nextTick(() => {
      wrapper.trigger('keydown', {
        key: 'Delete'
      })
      expect(wrapper.vm.nodeManager.items.length).to.be.eq(2)
      expect(wrapper.vm.nodeManager.getById(1)).to.be.not.null

      done()
    })
  })
  it('key F2 on node does nothing with canEdit option unchecked', done => {
    const nodes = [{
      id: 1,
      name: 'name'
    }, {
      id: 2,
      name: 'name2'
    }]
    const options = {
      checkOnSelect: false,
      canEdit: false
    }
    const wrapper = mount(Tree, { propsData: { nodes, options } })
    clickFirstFoundNodeText(wrapper)

    wrapper.vm.$nextTick(() => {
      wrapper.trigger('keydown', {
        key: 'F2'
      })
      expect(wrapper.vm.nodeManager.items.length).to.be.eq(2)
      expect(wrapper.vm.nodeManager.getById(1)).to.be.not.null

      done()
    })
  })
  it('key F2 on node switches it to edit mode with canEdit option checked', done => {
    const nodes = [{
      id: 1,
      name: 'name'
    }, {
      id: 2,
      name: 'name2'
    }]
    const options = {
      checkOnSelect: false,
      canEdit: true
    }
    const wrapper = mount(Tree, { propsData: { nodes, options } })
    clickFirstFoundNodeText(wrapper)

    wrapper.vm.$nextTick(() => {
      wrapper.trigger('keydown', {
        key: 'F2'
      })
      const editorWrapper = wrapper.find('.treevue-node-editor')
      expect(editorWrapper).to.be.not.null

      done()
    })
  })
})
