'use strict'
/* eslint-disable no-unused-expressions */
import { expect } from 'chai'
import { mount } from '@vue/test-utils'
import Tree from '@/components/TreeVue.vue'
// import Node from '@/components/Node.vue'

describe('keyboard mixin', () => {
  async function getWrapper (items, options = {}) {
    const wrapper = mount(Tree, {
      propsData: { items, options }
    })
    await wrapper.vm.$nextTick()

    return wrapper
  }
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
    expect(wrapper.vm.storage.selectedNode).to.be.not.null
    expect(wrapper.vm.storage.selectedNode.item.id).to.be.eq(nodeId)
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

  it('key Down on first node selects second node', async () => {
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
    const wrapper = await getWrapper(nodes, options)

    clickFirstFoundNodeText(wrapper)
    wrapper.trigger('keydown', {
      key: 'ArrowDown'
    })

    await wrapper.vm.$nextTick()

    expectSelectedNodeId(wrapper, 2)
    expectSecondSelectedEventWithNodeId(wrapper, 2)
  })
  it('key Down on second node does not change selected node', async () => {
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
    const wrapper = await getWrapper(nodes, options)

    const clickableNodes = wrapper.findAll('.treevue-tree-node')
    expect(clickableNodes.length).to.be.eq(2)
    const secondNode = clickableNodes.at(1)
    const clickableText = secondNode.find('.treevue-tree-node .treevue-node-text')
    clickableText.trigger('click')
    clickableText.trigger('focus')
    wrapper.trigger('keydown', {
      key: 'ArrowDown'
    })

    await wrapper.vm.$nextTick()

    expectSelectedNodeId(wrapper, 2)
    expectFirstSelectedEventWithNodeId(wrapper, 2)
  })
  it('key Down on first node selects next enabled sibling', async () => {
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
    const wrapper = await getWrapper(nodes, options)

    clickFirstFoundNodeText(wrapper)
    wrapper.trigger('keydown', {
      key: 'ArrowDown'
    })

    await wrapper.vm.$nextTick()

    expectSelectedNodeId(wrapper, 3)
    expectSecondSelectedEventWithNodeId(wrapper, 3)
  })
  it('key Down on first open node selects first its child', async () => {
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
    const wrapper = await getWrapper(nodes, options)

    clickFirstFoundNodeText(wrapper)
    wrapper.trigger('keydown', {
      key: 'ArrowDown'
    })

    await wrapper.vm.$nextTick()

    expectSelectedNodeId(wrapper, 4)
    expectSecondSelectedEventWithNodeId(wrapper, 4)
  })
  it('key Down on closed node with children selects next sibling', async () => {
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
    const wrapper = await getWrapper(nodes, options)

    clickFirstFoundNodeText(wrapper)
    wrapper.trigger('keydown', {
      key: 'ArrowDown'
    })

    await wrapper.vm.$nextTick()

    expectSelectedNodeId(wrapper, 2)
    expectSecondSelectedEventWithNodeId(wrapper, 2)
  })
  it('key Down on last child node selects next parent', async () => {
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
    const wrapper = await getWrapper(nodes, options)

    clickFirstFoundChildNodeText(wrapper)
    wrapper.trigger('keydown', {
      key: 'ArrowDown'
    })

    await wrapper.vm.$nextTick()

    expectSelectedNodeId(wrapper, 2)
    expectSecondSelectedEventWithNodeId(wrapper, 2)
  })
  it('key Down on first node selects next available node', async () => {
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
    const wrapper = await getWrapper(nodes, options)

    clickFirstFoundNodeText(wrapper)
    wrapper.trigger('keydown', {
      key: 'ArrowDown'
    })

    await wrapper.vm.$nextTick()

    expectSelectedNodeId(wrapper, 3)
    expectSecondSelectedEventWithNodeId(wrapper, 3)
  })
  it('key Up on second node selects first node', async () => {
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
    const wrapper = await getWrapper(nodes, options)

    const clickableNodes = wrapper.findAll('.treevue-tree-node')
    expect(clickableNodes.length).to.be.eq(2)
    const secondNode = clickableNodes.at(1)
    clickFirstFoundNodeText(secondNode)

    wrapper.trigger('keydown', {
      key: 'ArrowUp'
    })

    await wrapper.vm.$nextTick()

    expectSelectedNodeId(wrapper, 1)
    expectSecondSelectedEventWithNodeId(wrapper, 1)
  })
  it('key Up on first node does not change selected node', async () => {
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
    const wrapper = await getWrapper(nodes, options)

    clickFirstFoundNodeText(wrapper)
    wrapper.trigger('keydown', {
      key: 'ArrowUp'
    })

    await wrapper.vm.$nextTick()

    expectSelectedNodeId(wrapper, 1)
    expectFirstSelectedEventWithNodeId(wrapper, 1)
  })
  it('key Up on last node selects previous enabled sibling', async () => {
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
    const wrapper = await getWrapper(nodes, options)

    const clickableNodes = wrapper.findAll('.treevue-tree-node')
    expect(clickableNodes.length).to.be.eq(3)
    const secondNode = clickableNodes.at(2)
    const clickableText = secondNode.find('.treevue-tree-node .treevue-node-text')
    clickableText.trigger('click')
    clickableText.trigger('focus')

    await wrapper.vm.$nextTick()

    wrapper.trigger('keydown', {
      key: 'ArrowUp'
    })

    await wrapper.vm.$nextTick()

    expectSelectedNodeId(wrapper, 1)
    expectSecondSelectedEventWithNodeId(wrapper, 1)
  })
  it('key Up on last node selects first prev sibing child', async () => {
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
    const wrapper = await getWrapper(nodes, options)

    const clickableNodes = wrapper.findAll('.treevue-tree-root-node > .treevue-tree-node')
    expect(clickableNodes.length).to.be.eq(3)
    const thirdNode = clickableNodes.at(2)
    const clickableText = thirdNode.find('.treevue-tree-node .treevue-node-text')
    clickableText.trigger('click')
    clickableText.trigger('focus')

    await wrapper.vm.$nextTick()

    wrapper.trigger('keydown', {
      key: 'ArrowUp'
    })

    await wrapper.vm.$nextTick()

    expectSelectedNodeId(wrapper, 4)
    expectSecondSelectedEventWithNodeId(wrapper, 4)
  })
  it('key Up on last node does not change selected node if all above nodes are disabled', async () => {
    const nodes = [{
      id: 1,
      name: 'name',
      disabled: true
    }, {
      id: 2,
      name: 'name2',
      disabled: true,
      open: true,
      children: [{
        id: 4,
        disabled: true,
        name: 'child1'
      }]
    }, {
      id: 3,
      name: 'name3'
    }]
    const options = {
      checkOnSelect: false
    }
    const wrapper = await getWrapper(nodes, options)

    const clickableNodes = wrapper.findAll('.treevue-tree-root-node > .treevue-tree-node')
    expect(clickableNodes.length).to.be.eq(3)
    const thirdNode = clickableNodes.at(2)
    const clickableText = thirdNode.find('.treevue-tree-node .treevue-node-text')
    clickableText.trigger('click')
    clickableText.trigger('focus')

    await wrapper.vm.$nextTick()

    wrapper.trigger('keydown', {
      key: 'ArrowUp'
    })

    await wrapper.vm.$nextTick()

    expect(wrapper.emitted()['node:selected'].length).to.be.eq(1)
    expectSelectedNodeId(wrapper, 3)
    expectFirstSelectedEventWithNodeId(wrapper, 3)
  })
  it('key Up on last node selects next closed sibling with children', async () => {
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
    const wrapper = await getWrapper(nodes, options)

    const clickableNodes = wrapper.findAll('.treevue-tree-root-node > .treevue-tree-node')
    expect(clickableNodes.length).to.be.eq(3)
    const thirdNode = clickableNodes.at(2)
    const clickableText = thirdNode.find('.treevue-tree-node .treevue-node-text')
    clickableText.trigger('click')
    clickableText.trigger('focus')

    await wrapper.vm.$nextTick()
    wrapper.trigger('keydown', {
      key: 'ArrowUp'
    })

    await wrapper.vm.$nextTick()

    expectSelectedNodeId(wrapper, 2)
    expectSecondSelectedEventWithNodeId(wrapper, 2)
  })
  it('key Up on first child node selects its parent', async () => {
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
    const wrapper = await getWrapper(nodes, options)

    clickFirstFoundChildNodeText(wrapper)
    wrapper.trigger('keydown', {
      key: 'ArrowUp'
    })

    await wrapper.vm.$nextTick()

    expectSelectedNodeId(wrapper, 2)
    expectSecondSelectedEventWithNodeId(wrapper, 2)
  })
  it('key Left on open node collapses it', async () => {
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
    const wrapper = await getWrapper(nodes, options)

    clickFirstFoundNodeText(wrapper)
    wrapper.trigger('keydown', {
      key: 'ArrowLeft'
    })

    await wrapper.vm.$nextTick()

    expectSelectedNodeId(wrapper, 1)
    expect(wrapper.vm.storage.selectedNode.states.open).to.be.false
  })
  it('key Left on child node selectes its parent', async () => {
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
    const wrapper = await getWrapper(nodes, options)

    clickFirstFoundChildNodeText(wrapper)
    wrapper.trigger('keydown', {
      key: 'ArrowLeft'
    })

    await wrapper.vm.$nextTick()

    expectSelectedNodeId(wrapper, 1)
    expectSecondSelectedEventWithNodeId(wrapper, 1)
  })
  it('key Left on root node does nothing', async () => {
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
    const wrapper = await getWrapper(nodes, options)

    const clickableNodes = wrapper.findAll('.treevue-tree-node')
    expect(clickableNodes.length).to.be.eq(2)
    const secondNode = clickableNodes.at(1)
    const clickableText = secondNode.find('.treevue-tree-node .treevue-node-text')
    clickableText.trigger('click')
    clickableText.trigger('focus')
    wrapper.trigger('keydown', {
      key: 'ArrowLeft'
    })

    await wrapper.vm.$nextTick()

    expectSelectedNodeId(wrapper, 2)
    expectFirstSelectedEventWithNodeId(wrapper, 2)
  })
  it('key Right on closed node expands it', async () => {
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
    const wrapper = await getWrapper(nodes, options)

    clickFirstFoundNodeText(wrapper)
    wrapper.trigger('keydown', {
      key: 'ArrowRight'
    })

    await wrapper.vm.$nextTick()

    expectSelectedNodeId(wrapper, 1)
    expect(wrapper.vm.storage.selectedNode.states.open).to.be.true
  })
  it('key Right on open node selectes its first enabled child', async () => {
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
    const wrapper = await getWrapper(nodes, options)

    clickFirstFoundNodeText(wrapper)
    wrapper.trigger('keydown', {
      key: 'ArrowRight'
    })

    await wrapper.vm.$nextTick()

    expectSelectedNodeId(wrapper, 5)
    expectSecondSelectedEventWithNodeId(wrapper, 5)
  })
  it('key Right on open node with disabled children does nothing', async () => {
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
    const wrapper = await getWrapper(nodes, options)

    clickFirstFoundNodeText(wrapper)
    wrapper.trigger('keydown', {
      key: 'ArrowRight'
    })

    await wrapper.vm.$nextTick()

    expectSelectedNodeId(wrapper, 1)
    expectFirstSelectedEventWithNodeId(wrapper, 1)
  })
  it('key Space on disabled node does nothing', async () => {
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
    const wrapper = await getWrapper(nodes, options)

    clickFirstFoundNodeText(wrapper)
    wrapper.trigger('keydown', {
      key: ' '
    })

    await wrapper.vm.$nextTick()

    expect(wrapper.vm.storage.getById(1).states.checked).to.be.false
  })
  it('key Space on unchecked node checks it', async () => {
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
    const wrapper = await getWrapper(nodes, options)

    clickFirstFoundNodeText(wrapper)
    wrapper.trigger('keydown', {
      key: ' '
    })

    await wrapper.vm.$nextTick()

    expect(wrapper.vm.storage.getById(1).states.checked).to.be.true
  })
  it('key Space on checked node unchecks it', async () => {
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
    const wrapper = await getWrapper(nodes, options)

    clickFirstFoundNodeText(wrapper)
    wrapper.trigger('keydown', {
      key: ' '
    })

    await wrapper.vm.$nextTick()

    expect(wrapper.vm.storage.getById(1).states.checked).to.be.false
  })
  it('key Del on node deletes it with canDelete option checked', async () => {
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
    const wrapper = await getWrapper(nodes, options)

    clickFirstFoundNodeText(wrapper)

    await wrapper.vm.$nextTick()

    wrapper.trigger('keydown', {
      key: 'Delete'
    })
    expect(wrapper.vm.storage.nodes.length).to.be.eq(1)
    expect(wrapper.vm.storage.getById(1)).to.be.null
  })
  it('key Del on node does nothing with canDelete option unchecked', async () => {
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
    const wrapper = await getWrapper(nodes, options)

    clickFirstFoundNodeText(wrapper)

    await wrapper.vm.$nextTick()

    wrapper.trigger('keydown', {
      key: 'Delete'
    })
    expect(wrapper.vm.storage.nodes.length).to.be.eq(2)
    expect(wrapper.vm.storage.getById(1)).to.be.not.null
  })
  it('key F2 on node does nothing with canEdit option unchecked', async () => {
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
    const wrapper = await getWrapper(nodes, options)

    clickFirstFoundNodeText(wrapper)

    await wrapper.vm.$nextTick()

    wrapper.trigger('keydown', {
      key: 'F2'
    })
    expect(wrapper.vm.storage.nodes.length).to.be.eq(2)
    expect(wrapper.vm.storage.getById(1)).to.be.not.null
  })
  it('key F2 on node switches it to edit mode with canEdit option checked', async () => {
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
    const wrapper = await getWrapper(nodes, options)

    clickFirstFoundNodeText(wrapper)

    await wrapper.vm.$nextTick()

    wrapper.trigger('keydown', {
      key: 'F2'
    })
    const editorWrapper = wrapper.find('.treevue-node-editor')
    expect(editorWrapper).to.be.not.null
  })
  it('key F2 while editing node does nothing', async () => {
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
    const wrapper = await getWrapper(nodes, options)

    clickFirstFoundNodeText(wrapper)

    await wrapper.vm.$nextTick()

    wrapper.trigger('keydown', {
      key: 'F2'
    })
    wrapper.trigger('keydown', {
      key: 'ArrowDown'
    })

    await wrapper.vm.$nextTick()

    const editorWrapper = wrapper.find('.treevue-node-editor')
    expect(editorWrapper).to.be.not.null
  })
  it('key Down with no focused node does nothing', async () => {
    const nodes = [{
      id: 1,
      name: 'name'
    }, {
      id: 2,
      name: 'name2'
    }]
    const options = {
    }
    const wrapper = await getWrapper(nodes, options)
    wrapper.trigger('keydown', {
      key: 'ArrowDown'
    })
    expect(wrapper.vm.focusedNode).to.be.null
  })
})
