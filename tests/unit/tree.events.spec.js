'use strict'
/* eslint-disable no-unused-expressions */
import { expect } from 'chai'
import { mount } from '@vue/test-utils'
import Tree from '@/components/TreeVue.vue'

describe('Tree.vue events', () => {
  async function getWrapper (items, options = {}) {
    const wrapper = mount(Tree, {
      propsData: { items, options }
    })
    await wrapper.vm.$nextTick()

    return wrapper
  }
  it('click on node emits node:clicked', async () => {
    const nodes = [{
      id: 1,
      name: 'name'
    }]
    const options = {
    }
    const wrapper = await getWrapper(nodes, options)

    const clickableText = wrapper.find('.treevue-tree-node .treevue-node-text')
    clickableText.trigger('click')
    expect(wrapper.emitted()['node:clicked'][0]).to.be.not.null
    expect(wrapper.emitted()['node:clicked'][0][0]).to.be.not.null
    expect(wrapper.emitted()['node:clicked'][0][0].item).to.be.eq(nodes[0])
  })
  it('click on node text emits node:selected', async () => {
    const nodes = [{
      id: 1,
      name: 'name'
    }]
    const options = {}

    const wrapper = await getWrapper(nodes, options)

    const clickableText = wrapper.find('.treevue-tree-node .treevue-node-text')
    clickableText.trigger('click')

    await wrapper.vm.$nextTick()

    expect(wrapper.emitted()['node:selected'][0]).to.be.not.null
    expect(wrapper.emitted()['node:selected'][0][0]).to.be.not.null
    expect(wrapper.emitted()['node:selected'][0][0].item).to.be.eq(nodes[0])
  })
  it('setFocusedNode emits node:selected', async () => {
    const nodes = [{
      id: 1,
      name: 'name'
    }, {
      id: 2,
      name: 'name2'
    }]
    const options = {
    }
    const wrapper = await getWrapper(nodes, options)
    const secondNode = wrapper.vm.storage.getById(2)

    wrapper.vm.setFocusedNode(secondNode)

    expect(wrapper.emitted()['node:selected'][0]).to.be.not.null
  })
  it('storage.clearFilter emits tree:filter:cleared', async () => {
    const nodes = [{
      id: 1,
      name: 'node1',
      children: [{
        id: 3,
        name: 'child1',
        children: [{
          id: 9,
          name: 'grandchild1'
        }]
      }, {
        id: 4,
        name: 'child2'
      }]
    }, {
      id: 2,
      name: 'node2',
      children: [{
        id: 8,
        name: 'child3'
      }]
    }, {
      id: 5,
      name: 'node3'
    }]
    const options = { }
    const wrapper = await getWrapper(nodes, options)
    const storage = wrapper.vm.storage
    storage.filter('child1')

    storage.clearFilter()

    expect(wrapper.emitted()['tree:filter:cleared']).to.be.lengthOf(1)
    expect(wrapper.emitted()['tree:filter:cleared'][0]).to.be.not.null
  })
  it('storage.filter emits tree:filtered', async () => {
    const nodes = [{
      id: 1,
      name: 'node1',
      children: [{
        id: 3,
        name: 'child1',
        children: [{
          id: 9,
          name: 'grandchild1'
        }]
      }, {
        id: 4,
        name: 'child2'
      }]
    }, {
      id: 2,
      name: 'node2',
      children: [{
        id: 8,
        name: 'child3'
      }]
    }, {
      id: 5,
      name: 'node3'
    }]
    const options = { }
    const wrapper = await getWrapper(nodes, options)
    const storage = wrapper.vm.storage

    storage.filter('node')
    storage.clearFilter()

    expect(wrapper.emitted()['tree:filtered']).to.be.lengthOf(1)
    expect(wrapper.emitted()['tree:filtered'][0][0].map(x => x.id)).to.be.members([1, 2, 5])
    expect(wrapper.emitted()['tree:filtered'][0][1]).to.be.eq('node')
  })
  it('storage.checkAll emits tree:checked:all', async () => {
    const nodes = [{
      id: 1,
      name: 'node1',
      children: [{
        id: 3,
        name: 'child1',
        children: [{
          id: 9,
          name: 'grandchild1'
        }]
      }, {
        id: 4,
        name: 'child2'
      }]
    }, {
      id: 2,
      name: 'node2',
      children: [{
        id: 8,
        name: 'child3'
      }]
    }, {
      id: 5,
      name: 'node3'
    }]
    const options = { }
    const wrapper = await getWrapper(nodes, options)

    const storage = wrapper.vm.storage
    storage.checkAll()

    expect(wrapper.emitted()['tree:checked:all']).to.be.lengthOf(1)
  })
  it('storage.checkVisible emits tree:checked:visible', async () => {
    const nodes = [{
      id: 1,
      name: 'node1',
      children: [{
        id: 3,
        name: 'child1',
        children: [{
          id: 9,
          name: 'grandchild1'
        }]
      }, {
        id: 4,
        name: 'child2'
      }]
    }, {
      id: 2,
      name: 'node2',
      children: [{
        id: 8,
        name: 'child3'
      }]
    }, {
      id: 5,
      name: 'node3'
    }]
    const options = { }
    const wrapper = await getWrapper(nodes, options)

    const storage = wrapper.vm.storage
    storage.checkVisible()

    expect(wrapper.emitted()['tree:checked:visible']).to.be.lengthOf(1)
  })
  it('storage.uncheckAll emits tree:unchecked:all', async () => {
    const nodes = [{
      id: 1,
      name: 'node1',
      children: [{
        id: 3,
        name: 'child1',
        children: [{
          id: 9,
          name: 'grandchild1'
        }]
      }, {
        id: 4,
        name: 'child2'
      }]
    }, {
      id: 2,
      name: 'node2',
      children: [{
        id: 8,
        name: 'child3'
      }]
    }, {
      id: 5,
      name: 'node3'
    }]
    const options = { }
    const wrapper = await getWrapper(nodes, options)
    const storage = wrapper.vm.storage
    storage.uncheckAll()
    expect(wrapper.emitted()['tree:unchecked:all']).to.be.lengthOf(1)
  })
  it('storage.uncheckVisible emits tree:unchecked:visible', async () => {
    const nodes = [{
      id: 1,
      name: 'node1',
      children: [{
        id: 3,
        name: 'child1',
        children: [{
          id: 9,
          name: 'grandchild1'
        }]
      }, {
        id: 4,
        name: 'child2'
      }]
    }, {
      id: 2,
      name: 'node2',
      children: [{
        id: 8,
        name: 'child3'
      }]
    }, {
      id: 5,
      name: 'node3'
    }]
    const options = { }
    const wrapper = await getWrapper(nodes, options)
    const storage = wrapper.vm.storage
    storage.uncheckVisible()
    expect(wrapper.emitted()['tree:unchecked:visible']).to.be.lengthOf(1)
  })
  it('storage.check emits node:checked', async () => {
    const nodes = [{
      id: 1,
      name: 'node1',
      children: [{
        id: 3,
        name: 'child1',
        children: [{
          id: 9,
          name: 'grandchild1'
        }]
      }, {
        id: 4,
        name: 'child2'
      }]
    }, {
      id: 2,
      name: 'node2',
      children: [{
        id: 8,
        name: 'child3'
      }]
    }, {
      id: 5,
      name: 'node3'
    }]
    const options = { }
    const wrapper = await getWrapper(nodes, options)
    const storage = wrapper.vm.storage
    const node = storage.getById(1)
    storage.check(node)
    expect(wrapper.emitted()['node:checked']).to.be.lengthOf(1)
    expect(wrapper.emitted()['node:checked'][0][0]).to.be.eq(node)
  })
  it('storage.uncheck emits node:unchecked', async () => {
    const nodes = [{
      id: 1,
      name: 'node1',
      checked: true,
      children: [{
        id: 3,
        name: 'child1',
        children: [{
          id: 9,
          name: 'grandchild1'
        }]
      }, {
        id: 4,
        name: 'child2'
      }]
    }, {
      id: 2,
      name: 'node2',
      children: [{
        id: 8,
        name: 'child3'
      }]
    }, {
      id: 5,
      name: 'node3'
    }]
    const options = { }
    const wrapper = await getWrapper(nodes, options)
    const storage = wrapper.vm.storage
    const node = storage.getById(1)
    storage.uncheck(node)
    expect(wrapper.emitted()['node:unchecked']).to.be.lengthOf(1)
    expect(wrapper.emitted()['node:unchecked'][0][0]).to.be.eq(node)
  })
  it('storage.expand emits node:expanded', async () => {
    const nodes = [{
      id: 1,
      name: 'node1',
      children: [{
        id: 3,
        name: 'child1',
        children: [{
          id: 9,
          name: 'grandchild1'
        }]
      }, {
        id: 4,
        name: 'child2'
      }]
    }, {
      id: 2,
      name: 'node2',
      children: [{
        id: 8,
        name: 'child3'
      }]
    }, {
      id: 5,
      name: 'node3'
    }]
    const options = { }
    const wrapper = await getWrapper(nodes, options)
    const storage = wrapper.vm.storage
    const node = storage.getById(1)
    storage.expand(node)
    expect(wrapper.emitted()['node:expanded']).to.be.lengthOf(1)
    expect(wrapper.emitted()['node:expanded'][0][0]).to.be.eq(node)
  })
  it('storage.collapse emits node:collapsed', async () => {
    const nodes = [{
      id: 1,
      name: 'node1',
      open: true,
      children: [{
        id: 3,
        name: 'child1',
        children: [{
          id: 9,
          name: 'grandchild1'
        }]
      }, {
        id: 4,
        name: 'child2'
      }]
    }, {
      id: 2,
      name: 'node2',
      children: [{
        id: 8,
        name: 'child3'
      }]
    }, {
      id: 5,
      name: 'node3'
    }]
    const options = { }
    const wrapper = await getWrapper(nodes, options)
    const storage = wrapper.vm.storage
    const node = storage.getById(1)
    storage.collapse(node)
    expect(wrapper.emitted()['node:collapsed']).to.be.lengthOf(1)
    expect(wrapper.emitted()['node:collapsed'][0][0]).to.be.eq(node)
  })
  it('storage.expandAll emits tree:expanded:all', async () => {
    const nodes = [{
      id: 1,
      name: 'node1',
      children: [{
        id: 3,
        name: 'child1',
        children: [{
          id: 9,
          name: 'grandchild1'
        }]
      }, {
        id: 4,
        name: 'child2'
      }]
    }, {
      id: 2,
      name: 'node2',
      children: [{
        id: 8,
        name: 'child3'
      }]
    }, {
      id: 5,
      name: 'node3'
    }]
    const options = { }
    const wrapper = await getWrapper(nodes, options)
    const storage = wrapper.vm.storage
    storage.expandAll()
    expect(wrapper.emitted()['tree:expanded:all']).to.be.lengthOf(1)
  })
  it('storage.collapseAll emits tree:collapsed:all', async () => {
    const nodes = [{
      id: 1,
      name: 'node1',
      children: [{
        id: 3,
        name: 'child1',
        children: [{
          id: 9,
          name: 'grandchild1'
        }]
      }, {
        id: 4,
        name: 'child2'
      }]
    }, {
      id: 2,
      name: 'node2',
      children: [{
        id: 8,
        name: 'child3'
      }]
    }, {
      id: 5,
      name: 'node3'
    }]
    const options = { }
    const wrapper = await getWrapper(nodes, options)
    const storage = wrapper.vm.storage
    storage.collapseAll()
    expect(wrapper.emitted()['tree:collapsed:all']).to.be.lengthOf(1)
  })
  it('storage.disable emits node:disabled', async () => {
    const nodes = [{
      id: 1,
      name: 'node1',
      children: [{
        id: 3,
        name: 'child1',
        children: [{
          id: 9,
          name: 'grandchild1'
        }]
      }, {
        id: 4,
        name: 'child2'
      }]
    }, {
      id: 2,
      name: 'node2',
      children: [{
        id: 8,
        name: 'child3'
      }]
    }, {
      id: 5,
      name: 'node3'
    }]
    const options = { }
    const wrapper = await getWrapper(nodes, options)
    const storage = wrapper.vm.storage
    const node = storage.getById(1)
    storage.disable(node)
    expect(wrapper.emitted()['node:disabled']).to.be.lengthOf(1)
    expect(wrapper.emitted()['node:disabled'][0][0]).to.be.eq(node)
  })
  it('storage.disable on selected node emits node:selected with null param', async () => {
    const nodes = [{
      id: 1,
      name: 'node1',
      children: [{
        id: 3,
        name: 'child1',
        children: [{
          id: 9,
          name: 'grandchild1'
        }]
      }, {
        id: 4,
        name: 'child2'
      }]
    }, {
      id: 2,
      name: 'node2',
      children: [{
        id: 8,
        name: 'child3'
      }]
    }, {
      id: 5,
      name: 'node3'
    }]
    const options = { }
    const wrapper = await getWrapper(nodes, options)
    const storage = wrapper.vm.storage
    const node = storage.getById(1)
    storage.setSelected(node)
    storage.disable(node)
    expect(wrapper.emitted()['node:selected']).to.be.lengthOf(2)
    expect(wrapper.emitted()['node:selected'][0][0]).to.be.eq(node)
    expect(wrapper.emitted()['node:selected'][1][0]).to.be.eq(null)
  })
  it('storage.enable emits node:enabled', async () => {
    const nodes = [{
      id: 1,
      name: 'node1',
      children: [{
        id: 3,
        name: 'child1',
        children: [{
          id: 9,
          name: 'grandchild1'
        }]
      }, {
        id: 4,
        name: 'child2'
      }]
    }, {
      id: 2,
      name: 'node2',
      children: [{
        id: 8,
        name: 'child3'
      }]
    }, {
      id: 5,
      name: 'node3'
    }]
    const options = { }
    const wrapper = await getWrapper(nodes, options)
    const storage = wrapper.vm.storage
    const node = storage.getById(1)
    storage.enable(node)
    expect(wrapper.emitted()['node:enabled']).to.be.lengthOf(1)
    expect(wrapper.emitted()['node:enabled'][0][0]).to.be.eq(node)
  })
  it('storage.disableAll emits tree:disabled:all', async () => {
    const nodes = [{
      id: 1,
      name: 'node1',
      children: [{
        id: 3,
        name: 'child1',
        children: [{
          id: 9,
          name: 'grandchild1'
        }]
      }, {
        id: 4,
        name: 'child2'
      }]
    }, {
      id: 2,
      name: 'node2',
      children: [{
        id: 8,
        name: 'child3'
      }]
    }, {
      id: 5,
      name: 'node3'
    }]
    const options = { }
    const wrapper = await getWrapper(nodes, options)
    const storage = wrapper.vm.storage
    storage.disableAll()
    expect(wrapper.emitted()['tree:disabled:all']).to.be.lengthOf(1)
  })
  it('storage.disableAll with selected node emits node:selected with null param', async () => {
    const nodes = [{
      id: 1,
      name: 'node1',
      children: [{
        id: 3,
        name: 'child1',
        children: [{
          id: 9,
          name: 'grandchild1'
        }]
      }, {
        id: 4,
        name: 'child2'
      }]
    }, {
      id: 2,
      name: 'node2',
      children: [{
        id: 8,
        name: 'child3'
      }]
    }, {
      id: 5,
      name: 'node3'
    }]
    const options = { }
    const wrapper = await getWrapper(nodes, options)
    const storage = wrapper.vm.storage
    const node = storage.getById(1)
    storage.setSelected(node)
    storage.disableAll()
    expect(wrapper.emitted()['node:selected']).to.be.lengthOf(2)
    expect(wrapper.emitted()['node:selected'][0][0]).to.be.eq(node)
    expect(wrapper.emitted()['node:selected'][1][0]).to.be.eq(null)
  })
  it('storage.enableAll emits tree:enabled:all', async () => {
    const nodes = [{
      id: 1,
      name: 'node1',
      children: [{
        id: 3,
        name: 'child1',
        children: [{
          id: 9,
          name: 'grandchild1'
        }]
      }, {
        id: 4,
        name: 'child2'
      }]
    }, {
      id: 2,
      name: 'node2',
      children: [{
        id: 8,
        name: 'child3'
      }]
    }, {
      id: 5,
      name: 'node3'
    }]
    const options = { }
    const wrapper = await getWrapper(nodes, options)
    const storage = wrapper.vm.storage
    storage.enableAll()
    expect(wrapper.emitted()['tree:enabled:all']).to.be.lengthOf(1)
  })
  it('storage.setSelected emits node:selected', async () => {
    const nodes = [{
      id: 1,
      name: 'node1',
      children: [{
        id: 3,
        name: 'child1',
        children: [{
          id: 9,
          name: 'grandchild1'
        }]
      }, {
        id: 4,
        name: 'child2'
      }]
    }, {
      id: 2,
      name: 'node2',
      children: [{
        id: 8,
        name: 'child3'
      }]
    }, {
      id: 5,
      name: 'node3'
    }]
    const options = { }
    const wrapper = await getWrapper(nodes, options)
    const storage = wrapper.vm.storage
    const node = storage.getById(1)
    storage.setSelected(node)
    expect(wrapper.emitted()['node:selected']).to.be.lengthOf(1)
    expect(wrapper.emitted()['node:selected'][0][0]).to.be.eq(node)
  })
  it('storage.setSelected with null emits node:selected with null param', async () => {
    const nodes = [{
      id: 1,
      name: 'node1',
      children: [{
        id: 3,
        name: 'child1',
        children: [{
          id: 9,
          name: 'grandchild1'
        }]
      }, {
        id: 4,
        name: 'child2'
      }]
    }, {
      id: 2,
      name: 'node2',
      children: [{
        id: 8,
        name: 'child3'
      }]
    }, {
      id: 5,
      name: 'node3'
    }]
    const options = { }
    const wrapper = await getWrapper(nodes, options)
    const storage = wrapper.vm.storage
    storage.setSelected(null)
    expect(wrapper.emitted()['node:selected']).to.be.lengthOf(1)
    expect(wrapper.emitted()['node:selected'][0][0]).to.be.null
  })
  it('storage.addChild emits node:child:added', async () => {
    const nodes = [{
      id: 1,
      name: 'node1',
      children: [{
        id: 3,
        name: 'child1'
      }, {
        id: 4,
        name: 'child2'
      }]
    }]
    const options = { }
    const wrapper = await getWrapper(nodes, options)
    const storage = wrapper.vm.storage
    const node = storage.getById(1)
    const newChildItem = {
      id: 5,
      name: 'child3'
    }
    const newChild = storage.addChild(node, newChildItem)

    expect(wrapper.emitted()['node:child:added']).to.be.lengthOf(1)
    expect(wrapper.emitted()['node:child:added'][0][0]).to.be.eq(newChildItem)
    expect(wrapper.emitted()['node:child:added'][0][1]).to.be.eq(newChild)
  })
  it('storage.insertChild emits node:child:added', async () => {
    const nodes = [{
      id: 1,
      name: 'node1',
      children: [{
        id: 3,
        name: 'child1'
      }, {
        id: 4,
        name: 'child2'
      }]
    }]
    const options = { }
    const wrapper = await getWrapper(nodes, options)
    const storage = wrapper.vm.storage
    const node = storage.getById(1)
    const newChildItem = {
      id: 5,
      name: 'child3'
    }
    const newChild = storage.insertChild(node, newChildItem)

    expect(wrapper.emitted()['node:child:added']).to.be.lengthOf(1)
    expect(wrapper.emitted()['node:child:added'][0][0]).to.be.eq(newChildItem)
    expect(wrapper.emitted()['node:child:added'][0][1]).to.be.eq(newChild)
  })
  it('storage.remove on root node emits node:removed', async () => {
    const nodes = [{
      id: 1,
      name: 'node1',
      children: [{
        id: 3,
        name: 'child1'
      }, {
        id: 4,
        name: 'child2'
      }]
    }]
    const options = { }
    const wrapper = await getWrapper(nodes, options)
    const storage = wrapper.vm.storage
    const node = storage.getById(1)
    storage.remove(node)

    expect(wrapper.emitted()['node:removed']).to.be.lengthOf(1)
    expect(wrapper.emitted()['node:removed'][0][0]).to.be.eq(node)
  })
  it('storage.remove on child node emits node:child:removed', async () => {
    const nodes = [{
      id: 1,
      name: 'node1',
      children: [{
        id: 3,
        name: 'child1'
      }, {
        id: 4,
        name: 'child2'
      }]
    }]
    const options = { }
    const wrapper = await getWrapper(nodes, options)
    const storage = wrapper.vm.storage
    const node = storage.getById(3)
    storage.remove(node)

    expect(wrapper.emitted()['node:child:removed']).to.be.lengthOf(1)
    expect(wrapper.emitted()['node:child:removed'][0][0]).to.be.eq(node)
  })
})
