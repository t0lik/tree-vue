'use strict'
/* eslint-disable no-unused-expressions */
import { expect } from 'chai'
import { mount } from '@vue/test-utils'
import Tree from '@/components/Tree.vue'
import NodeExpander from '@/components/NodeExpander.vue'

describe('Node.vue', () => {
  function getTreeWrapper (nodes, options = {}) {
    const wrapper = mount(Tree, {
      propsData: { nodes, options }
    })

    return wrapper
  }
  function getNodeExpanderWrapper (treeWrapper, node, options = {}) {
    const nodeWrapper = mount(NodeExpander, {
      ...options,
      propsData: {
        value: node.states.open,
        icons: treeWrapper.vm.treeOptions.icons,
        disabled: node.states.disabled
      }
    })

    return nodeWrapper
  }
  it('closedIcon = treeOptions.icons.closedIcon', () => {
    const nodes = [{
      id: 1,
      name: 'name'
    }]
    const wrapper = getTreeWrapper(nodes)
    const node = wrapper.vm.nodeManager.getById(1)
    const expanderWrapper = getNodeExpanderWrapper(wrapper, node, {})
    expect(expanderWrapper.vm.closedIcon).to.be.eq(wrapper.vm.treeOptions.icons.closedIcon)
  })
  it('openIcon = treeOptions.icons.openIcon', () => {
    const nodes = [{
      id: 1,
      name: 'name'
    }]
    const wrapper = getTreeWrapper(nodes)
    const node = wrapper.vm.nodeManager.getById(1)
    const expanderWrapper = getNodeExpanderWrapper(wrapper, node, {})
    expect(expanderWrapper.vm.openIcon).to.be.eq(wrapper.vm.treeOptions.icons.openIcon)
  })
  it('expanderClass = openIcon on open node', () => {
    const nodes = [{
      id: 1,
      open: true,
      name: 'name'
    }]
    const wrapper = getTreeWrapper(nodes)
    const node = wrapper.vm.nodeManager.getById(1)
    const expanderWrapper = getNodeExpanderWrapper(wrapper, node, {})
    expect(expanderWrapper.vm.expanderClass).to.be.eq(expanderWrapper.vm.openIcon)
  })
  it('expanderClass = closedIcon on closed node', () => {
    const nodes = [{
      id: 1,
      name: 'name'
    }]
    const wrapper = getTreeWrapper(nodes)
    const node = wrapper.vm.nodeManager.getById(1)
    const expanderWrapper = getNodeExpanderWrapper(wrapper, node, {})
    expect(expanderWrapper.vm.expanderClass).to.be.eq(expanderWrapper.vm.closedIcon)
  })
  it('i classes contain openIcon classes on open node', () => {
    const nodes = [{
      id: 1,
      open: true,
      name: 'name'
    }]
    const wrapper = getTreeWrapper(nodes)
    const node = wrapper.vm.nodeManager.getById(1)
    const expanderWrapper = getNodeExpanderWrapper(wrapper, node, {})
    expect(expanderWrapper.classes('treevue-default-arrow')).to.be.true
    expect(expanderWrapper.classes('expanded')).to.be.true
  })
  it('i classes contain closedIcon classes on closed node', () => {
    const nodes = [{
      id: 1,
      name: 'name'
    }]
    const wrapper = getTreeWrapper(nodes)
    const node = wrapper.vm.nodeManager.getById(1)
    const expanderWrapper = getNodeExpanderWrapper(wrapper, node, {})
    expect(expanderWrapper.classes('treevue-default-arrow')).to.be.true
    expect(expanderWrapper.classes('expanded')).to.be.false
  })
  it('onClick on closed node emits input with true', done => {
    const nodes = [{
      id: 1,
      name: 'name'
    }]
    const wrapper = getTreeWrapper(nodes)
    const node = wrapper.vm.nodeManager.getById(1)
    const expanderWrapper = getNodeExpanderWrapper(wrapper, node, {})
    expanderWrapper.vm.onClick()
    wrapper.vm.$nextTick(() => {
      expect(expanderWrapper.emitted().input[0]).to.be.not.null
      expect(expanderWrapper.emitted().input[0][0]).to.be.not.null
      expect(expanderWrapper.emitted().input[0][0]).to.be.true
      done()
    })
  })
  it('onClick on open node emits input with false', done => {
    const nodes = [{
      id: 1,
      open: true,
      name: 'name'
    }]
    const wrapper = getTreeWrapper(nodes)
    const node = wrapper.vm.nodeManager.getById(1)
    const expanderWrapper = getNodeExpanderWrapper(wrapper, node, {})

    expanderWrapper.vm.onClick()

    wrapper.vm.$nextTick(() => {
      expect(expanderWrapper.emitted().input[0]).to.be.not.null
      expect(expanderWrapper.emitted().input[0][0]).to.be.not.null
      expect(expanderWrapper.emitted().input[0][0]).to.be.false
      done()
    })
  })
  it('onClick does not emit input event on disabled node', done => {
    const nodes = [{
      id: 1,
      disabled: true,
      name: 'name'
    }]
    const wrapper = getTreeWrapper(nodes)
    const node = wrapper.vm.nodeManager.getById(1)
    const expanderWrapper = getNodeExpanderWrapper(wrapper, node, {})

    expanderWrapper.vm.onClick()

    wrapper.vm.$nextTick(() => {
      expect(expanderWrapper.emitted()).to.not.have.property('input')
      done()
    })
  })
})
