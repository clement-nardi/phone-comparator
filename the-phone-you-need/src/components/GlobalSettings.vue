<template>
  <div style="display: flex; justify-content: space-between;">
    <div style="display: flex; flex-wrap: wrap; align-items: center;">
      <div style="margin-right: 6px;">Comparing {{this.$store.state.filteredPhones.length}} phones.</div>
      <div v-if="this.$store.getters.getFilters.length > 0">
        Active Filters:
      </div>
      <div class="filterbox" style="float:left;" v-for="filter in this.$store.getters.getFilters" v-bind:key="filter.key + '|' + filter.type">
        {{filter.key}}: {{filter.type}}={{filter.value}} <button class="close" @click="removeFilter(filter)"><strong>x</strong></button>
      </div>
    </div>
    <div>
      Dark theme:
      <input type="checkbox" v-model="darktheme" />
      <button id="openWeightEditorButton" @click="openWeightEditor">Customize Score</button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'GlobalSettings',
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
    },
    removeFilter(filter) {
      this.$store.commit('removeFilter',filter)
    },
    openWeightEditor() {
      this.$store.commit('displayWeightEditor')
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

.filterbox {
  border-radius: 4px;
  border-color: orange;
  border-width: 1px;
  border-style: solid;
  padding: 4px;
  margin: 4px;
  text-align: left;
}

.close {
  border-radius: 2px;
  border-color: grey;
  border-width: 1px;
  border-style: solid;
  padding: 2px 4px 2px 4px;
  margin: 0px;
  color: red;
}


</style>
