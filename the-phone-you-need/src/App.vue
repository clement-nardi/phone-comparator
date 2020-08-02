<template>
  <div id="app">
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
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
