'use strict'
/* eslint-disable no-unused-expressions */
import { expect } from 'chai'
import { mount } from '@vue/test-utils'
import Tree from '@/components/TreeVue.vue'
import Node from '@/components/Node.vue'
import sinon from 'sinon'

describe('Tree.vue', () => {
  it('renders tree', () => {
    const nodes = []
    const options = {
      checkOnSelect: false
    }
    const wrapper = mount(Tree, { propsData: { items: nodes, options } })

    expect(wrapper.find('.treevue-tree').exists()).to.be.true
  })
  it('initializes storage', () => {
    const nodes = []
    const options = {
      checkOnSelect: false
    }
    const wrapper = mount(Tree, { propsData: { items: nodes, options } })

    expect(wrapper.vm.storage).to.be.not.null
  })
  it('filter with not found nodes shows not found text', () => {
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
    const wrapper = mount(Tree, { propsData: { items: nodes, options } })

    wrapper.vm.storage.filter('node')

    expect(wrapper.find('.treevue-empty-search-text').exists()).to.be.true
  })
  it('filter with found nodes does not show not found text', () => {
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
    const wrapper = mount(Tree, { propsData: { items: nodes, options } })

    wrapper.vm.storage.filter('test')

    expect(wrapper.find('.treevue-empty-search-text').exists()).to.be.false
  })
  it('empty tree does not show not found text', () => {
    const nodes = []
    const options = {
      checkOnSelect: false
    }
    const wrapper = mount(Tree, { propsData: { items: nodes, options } })

    expect(wrapper.find('.treevue-empty-search-text').exists()).to.be.false
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
    const wrapper = mount(Tree, { propsData: { items: nodes, options } })

    expect(wrapper.findAll(Node).length).to.be.eq(nodes.length)
  })
  it('visibleNodes count equals to source node count', () => {
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
    const wrapper = mount(Tree, { propsData: { items: nodes, options } })

    expect(wrapper.vm.visibleNodes.length).to.be.eq(nodes.length)
  })
  it('default treeState', () => {
    const nodes = []
    const options = { }
    const wrapper = mount(Tree, { propsData: { items: nodes, options } })

    expect(wrapper.vm.treeState).to.be.not.null
    expect(wrapper.vm.treeState.nodes).to.be.empty
  })
  it('default treeOptions', () => {
    const nodes = []
    const options = { }
    const wrapper = mount(Tree, { propsData: { items: nodes, options } })

    expect(wrapper.vm.treeOptions).to.be.not.null
    expect(wrapper.vm.treeOptions.icons).to.be.not.null
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
    expect(wrapper.vm.treeOptions.styleClasses).to.be.not.null
    expect(wrapper.vm.treeOptions.styleClasses.icon).to.be.null
    expect(wrapper.vm.treeOptions.styleClasses.text).to.be.null
    expect(wrapper.vm.treeOptions.styleClasses.checkbox).to.be.null
    expect(wrapper.vm.treeOptions.styleClasses.expander).to.be.null
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
      canDelete: true,
      styleClasses: {
        icon: 'icon-test',
        text: 'text-test',
        checkbox: 'checkbox-test',
        expander: 'expander-test'
      }
    }
    const wrapper = mount(Tree, { propsData: { items: nodes, options } })

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
    expect(wrapper.vm.treeOptions.styleClasses.icon).to.be.eq('icon-test')
    expect(wrapper.vm.treeOptions.styleClasses.text).to.be.eq('text-test')
    expect(wrapper.vm.treeOptions.styleClasses.checkbox).to.be.eq('checkbox-test')
    expect(wrapper.vm.treeOptions.styleClasses.expander).to.be.eq('expander-test')
  })
  it('getStorage returns storage', () => {
    const nodes = []
    const options = {
    }
    const wrapper = mount(Tree, { propsData: { items: nodes, options } })
    expect(wrapper.vm.getStorage()).to.be.eq(wrapper.vm.storage)
  })
  it('onNodeClicked emits node:clicked', () => {
    const nodes = [{
      id: 1,
      name: 'name'
    }]
    const options = {
    }
    const wrapper = mount(Tree, { propsData: { items: nodes, options } })
    const node = wrapper.vm.storage.getById(1)
    wrapper.vm.onNodeClicked(node)

    expect(wrapper.emitted()['node:clicked'][0]).to.be.not.null
    expect(wrapper.emitted()['node:clicked'][0][0]).to.be.not.null
    expect(wrapper.emitted()['node:clicked'][0][0].id).to.be.eq(node.id)
  })
  it('onKeyDown calls navigate', () => {
    const nodes = [{
      id: 1,
      name: 'name'
    }]
    const options = {
    }
    const wrapper = mount(Tree, { propsData: { items: nodes, options } })
    const event = {
      key: 'Enter'
    }
    const mock = sinon.mock(wrapper.vm)
    mock.expects('navigate').once().withArgs(event)

    wrapper.vm.onKeyDown(event)

    mock.verify()
  })
  it('keydown event calls onKeyDown', () => {
    const nodes = [{
      id: 1,
      name: 'name'
    }]
    const options = {
    }
    const wrapper = mount(Tree, { propsData: { items: nodes, options } })
    const mock = sinon.mock(wrapper.vm)
    mock.expects('navigate').once()

    wrapper.trigger('keydown', {
      key: 'a'
    })

    mock.verify()
  })
  it('onNodeFocused sets focusedNode', () => {
    const nodes = [{
      id: 1,
      name: 'name'
    }]
    const options = {
    }
    const wrapper = mount(Tree, { propsData: { items: nodes, options } })
    const node = wrapper.vm.storage.getById(1)

    wrapper.vm.onNodeFocused(node)

    expect(wrapper.vm.focusedNode).to.be.not.null
    expect(wrapper.vm.focusedNode.id).to.be.eq(node.id)
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
    const wrapper = mount(Tree, { propsData: { items: nodes, options } })
    const secondNode = wrapper.vm.storage.getById(2)
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
    const wrapper = mount(Tree, { propsData: { items: nodes, options } })
    const secondNode = wrapper.vm.storage.getById(2)
    wrapper.vm.setFocusedNode(secondNode)
    expect(wrapper.vm.storage.selectedNode).to.be.not.null
    expect(wrapper.vm.storage.selectedNode.id).to.be.eq(secondNode.id)
  })
  it('treeState.nodes has all the nodes', () => {
    const nodes = [{
      id: 1,
      name: 'name'
    }, {
      id: 2,
      name: 'name2'
    }]
    const options = {
    }
    const wrapper = mount(Tree, { propsData: { items: nodes, options } })
    const allNodeComponents = wrapper.findAll(Node)
    expect(allNodeComponents.length).to.be.eq(Object.keys(wrapper.vm.treeState.nodes).length)
  })
})
