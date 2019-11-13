'use strict'
/* eslint-disable no-unused-expressions */
import { expect } from 'chai'
import { mount } from '@vue/test-utils'
import NodeIcon from '@/components/NodeIcon.vue'

describe('NodeIcon.vue', () => {
  function getNodeIconWrapper (iconClass) {
    const nodeWrapper = mount(NodeIcon, {
      propsData: {
        iconClass: iconClass
      }
    })

    return nodeWrapper
  }
  it('empty iconClass does not add additional classed to i', () => {
    const expanderWrapper = getNodeIconWrapper(null)
    expect(expanderWrapper.classes()).to.be.members(['treevue-node-icon'])
  })
  it('i classes contain iconClass classes set as string', () => {
    const expanderWrapper = getNodeIconWrapper('test-class')
    expect(expanderWrapper.classes()).to.be.members(['treevue-node-icon', 'test-class'])
  })
  it('i classes contain iconClass classes set as object', () => {
    const expanderWrapper = getNodeIconWrapper({ 'test-class': true })
    expect(expanderWrapper.classes()).to.be.members(['treevue-node-icon', 'test-class'])
  })
})
