<template>
  <tr :class="{ highlighted: highlighted }" @click="highlight()">
    <td>{{index+1}}</td>
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
      highlighted: false
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
    },
    highlight() {
      this.highlighted = !this.highlighted
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

td { white-space:nowrap; overflow: hidden; }

.highlighted {
  border: solid thin;
  border-width: 2px;
  border-color: blue;
}
.darktheme .highlighted {
  border-color: yellow;
}
</style>
