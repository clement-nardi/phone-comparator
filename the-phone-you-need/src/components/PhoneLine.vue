<template>
  <tr>
    <td>{{phone.name}}</td>
    <td v-for="k in this.$store.state.allKeys" :key="k">
      {{ getSpec(phone,k) }}
    </td>
  </tr>
</template>

<script>
export default {
  name: 'PhoneLine',
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
        return phone.specs[k]
      } else {
        return ''
      }
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
