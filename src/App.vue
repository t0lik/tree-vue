<template>
  <div id="app">
    <tree :nodes="nodes"/>
  </div>
</template>

<script>
import Tree from './components/Tree'

export default {
  name: 'app',
  components: {
    Tree
  },
  data () {
    return {
      nodes: [{
        id: 0,
        name: 'ноль'
      }, {
        id: 1,
        name: 'один',
        children: [{
        id: 3,
        name: 'три'
      }, {
        id: 4,
        name: 'четыре'
      }]
      }, {
        id: 2,
        name: 'два'
      }],
      isOpened: false
    }
  },
  methods: {
    onClick () {
      this.isOpened = !this.isOpened
    }
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  margin-left: 50px;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
