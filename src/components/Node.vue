<template>
  <div class="treevue-tree-node-container" :class="nodeClasses">
    <div class="treevue-tree-node">
      <node-icon v-model="node.states.opened" :styleManager="styleManager" class="treevue-tree-node-element" v-if="node.children.length"/>
      <node-checkbox v-model="node.states.checked" :styleManager="styleManager" class="treevue-tree-node-element treevue-tree-node-checkbox"/>
      <node-text :title="node.item.name" class="treevue-tree-node-element treevue-tree-node-text" />
    </div>
    <div class="treevue-tree-node-children-container" v-if="node.states.opened">
      <node :styleManager="styleManager" v-for="child in node.children" :key="child.id" :node="child" class="treevue-tree-node-child" />
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
    styleManager: {
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
    nodeClasses () {
      return {
        'no-children': this.node.children.length === 0
      }
    }
  },
  mounted () {
  },
  methods: {
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
.treevue-tree-node-children-container {
  margin-left: 20px;
}
.treevue-tree-node-text.selected {
  background-color: rgba(0, 0, 200, 0.5)
}
</style>
