<template>
  <div>
    <table>
      <colgroup>
        <col />
        <col v-for="k in this.$store.state.allKeys"
            :key="k"
            :style="'width: ' + getHeaderWidth(k) + '; background-color: ' + getColumnBackgroundColor(k) + ';' ">
      </colgroup>
      <tr v-for="(headers, n) in this.$store.getters.getHeaderLevels"
          :key="n">
        <th />
        <th v-for="(k, i) in headers"
            :key="i + '_' + k"
            :colSpan="k.colSpan"
            :rowSpan="k.rowSpan"
            class="metaHeader">
          {{k.title}}
        </th>
      </tr>
      <tr>
        <th />
        <th v-for="k in this.$store.state.allKeys"
            :key="k">
          <button @click="headerClicked(k,$event)" class="headerButton" :style="headerStyle(k)">
            <LabelWithTooltip :label="getHeader(k) + ''" :tooltip="getHeaderTooltip(k) + ''" :below="true" />
          </button>
        </th>
      </tr>
      <PhoneLine v-for="(phone, index) in this.$store.getters.getPhones()" :key="phone.name" :phone="phone" :index="index" />
    </table>
      Show:
    <span v-for="(nb, i) in nbLinesList" :key="nb">
      <a @click="show(nb)">{{nb}}</a>
      <span v-if="i<nbLinesList.length-1"> - </span>
    </span>
  </div>
</template>

<script>
import LabelWithTooltip from './LabelWithTooltip'
import PhoneLine from './PhoneLine'
export default {
  name: 'PhoneTable',
  components: {PhoneLine, LabelWithTooltip},
  props: {
    msg: String
  },
  data: function () {
    return {
    }
  },
  computed: {
    nbLinesList() {
      let nbLinesList = []
      let step = 100
      let i = step
      let max = this.$store.state.filteredPhones.length
      while (i < max) {
        nbLinesList.push(i)
        i += step
      }
      nbLinesList.push(max)
      return nbLinesList
    }
  },
  methods: {
    getHeadersLevel(n) {
      return this.$store.getters.getHeadersLevel(n)
    },
    getHeader(k) {
      return this.$store.getters.getHeader(k)
    },
    getHeaderWidth(k) {
      return this.$store.getters.getHeaderWidth(k)
    },
    getColumnBackgroundColor(k) {
      return this.$store.getters.getColumnBackgroundColor(k)
    },
    getHeaderTooltip(k) {
      return this.$store.getters.getHeaderTooltip(k)
    },
    headerClicked(k, event) {
      event.stopPropagation()
      this.$store.commit('setConfigKey', {key: k, posX: event.clientX, posY:event.clientY} )
    },
    headerStyle(k) {
      let filters = this.$store.getters.getFilters.map(f => f.key)
      let color = 'silver'
      if (filters.includes(k)) {
        color = 'orange'
      }
      if (this.$store.state.sortKey == k) {
        color = 'green'
      }
      return 'background-color: ' + color + ';'
    },
    show(nb) {
      this.$store.commit('setNbVisiblePhones', nb)
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
table {
  table-layout: fixed;
  width: 200%;
  border-collapse: collapse;
}
th {
  white-space:nowrap;
  overflow: hidden;
  text-align: left;
}
.headerButton {
  padding-left: 1px;
  border-radius: 2px;
  border-width: 1px;
  border-style: solid;
}
a {
  cursor: pointer;
  text-decoration: underline;
}
.metaHeader {
  text-align: center;
  border-width: 1px;
  border-style: solid;
  width: auto;
}
</style>
