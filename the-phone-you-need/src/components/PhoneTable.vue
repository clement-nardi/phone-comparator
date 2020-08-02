<template>
  <div>
    <table>
      <tr>
        <th>name</th>
        <th v-for="k in this.$store.state.allKeys" :key="k">
          {{k }}
        </th>
      </tr>
      <PhoneLine v-for="phone in this.$store.state.allSpecs" :key="phone.name" :phone="phone"/>
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
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
