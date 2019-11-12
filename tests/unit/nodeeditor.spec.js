'use strict'
/* eslint-disable no-unused-expressions */
import { expect } from 'chai'
import { mount } from '@vue/test-utils'
import Tree from '@/components/Tree.vue'
import NodeEditor from '@/components/NodeEditor.vue'

describe('Node.vue', () => {
  function getTreeWrapper (nodes, options = {}) {
    const wrapper = mount(Tree, {
      propsData: { nodes, options }
    })

    return wrapper
  }
  function getNodeEditorWrapper (treeWrapper, node, options = {}) {
    const nodeWrapper = mount(NodeEditor, {
      ...options,
      propsData: {
        node,
        manager: treeWrapper.vm.nodeManager
      }
    })

    return nodeWrapper
  }
  it('editText = node.name', () => {
    const nodes = [{
      id: 1,
      name: 'name'
    }]
    const wrapper = getTreeWrapper(nodes)
    const node = wrapper.vm.nodeManager.getById(1)
    const editorWrapper = getNodeEditorWrapper(wrapper, node, {})
    expect(editorWrapper.vm.editText).to.be.eq('name')
  })
  it('editText = node.title with treeOptions.editNameProp=title', () => {
    const nodes = [{
      id: 1,
      name: 'name',
      title: 'title'
    }]
    const wrapper = getTreeWrapper(nodes, { editNameProp: 'title' })
    const node = wrapper.vm.nodeManager.getById(1)
    const editorWrapper = getNodeEditorWrapper(wrapper, node, {})
    expect(editorWrapper.vm.editText).to.be.eq('title')
  })
  it('input has focus after mount', done => {
    const nodes = [{
      id: 1,
      name: 'name',
      title: 'title'
    }]
    const wrapper = getTreeWrapper(nodes, { editNameProp: 'title' })
    const node = wrapper.vm.nodeManager.getById(1)
    const editorWrapper = getNodeEditorWrapper(wrapper, node, { attachToDocument: true })
    const nodeInput = editorWrapper.find('.treevue-node-editor')
    editorWrapper.vm.$nextTick(() => {
      try {
        expect(document.activeElement).to.be.eq(nodeInput.vm.$el)
        done()
      } finally {
        nodeInput.destroy()
      }
    })
  })
  it('onInput sets editText=event.target.value', () => {
    const nodes = [{
      id: 1,
      name: 'name'
    }]
    const wrapper = getTreeWrapper(nodes)
    const node = wrapper.vm.nodeManager.getById(1)
    const editorWrapper = getNodeEditorWrapper(wrapper, node, {})

    editorWrapper.vm.onInput({ target: { value: 'newname' } })

    expect(editorWrapper.vm.editText).to.be.eq('newname')
  })
  it('cancelEdit emits stopEdit', () => {
    const nodes = [{
      id: 1,
      name: 'name'
    }]
    const wrapper = getTreeWrapper(nodes)
    const node = wrapper.vm.nodeManager.getById(1)
    const editorWrapper = getNodeEditorWrapper(wrapper, node, {})

    editorWrapper.vm.cancelEdit()

    expect(editorWrapper.emitted().stopEdit[0]).to.be.not.null
    expect(node.getName()).to.be.eq('name')
  })
  it('confirmEdit sets node name = editText and emits stopEdit', () => {
    const nodes = [{
      id: 1,
      name: 'name'
    }]
    const wrapper = getTreeWrapper(nodes)
    const node = wrapper.vm.nodeManager.getById(1)
    const editorWrapper = getNodeEditorWrapper(wrapper, node, {})

    editorWrapper.vm.editText = 'newname'
    editorWrapper.vm.confirmEdit()

    expect(editorWrapper.emitted().stopEdit[0]).to.be.not.null
    expect(node.getName()).to.be.eq('newname')
  })
  it('onBlur sets node name = editText and emits stopEdit', () => {
    const nodes = [{
      id: 1,
      name: 'name'
    }]
    const wrapper = getTreeWrapper(nodes)
    const node = wrapper.vm.nodeManager.getById(1)
    const editorWrapper = getNodeEditorWrapper(wrapper, node, {})

    editorWrapper.vm.editText = 'newname'
    editorWrapper.vm.onBlur()

    expect(editorWrapper.emitted().stopEdit[0]).to.be.not.null
    expect(node.getName()).to.be.eq('newname')
  })
  it('onKeyUp with event.key = Enter sets node name = editText and emits stopEdit', () => {
    const nodes = [{
      id: 1,
      name: 'name'
    }]
    const wrapper = getTreeWrapper(nodes)
    const node = wrapper.vm.nodeManager.getById(1)
    const editorWrapper = getNodeEditorWrapper(wrapper, node, {})

    editorWrapper.vm.editText = 'newname'
    editorWrapper.vm.onKeyUp({ key: 'Enter' })

    expect(editorWrapper.emitted().stopEdit[0]).to.be.not.null
    expect(node.getName()).to.be.eq('newname')
  })
  it('onKeyUp with event.key = Escape emits stopEdit', () => {
    const nodes = [{
      id: 1,
      name: 'name'
    }]
    const wrapper = getTreeWrapper(nodes)
    const node = wrapper.vm.nodeManager.getById(1)
    const editorWrapper = getNodeEditorWrapper(wrapper, node, {})

    editorWrapper.vm.editText = 'newname'
    editorWrapper.vm.onKeyUp({ key: 'Escape' })

    expect(editorWrapper.emitted().stopEdit[0]).to.be.not.null
    expect(node.getName()).to.be.eq('name')
  })
  it('onKeyUp with event.key != Escape || Enter does not emit stopEdit', () => {
    const nodes = [{
      id: 1,
      name: 'name'
    }]
    const wrapper = getTreeWrapper(nodes)
    const node = wrapper.vm.nodeManager.getById(1)
    const editorWrapper = getNodeEditorWrapper(wrapper, node, {})

    editorWrapper.vm.editText = 'newname'
    editorWrapper.vm.onKeyUp({ key: 'Space' })

    expect(editorWrapper.emitted()).to.not.have.property('stopEdit')
    expect(node.getName()).to.be.eq('name')
  })
})
