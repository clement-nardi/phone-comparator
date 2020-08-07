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
      <br>
      <span>Keep empty: </span><input type="checkbox" v-model="keepEmpty"/>
    </div>
  </div>
</template>

<script>
//import LabelWithTooltip from './LabelWithTooltip'
import noUiSlider from 'nouislider';
import 'nouislider/distribute/nouislider.css';
var currentKey = undefined

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
    keepEmpty: {
      // getter
      get: function () {
        let k = this.$store.state.configKey
        let v = this.$store.getters.getKeepEmpty(k)
        return v
      },
      // setter
      set: function (newValue) {
        let k = this.$store.state.configKey
        this.$store.commit('applyFilter', {key: k, filterType: 'keepEmpty', filterValue: newValue})
      }
    },
    key() {
      let k = this.$store.state.configKey
      if (currentKey != k) {
        currentKey = k
        if (k) {
          const filterSlider = document.getElementById('filterSlider');
          const kprops = this.$store.state.keyProperties[k]
          let min = kprops.minValue
          let max = kprops.maxValue
          let showSlider = (typeof max == 'number')
          if (showSlider) {
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
          filterSlider.style.visibility = showSlider?'visible':'hidden'
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
      this.$store.commit("sortBy", { key: this.key, bestFirst: bestFirst })
      this.hide()
    },
    hide() {
      this.$store.commit("setConfigKey", { key: null, pos: 0})
    },
    updateMinMax(values, handle) {
      if (handle == 0) {
        this.min = values[handle]
      } else {
        this.max = values[handle]
      }
    },
    applyFilter(values, handle) {
      this.$store.commit('applyFilter', {
        key: currentKey,
        filterType: (handle==0)?'min':'max',
        filterValue: parseFloat(values[handle])
      })
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
      filterSlider.noUiSlider.on('update', this.updateMinMax);
      filterSlider.noUiSlider.on('change', this.applyFilter);
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
