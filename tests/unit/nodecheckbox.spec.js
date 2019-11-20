'use strict'
/* eslint-disable no-unused-expressions */
import { expect } from 'chai'
import { mount } from '@vue/test-utils'
import Tree from '@/components/TreeVue.vue'
import NodeCheckbox from '@/components/NodeCheckbox.vue'

describe('Node.vue', () => {
  function getTreeWrapper (items, options = {}) {
    const wrapper = mount(Tree, {
      propsData: { items, options }
    })

    return wrapper
  }
  function getNodeCheckboxWrapper (treeWrapper, node, options = {}) {
    const nodeWrapper = mount(NodeCheckbox, {
      ...options,
      propsData: {
        node,
        value: node.states.checked,
        icons: treeWrapper.vm.treeOptions.icons,
        disabled: node.states.disabled
      }
    })

    return nodeWrapper
  }
  it('checkedIcon = treeOptions.icons.checkedIcon', () => {
    const nodes = [{
      id: 1,
      name: 'name'
    }]
    const wrapper = getTreeWrapper(nodes)
    const node = wrapper.vm.storage.getById(1)
    const checkboxWrapper = getNodeCheckboxWrapper(wrapper, node, {})
    expect(checkboxWrapper.vm.checkedIcon).to.be.eq(wrapper.vm.treeOptions.icons.checkedIcon)
  })
  it('uncheckedIcon = treeOptions.icons.uncheckedIcon', () => {
    const nodes = [{
      id: 1,
      name: 'name'
    }]
    const wrapper = getTreeWrapper(nodes)
    const node = wrapper.vm.storage.getById(1)
    const checkboxWrapper = getNodeCheckboxWrapper(wrapper, node, {})
    expect(checkboxWrapper.vm.uncheckedIcon).to.be.eq(wrapper.vm.treeOptions.icons.uncheckedIcon)
  })
  it('partiallyCheckedIcon = treeOptions.icons.partiallyCheckedIcon', () => {
    const nodes = [{
      id: 1,
      name: 'name'
    }]
    const wrapper = getTreeWrapper(nodes)
    const node = wrapper.vm.storage.getById(1)
    const checkboxWrapper = getNodeCheckboxWrapper(wrapper, node, {})
    expect(checkboxWrapper.vm.partiallyCheckedIcon).to.be.eq(wrapper.vm.treeOptions.icons.partiallyCheckedIcon)
  })
  it('partiallyCheckedIcon = treeOptions.icons.partiallyCheckedIcon', () => {
    const nodes = [{
      id: 1,
      name: 'name'
    }]
    const wrapper = getTreeWrapper(nodes)
    const node = wrapper.vm.storage.getById(1)
    const checkboxWrapper = getNodeCheckboxWrapper(wrapper, node, {})
    expect(checkboxWrapper.vm.partiallyCheckedIcon).to.be.eq(wrapper.vm.treeOptions.icons.partiallyCheckedIcon)
  })
  it('checkClass = checkedIcon on checked node', () => {
    const nodes = [{
      id: 1,
      checked: true,
      name: 'name'
    }]
    const wrapper = getTreeWrapper(nodes)
    const node = wrapper.vm.storage.getById(1)
    const checkboxWrapper = getNodeCheckboxWrapper(wrapper, node, {})
    expect(checkboxWrapper.vm.checkClass).to.be.eq(checkboxWrapper.vm.checkedIcon)
  })
  it('checkClass = uncheckedIcon on unchecked node', () => {
    const nodes = [{
      id: 1,
      name: 'name'
    }]
    const wrapper = getTreeWrapper(nodes)
    const node = wrapper.vm.storage.getById(1)
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
    const wrapper = getTreeWrapper(nodes, { checkMode: 'linked' })
    const node = wrapper.vm.storage.getById(1)
    const checkboxWrapper = getNodeCheckboxWrapper(wrapper, node, {})
    expect(checkboxWrapper.vm.checkClass).to.be.eq(checkboxWrapper.vm.partiallyCheckedIcon)
  })
  it('i classes contain checkedIcon classes on checked node', () => {
    const nodes = [{
      id: 1,
      checked: true,
      name: 'name'
    }]
    const wrapper = getTreeWrapper(nodes)
    const node = wrapper.vm.storage.getById(1)
    const checkboxWrapper = getNodeCheckboxWrapper(wrapper, node, {})
    expect(checkboxWrapper.classes('treevue-default-checkbox')).to.be.true
    expect(checkboxWrapper.classes('checked')).to.be.true
  })
  it('i classes contain uncheckedIcon classes on unchecked node', () => {
    const nodes = [{
      id: 1,
      name: 'name'
    }]
    const wrapper = getTreeWrapper(nodes)
    const node = wrapper.vm.storage.getById(1)
    const checkboxWrapper = getNodeCheckboxWrapper(wrapper, node, {})
    expect(checkboxWrapper.classes('treevue-default-checkbox')).to.be.true
    expect(checkboxWrapper.classes('checked')).to.be.false
  })
  it('i classes contain partiallyCheckedIcon classes on node in indeterminate state', () => {
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
    const wrapper = getTreeWrapper(nodes, { checkMode: 'linked' })
    const node = wrapper.vm.storage.getById(1)
    const checkboxWrapper = getNodeCheckboxWrapper(wrapper, node, {})
    expect(checkboxWrapper.classes('treevue-default-checkbox')).to.be.true
    expect(checkboxWrapper.classes('indeterminate')).to.be.true
    expect(checkboxWrapper.classes('checked')).to.be.false
  })
  it('onClick on unchecked node emits input with true', done => {
    const nodes = [{
      id: 1,
      name: 'name'
    }]
    const wrapper = getTreeWrapper(nodes)
    const node = wrapper.vm.storage.getById(1)
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
    const node = wrapper.vm.storage.getById(1)
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
    const node = wrapper.vm.storage.getById(1)
    const checkboxWrapper = getNodeCheckboxWrapper(wrapper, node, {})

    checkboxWrapper.vm.onClick()

    wrapper.vm.$nextTick(() => {
      expect(checkboxWrapper.emitted()).to.not.have.property('input')
      done()
    })
  })
})
