/* eslint-disable no-unused-expressions */
import { expect } from 'chai'
import { mount } from '@vue/test-utils'
import Tree from '@/components/Tree.vue'
import Node from '@/components/Node.vue'
// import fontawesomeManager from '@/styleManagers/fontawesomeManager'
// import defaultStyleManager from '@/styleManagers/defaultStyleManager'

describe('Tree.vue', () => {
  it('renders tree', () => {
    const nodes = []
    const options = {
      checkOnSelect: false
    }
    const wrapper = mount(Tree, { propsData: { nodes, options } })

    expect(wrapper.find('.treevue-tree').exists()).to.be.true
  })
  it('initializes node manager', () => {
    const nodes = []
    const options = {
      checkOnSelect: false
    }
    const wrapper = mount(Tree, { propsData: { nodes, options } })

    expect(wrapper.vm.nodeManager).to.be.not.null
  })
  it('Node.vue count equals to source node count', () => {
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
    const wrapper = mount(Tree, { propsData: { nodes, options } })

    expect(wrapper.findAll(Node).length).to.be.eq(nodes.length)
  })
  it('visibleItems count equals to source node count', () => {
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
    const wrapper = mount(Tree, { propsData: { nodes, options } })

    expect(wrapper.vm.visibleItems.length).to.be.eq(nodes.length)
  })
  it('default treeState', () => {
    const nodes = []
    const options = { }
    const wrapper = mount(Tree, { propsData: { nodes, options } })

    expect(wrapper.vm.treeState).to.be.not.null
    expect(wrapper.vm.treeState.nodes).to.be.empty
  })
  it('default treeOptions', () => {
    const nodes = []
    const options = { }
    const wrapper = mount(Tree, { propsData: { nodes, options } })

    expect(wrapper.vm.treeOptions).to.be.not.null
    expect(wrapper.vm.treeOptions.styleManager).to.be.not.null
    expect(wrapper.vm.treeOptions.multiselect).to.be.false
    expect(wrapper.vm.treeOptions.showCheckbox).to.be.true
    expect(wrapper.vm.treeOptions.showIcon).to.be.false
    expect(wrapper.vm.treeOptions.hideEmptyIcon).to.be.true
    expect(wrapper.vm.treeOptions.checkOnSelect).to.be.false
    expect(wrapper.vm.treeOptions.checkMode).to.be.eq('independent')
    expect(wrapper.vm.treeOptions.openOnSelect).to.be.false
    expect(wrapper.vm.treeOptions.autoSort).to.be.false
    expect(wrapper.vm.treeOptions.sortComparator).to.be.null
    expect(wrapper.vm.treeOptions.idProp).to.be.eq('id')
    expect(wrapper.vm.treeOptions.nameProp).to.be.eq('name')
    expect(wrapper.vm.treeOptions.childrenProp).to.be.eq('children')
    expect(wrapper.vm.treeOptions.notFoundText).to.be.eq('no nodes are found')
    expect(wrapper.vm.treeOptions.canEdit).to.be.false
    expect(wrapper.vm.treeOptions.canDelete).to.be.false
  })
  it('set treeOptions to non-default values', () => {
    const nodes = []
    const options = {
      multiselect: true,
      showCheckbox: false,
      showIcon: true,
      hideEmptyIcon: false,
      checkOnSelect: true,
      checkMode: 'linked',
      openOnSelect: true,
      autoSort: true,
      sortComparator: (node1, node2) => this.getName(node1).localeCompare(this.getName(node2)),
      idProp: 'id_',
      nameProp: 'text',
      childrenProp: 'kids',
      notFoundText: 'no more nodes are found',
      canEdit: true,
      canDelete: true
    }
    const wrapper = mount(Tree, { propsData: { nodes, options } })

    expect(wrapper.vm.treeOptions.multiselect).to.be.true
    expect(wrapper.vm.treeOptions.showCheckbox).to.be.false
    expect(wrapper.vm.treeOptions.showIcon).to.be.true
    expect(wrapper.vm.treeOptions.hideEmptyIcon).to.be.false
    expect(wrapper.vm.treeOptions.checkOnSelect).to.be.true
    expect(wrapper.vm.treeOptions.checkMode).to.be.eq('linked')
    expect(wrapper.vm.treeOptions.openOnSelect).to.be.true
    expect(wrapper.vm.treeOptions.autoSort).to.be.true
    expect(wrapper.vm.treeOptions.sortComparator).to.be.not.null
    expect(wrapper.vm.treeOptions.idProp).to.be.eq('id_')
    expect(wrapper.vm.treeOptions.nameProp).to.be.eq('text')
    expect(wrapper.vm.treeOptions.childrenProp).to.be.eq('kids')
    expect(wrapper.vm.treeOptions.notFoundText).to.be.eq('no more nodes are found')
    expect(wrapper.vm.treeOptions.canEdit).to.be.true
    expect(wrapper.vm.treeOptions.canDelete).to.be.true
  })
  it('getNodeManager returns nodeManager', () => {
    const nodes = []
    const options = {
    }
    const wrapper = mount(Tree, { propsData: { nodes, options } })
    expect(wrapper.vm.getNodeManager()).to.be.eq(wrapper.vm.nodeManager)
  })
  it('click on node emits node:clicked', done => {
    const nodes = [{
      id: 1,
      name: 'name'
    }]
    const options = {
    }
    const wrapper = mount(Tree, { propsData: { nodes, options } })
    const clickableNode = wrapper.find('.treevue-tree-node')
    clickableNode.trigger('click')
    wrapper.vm.$nextTick(() => {
      expect(wrapper.emitted()['node:clicked'][0]).to.be.not.null
      expect(wrapper.emitted()['node:clicked'][0][0]).to.be.not.null
      expect(wrapper.emitted()['node:clicked'][0][0].item).to.be.eq(nodes[0])
      done()
    })
  })
  it('click on node text emits node:selected', done => {
    const nodes = [{
      id: 1,
      name: 'name'
    }]
    const options = {
    }
    const wrapper = mount(Tree, { propsData: { nodes, options } })
    const clickableText = wrapper.find('.treevue-tree-node .treevue-node-text')
    clickableText.trigger('click')
    wrapper.vm.$nextTick(() => {
      expect(wrapper.emitted()['node:selected'][0]).to.be.not.null
      expect(wrapper.emitted()['node:selected'][0][0]).to.be.not.null
      expect(wrapper.emitted()['node:selected'][0][0].item).to.be.eq(nodes[0])
      done()
    })
  })
  it('click and focus on node text sets focusedNode', done => {
    const nodes = [{
      id: 1,
      name: 'name'
    }]
    const options = {
    }
    const wrapper = mount(Tree, { propsData: { nodes, options } })
    const clickableText = wrapper.find('.treevue-tree-node .treevue-node-text')
    clickableText.trigger('click')
    clickableText.trigger('focus')
    wrapper.vm.$nextTick(() => {
      expect(wrapper.vm.focusedNode).to.be.not.null
      done()
    })
  })
  it('key Down selects next node', done => {
    const nodes = [{
      id: 1,
      name: 'name'
    }, {
      id: 2,
      name: 'name2'
    }]
    const options = {
    }
    const wrapper = mount(Tree, { propsData: { nodes, options } })
    const clickableText = wrapper.find('.treevue-tree-node .treevue-node-text')
    clickableText.trigger('click')
    clickableText.trigger('focus')
    wrapper.vm.$nextTick(() => {
      expect(wrapper.emitted()['node:selected'][0]).to.be.not.null
      wrapper.trigger('keydown.down')
      wrapper.vm.$nextTick(() => {
        expect(wrapper.vm.nodeManager.selectedNode).to.be.not.null
        expect(wrapper.vm.nodeManager.selectedNode.item.id).to.be.eq(nodes[1].id)
        expect(wrapper.emitted()['node:selected'][1]).to.be.not.null
        expect(wrapper.emitted()['node:selected'][1][0]).to.be.not.null
        expect(wrapper.emitted()['node:selected'][1][0].item.id).to.be.eq(nodes[1].id)
        done()
      })
    })
  })
  it('setFocusedNode sets focusedNode', () => {
    const nodes = [{
      id: 1,
      name: 'name'
    }, {
      id: 2,
      name: 'name2'
    }]
    const options = {
    }
    const wrapper = mount(Tree, { propsData: { nodes, options } })
    const secondNode = wrapper.vm.nodeManager.getById(2)
    wrapper.vm.setFocusedNode(secondNode)
    expect(wrapper.vm.focusedNode).to.be.not.null
    expect(wrapper.vm.focusedNode.id).to.be.eq(secondNode.id)
  })
  it('setFocusedNode sets selectedNode', () => {
    const nodes = [{
      id: 1,
      name: 'name'
    }, {
      id: 2,
      name: 'name2'
    }]
    const options = {
    }
    const wrapper = mount(Tree, { propsData: { nodes, options } })
    const secondNode = wrapper.vm.nodeManager.getById(2)
    wrapper.vm.setFocusedNode(secondNode)
    expect(wrapper.emitted()['node:selected'][0]).to.be.not.null
    expect(wrapper.vm.nodeManager.selectedNode).to.be.not.null
    expect(wrapper.vm.nodeManager.selectedNode.id).to.be.eq(secondNode.id)
  })
})
