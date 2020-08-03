<template>
  <tr>
    <td>
      <LabelWithTooltip :label="phone.name" :tooltip="phone.name"/>
    </td>
    <td v-for="k in this.$store.state.allKeys" :key="k">
      <LabelWithTooltip :label="getSpec(phone,k)" :tooltip="getTooltip(phone,k)" />
    </td>
  </tr>
</template>

<script>
import LabelWithTooltip from './LabelWithTooltip'
export default {
  name: 'PhoneLine',
  components: {LabelWithTooltip},
  props: {
    phone: Object
  },
  data: function () {
    return {
    }
  },
  computed: {
  },
  methods: {
    getSpec(phone, k) {
      if (phone.specs && phone.specs[k]) {
        var spec = phone.specs[k]
        if (typeof spec === 'object') {
          return 'link'
        } else {
          return this.safeToString(spec)
        }
      } else {
        return ''
      }
    },
    getTooltip(phone, k) {
      if (phone.specs && phone.specs[k]) {
        var spec = phone.specs[k]
        return this.safeToString(spec)
      } else {
        return ''
      }
    },
    safeToString(any) {
      return any + ''
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

td { white-space:nowrap; overflow: hidden; }
</style>
