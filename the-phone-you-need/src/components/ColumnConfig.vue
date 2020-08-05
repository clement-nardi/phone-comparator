<template>
  <div id="column-config" v-if="key" :style="style" v-click-outside="hide">
    <strong>
      {{columnLabel}}
    </strong>
    <br>
    <span>
      Sort:
      <button @click="sort(true)">See best first</button>
      -
      <button @click="sort(false)">See worst first</button>
    </span>


  </div>
</template>

<script>
//import LabelWithTooltip from './LabelWithTooltip'
export default {
  name: 'ColumnConfig',
  //components: {LabelWithTooltip},
  props: {
  },
  data: function () {
    return {
    }
  },
  computed: {
    key() {
      return this.$store.state.configKey
    },
    columnLabel() {
      return this.$store.getters.getHeader(this.key)
    },
    style() {
      var pos = this.$store.state.configPos
      return 'left:' + Math.min(pos, window.innerWidth - 300) + 'px'
    }
  },
  methods: {
    sort(bestFirst) {
      this.$store.commit("sortBy", { key: this.key, bestFirst: bestFirst })
      this.hide()
    },
    hide() {
      this.$store.commit("setConfigKey", { key: null, pos: 0})
    }
  },
  events: {
    clickOutside: function() {
      this.hide()
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
#column-config {
  background-color: white;
  text-align: center;
  border-radius: 6px;
  border-color: darkblue;
  border-width: 2px;
  border-style: solid;
  padding: 10px;
  margin: 10px;
  z-index: 1;
  position: fixed;
  text-align: left;
  top: 20px;
  width: 300px;
}
</style>
