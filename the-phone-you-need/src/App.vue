<template>
  <div id="app">
    <GlobalSettings />
    <div id="tooltip"/>
    <PhoneTable />
    <ColumnConfig />
    <WeightsEditor />
  </div>
</template>

<script>
import PhoneTable from './components/PhoneTable.vue'
import ColumnConfig from './components/ColumnConfig.vue'
import GlobalSettings from './components/GlobalSettings.vue'
import WeightsEditor from './components/WeightsEditor.vue'

export default {
  name: 'App',
  components: {
    PhoneTable,
    ColumnConfig,
    GlobalSettings,
    WeightsEditor
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
.darktheme {
  background-color: black;
  color:white;
}
.darktheme a:link {color:#CCFFFF;} /* sets normal link color */
.darktheme a:visited {color:#FFCCFF;} /* sets visited link color */
.darktheme a:active {color:#66FFCC;} /* sets active link color */
</style>
