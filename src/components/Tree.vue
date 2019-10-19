<template>
  <div class="treevue-tree">
    <div class="treevue-empty-search-text" v-if="!visibleItems.length && nodeManager.options.inSearch"> {{ treeOptions.notFoundText }} </div>
    <node :options="treeOptions" :manager="nodeManager" :state="treeState" v-for="item in visibleItems" :key="item.id" :node="item" :parentClasses="getNodeClasses" @clicked="onNodeClicked">
      <template v-for="(_, slot) of $scopedSlots" v-slot:[slot]="scope"><slot :name="slot" v-bind="scope"/></template>
    </node>
  </div>
</template>

<script>
import Node from './Node'
import defaultStyleManager from '../styleManagers/defaultStyleManager'
import DefaultManager from '../nodeManagers/defaultManager'

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
  components: {
    Node
  },
  data () {
    return {
      treeState: {
      },
      treeOptions: Object.assign({}, {
        styleManager: defaultStyleManager,
        multiselect: false,
        showCheckbox: true,
        checkOnSelect: false,
        openOnSelect: false,
        autoSort: false,
        sortComparator: null,
        idProp: 'id_',
        nameProp: 'name',
        childrenProp: 'children',
        notFoundText: 'no nodes are found'
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
    getCheckedNodes () {
      return this.nodeManager.getCheckedNodes()
    },
    getNodeManager () {
      return this.nodeManager
    },
    getNodeClasses (item) {
      return {
        selected: this.nodeManager.selectedNode === item
      }
    },
    onNodeClicked (item) {
      this.$emit('node:clicked', item)
    }
  }
}
</script>

<style scoped>
.treevue-empty-search-text {
  margin: 10px;
}
</style>
