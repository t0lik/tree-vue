<template>
  <div class="treevue-tree" @keydown="onKeyDown">
    <div class="treevue-empty-search-text" v-if="!visibleNodes.length && storage.options.inSearch"> {{ treeOptions.notFoundText }} </div>
    <node
      :options="treeOptions"
      :storage="storage"
      :state="treeState"
      v-for="item in visibleNodes" :key="item.id"
      :node="item"
      @clicked="onNodeClicked"
      @node:focused="onNodeFocused"
      class="treevue-tree-root-node"
      >
      <template v-for="(_, slot) of $scopedSlots" v-slot:[slot]="scope"><slot :name="slot" v-bind="scope"/></template>
    </node>
  </div>
</template>

<script>
import Node from '@/components/Node'
import defaultIcons from '../icons/defaultIcons'
import DefaultStorage from '../storages/defaultStorage'
import keyboardMixin from '../mixins/keyboard'

export default {
  name: 'TreeVue',
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
        icons: defaultIcons,
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
        canDelete: false,
        styleClasses: {
          icon: null,
          text: null,
          checkbox: null,
          expander: null
        }
      }, this.options),
      storage: new DefaultStorage(this)
    }
  },
  watch: {
    'options.icons' (newValue) {
      this.treeOptions.icons = this.options.icons
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
    visibleNodes () {
      return this.storage.nodes.filter(x => x.visible())
    }
  },
  mounted () {
    this.storage.initialize(this.treeOptions)
    this.storage.setNodes(this.nodes)
  },
  methods: {
    getStorage () {
      return this.storage
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
