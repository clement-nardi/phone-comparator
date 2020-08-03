<template>
  <div :ref="label" class="label" @mouseover="showTooltip(label)">
    {{label}}
  </div>
</template>

<script>
export default {
  name: 'LabelWithTooltip',
  props: {
    label: String,
    tooltip: String
  },
  data: function () {
    return {
    }
  },
  computed: {
  },
  methods: {
    showTooltip(label) {
      const labelEl = this.$refs[label]
      var container = document.getElementById("tooltip");
      if (labelEl.scrollWidth > labelEl.clientWidth) {
        container.innerText = this.tooltip
        container.style.visibility = 'visible'

        const left = labelEl.getBoundingClientRect().left
        const top = labelEl.getBoundingClientRect().top
        //console.log(left)
        container.style.left = (left+30) + 'px'
        container.style.top = (top-20) + 'px'
      } else {
        container.style.visibility = 'hidden'
      }
    }
  }
}
</script>

<style>
#tooltip {
  background-color: black;
  color: #fff;
  text-align: center;
  border-radius: 6px;
  padding: 10px;
  margin: 10px;
  z-index: 1;
  position: fixed;
}
</style>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.label {
  position: relative;
}

</style>
