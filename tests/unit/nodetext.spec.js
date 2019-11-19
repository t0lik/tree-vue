'use strict'

/* eslint-disable no-unused-expressions */
import { expect } from 'chai'
import { mount } from '@vue/test-utils'
import Tree from '@/components/TreeVue.vue'
import NodeText from '@/components/NodeText.vue'

describe('NodeText.vue', () => {
  function getTreeWrapper (nodes, options = {}) {
    const wrapper = mount(Tree, {
      propsData: { nodes, options }
    })

    return wrapper
  }
  function getNodeTextWrapper (treeWrapper, node, options = {}) {
    const nodeWrapper = mount(NodeText, {
      ...options,
      propsData: {
        options: treeWrapper.vm.treeOptions,
        node,
        title: node.getName()
      }
    })

    return nodeWrapper
  }
  it('span text = title prop', () => {
    const nodes = [{
      id: 1,
      name: 'name'
    }]
    const wrapper = getTreeWrapper(nodes)
    const node = wrapper.vm.nodeManager.getById(1)
    const textWrapper = getNodeTextWrapper(wrapper, node, {})
    const spanWrapper = textWrapper.find('span')
    expect(spanWrapper.text()).to.be.eq('name')
  })
  it('focus on nodetext emits node:focused', () => {
    const nodes = [{
      id: 1,
      name: 'name'
    }]
    const wrapper = getTreeWrapper(nodes)
    const node = wrapper.vm.nodeManager.getById(1)
    const textWrapper = getNodeTextWrapper(wrapper, node, {})

    textWrapper.vm.focus()

    expect(textWrapper.emitted()['node:focused']).to.be.not.null
    expect(textWrapper.emitted()['node:focused'][0]).to.be.not.null
    expect(textWrapper.emitted()['node:focused'][0][0]).to.be.eq(node)
  })
  it('double click on nodetext with treeOptions.canEdit=true emits startEdit', () => {
    const nodes = [{
      id: 1,
      name: 'name'
    }]
    const wrapper = getTreeWrapper(nodes, {
      canEdit: true
    })
    const node = wrapper.vm.nodeManager.getById(1)
    const textWrapper = getNodeTextWrapper(wrapper, node, {})

    textWrapper.trigger('dblclick')

    expect(textWrapper.emitted().startEdit).to.be.not.null
    expect(textWrapper.emitted().startEdit[0]).to.be.not.null
    expect(textWrapper.emitted().startEdit[0][0]).to.be.eq(node)
  })
  it('double click on nodetext with treeOptions.canEdit=false does not emit startEdit', () => {
    const nodes = [{
      id: 1,
      name: 'name'
    }]
    const wrapper = getTreeWrapper(nodes, {
      canEdit: false
    })
    const node = wrapper.vm.nodeManager.getById(1)
    const textWrapper = getNodeTextWrapper(wrapper, node, {})

    textWrapper.trigger('dblclick')

    expect(textWrapper.emitted()).to.not.have.property('startEdit')
  })
  it('focus function sets focus on span', done => {
    const nodes = [{
      id: 1,
      name: 'name',
      title: 'title'
    }]
    const wrapper = getTreeWrapper(nodes, { editNameProp: 'title' })
    const node = wrapper.vm.nodeManager.getById(1)
    const textWrapper = getNodeTextWrapper(wrapper, node, { attachToDocument: true })
    const nodeSpan = textWrapper.find('.treevue-node-text')

    textWrapper.vm.focus()

    textWrapper.vm.$nextTick(() => {
      try {
        expect(document.activeElement).to.be.eq(nodeSpan.vm.$el)
        done()
      } finally {
        nodeSpan.destroy()
      }
    })
  })
})
