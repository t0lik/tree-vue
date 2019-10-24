<template>
  <div class="treevue-tree" @keydown="onKeyDown">
    <div class="treevue-empty-search-text" v-if="!visibleItems.length && nodeManager.options.inSearch"> {{ treeOptions.notFoundText }} </div>
    <node
      :options="treeOptions"
      :manager="nodeManager"
      :state="treeState"
      v-for="item in visibleItems" :key="item.id"
      :node="item"
      @clicked="onNodeClicked"
      @node:focused="onNodeFocused"
      >
      <template v-for="(_, slot) of $scopedSlots" v-slot:[slot]="scope"><slot :name="slot" v-bind="scope"/></template>
    </node>
  </div>
</template>

<script>
import Node from './Node'
import defaultStyleManager from '../styleManagers/defaultStyleManager'
import DefaultManager from '../nodeManagers/defaultManager'
import keyboardMixin from '../mixins/keyboard'

export default {
  name: 'Tree',
  props: {
    nodes: {
      type: Array
    },
    options: {
      type: Object
    }
  },
  mixins: [keyboardMixin],
  components: {
    Node
  },
  data () {
    return {
      treeState: {
        nodes: {}
      },
      focusedNode: null,
      treeOptions: Object.assign({}, {
        styleManager: defaultStyleManager,
        multiselect: false,
        showCheckbox: true,
        showIcon: false,
        hideEmptyIcon: true,
        checkOnSelect: false,
        checkMode: 'independent',
        openOnSelect: false,
        autoSort: false,
        sortComparator: null,
        idProp: 'id',
        nameProp: 'name',
        childrenProp: 'children',
        notFoundText: 'no nodes are found',
        canEdit: false,
        canDelete: false
      }, this.options),
      nodeManager: new DefaultManager(this)
    }
  },
  watch: {
    'options.styleManager' (newValue) {
      this.treeOptions.styleManager = this.options.styleManager
    },
    'options.showCheckbox' (newValue) {
      this.treeOptions.showCheckbox = this.options.showCheckbox
    },
    'options.showIcon' (newValue) {
      this.treeOptions.showIcon = this.options.showIcon
    },
    'options.canEdit' (newValue) {
      this.treeOptions.canEdit = this.options.canEdit
    },
    'options.canDelete' (newValue) {
      this.treeOptions.canDelete = this.options.canDelete
    }
  },
  computed: {
    visibleItems () {
      return this.nodeManager.items.filter(x => this.nodeManager.getVisibility(x))
    }
  },
  mounted () {
    this.nodeManager.initialize(this.treeOptions)
    this.nodeManager.setNodes(this.nodes)
  },
  methods: {
    getNodeManager () {
      return this.nodeManager
    },
    onNodeClicked (item) {
      this.$emit('node:clicked', item)
    },
    onKeyDown (event) {
      this.navigate(event)
    },
    onNodeFocused (node) {
      this.focusedNode = node
    },
    setFocusedNode (node) {
      const nodeComponent = this.treeState.nodes[node.id]
      if (nodeComponent) {
        this.focusedNode = node
        node.select()
        nodeComponent.focus()
      }
    }
  }
}
</script>

<style scoped>
.treevue-empty-search-text {
  margin: 10px;
}
</style>
