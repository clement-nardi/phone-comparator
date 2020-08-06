<template>
  <div id="column-config" :style="style" v-click-outside="hide">
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
    <div>
      Filter values:
      <div v-once ref="filterSlider" id="filterSlider"> </div>
      <div>
        <div style="float:left;">
          {{this.min}}
        </div>
        <div style="float:right;">
          {{this.max}}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
//import LabelWithTooltip from './LabelWithTooltip'
import noUiSlider from 'nouislider';
import 'nouislider/distribute/nouislider.css';
var previousKey = undefined

export default {
  name: 'ColumnConfig',
  //components: {LabelWithTooltip},
  props: {
  },
  data: function () {
    return {
      min: 0,
      max: 0
    }
  },
  computed: {
    key() {
      let k = this.$store.state.configKey
      if (previousKey != k) {
        previousKey = k
        console.log('key changed')
        if (k) {
          const filterSlider = document.getElementById('filterSlider');
          const kprops = this.$store.state.keyProperties[k]
          let min = kprops.minValue
          let max = kprops.maxValue
          console.log(min)
          console.log(max)
          if (typeof max == 'number') {
            filterSlider.noUiSlider.updateOptions( {
                start: [min, max],
                connect: true,
                range: {
                    'min': min,
                    'max': max
                }
              }
            )
          }
        }
      }
      return k
    },
    columnLabel() {
      return this.$store.getters.getHeader(this.key)
    },
    style() {
      var pos = this.$store.state.configPos
      return 'left:' + Math.min(pos, window.innerWidth - 300) + 'px;' +
       "visibility:" + (this.key?'visible':'hidden')
    }
  },
  methods: {
    sort(bestFirst) {
      console.log('sort')
      this.$store.commit("sortBy", { key: this.key, bestFirst: bestFirst })
      this.hide()
    },
    hide() {
      console.log('hide')
      this.$store.commit("setConfigKey", { key: null, pos: 0})
    },
    updateFilter(values, handle) {
      if (handle == 0) {
        this.min = values[handle]
      } else {
        this.max = values[handle]
      }
    }
  },
  events: {
    clickOutside: function() {
      this.hide()
    }
  },
  mounted: function () {
    const filterSlider = this.$refs['filterSlider'];
    if (filterSlider) {
      noUiSlider.create(filterSlider, {
          start: [20, 80],
          connect: true,
          range: {
              'min': 0,
              'max': 100
          }
        }
      );
      filterSlider.noUiSlider.on('update', this.updateFilter);
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
#filterSlider {
  margin: 20px;
}
</style>
