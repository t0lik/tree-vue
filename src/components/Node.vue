<template>
  <div class="treevue-tree-node-container" :class="nodeContainerClasses">
    <div class="treevue-tree-node" @click="onClick" :class="parentClasses(node)">
      <node-icon v-model="node.states.opened" :styleManager="styleManager" class="treevue-tree-node-element treevue-tree-node-icon" v-if="node.children.length" :disabled="node.states.disabled"/>
      <node-checkbox v-model="node.states.checked" :styleManager="styleManager" class="treevue-tree-node-element treevue-tree-node-checkbox"  :class="checkClasses" :disabled="node.states.disabled"/>
      <slot name="text" v-bind:nodeText="nodeText" v-bind:textClasses="textClasses">
        <node-text :title="nodeText" class="treevue-tree-node-element treevue-tree-node-text" :class="textClasses"/>
      </slot>
    </div>
    <div class="treevue-tree-node-children-container" v-if="node.states.opened">
      <node :options="options" :state="state" :manager="manager" v-for="child in visibleItems" :key="child.id" :node="child" class="treevue-tree-node-child" @selected="onSelected" :parentClasses="parentClasses">
        <template v-for="(_, slot) of $scopedSlots" v-slot:[slot]="scope"><slot :name="slot" v-bind="scope"/></template>
      </node>
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
    textClasses () {
      return {
        'filter-matched': this.node.states.matched,
        disabled: this.node.states.disabled
      }
    },
    checkClasses () {
      return {
        disabled: this.node.states.disabled
      }
    },
    styleManager () {
      return this.options.styleManager
    },
    nodeContainerClasses () {
      return {
        'no-children': this.node.children.length === 0
      }
    },
    visibleItems () {
      return this.node.children.filter(x => this.manager.getVisibility(x))
    },
    nodeText () {
      return this.manager.getName(this.node)
    }
  },
  mounted () {
  },
  methods: {
    onSelected (item) {
      this.$emit('selected', item)
    },
    onClick () {
      if (this.node.states.disabled) {
        return
      }
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
.treevue-tree-node-container.no-children .treevue-tree-node {
  margin-left: 22px;
}
.treevue-tree-node-element {
  margin-right: 0px;
}
.treevue-tree-node-element.treevue-tree-node-icon {
  margin-right: 2px;
}
/* .treevue-tree-node-container.no-children .treevue-tree-node-element.treevue-tree-node-checkbox {
  margin-left: 20px;
} */
.treevue-tree-node-container .treevue-tree-node-element.treevue-tree-node-checkbox {
  margin-right: 5px;
}
.treevue-tree-node-container {
  margin-top: 3px;
  margin-bottom: 3px;
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
.treevue-tree-node-text.disabled {
  color: #979191
}
.treevue-tree-node-checkbox.disabled {
  color: #979191;
  border-color: #979191
}
.treevue-tree-node-text.filter-matched {
  font-weight: bold;
}
</style>
