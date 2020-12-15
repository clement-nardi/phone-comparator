<template>
  <div>
    <input type="range" min="0" max="10" class="slider" v-model="sliderValue" >
    {{sliderValue}}
  </div>
</template>

<script>
export default {
  name: 'WeightEditor',
  props: {
    path: Array,
    propKey: String
  },
  data: function () {
    return {
    }
  },
  computed: {
    sliderValue: {
      get: function() {
        if (this.propKey) {
          return this.$store.getters.getKeyWeight(this.propKey)
        } else {
          return this.$store.getters.getWeight(this.path)
        }
      },
      set: function(val) {
        if (this.propKey) {
          return this.$store.commit('setKeyWeight', {key: this.propKey, weight: val})
        } else {
          return this.$store.commit('setWeight',  {path: this.path, weight: val})
        }
      }
    }
  },
  methods: {
    getHeader(k) {
      return this.$store.getters.getHeader(k)
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
