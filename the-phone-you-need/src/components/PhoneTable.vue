<template>
  <div>
    <table>
      <tr>
        <th />
        <th v-for="k in this.$store.state.allKeys"
            :key="k"
            :style="'width: ' + getHeaderWidth(k)">
          <button @click="headerClicked(k,$event)" class="headerButton" :style="headerStyle(k)">
            <LabelWithTooltip :label="getHeader(k) + ''" :tooltip="getHeaderTooltip(k) + ''" :below="true" />
          </button>
        </th>
      </tr>
      <PhoneLine v-for="(phone, index) in this.$store.getters.getPhones()" :key="phone.name" :phone="phone" :index="index"/>
    </table>
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
  },
  methods: {
    getHeader(k) {
      return this.$store.getters.getHeader(k)
    },
    getHeaderWidth(k) {
      return this.$store.getters.getHeaderWidth(k)
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
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
table {
  table-layout: fixed;
  width: 100%;
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
</style>
