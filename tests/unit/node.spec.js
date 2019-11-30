'use strict'
/* eslint-disable no-unused-expressions */
import { expect } from 'chai'
import { mount } from '@vue/test-utils'
import Tree from '@/components/TreeVue.vue'
import Node from '@/components/Node.vue'
import NodeExpander from '@/components/NodeExpander.vue'
import NodeCheckbox from '@/components/NodeCheckbox.vue'
import NodeIcon from '@/components/NodeIcon.vue'
import NodeText from '@/components/NodeText.vue'
import NodeEditor from '@/components/NodeEditor.vue'
import fontawesomeIcons from '@/icons/fontawesomeIcons'
import defaultIcons from '@/icons/defaultIcons'

describe('Node.vue', () => {
  function clickFirstFoundNodeText (wrapper) {
    const clickableText = wrapper.find('.treevue-tree-node .treevue-node-text')
    clickableText.trigger('click')
    clickableText.trigger('focus')
  }
  async function getTreeWrapper (items, options = {}) {
    const wrapper = mount(Tree, {
      propsData: { items, options }
    })
    await wrapper.vm.$nextTick()

    return wrapper
  }
  function getNodeWrapper (treeWrapper, node, options = {}) {
    const nodeWrapper = mount(Node, {
      ...options,
      propsData: {
        node,
        state: treeWrapper.vm.treeState,
        storage: treeWrapper.vm.storage,
        options: treeWrapper.vm.treeOptions
      }
    })

    return nodeWrapper
  }
  it('click and focus on node text sets focusedNode', async () => {
    const nodes = [{
      id: 1,
      name: 'name'
    }]
    const wrapper = await getTreeWrapper(nodes)

    const clickableText = wrapper.find('.treevue-tree-node .treevue-node-text')
    clickableText.trigger('click')
    clickableText.trigger('focus')
    expect(wrapper.vm.focusedNode).to.be.not.null
  })
  it('click on node emits clicked', async () => {
    const nodes = [{
      id: 1,
      name: 'name'
    }]
    const wrapper = await getTreeWrapper(nodes)

    const node = wrapper.vm.storage.getById(1)
    const nodeWrapper = getNodeWrapper(wrapper, node)
    const clickableText = nodeWrapper.find('.treevue-tree-node .treevue-node-text')
    clickableText.trigger('click')

    await wrapper.vm.$nextTick()

    expect(nodeWrapper.emitted().clicked[0]).to.be.not.null
    expect(nodeWrapper.emitted().clicked[0][0]).to.be.not.null
    expect(nodeWrapper.emitted().clicked[0][0].item).to.be.eq(nodes[0])
  })
  it('node without children has no-children class', async () => {
    const nodes = [{
      id: 1,
      name: 'name'
    }]
    const wrapper = await getTreeWrapper(nodes)

    const node = wrapper.vm.storage.getById(1)
    const nodeWrapper = getNodeWrapper(wrapper, node)
    expect(nodeWrapper.classes('no-children')).to.be.true
    expect(nodeWrapper.vm.nodeContainerClasses).to.have.property('no-children', true)
  })
  it('node with children has no no-children class', async () => {
    const nodes = [{
      id: 1,
      name: 'name',
      children: [{
        id: 2,
        name: 'child'
      }]
    }]
    const wrapper = await getTreeWrapper(nodes)

    const node = wrapper.vm.storage.getById(1)
    const nodeWrapper = getNodeWrapper(wrapper, node)
    expect(nodeWrapper.classes('no-children')).to.be.false
    expect(nodeWrapper.vm.nodeContainerClasses).to.have.property('no-children', false)
  })
  it('not selected node has no selected class', async () => {
    const nodes = [{
      id: 1,
      name: 'name',
      children: [{
        id: 2,
        name: 'child'
      }]
    }]
    const wrapper = await getTreeWrapper(nodes)

    const node = wrapper.vm.storage.getById(1)
    const nodeWrapper = getNodeWrapper(wrapper, node)
    const innerNodeTag = nodeWrapper.find('.treevue-tree-node-container > .treevue-tree-node')
    expect(innerNodeTag.classes('selected')).to.be.false
    expect(nodeWrapper.vm.nodeClasses).to.have.property('selected', false)
  })
  it('selected node has selected class', async () => {
    const nodes = [{
      id: 1,
      name: 'name',
      children: [{
        id: 2,
        name: 'child'
      }]
    }]
    const wrapper = await getTreeWrapper(nodes)

    const node = wrapper.vm.storage.getById(1)
    wrapper.vm.storage.setSelected(node)
    const nodeWrapper = getNodeWrapper(wrapper, node)
    const innerNodeTag = nodeWrapper.find('.treevue-tree-node-container > .treevue-tree-node')
    expect(innerNodeTag.classes('selected')).to.be.true
    expect(nodeWrapper.vm.nodeClasses).to.have.property('selected', true)
  })
  it('node without children has no NodeExpander', async () => {
    const nodes = [{
      id: 1,
      name: 'name'
    }]
    const wrapper = await getTreeWrapper(nodes)
    const node = wrapper.vm.storage.getById(1)
    const nodeWrapper = getNodeWrapper(wrapper, node)
    expect(nodeWrapper.contains(NodeExpander)).to.be.false
  })
  it('node with children has NodeExpander', async () => {
    const nodes = [{
      id: 1,
      name: 'name',
      children: [{
        id: 2,
        name: 'child'
      }]
    }]
    const wrapper = await getTreeWrapper(nodes)
    const node = wrapper.vm.storage.getById(1)
    const nodeWrapper = getNodeWrapper(wrapper, node)
    expect(nodeWrapper.contains(NodeExpander)).to.be.true
  })
  it('node with treeOptions.showCheckbox=true has NodeCheckbox', async () => {
    const nodes = [{
      id: 1,
      name: 'name'
    }]
    const wrapper = await getTreeWrapper(nodes, {
      showCheckbox: true
    })
    const node = wrapper.vm.storage.getById(1)
    const nodeWrapper = getNodeWrapper(wrapper, node)
    expect(nodeWrapper.contains(NodeCheckbox)).to.be.true
  })
  it('node with treeOptions.showCheckbox=false has no NodeCheckbox', async () => {
    const nodes = [{
      id: 1,
      name: 'name'
    }]
    const wrapper = await getTreeWrapper(nodes, {
      showCheckbox: false
    })
    const node = wrapper.vm.storage.getById(1)
    const nodeWrapper = getNodeWrapper(wrapper, node)
    expect(nodeWrapper.contains(NodeCheckbox)).to.be.false
  })
  it('node with treeOptions.showIcon=true has NodeIcon', async () => {
    const nodes = [{
      id: 1,
      name: 'name',
      icon: 'fa fa-dice-one'
    }]
    const wrapper = await getTreeWrapper(nodes, {
      showIcon: true
    })
    const node = wrapper.vm.storage.getById(1)
    const nodeWrapper = getNodeWrapper(wrapper, node)
    expect(nodeWrapper.contains(NodeIcon)).to.be.true
  })
  it('node with no icon and treeOptions.showIcon=true has no NodeIcon', async () => {
    const nodes = [{
      id: 1,
      name: 'name'
    }]
    const wrapper = await getTreeWrapper(nodes, {
      showIcon: true
    })
    const node = wrapper.vm.storage.getById(1)
    const nodeWrapper = getNodeWrapper(wrapper, node)
    expect(nodeWrapper.contains(NodeIcon)).to.be.false
  })
  it('node with no icon and treeOptions.showIcon=true and treeOptions.hideEmptyIcon=false has NodeIcon', async () => {
    const nodes = [{
      id: 1,
      name: 'name'
    }]
    const wrapper = await getTreeWrapper(nodes, {
      showIcon: true,
      hideEmptyIcon: false
    })
    const node = wrapper.vm.storage.getById(1)
    const nodeWrapper = getNodeWrapper(wrapper, node)
    expect(nodeWrapper.contains(NodeIcon)).to.be.true
  })
  it('node in view mode has NodeText', async () => {
    const nodes = [{
      id: 1,
      name: 'name'
    }]
    const wrapper = await getTreeWrapper(nodes, {
    })
    const node = wrapper.vm.storage.getById(1)
    const nodeWrapper = getNodeWrapper(wrapper, node)
    expect(nodeWrapper.contains(NodeText)).to.be.true
  })
  it('node in edit mode has no NodeText', async () => {
    const nodes = [{
      id: 1,
      name: 'name'
    }]
    const options = {
      checkOnSelect: false,
      canEdit: true
    }
    const wrapper = await getTreeWrapper(nodes, options)

    clickFirstFoundNodeText(wrapper)

    await wrapper.vm.$nextTick()

    wrapper.trigger('keydown', {
      key: 'F2'
    })
    await wrapper.vm.$nextTick()

    const editorWrapper = wrapper.find(NodeText)
    expect(editorWrapper.exists()).to.be.false
  })
  it('node in edit mode has NodeEditor', async () => {
    const nodes = [{
      id: 1,
      name: 'name'
    }]
    const wrapper = await getTreeWrapper(nodes, {
      canEdit: true
    })
    const clickableText = wrapper.find('.treevue-node-text')
    clickableText.trigger('click')
    clickableText.trigger('focus')

    await wrapper.vm.$nextTick()

    wrapper.trigger('keydown', {
      key: 'F2'
    })

    await wrapper.vm.$nextTick()

    const nodeWrapper = wrapper.find(Node)
    expect(nodeWrapper.contains(NodeEditor)).to.be.true
  })
  it('open node with child nodes has child Node components', async () => {
    const nodes = [{
      id: 1,
      name: 'name',
      open: true,
      children: [{
        id: 2,
        name: 'child'
      }]
    }]
    const wrapper = await getTreeWrapper(nodes, {
      canEdit: true
    })
    const childrenContainer = wrapper.find('.treevue-tree-node-children-container')
    expect(childrenContainer.exists()).to.be.true
    expect(childrenContainer.contains(Node)).to.be.true
  })
  it('closed node with child nodes has no child Node components', async () => {
    const nodes = [{
      id: 1,
      name: 'name',
      open: false,
      children: [{
        id: 2,
        name: 'child'
      }]
    }]
    const wrapper = await getTreeWrapper(nodes, {
      canEdit: true
    })
    const childrenContainer = wrapper.find('.treevue-tree-node-children-container')
    expect(childrenContainer.exists()).to.be.false
  })
  it('textClasses = empty class on enabled and not filter-matched node', async () => {
    const nodes = [{
      id: 1,
      name: 'name',
      children: [{
        id: 2,
        name: 'child'
      }]
    }]
    const wrapper = await getTreeWrapper(nodes)
    const node = wrapper.vm.storage.getById(1)
    const nodeWrapper = getNodeWrapper(wrapper, node)
    expect(nodeWrapper.vm.textClasses).to.have.property('filter-matched', false)
    expect(nodeWrapper.vm.textClasses).to.have.property('disabled', false)
  })
  it('textClasses class contains disabled=true on disabled node', async () => {
    const nodes = [{
      id: 1,
      name: 'name',
      disabled: true,
      children: [{
        id: 2,
        name: 'child'
      }]
    }]
    const wrapper = await getTreeWrapper(nodes)
    const node = wrapper.vm.storage.getById(1)
    const nodeWrapper = getNodeWrapper(wrapper, node)
    expect(nodeWrapper.vm.textClasses).to.have.property('disabled', true)
  })
  it('textClasses class contains filter-matched=true on matched node after filter function', async () => {
    const nodes = [{
      id: 1,
      name: 'name',
      children: [{
        id: 2,
        name: 'child'
      }]
    }]
    const wrapper = await getTreeWrapper(nodes)
    wrapper.vm.storage.filter('name')
    const node = wrapper.vm.storage.getById(1)
    const nodeWrapper = getNodeWrapper(wrapper, node)
    expect(nodeWrapper.vm.textClasses).to.have.property('filter-matched', true)
  })
  it('textClasses class contains custom text class from node', async () => {
    const nodes = [{
      id: 1,
      name: 'name',
      children: [{
        id: 2,
        name: 'child'
      }]
    }]
    const wrapper = await getTreeWrapper(nodes)
    const node = wrapper.vm.storage.getById(1)
    wrapper.vm.storage.setTextStyle(node, 'text-class')
    const nodeWrapper = getNodeWrapper(wrapper, node)
    expect(nodeWrapper.vm.textClasses).to.have.property('text-class', true)
  })
  it('textClasses class contains custom text class from treeOptions', async () => {
    const nodes = [{
      id: 1,
      name: 'name',
      children: [{
        id: 2,
        name: 'child'
      }]
    }]
    const wrapper = await getTreeWrapper(nodes, {
      styleClasses: {
        text: 'text-class'
      }
    })
    const node = wrapper.vm.storage.getById(1)
    const nodeWrapper = getNodeWrapper(wrapper, node)
    expect(nodeWrapper.vm.textClasses).to.have.property('text-class', true)
  })
  it('textClasses class contains custom text classes from node if both node and treeOptions classes are set', async () => {
    const nodes = [{
      id: 1,
      name: 'name',
      children: [{
        id: 2,
        name: 'child'
      }]
    }]
    const wrapper = await getTreeWrapper(nodes, {
      styleClasses: {
        text: 'all-text-class'
      }
    })
    const node = wrapper.vm.storage.getById(1)
    wrapper.vm.storage.setTextStyle(node, 'text-class')
    const nodeWrapper = getNodeWrapper(wrapper, node)
    expect(nodeWrapper.vm.textClasses).to.have.property('text-class', true)
    expect(nodeWrapper.vm.textClasses).to.not.have.property('all-text-class')
  })
  it('iconClasses = empty class on enabled node', async () => {
    const nodes = [{
      id: 1,
      name: 'name',
      children: [{
        id: 2,
        name: 'child'
      }]
    }]
    const wrapper = await getTreeWrapper(nodes)
    const node = wrapper.vm.storage.getById(1)
    const nodeWrapper = getNodeWrapper(wrapper, node)
    expect(nodeWrapper.vm.iconClasses).to.have.property('disabled', false)
  })
  it('iconClasses class contains disabled=true on disabled node', async () => {
    const nodes = [{
      id: 1,
      name: 'name',
      disabled: true,
      children: [{
        id: 2,
        name: 'child'
      }]
    }]
    const wrapper = await getTreeWrapper(nodes)
    const node = wrapper.vm.storage.getById(1)
    const nodeWrapper = getNodeWrapper(wrapper, node)
    expect(nodeWrapper.vm.iconClasses).to.have.property('disabled', true)
  })
  it('iconClasses class contains custom icon class from node', async () => {
    const nodes = [{
      id: 1,
      name: 'name',
      children: [{
        id: 2,
        name: 'child'
      }]
    }]
    const wrapper = await getTreeWrapper(nodes)
    const node = wrapper.vm.storage.getById(1)
    wrapper.vm.storage.setIconStyle(node, 'icon-class')
    const nodeWrapper = getNodeWrapper(wrapper, node)
    expect(nodeWrapper.vm.iconClasses).to.have.property('icon-class', true)
  })
  it('iconClasses class contains custom icon class from treeOptions', async () => {
    const nodes = [{
      id: 1,
      name: 'name',
      children: [{
        id: 2,
        name: 'child'
      }]
    }]
    const wrapper = await getTreeWrapper(nodes, {
      styleClasses: {
        icon: 'icon-class'
      }
    })
    const node = wrapper.vm.storage.getById(1)
    const nodeWrapper = getNodeWrapper(wrapper, node)
    expect(nodeWrapper.vm.iconClasses).to.have.property('icon-class', true)
  })
  it('iconClasses class contains custom icon classes from node if both node and treeOptions classes are set', async () => {
    const nodes = [{
      id: 1,
      name: 'name',
      children: [{
        id: 2,
        name: 'child'
      }]
    }]
    const wrapper = await getTreeWrapper(nodes, {
      styleClasses: {
        icon: 'all-icon-class'
      }
    })
    const node = wrapper.vm.storage.getById(1)
    wrapper.vm.storage.setIconStyle(node, 'icon-class')
    const nodeWrapper = getNodeWrapper(wrapper, node)
    expect(nodeWrapper.vm.iconClasses).to.have.property('icon-class', true)
    expect(nodeWrapper.vm.iconClasses).to.not.have.property('all-icon-class')
  })
  it('checkClasses = empty class on enabled node', async () => {
    const nodes = [{
      id: 1,
      name: 'name',
      children: [{
        id: 2,
        name: 'child'
      }]
    }]
    const wrapper = await getTreeWrapper(nodes)
    const node = wrapper.vm.storage.getById(1)
    const nodeWrapper = getNodeWrapper(wrapper, node)
    expect(nodeWrapper.vm.checkClasses).to.have.property('disabled', false)
  })
  it('checkClasses class contains disabled=true on disabled node', async () => {
    const nodes = [{
      id: 1,
      name: 'name',
      disabled: true,
      children: [{
        id: 2,
        name: 'child'
      }]
    }]
    const wrapper = await getTreeWrapper(nodes)
    const node = wrapper.vm.storage.getById(1)
    const nodeWrapper = getNodeWrapper(wrapper, node)
    expect(nodeWrapper.vm.checkClasses).to.have.property('disabled', true)
  })
  it('checkClasses class contains custom checkbox class that is set in node', async () => {
    const nodes = [{
      id: 1,
      name: 'name',
      children: [{
        id: 2,
        name: 'child'
      }]
    }]
    const wrapper = await getTreeWrapper(nodes)
    const node = wrapper.vm.storage.getById(1)
    wrapper.vm.storage.setCheckboxStyle(node, 'checkbox-class')
    const nodeWrapper = getNodeWrapper(wrapper, node)
    expect(nodeWrapper.vm.checkClasses).to.have.property('checkbox-class', true)
  })
  it('checkClasses class contains custom checkbox class from treeOptions', async () => {
    const nodes = [{
      id: 1,
      name: 'name',
      children: [{
        id: 2,
        name: 'child'
      }]
    }]
    const wrapper = await getTreeWrapper(nodes, {
      styleClasses: {
        checkbox: 'checkbox-class'
      }
    })
    const node = wrapper.vm.storage.getById(1)
    const nodeWrapper = getNodeWrapper(wrapper, node)
    expect(nodeWrapper.vm.checkClasses).to.have.property('checkbox-class', true)
  })
  it('checkClasses class contains custom checkbox classes from node if both node and treeOptions classes are set', async () => {
    const nodes = [{
      id: 1,
      name: 'name',
      children: [{
        id: 2,
        name: 'child'
      }]
    }]
    const wrapper = await getTreeWrapper(nodes, {
      styleClasses: {
        checkbox: 'all-checkbox-class'
      }
    })
    const node = wrapper.vm.storage.getById(1)
    wrapper.vm.storage.setCheckboxStyle(node, 'checkbox-class')
    const nodeWrapper = getNodeWrapper(wrapper, node)
    expect(nodeWrapper.vm.checkClasses).to.have.property('checkbox-class', true)
    expect(nodeWrapper.vm.checkClasses).to.not.have.property('all-checkbox-class')
  })
  it('expanderClasses = empty class on enabled node', async () => {
    const nodes = [{
      id: 1,
      name: 'name',
      children: [{
        id: 2,
        name: 'child'
      }]
    }]
    const wrapper = await getTreeWrapper(nodes)
    const node = wrapper.vm.storage.getById(1)
    const nodeWrapper = getNodeWrapper(wrapper, node)
    expect(nodeWrapper.vm.expanderClasses).to.have.property('disabled', false)
  })
  it('expanderClasses class contains disabled=true on disabled node', async () => {
    const nodes = [{
      id: 1,
      name: 'name',
      disabled: true,
      children: [{
        id: 2,
        name: 'child'
      }]
    }]
    const wrapper = await getTreeWrapper(nodes)
    const node = wrapper.vm.storage.getById(1)
    const nodeWrapper = getNodeWrapper(wrapper, node)
    expect(nodeWrapper.vm.expanderClasses).to.have.property('disabled', true)
  })
  it('expanderClasses class contains custom expander class from node', async () => {
    const nodes = [{
      id: 1,
      name: 'name',
      children: [{
        id: 2,
        name: 'child'
      }]
    }]
    const wrapper = await getTreeWrapper(nodes)
    const node = wrapper.vm.storage.getById(1)
    wrapper.vm.storage.setExpanderStyle(node, 'expander-class')
    const nodeWrapper = getNodeWrapper(wrapper, node)
    expect(nodeWrapper.vm.expanderClasses).to.have.property('expander-class', true)
  })
  it('expanderClasses class contains custom expander class from treeOptions', async () => {
    const nodes = [{
      id: 1,
      name: 'name',
      children: [{
        id: 2,
        name: 'child'
      }]
    }]
    const wrapper = await getTreeWrapper(nodes, {
      styleClasses: {
        expander: 'expander-class'
      }
    })
    const node = wrapper.vm.storage.getById(1)
    const nodeWrapper = getNodeWrapper(wrapper, node)
    expect(nodeWrapper.vm.expanderClasses).to.have.property('expander-class', true)
  })
  it('expanderClasses class contains custom expander classes from node if both node and treeOptions classes are set', async () => {
    const nodes = [{
      id: 1,
      name: 'name',
      children: [{
        id: 2,
        name: 'child'
      }]
    }]
    const wrapper = await getTreeWrapper(nodes, {
      styleClasses: {
        expander: 'all-expander-class'
      }
    })
    const node = wrapper.vm.storage.getById(1)
    wrapper.vm.storage.setExpanderStyle(node, 'expander-class')
    const nodeWrapper = getNodeWrapper(wrapper, node)
    expect(nodeWrapper.vm.expanderClasses).to.have.property('expander-class', true)
    expect(nodeWrapper.vm.expanderClasses).to.not.have.property('all-expander-class')
  })
  it('icons prop = defaultIcons with default treeOptions', async () => {
    const nodes = [{
      id: 1,
      name: 'name',
      children: [{
        id: 2,
        name: 'child'
      }]
    }]
    const wrapper = await getTreeWrapper(nodes)
    const node = wrapper.vm.storage.getById(1)
    const nodeWrapper = getNodeWrapper(wrapper, node)
    expect(nodeWrapper.vm.icons).to.be.eq(defaultIcons)
  })
  it('icons prop = treeOptions.icons', async () => {
    const nodes = [{
      id: 1,
      name: 'name',
      children: [{
        id: 2,
        name: 'child'
      }]
    }]
    const wrapper = await getTreeWrapper(nodes, {
      icons: fontawesomeIcons
    })
    const node = wrapper.vm.storage.getById(1)
    const nodeWrapper = getNodeWrapper(wrapper, node)
    expect(nodeWrapper.vm.icons).to.be.eq(fontawesomeIcons)
  })
  it('showCheckbox prop = true with default treeOptions', async () => {
    const nodes = [{
      id: 1,
      name: 'name',
      children: [{
        id: 2,
        name: 'child'
      }]
    }]
    const wrapper = await getTreeWrapper(nodes)
    const node = wrapper.vm.storage.getById(1)
    const nodeWrapper = getNodeWrapper(wrapper, node)
    expect(nodeWrapper.vm.showCheckbox).to.be.true
  })
  it('showCheckbox prop = treeOptions.showCheckbox', async () => {
    const nodes = [{
      id: 1,
      name: 'name',
      children: [{
        id: 2,
        name: 'child'
      }]
    }]
    const wrapper = await getTreeWrapper(nodes, {
      showCheckbox: false
    })
    const node = wrapper.vm.storage.getById(1)
    const nodeWrapper = getNodeWrapper(wrapper, node)
    expect(nodeWrapper.vm.showCheckbox).to.be.false
  })
  it('showIcon prop = false with default treeOptions', async () => {
    const nodes = [{
      id: 1,
      name: 'name',
      children: [{
        id: 2,
        name: 'child'
      }]
    }]
    const wrapper = await getTreeWrapper(nodes)
    const node = wrapper.vm.storage.getById(1)
    const nodeWrapper = getNodeWrapper(wrapper, node)
    expect(nodeWrapper.vm.showIcon).to.be.false
  })
  it('showIcon prop = treeOptions.showIcon', async () => {
    const nodes = [{
      id: 1,
      name: 'name',
      children: [{
        id: 2,
        name: 'child'
      }]
    }]
    const wrapper = await getTreeWrapper(nodes, {
      showIcon: true
    })
    const node = wrapper.vm.storage.getById(1)
    const nodeWrapper = getNodeWrapper(wrapper, node)
    expect(nodeWrapper.vm.showIcon).to.be.true
  })
  it('hideEmptyIcon prop = true with default treeOptions', async () => {
    const nodes = [{
      id: 1,
      name: 'name',
      children: [{
        id: 2,
        name: 'child'
      }]
    }]
    const wrapper = await getTreeWrapper(nodes)
    const node = wrapper.vm.storage.getById(1)
    const nodeWrapper = getNodeWrapper(wrapper, node)
    expect(nodeWrapper.vm.hideEmptyIcon).to.be.true
  })
  it('hideEmptyIcon prop = treeOptions.hideEmptyIcon', async () => {
    const nodes = [{
      id: 1,
      name: 'name',
      children: [{
        id: 2,
        name: 'child'
      }]
    }]
    const wrapper = await getTreeWrapper(nodes, {
      hideEmptyIcon: false
    })
    const node = wrapper.vm.storage.getById(1)
    const nodeWrapper = getNodeWrapper(wrapper, node)
    expect(nodeWrapper.vm.hideEmptyIcon).to.be.false
  })
  it('visibleItems prop = [] with no visible node children', async () => {
    const nodes = [{
      id: 1,
      name: 'name',
      children: [{
        id: 2,
        name: 'child'
      }]
    }]
    const wrapper = await getTreeWrapper(nodes, {
    })
    const node = wrapper.vm.storage.getById(1)
    const nodeWrapper = getNodeWrapper(wrapper, node)
    expect(nodeWrapper.vm.visibleItems).to.be.empty
  })
  it('visibleItems prop = visible node children', async () => {
    const nodes = [{
      id: 1,
      name: 'name',
      open: true,
      children: [{
        id: 2,
        name: 'child'
      }]
    }]
    const wrapper = await getTreeWrapper(nodes, {
    })
    const node = wrapper.vm.storage.getById(1)
    const nodeWrapper = getNodeWrapper(wrapper, node)
    expect(nodeWrapper.vm.visibleItems).to.be.not.empty
    expect(nodeWrapper.vm.visibleItems[0].id).to.be.eq(2)
  })
  it('nodeText prop = node name prop by default', async () => {
    const nodes = [{
      id: 1,
      name: 'name',
      children: [{
        id: 2,
        name: 'child'
      }]
    }]
    const wrapper = await getTreeWrapper(nodes, {
    })
    const node = wrapper.vm.storage.getById(1)
    const nodeWrapper = getNodeWrapper(wrapper, node)
    expect(nodeWrapper.vm.nodeText).to.be.eq('name')
  })
  it('nodeText prop = node title prop with treeOptions.nameProp=title', async () => {
    const nodes = [{
      id: 1,
      name: 'name',
      title: 'title',
      children: [{
        id: 2,
        name: 'child'
      }]
    }]
    const wrapper = await getTreeWrapper(nodes, {
      nameProp: 'title'
    })
    const node = wrapper.vm.storage.getById(1)
    const nodeWrapper = getNodeWrapper(wrapper, node)
    expect(nodeWrapper.vm.nodeText).to.be.eq('title')
  })
  it('treeState.nodes has node after Node.vue is mounted', async () => {
    const nodes = [{
      id: 1,
      name: 'name'
    }]
    const wrapper = await getTreeWrapper(nodes, {
    })
    const node = wrapper.vm.storage.getById(1)
    const nodeWrapper = wrapper.find(Node)
    expect(nodeWrapper.vm.state.nodes).to.have.property(node.id, nodeWrapper.vm)
  })
  it('treeState.nodes has no node after Node.vue is destroyed', async () => {
    const nodes = [{
      id: 1,
      name: 'name'
    }]
    const wrapper = await getTreeWrapper(nodes)

    const node = wrapper.vm.storage.getById(1)

    wrapper.vm.storage.remove(node)

    await wrapper.vm.$nextTick()

    expect(wrapper.vm.treeState.nodes).to.not.have.property(node.id)
  })
  it('combineClasses function returns combined object with first and array of rest arguments as objects', async () => {
    const nodes = [{
      id: 1,
      name: 'name'
    }]
    const wrapper = await getTreeWrapper(nodes, {
    })
    const node = wrapper.vm.storage.getById(1)
    const nodeWrapper = getNodeWrapper(wrapper, node)
    const defaultClass = { 'default-class': true }
    const otherClass = { 'test-class': true }
    const combinesClass = nodeWrapper.vm.combineClasses(defaultClass, [otherClass])
    expect(combinesClass).to.have.property('default-class', true)
    expect(combinesClass).to.have.property('test-class', true)
  })
  it('combineClasses function returns combined object with first argument as object and secord argument as array with string with class names', async () => {
    const nodes = [{
      id: 1,
      name: 'name'
    }]
    const wrapper = await getTreeWrapper(nodes, {
    })
    const node = wrapper.vm.storage.getById(1)
    const nodeWrapper = getNodeWrapper(wrapper, node)
    const defaultClass = { 'default-class': true }
    const otherClass = 'test-class test-class-2'
    const combinesClass = nodeWrapper.vm.combineClasses(defaultClass, [otherClass])

    expect(combinesClass).to.have.property('default-class', true)
    expect(combinesClass).to.have.property('test-class', true)
    expect(combinesClass).to.have.property('test-class-2', true)
  })
  it('combineClasses function returns object from first argument if secord argument = null', async () => {
    const nodes = [{
      id: 1,
      name: 'name'
    }]
    const wrapper = await getTreeWrapper(nodes, {
    })
    const node = wrapper.vm.storage.getById(1)
    const nodeWrapper = getNodeWrapper(wrapper, node)
    const defaultClass = { 'default-class': true }
    const combinesClass = nodeWrapper.vm.combineClasses(defaultClass, null)

    expect(combinesClass).to.have.property('default-class', true)
  })
  it('onChildClicked function emits clicked event with node specifies as first argument to the function', async () => {
    const nodes = [{
      id: 1,
      name: 'name'
    }]
    const wrapper = await getTreeWrapper(nodes, {
    })
    const node = wrapper.vm.storage.getById(1)
    const nodeWrapper = getNodeWrapper(wrapper, node)
    nodeWrapper.vm.onChildClicked(node)

    expect(nodeWrapper.emitted().clicked[0]).to.be.not.null
    expect(nodeWrapper.emitted().clicked[0][0]).to.be.not.null
    expect(nodeWrapper.emitted().clicked[0][0].item).to.be.eq(nodes[0])
  })
  it('onNodeCheckStateChanging with state=true sets node as checked', async () => {
    const nodes = [{
      id: 1,
      name: 'name'
    }]
    const wrapper = await getTreeWrapper(nodes, {
    })
    const node = wrapper.vm.storage.getById(1)
    const nodeWrapper = getNodeWrapper(wrapper, node)
    nodeWrapper.vm.onNodeCheckStateChanging(true)

    expect(node.states.checked).to.be.true
  })
  it('onNodeCheckStateChanging with state=false sets node as unchecked', async () => {
    const nodes = [{
      id: 1,
      name: 'name'
    }]
    const wrapper = await getTreeWrapper(nodes, {
    })
    const node = wrapper.vm.storage.getById(1)
    const nodeWrapper = getNodeWrapper(wrapper, node)
    nodeWrapper.vm.onNodeCheckStateChanging(false)

    expect(node.states.checked).to.be.false
  })
  it('onNodeOpenStateChanging with state=true sets node as open', async () => {
    const nodes = [{
      id: 1,
      name: 'name'
    }]
    const wrapper = await getTreeWrapper(nodes, {
    })
    const node = wrapper.vm.storage.getById(1)
    const nodeWrapper = getNodeWrapper(wrapper, node)
    nodeWrapper.vm.onNodeOpenStateChanging(true)

    expect(node.states.open).to.be.true
  })
  it('onNodeCheckStateChanging with state=false sets node as closed', async () => {
    const nodes = [{
      id: 1,
      name: 'name'
    }]
    const wrapper = await getTreeWrapper(nodes, {
    })
    const node = wrapper.vm.storage.getById(1)
    const nodeWrapper = getNodeWrapper(wrapper, node)
    nodeWrapper.vm.onNodeOpenStateChanging(false)

    expect(node.states.open).to.be.false
  })
  it('onClick function emits clicked event with node and sets it as selected if node enabled', async () => {
    const nodes = [{
      id: 1,
      name: 'name'
    }]
    const wrapper = await getTreeWrapper(nodes, {
    })
    const node = wrapper.vm.storage.getById(1)
    const nodeWrapper = getNodeWrapper(wrapper, node)
    nodeWrapper.vm.onClick(node)

    expect(nodeWrapper.emitted().clicked[0]).to.be.not.null
    expect(nodeWrapper.emitted().clicked[0][0]).to.be.not.null
    expect(nodeWrapper.emitted().clicked[0][0].item).to.be.eq(nodes[0])
    expect(wrapper.vm.storage.selectedNode).to.be.eq(node)
  })
  it('onClick function does nothing if node disabled', async () => {
    const nodes = [{
      id: 1,
      disabled: true,
      name: 'name'
    }]
    const wrapper = await getTreeWrapper(nodes, {
    })
    const node = wrapper.vm.storage.getById(1)
    const nodeWrapper = getNodeWrapper(wrapper, node)
    nodeWrapper.vm.onClick(node)

    expect(nodeWrapper.emitted()).to.be.not.have.property('clicked')
    expect(wrapper.vm.storage.selectedNode).to.be.null
  })
  it('onFocused function emits node:focused event', async () => {
    const nodes = [{
      id: 1,
      name: 'name'
    }]
    const wrapper = await getTreeWrapper(nodes, {
    })
    const node = wrapper.vm.storage.getById(1)
    const nodeWrapper = getNodeWrapper(wrapper, node)
    nodeWrapper.vm.onFocused(node)

    expect(nodeWrapper.emitted()['node:focused'][0]).to.be.not.null
    expect(nodeWrapper.emitted()['node:focused'][0][0]).to.be.not.null
    expect(nodeWrapper.emitted()['node:focused'][0][0]).to.be.eq(node)
  })
  it('focus function moves focus on NodeText span', async () => {
    const nodes = [{
      id: 1,
      name: 'name'
    }]
    const wrapper = await getTreeWrapper(nodes, {
    })
    const node = wrapper.vm.storage.getById(1)
    const nodeWrapper = getNodeWrapper(wrapper, node, { attachToDocument: true })
    try {
      nodeWrapper.vm.focus()
      const nodeText = nodeWrapper.find('.treevue-tree-node .treevue-node-text')

      expect(document.activeElement).to.be.eq(nodeText.vm.$el)
    } finally {
      nodeWrapper.destroy()
    }
  })
  it('onStopEdit function moves focus on NodeText span and sets editorMode=false', async () => {
    const nodes = [{
      id: 1,
      name: 'name'
    }]
    const wrapper = await getTreeWrapper(nodes, {
    })
    const node = wrapper.vm.storage.getById(1)
    const nodeWrapper = getNodeWrapper(wrapper, node, { attachToDocument: true })
    nodeWrapper.vm.onStopEdit()
    const nodeText = nodeWrapper.find('.treevue-tree-node .treevue-node-text')

    await wrapper.vm.$nextTick()

    try {
      expect(nodeWrapper.vm.editorMode).to.be.false
      expect(document.activeElement).to.be.eq(nodeText.vm.$el)
    } finally {
      nodeWrapper.destroy()
    }
  })
  it('startEdit function sets editorMode=true', async () => {
    const nodes = [{
      id: 1,
      name: 'name'
    }]
    const wrapper = await getTreeWrapper(nodes, {
    })
    const node = wrapper.vm.storage.getById(1)
    const nodeWrapper = getNodeWrapper(wrapper, node)

    nodeWrapper.vm.startEdit()

    expect(nodeWrapper.vm.editorMode).to.be.true
  })
})
