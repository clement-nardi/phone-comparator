<template>
  <div id="weightEditor" :style="style">
    <div style="display: flex; align-items: flex-start;">
      <table>
        <tr v-for="(row, i) in rows"
            :key="i">
          <th v-for="(header, i) in row.filter(cell => typeof cell == 'object')"
              :key="i + '_' + header"
              :colSpan="header.rowSpan"
              :rowSpan="header.colSpan"
              class="weightHeader">
            {{header.title}}
            <div style="display: flex; align-items: flex-start;">
              <div><i>default weight:</i></div>
             <WeightEditor :path="header.path" />
            </div>
          </th>
          <td v-for="(cell, i) in row.filter(cell => typeof cell != 'object')"
              :key="i + '_' + cell"
              class="weightCell">
            <div style="display: flex; align-items: flex-start;">
              <div>{{cell}}</div>
              <WeightEditor :propKey="cell" />
            </div>
          </td>
        </tr>
      </table>
      <button @click="hide"><b style="color: red; font-size: 150%;">X</b></button>
    </div>
  </div>
</template>

<script>
import WeightEditor from './WeightEditor'
export default {
  name: 'WeightsEditor',
  components: {WeightEditor},
  props: {
  },
  data: function () {
    return {
    }
  },
  computed: {
    rows() {
      const levels = this.$store.getters.getHeaderLevels
      const keys = this.$store.state.allKeys

      let rows = []
      let levelCounters = [0, 0, 0]
      let levelIndexes = [0, 0, 0]
      let levelSkip = [0, 0, 0]

      for (let i in keys) {
        let key = keys[i]
        let row = []
        for (let li = 0; li < levels.length; li += 1) {
          if (levelIndexes[li] < levels[li].length) {
            let level = levels[li][levelIndexes[li]]
            if (levelCounters[li] == 0) {
              row.push(level)
              levelCounters[li] = level.colSpan
              levelIndexes[li] += 1
              levelSkip[li] = level.rowSpan - 1
            } 
            levelCounters[li] -= 1
            li += levelSkip[li]            
          }
        }
        row.push(key)
        rows.push(row)
      }
      return rows
    },
    style() {
      return 'visibility: ' + (this.$store.state.displayWeightEditor?'visible':'hidden') + ';'
    }
  },
  methods: {
    getHeader(k) {
      return this.$store.getters.getHeader(k)
    },
    hide() {
      this.$store.commit('hideWeightEditor')
      this.$store.commit('updateScores')
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
#weightEditor {
  position: absolute; /* Stay in place */
  z-index: 1; /* Sit on top */
  left: 5%;
  top: 5%;
  background-color: rgb(0,0,0); /* Fallback color */
  background-color: rgba(0,0,0,0.9); /* Black w/ opacity */
}

table {
  table-layout: fixed;
  width: 90%;
  border-color: aqua;
  border-style: solid;
}
th {
  text-align: left;
  border-color: chartreuse;
  border-style: solid;
}
td {
  border-color: hotpink;
  border-style: solid;
}
</style>
