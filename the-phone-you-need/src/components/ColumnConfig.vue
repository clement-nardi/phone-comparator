<template>
  <div id="column-config" :style="style" v-click-outside="hide">
    <div>
      <strong>
        {{columnLabel}}
      </strong>
    </div>
    <div>
      Sort:
      <button @click="sort(true)">See best first</button>
      -
      <button @click="sort(false)">See worst first</button>
    </div>
    <div ref="numberFilter">
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
      get: function () {
        let k = this.$store.state.configKey
        let v = this.$store.getters.getKeepEmpty(k)
        return v
      },
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
          const kprops = this.$store.state.keyProperties[k]
          let min = kprops.minValue
          let max = kprops.maxValue
          const filterSlider = document.getElementById('filterSlider');
          const showSlider = (typeof max == 'number') && filterSlider && min != max
          if (showSlider ) {
            let range = {
                'min': min,
                'max': max
            }
            let snap = false
            if (kprops.values.length < 50) {
              for (let val of kprops.values) {
                if (val == undefined || val == null || val == min || val == max) {continue}
                let percent = (val-min)/(max-min)*100
                range[percent + '%'] = val
              }
              snap = true
            }
            let start = [min, max]
            if (kprops.filters['min']) {
              start[0] = kprops.filters['min']
            }
            if (kprops.filters['max']) {
              start[1] = kprops.filters['max']
            }
            filterSlider.noUiSlider.updateOptions( {
                start: start,
                connect: true,
                snap: snap,
                range: range
              }
            )
          }
          const numberFilter = this.$refs['numberFilter']
          if (numberFilter) {
            numberFilter.style.display = showSlider?'contents':'none'
          }
        }
      }
      return k
    },
    columnLabel() {
      return this.$store.getters.getHeader(this.key)
    },
    style() {
      var pos = Math.max(0,this.$store.state.configPosX - 150)
      pos = Math.min(pos, window.innerWidth - 360)
      return 'left:' + pos + 'px;' + 'top:' + (this.$store.state.configPosY+12) + 'px;' + 
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
        this.min = parseFloat(values[handle])
      } else {
        this.max = parseFloat(values[handle])
      }
    },
    applyFilter(values, handle) {
      console.log(values)
        console.log(handle)
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
  width: 300px;
}
.darktheme #column-config {
  border-color: blue;
  background-color: slategray;
}
#filterSlider {
  margin: 20px;
}
</style>
