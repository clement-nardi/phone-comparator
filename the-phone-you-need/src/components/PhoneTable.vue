<template>
  <div>
    <table>
      <tr>
        <th v-for="(k, i) in this.$store.state.allKeys" :key="k">
          <LabelWithTooltip :label="getHeader(i)" :tooltip="getHeaderTooltip(i)"/>
        </th>
      </tr>
      <PhoneLine v-for="(phone, index) in this.$store.state.allPhones" :key="phone.name" :phoneIdx="index"/>
    </table>
  </div>
</template>

<script>
import PhoneLine from './PhoneLine'
import LabelWithTooltip from './LabelWithTooltip'
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
    getHeader(i) {
      return this.$store.getters.getHeader(i)
    },
    getHeaderTooltip(i) {
      return this.$store.getters.getHeaderTooltip(i)
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
table { table-layout: fixed; width: 100%; }
th { white-space:nowrap; overflow: hidden; }
</style>
