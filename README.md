# TreeVue

A Vue treeview component that visualizes your data hierarchically.

## Features
* full programmatic access
* wide range of events
* flexible configuration
* no limitations on the number of instances per page
* filtering
* sorting
* multiselection
* keyboard navigation

## Installation
**Npm:**

```shell
$ npm install vu-tree
```

**Yarn:**

```shell
$ yarn add vu-tree
```

## Demo app

To run the demo:

* Clone this repository
* `npm install`
* `npm run serve` 
* Visit `http://localhost:8080/` (or similar url that is located under the "App running at" after command "npm run serve")

This simple app demonstrates almost all main tree features.

## Usage

```html
  <template>
    <tree-vue
        :items="items"
        :options="options"
        ref="treeVue"
    />
  </template>

  <script>
    import Vue from 'Vue'
    import { TreeVue } from 'vu-tree'

    Vue.use(TreeVue)

    export default {
      ...
      data() {
        return {
          items: [
            { name: 'Node 1' },
            { name: 'Node 2',
              checked: true,
              open: true,
              children: [
              { name: 'Node 3', disabled: true },
              { name: 'Node 4' }
            ]}
          ],
          options: {
            showCheckbox: true
          }
        }
      }
      ...
    }
  </script>
```
### Events
  All the events can be captured using the usual Vue event engine:
```html
  <template>
    <tree-vue
        :items="items"
        :options="options"
        ref="treeVue"
        @tree:checked:all="onCheckedAll"
        @node:enabled="onNodeEnabled"
    />
  </template>
  ...
```

### Node management
  Nodes are managed by the node storage that is accessed by the function "getStorage" of the tree component.
```html
  <template>
    <tree-vue
        :items="items"
        :options="options"
        ref="treeVue"
    />
  </template>
  <script>
    import Vue from 'Vue'
    import { TreeVue } from 'tree-vue'

    Vue.use(TreeVue)

    export default {
      computed: {
        storage () {
          if (!this.$refs.tree) {
            return null
          }

          return this.$refs.tree.getStorage()
        }
      },
      ...
      methods: {
        checkAllNodes () {
          this.storage.checkAll()
        }
      }
      ...
```


## Development

To build this component from sources just run this command:
- `npm run build`

To run unit tests:
- `npm run test:unit`


## License

[MIT](https://opensource.org/licenses/MIT)
