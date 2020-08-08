<template>
  <div>
    <div style="float:right;">
      Dark theme:
      <input type="checkbox" v-model="darktheme" />
    </div>
  </div>
</template>

<script>
export default {
  name: 'Settings',
  //components: {LabelWithTooltip},
  props: {
  },
  data: function () {
    return {
    }
  },
  computed: {
    darktheme: {
      get () {
        return this.$store.state.darktheme
      },
      set (v) {
        this.setTheme(v)
      }
    }
  },
  methods: {
    setTheme(v) {
      this.$store.state.darktheme = v
      if (v) {
        document.body.classList.add('darktheme')
      } else {
        document.body.classList.remove('darktheme')
      }
    }
  },
  events: {
  },
  mounted: function () {
    this.setTheme(this.$store.state.darktheme)
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
