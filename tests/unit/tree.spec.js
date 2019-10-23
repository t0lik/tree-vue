/* eslint-disable no-unused-expressions */
import { expect } from 'chai'
import { mount, shallowMount } from '@vue/test-utils'
import Tree from '@/components/Tree.vue'
import Node from '@/components/Node.vue'

describe('Tree.vue', () => {
  it('renders tree', () => {
    const nodes = []
    const options = {
      checkOnSelect: false
    }
    const wrapper = shallowMount(Tree, {
      propsData: { nodes, options }
    })
    expect(wrapper.find('.treevue-tree').exists()).to.be.true
  })
  it('initializes node manager', () => {
    const nodes = []
    const options = {
      checkOnSelect: false
    }
    const wrapper = mount(Tree, {
      propsData: { nodes, options }
    })
    expect(wrapper.vm.nodeManager).to.be.not.null
  })
  it('rendered Node count equals to source node count', () => {
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
    const wrapper = mount(Tree, {
      propsData: { nodes, options }
    })
    expect(wrapper.findAll(Node).length).to.be.eq(nodes.length)
  })
})
