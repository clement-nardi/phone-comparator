<template>
  <tr>
    <td v-for="k in this.$store.state.allKeys" :key="k">
      <LabelWithTooltip :label="getLabel(phoneIdx, k) + ''"
                        :tooltip="getTooltip(phoneIdx, k) + ''"
                        :color="getColor(phoneIdx, k)" />
    </td>
  </tr>
</template>

<script>
import LabelWithTooltip from './LabelWithTooltip'
export default {
  name: 'PhoneLine',
  components: {LabelWithTooltip},
  props: {
    phoneIdx: Number
  },
  data: function () {
    return {
    }
  },
  computed: {
  },
  methods: {
    getLabel(phoneIdx, k) {
      return this.$store.getters.getLabel(phoneIdx, k)
    },
    getTooltip(phoneIdx, k) {
      return this.$store.getters.getTooltip(phoneIdx, k)
    },
    getColor(phoneIdx, k) {
      return this.$store.getters.getColor(phoneIdx, k)
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

td { white-space:nowrap; overflow: hidden; }
</style>
