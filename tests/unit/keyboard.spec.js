'use strict'
/* eslint-disable no-unused-expressions */
import { expect } from 'chai'
import { mount } from '@vue/test-utils'
import Tree from '@/components/Tree.vue'
// import Node from '@/components/Node.vue'

describe('keyboard mixin', () => {
  it('key Down on first node selects second node', done => {
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
    const wrapper = mount(Tree, { propsData: { nodes, options } })

    wrapper.vm.$nextTick(() => {
      const clickableNode = wrapper.find('.treevue-tree-node')

      clickableNode.trigger('click')
      const clickableText = wrapper.find('.treevue-tree-node .treevue-node-text')
      clickableText.trigger('focus')
      wrapper.trigger('keydown.down')
      wrapper.vm.$nextTick(() => {
        expect(wrapper.vm.nodeManager.selectedNode).to.be.not.null
        expect(wrapper.vm.nodeManager.selectedNode.item.id).to.be.eq(nodes[1].id)
        expect(wrapper.emitted()['node:selected'].length).to.be.eq(2)
        expect(wrapper.emitted()['node:selected'][1]).to.be.not.null
        expect(wrapper.emitted()['node:selected'][1][0]).to.be.not.null
        expect(wrapper.emitted()['node:selected'][1][0].item.id).to.be.eq(nodes[1].id)
        done()
      })
    })
  })
  it('key Down on second node does not change selected node', done => {
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
    const wrapper = mount(Tree, { propsData: { nodes, options } })

    wrapper.vm.$nextTick(() => {
      const clickableNodes = wrapper.findAll('.treevue-tree-node')
      expect(clickableNodes.length).to.be.eq(2)
      const secondNode = clickableNodes.at(1)
      secondNode.trigger('click')
      const clickableText = secondNode.find('.treevue-tree-node .treevue-node-text')
      clickableText.trigger('focus')
      wrapper.trigger('keydown.down')
      wrapper.vm.$nextTick(() => {
        expect(wrapper.vm.nodeManager.selectedNode).to.be.not.null
        expect(wrapper.vm.nodeManager.selectedNode.item.id).to.be.eq(nodes[1].id)
        expect(wrapper.emitted()['node:selected'].length).to.be.eq(1)
        expect(wrapper.emitted()['node:selected'][0]).to.be.not.null
        expect(wrapper.emitted()['node:selected'][0][0]).to.be.not.null
        expect(wrapper.emitted()['node:selected'][0][0].item.id).to.be.eq(nodes[1].id)
        done()
      })
    })
  })
  it('key Up on second node selects first node', done => {
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
    const wrapper = mount(Tree, { propsData: { nodes, options } })

    wrapper.vm.$nextTick(() => {
      const clickableNodes = wrapper.findAll('.treevue-tree-node')
      expect(clickableNodes.length).to.be.eq(2)
      const secondNode = clickableNodes.at(1)
      secondNode.trigger('click')
      const clickableText = secondNode.find('.treevue-tree-node .treevue-node-text')
      clickableText.trigger('focus')
      wrapper.trigger('keydown.up')
      wrapper.vm.$nextTick(() => {
        expect(wrapper.vm.nodeManager.selectedNode).to.be.not.null
        expect(wrapper.vm.nodeManager.selectedNode.item.id).to.be.eq(nodes[0].id)
        expect(wrapper.emitted()['node:selected'].length).to.be.eq(2)
        expect(wrapper.emitted()['node:selected'][1]).to.be.not.null
        expect(wrapper.emitted()['node:selected'][1][0]).to.be.not.null
        expect(wrapper.emitted()['node:selected'][1][0].item.id).to.be.eq(nodes[0].id)
        done()
      })
    })
  })
  it('key Up on first node does not change selected node', done => {
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
    const wrapper = mount(Tree, { propsData: { nodes, options } })

    wrapper.vm.$nextTick(() => {
      const clickableNode = wrapper.find('.treevue-tree-node')
      clickableNode.trigger('click')
      const clickableText = wrapper.find('.treevue-tree-node .treevue-node-text')
      clickableText.trigger('focus')
      wrapper.trigger('keydown.up')

      wrapper.vm.$nextTick(() => {
        expect(wrapper.vm.nodeManager.selectedNode).to.be.not.null
        expect(wrapper.vm.nodeManager.selectedNode.item.id).to.be.eq(nodes[0].id)
        expect(wrapper.emitted()['node:selected'].length).to.be.eq(1)
        expect(wrapper.emitted()['node:selected'][0]).to.be.not.null
        expect(wrapper.emitted()['node:selected'][0][0]).to.be.not.null
        expect(wrapper.emitted()['node:selected'][0][0].item.id).to.be.eq(nodes[0].id)
        done()
      })
    })
  })
})
