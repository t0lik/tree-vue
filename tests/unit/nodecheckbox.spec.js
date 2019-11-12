'use strict'
/* eslint-disable no-unused-expressions */
import { expect } from 'chai'
import { mount } from '@vue/test-utils'
import Tree from '@/components/Tree.vue'
import NodeCheckbox from '@/components/NodeCheckbox.vue'

describe('Node.vue', () => {
  function getTreeWrapper (nodes, options = {}) {
    const wrapper = mount(Tree, {
      propsData: { nodes, options }
    })

    return wrapper
  }
  function getNodeCheckboxWrapper (treeWrapper, node, options = {}) {
    const nodeWrapper = mount(NodeCheckbox, {
      ...options,
      propsData: {
        node,
        value: node.states.checked,
        styleManager: treeWrapper.vm.treeOptions.styleManager,
        disabled: node.states.disabled
      }
    })

    return nodeWrapper
  }
  it('checkedIcon = treeOptions.styleManager.checkedIcon', () => {
    const nodes = [{
      id: 1,
      name: 'name'
    }]
    const wrapper = getTreeWrapper(nodes)
    const node = wrapper.vm.nodeManager.getById(1)
    const checkboxWrapper = getNodeCheckboxWrapper(wrapper, node, {})
    expect(checkboxWrapper.vm.checkedIcon).to.be.eq(wrapper.vm.treeOptions.styleManager.checkedIcon)
  })
  it('uncheckedIcon = treeOptions.styleManager.uncheckedIcon', () => {
    const nodes = [{
      id: 1,
      name: 'name'
    }]
    const wrapper = getTreeWrapper(nodes)
    const node = wrapper.vm.nodeManager.getById(1)
    const checkboxWrapper = getNodeCheckboxWrapper(wrapper, node, {})
    expect(checkboxWrapper.vm.uncheckedIcon).to.be.eq(wrapper.vm.treeOptions.styleManager.uncheckedIcon)
  })
  it('partiallyCheckedIcon = treeOptions.styleManager.partiallyCheckedIcon', () => {
    const nodes = [{
      id: 1,
      name: 'name'
    }]
    const wrapper = getTreeWrapper(nodes)
    const node = wrapper.vm.nodeManager.getById(1)
    const checkboxWrapper = getNodeCheckboxWrapper(wrapper, node, {})
    expect(checkboxWrapper.vm.partiallyCheckedIcon).to.be.eq(wrapper.vm.treeOptions.styleManager.partiallyCheckedIcon)
  })
  it('partiallyCheckedIcon = treeOptions.styleManager.partiallyCheckedIcon', () => {
    const nodes = [{
      id: 1,
      name: 'name'
    }]
    const wrapper = getTreeWrapper(nodes)
    const node = wrapper.vm.nodeManager.getById(1)
    const checkboxWrapper = getNodeCheckboxWrapper(wrapper, node, {})
    expect(checkboxWrapper.vm.partiallyCheckedIcon).to.be.eq(wrapper.vm.treeOptions.styleManager.partiallyCheckedIcon)
  })
  it('checkClass = checkedIcon on checked node', () => {
    const nodes = [{
      id: 1,
      checked: true,
      name: 'name'
    }]
    const wrapper = getTreeWrapper(nodes)
    const node = wrapper.vm.nodeManager.getById(1)
    const checkboxWrapper = getNodeCheckboxWrapper(wrapper, node, {})
    expect(checkboxWrapper.vm.checkClass).to.be.eq(checkboxWrapper.vm.checkedIcon)
  })
  it('checkClass = uncheckedIcon on unchecked node', () => {
    const nodes = [{
      id: 1,
      name: 'name'
    }]
    const wrapper = getTreeWrapper(nodes)
    const node = wrapper.vm.nodeManager.getById(1)
    const checkboxWrapper = getNodeCheckboxWrapper(wrapper, node, {})
    expect(checkboxWrapper.vm.checkClass).to.be.eq(checkboxWrapper.vm.uncheckedIcon)
  })
  it('checkClass = partiallyCheckedIcon on node in an indeterminate state', () => {
    const nodes = [{
      id: 1,
      name: 'name',
      children: [{
        id: 2,
        name: 'child1',
        checked: true
      }, {
        id: 3,
        name: 'child2'
      }]
    }]
    const wrapper = getTreeWrapper(nodes)
    const node = wrapper.vm.nodeManager.getById(1)
    const checkboxWrapper = getNodeCheckboxWrapper(wrapper, node, {})
    expect(checkboxWrapper.vm.checkClass).to.be.eq(checkboxWrapper.vm.partiallyCheckedIcon)
  })
  it('onClick on unchecked node emits input with true', done => {
    const nodes = [{
      id: 1,
      name: 'name'
    }]
    const wrapper = getTreeWrapper(nodes)
    const node = wrapper.vm.nodeManager.getById(1)
    const checkboxWrapper = getNodeCheckboxWrapper(wrapper, node, {})
    checkboxWrapper.vm.onClick()
    wrapper.vm.$nextTick(() => {
      expect(checkboxWrapper.emitted().input[0]).to.be.not.null
      expect(checkboxWrapper.emitted().input[0][0]).to.be.not.null
      expect(checkboxWrapper.emitted().input[0][0]).to.be.true
      done()
    })
  })
  it('onClick on checked node emits input with false', done => {
    const nodes = [{
      id: 1,
      checked: true,
      name: 'name'
    }]
    const wrapper = getTreeWrapper(nodes)
    const node = wrapper.vm.nodeManager.getById(1)
    const checkboxWrapper = getNodeCheckboxWrapper(wrapper, node, {})

    checkboxWrapper.vm.onClick()

    wrapper.vm.$nextTick(() => {
      expect(checkboxWrapper.emitted().input[0]).to.be.not.null
      expect(checkboxWrapper.emitted().input[0][0]).to.be.not.null
      expect(checkboxWrapper.emitted().input[0][0]).to.be.false
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
    const checkboxWrapper = getNodeCheckboxWrapper(wrapper, node, {})

    checkboxWrapper.vm.onClick()

    wrapper.vm.$nextTick(() => {
      expect(checkboxWrapper.emitted()).to.not.have.property('input')
      done()
    })
  })
})
