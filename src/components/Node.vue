<template>
  <div class="treevue-tree-node-container" :class="nodeContainerClasses">
    <div class="treevue-tree-node" @click="onClick" :class="parentClasses(node)">
      <node-icon v-model="node.states.opened" :styleManager="styleManager" class="treevue-tree-node-element" v-if="node.children.length"/>
      <node-checkbox v-model="node.states.checked" :styleManager="styleManager" class="treevue-tree-node-element treevue-tree-node-checkbox"/>
      <node-text :title="node.item.name" class="treevue-tree-node-element treevue-tree-node-text" @click="onClick" @сhangeRequested="checkChangeRequested" @selectRequested="selectChangeRequested"/>
    </div>
    <div class="treevue-tree-node-children-container" v-if="node.states.opened">
      <node :options="options" :state="state" :manager="manager" v-for="child in visibleItems" :key="child.id" :node="child" class="treevue-tree-node-child" @selected="onSelected" :parentClasses="parentClasses"/>
    </div>
  </div>
</template>

<script>
import NodeIcon from './NodeIcon'
import NodeText from './NodeText'
import NodeCheckbox from './NodeCheckbox'

export default {
  name: 'Node',
  props: {
    node: {
      type: Object
    },
    parentClasses: {
      type: Function
    },
    state: {
      type: Object,
      required: true
    },
    manager: {
      type: Object,
      required: true
    },
    options: {
      type: Object,
      required: true
    }
  },
  components: {
    NodeIcon,
    NodeText,
    NodeCheckbox
  },
  data () {
    return {
    }
  },
  computed: {
    styleManager () {
      return this.options.styleManager
    },
    nodeContainerClasses () {
      return {
        'no-children': this.node.children.length === 0
      }
    },
    visibleItems () {
      return this.node.children.filter(x => this.nodeManager.getVisibility(x))
    }
  },
  mounted () {
  },
  methods: {
    onSelected (item) {
      this.$emit('selected', item)
    },
    onClick () {
      this.$emit('selected', this.node)
    },
    checkChangeRequested () {
      this.node.states.checked = !this.node.states.checked
    },
    selectChangeRequested () {
      this.$emit('selected', this.node)
    }
  }
}
</script>

<style scoped>
.treevue-tree-node {
  display: flex;
  align-items: center;
}
/* .treevue-tree-node-container.no-children {
  margin-left: 20px;
} */
.treevue-tree-node-element {
  margin-right: 0px;
}
.treevue-tree-node-container.no-children .treevue-tree-node-element.treevue-tree-node-checkbox {
  margin-left: 1em;
}
.treevue-tree-node-container {
  margin-top: 2px;
  margin-bottom: 2px;
}
.treevue-tree-node-children-container {
  margin-left: 20px;
}
.treevue-tree-node:hover {
  background-color: rgba(231, 238, 247, 0.514);
}
.treevue-tree-node.selected {
  background-color: rgb(231, 238, 247);
}
.treevue-tree-node-text {
  flex: 1
}
</style>
