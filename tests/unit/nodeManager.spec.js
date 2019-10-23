/* eslint-disable no-unused-expressions */
import { expect } from 'chai'
import { mount } from '@vue/test-utils'
import Tree from '@/components/Tree.vue'

describe('nodeManager', () => {
  it('node manager item count equals source item count', () => {
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
    expect(wrapper.vm.nodeManager.items.length).to.be.eq(nodes.length)
  })
})
