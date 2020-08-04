<template>
  <div id="app">
    <div id="tooltip"/>
    <PhoneTable />
    <ColumnConfig />
  </div>
</template>

<script>
import PhoneTable from './components/PhoneTable.vue'
import ColumnConfig from './components/ColumnConfig.vue'

export default {
  name: 'App',
  components: {
    PhoneTable,
    ColumnConfig
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  font-size: 80%;
}
</style>
