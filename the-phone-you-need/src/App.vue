<template>
  <div id="app">
    <div id="tooltip"/>
    <PhoneTable />
  </div>
</template>

<script>
import PhoneTable from './components/PhoneTable.vue'

export default {
  name: 'App',
  components: {
    PhoneTable
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
