<template>
  <div>
    <table>
      <tr>
        <th v-for="k in this.$store.state.allKeys"
            :key="k"
            :style="'width: ' + getHeaderWidth(k)">
          <button @click="headerClicked(k,$event)">{{getHeader(k)}}</button>
        </th>
      </tr>
      <PhoneLine v-for="(phone, index) in this.$store.getters.getPhones()" :key="phone.name" :phoneIdx="index"/>
    </table>
  </div>
</template>

<script>
import PhoneLine from './PhoneLine'
export default {
  name: 'PhoneTable',
  components: {PhoneLine},
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
      this.$store.commit('setConfigKey', {key: k, pos: event.clientX} )
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
</style>
