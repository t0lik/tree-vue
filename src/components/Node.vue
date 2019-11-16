<template>
  <div class="treevue-tree-node-container" :class="nodeContainerClasses">
    <div class="treevue-tree-node" @click="onClick" :class="nodeClasses">
      <node-expander
        :value="node.states.open"
        @input="onNodeOpenStateChanging"
        :icons="icons"
        class="treevue-tree-node-element treevue-tree-node-expander"
        :class="expanderClasses"
        v-if="node.children.length"
        :disabled="node.states.disabled"/>
      <node-checkbox
        :value="node.states.checked"
        @input="onNodeCheckStateChanging"
        :icons="icons"
        class="treevue-tree-node-element treevue-tree-node-checkbox"
        :class="checkClasses"
        :disabled="node.states.disabled"
        :node="node"
        v-if="showCheckbox"/>
      <slot name="icon" v-bind:iconClasses="iconClasses" v-if="showIcon && (!hideEmptyIcon || node.icon)">
        <node-icon class="treevue-tree-node-element treevue-tree-node-icon" :class="iconClasses" :iconClass="node.icon"/>
      </slot>
      <slot name="text" v-bind:nodeText="nodeText" v-bind:textClasses="textClasses" v-if="!editorMode">
        <node-text
          :title="nodeText"
          class="treevue-tree-node-element treevue-tree-node-text"
          :class="textClasses"
          :node="node"
          :options="options"
          @node:focused="onFocused"
          @startEdit="startEdit"
          ref="nodeText"/>
      </slot>
      <slot name="editor" v-bind:node="node" v-if="editorMode">
        <node-editor :node="node" :manager="manager" @stopEdit="onStopEdit"/>
      </slot>
    </div>
    <div class="treevue-tree-node-children-container" v-if="node.states.open">
      <node
        :options="options"
        :state="state"
        :manager="manager"
        v-for="child in visibleItems" :key="child.id"
        :node="child"
        class="treevue-tree-node-child"
        @clicked="onChildClicked"
        @node:focused="$emit('node:focused', $event)">
        <template v-for="(_, slot) of $scopedSlots" v-slot:[slot]="scope"><slot :name="slot" v-bind="scope"/></template>
      </node>
    </div>
  </div>
</template>

<script>
import NodeExpander from './NodeExpander'
import NodeText from './NodeText'
import NodeCheckbox from './NodeCheckbox'
import NodeIcon from './NodeIcon'
import NodeEditor from './NodeEditor'

export default {
  name: 'Node',
  props: {
    node: {
      type: Object
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
    NodeExpander,
    NodeText,
    NodeCheckbox,
    NodeIcon,
    NodeEditor
  },
  data () {
    return {
      editorMode: false
    }
  },
  computed: {
    nodeClasses () {
      return {
        selected: this.manager.selectedNode === this.node
      }
    },
    textClasses () {
      const classes = {
        'filter-matched': this.node.states.matched,
        disabled: this.node.states.disabled
      }
      return this.combineClasses(this.combineClasses(classes, this.node.styleClasses.text), this.options.styleClasses.text)
    },
    iconClasses () {
      const classes = {
        disabled: this.node.states.disabled
      }

      return this.combineClasses(this.combineClasses(classes, this.node.styleClasses.icon), this.options.styleClasses.icon)
    },
    checkClasses () {
      const classes = {
        disabled: this.node.states.disabled
      }

      return this.combineClasses(this.combineClasses(classes, this.node.styleClasses.checkbox), this.options.styleClasses.checkbox)
    },
    expanderClasses () {
      const classes = {
        disabled: this.node.states.disabled
      }

      return this.combineClasses(this.combineClasses(classes, this.node.styleClasses.expander), this.options.styleClasses.expander)
    },
    icons () {
      return this.options.icons
    },
    showCheckbox () {
      return this.options.showCheckbox
    },
    showIcon () {
      return this.options.showIcon
    },
    hideEmptyIcon () {
      return this.options.hideEmptyIcon
    },
    nodeContainerClasses () {
      return {
        'no-children': this.node.children.length === 0
      }
    },
    visibleItems () {
      return this.node.children.filter(x => x.visible())
    },
    nodeText () {
      return this.node.getName()
    }
  },
  mounted () {
    this.state.nodes[this.node.id] = this
  },
  beforeDestroy () {
    delete this.state.nodes[this.node.id]
  },
  methods: {
    combineClasses (defaultClass, customClass) {
      if (customClass) {
        const classes = {}
        if (typeof (customClass) === 'string') {
          const classList = customClass.split(' ')

          for (const className of classList) {
            classes[className] = true
          }
          return Object.assign({}, defaultClass, classes)
        }
        return Object.assign({}, defaultClass, customClass)
      }

      return defaultClass
    },
    onChildClicked (item) {
      this.$emit('clicked', item)
    },
    onNodeCheckStateChanging (state) {
      this.manager.setCheckState(this.node, state)
    },
    onNodeOpenStateChanging (state) {
      this.manager.setOpenState(this.node, state)
    },
    onClick () {
      if (this.node.states.disabled) {
        return
      }
      this.manager.setSelected(this.node)
      this.$emit('clicked', this.node)
    },
    onFocused () {
      this.$emit('node:focused', this.node)
    },
    focus () {
      this.$refs.nodeText.focus()
    },
    onStopEdit () {
      this.editorMode = false
      this.$nextTick(() => {
        this.focus()
      })
    },
    startEdit () {
      this.editorMode = true
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
.treevue-tree-node-element.treevue-tree-node-expander {
  margin-right: 2px;
}
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
  flex: 1;
  margin-top: 2px;
  margin-bottom: 2px;
}
.treevue-tree-node-icon {
  margin: 2px;
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
