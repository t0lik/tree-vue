'use strict'
/* eslint-disable no-unused-expressions */
import { expect } from 'chai'
import { mount } from '@vue/test-utils'
import Tree from '@/components/Tree.vue'
import Node from '@/components/Node.vue'
import NodeExpander from '@/components/NodeExpander.vue'
import NodeCheckbox from '@/components/NodeCheckbox.vue'
import NodeIcon from '@/components/NodeIcon.vue'
import NodeText from '@/components/NodeText.vue'
import NodeEditor from '@/components/NodeEditor.vue'

describe('Node.vue', () => {
  function clickFirstFoundNodeText (wrapper) {
    const clickableText = wrapper.find('.treevue-tree-node .treevue-node-text')
    clickableText.trigger('click')
    clickableText.trigger('focus')
  }
  function getTreeWrapper (nodes, options = {}) {
    const wrapper = mount(Tree, {
      propsData: { nodes, options }
    })

    return wrapper
  }
  function getNodeWrapper (treeWrapper, node) {
    const nodeWrapper = mount(Node, {
      propsData: {
        node,
        state: treeWrapper.vm.treeState,
        manager: treeWrapper.vm.nodeManager,
        options: treeWrapper.vm.treeOptions
      }
    })

    return nodeWrapper
  }
  it('click and focus on node text sets focusedNode', done => {
    const nodes = [{
      id: 1,
      name: 'name'
    }]
    const wrapper = getTreeWrapper(nodes)
    const clickableText = wrapper.find('.treevue-tree-node .treevue-node-text')
    clickableText.trigger('click')
    clickableText.trigger('focus')
    wrapper.vm.$nextTick(() => {
      expect(wrapper.vm.focusedNode).to.be.not.null
      done()
    })
  })
  it('click on node emits clicked', done => {
    const nodes = [{
      id: 1,
      name: 'name'
    }]
    const wrapper = getTreeWrapper(nodes)
    const node = wrapper.vm.nodeManager.getById(1)
    const nodeWrapper = getNodeWrapper(wrapper, node)
    const clickableNode = nodeWrapper.find('.treevue-tree-node')
    clickableNode.trigger('click')
    wrapper.vm.$nextTick(() => {
      expect(nodeWrapper.emitted().clicked[0]).to.be.not.null
      expect(nodeWrapper.emitted().clicked[0][0]).to.be.not.null
      expect(nodeWrapper.emitted().clicked[0][0].item).to.be.eq(nodes[0])
      done()
    })
  })
  it('node without children has no-children class', () => {
    const nodes = [{
      id: 1,
      name: 'name'
    }]
    const wrapper = getTreeWrapper(nodes)
    const node = wrapper.vm.nodeManager.getById(1)
    const nodeWrapper = getNodeWrapper(wrapper, node)
    expect(nodeWrapper.classes('no-children')).to.be.true
  })
  it('node with children has no no-children class', () => {
    const nodes = [{
      id: 1,
      name: 'name',
      children: [{
        id: 2,
        name: 'child'
      }]
    }]
    const wrapper = getTreeWrapper(nodes)
    const node = wrapper.vm.nodeManager.getById(1)
    const nodeWrapper = getNodeWrapper(wrapper, node)
    expect(nodeWrapper.classes('no-children')).to.be.false
  })
  it('not selected node has no selected class', () => {
    const nodes = [{
      id: 1,
      name: 'name',
      children: [{
        id: 2,
        name: 'child'
      }]
    }]
    const wrapper = getTreeWrapper(nodes)
    const node = wrapper.vm.nodeManager.getById(1)
    const nodeWrapper = getNodeWrapper(wrapper, node)
    const innerNodeTag = nodeWrapper.find('.treevue-tree-node-container > .treevue-tree-node')
    expect(innerNodeTag.classes('selected')).to.be.false
  })
  it('selected node has selected class', () => {
    const nodes = [{
      id: 1,
      name: 'name',
      children: [{
        id: 2,
        name: 'child'
      }]
    }]
    const wrapper = getTreeWrapper(nodes)
    const node = wrapper.vm.nodeManager.getById(1)
    wrapper.vm.nodeManager.setSelected(node)
    const nodeWrapper = getNodeWrapper(wrapper, node)
    const innerNodeTag = nodeWrapper.find('.treevue-tree-node-container > .treevue-tree-node')
    expect(innerNodeTag.classes('selected')).to.be.true
  })
  it('node without children has no NodeExpander', () => {
    const nodes = [{
      id: 1,
      name: 'name'
    }]
    const wrapper = getTreeWrapper(nodes)
    const node = wrapper.vm.nodeManager.getById(1)
    const nodeWrapper = getNodeWrapper(wrapper, node)
    expect(nodeWrapper.contains(NodeExpander)).to.be.false
  })
  it('node with children has NodeExpander', () => {
    const nodes = [{
      id: 1,
      name: 'name',
      children: [{
        id: 2,
        name: 'child'
      }]
    }]
    const wrapper = getTreeWrapper(nodes)
    const node = wrapper.vm.nodeManager.getById(1)
    const nodeWrapper = getNodeWrapper(wrapper, node)
    expect(nodeWrapper.contains(NodeExpander)).to.be.true
  })
  it('node with treeOptions.showCheckbox=true has NodeCheckbox', () => {
    const nodes = [{
      id: 1,
      name: 'name'
    }]
    const wrapper = getTreeWrapper(nodes, {
      showCheckbox: true
    })
    const node = wrapper.vm.nodeManager.getById(1)
    const nodeWrapper = getNodeWrapper(wrapper, node)
    expect(nodeWrapper.contains(NodeCheckbox)).to.be.true
  })
  it('node with treeOptions.showCheckbox=false has no NodeCheckbox', () => {
    const nodes = [{
      id: 1,
      name: 'name'
    }]
    const wrapper = getTreeWrapper(nodes, {
      showCheckbox: false
    })
    const node = wrapper.vm.nodeManager.getById(1)
    const nodeWrapper = getNodeWrapper(wrapper, node)
    expect(nodeWrapper.contains(NodeCheckbox)).to.be.false
  })
  it('node with treeOptions.showIcon=true has NodeIcon', () => {
    const nodes = [{
      id: 1,
      name: 'name',
      icon: 'fa fa-dice-one'
    }]
    const wrapper = getTreeWrapper(nodes, {
      showIcon: true
    })
    const node = wrapper.vm.nodeManager.getById(1)
    const nodeWrapper = getNodeWrapper(wrapper, node)
    expect(nodeWrapper.contains(NodeIcon)).to.be.true
  })
  it('node with no icon and treeOptions.showIcon=true has no NodeIcon', () => {
    const nodes = [{
      id: 1,
      name: 'name'
    }]
    const wrapper = getTreeWrapper(nodes, {
      showIcon: true
    })
    const node = wrapper.vm.nodeManager.getById(1)
    const nodeWrapper = getNodeWrapper(wrapper, node)
    expect(nodeWrapper.contains(NodeIcon)).to.be.false
  })
  it('node with no icon and treeOptions.showIcon=true and treeOptions.hideEmptyIcon=false has NodeIcon', () => {
    const nodes = [{
      id: 1,
      name: 'name'
    }]
    const wrapper = getTreeWrapper(nodes, {
      showIcon: true,
      hideEmptyIcon: false
    })
    const node = wrapper.vm.nodeManager.getById(1)
    const nodeWrapper = getNodeWrapper(wrapper, node)
    expect(nodeWrapper.contains(NodeIcon)).to.be.true
  })
  it('node in view mode has NodeText', () => {
    const nodes = [{
      id: 1,
      name: 'name'
    }]
    const wrapper = getTreeWrapper(nodes, {
    })
    const node = wrapper.vm.nodeManager.getById(1)
    const nodeWrapper = getNodeWrapper(wrapper, node)
    expect(nodeWrapper.contains(NodeText)).to.be.true
  })
  it('node in edit mode has no NodeText', done => {
    const nodes = [{
      id: 1,
      name: 'name'
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
      const editorWrapper = wrapper.find(NodeText)
      expect(editorWrapper.exists()).to.be.false

      done()
    })
  })
  it('node in edit mode has NodeEditor', () => {
    const nodes = [{
      id: 1,
      name: 'name'
    }]
    const wrapper = getTreeWrapper(nodes, {
      canEdit: true
    })
    const clickableText = wrapper.find('.treevue-node-text')
    clickableText.trigger('click')
    clickableText.trigger('focus')
    wrapper.trigger('keydown', {
      key: 'F2'
    })
    const nodeWrapper = wrapper.find(Node)
    expect(nodeWrapper.contains(NodeEditor)).to.be.true
  })
  it('opened node with child nodes has child Node components', () => {
    const nodes = [{
      id: 1,
      name: 'name',
      opened: true,
      children: [{
        id: 2,
        name: 'child'
      }]
    }]
    const wrapper = getTreeWrapper(nodes, {
      canEdit: true
    })
    const childrenContainer = wrapper.find('.treevue-tree-node-children-container')
    expect(childrenContainer.exists()).to.be.true
    expect(childrenContainer.contains(Node)).to.be.true
  })
  it('closed node with child nodes has no child Node components', () => {
    const nodes = [{
      id: 1,
      name: 'name',
      opened: false,
      children: [{
        id: 2,
        name: 'child'
      }]
    }]
    const wrapper = getTreeWrapper(nodes, {
      canEdit: true
    })
    const childrenContainer = wrapper.find('.treevue-tree-node-children-container')
    expect(childrenContainer.exists()).to.be.false
  })
})
