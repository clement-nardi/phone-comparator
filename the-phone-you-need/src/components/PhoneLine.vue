<template>
  <tr>
    <td>{{index}}</td>
    <td v-for="k in this.$store.state.allKeys" :key="k">
      <LabelWithTooltip :label="getLabel(phone, k) + ''"
                        :tooltip="getTooltip(phone, k) + ''"
                        :color="getColor(phone, k)" />
    </td>
  </tr>
</template>

<script>
import LabelWithTooltip from './LabelWithTooltip'
export default {
  name: 'PhoneLine',
  components: {LabelWithTooltip},
  props: {
    phone: Object,
    index: Number
  },
  data: function () {
    return {
    }
  },
  computed: {
  },
  methods: {
    getLabel(phone, k) {
      return this.$store.getters.getLabel(phone, k)
    },
    getTooltip(phone, k) {
      return this.$store.getters.getTooltip(phone, k)
    },
    getColor(phone, k) {
      return this.$store.getters.getColor(phone, k)
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

td { white-space:nowrap; overflow: hidden; }
</style>
