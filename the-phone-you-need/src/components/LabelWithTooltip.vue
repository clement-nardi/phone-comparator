<template>
  <div ref="labelRef" class="label"
       @mouseover="showTooltip()"
       :style="'background-color: ' + this.color"
       v-html="label">
  </div>
</template>

<script>
export default {
  name: 'LabelWithTooltip',
  props: {
    label: String,
    tooltip: String,
    color: String,
    below: Boolean
  },
  data: function () {
    return {
    }
  },
  computed: {
  },
  methods: {
    showTooltip() {
      const labelEl = this.$refs['labelRef']
      var container = document.getElementById("tooltip");
      if (labelEl.scrollWidth > labelEl.clientWidth || this.label != this.tooltip) {
        container.innerHTML = this.tooltip
        container.style.visibility = 'visible'

        const left = labelEl.getBoundingClientRect().left
        const top = labelEl.getBoundingClientRect().top
        if (left > 800) {
          container.style.left = (left-(this.below?90:(container.getBoundingClientRect().width))-20) + 'px'
        } else {
          container.style.left = (left+(this.below?0:labelEl.clientWidth)) + 'px'
          container.style.right = ''
        }
        container.style.top = top-(this.below?-20:20) + 'px'
      } else {
        container.style.visibility = 'hidden'
      }
    }
  }
}
</script>

<style>
#tooltip {
  visibility: hidden;
  background-color: white;
  text-align: center;
  border-radius: 6px;
  border-color: black;
  border-width: 1px;
  border-style: solid;
  padding: 10px;
  margin: 10px;
  z-index: 1;
  position: fixed;
  text-align: left;
}

.darktheme #tooltip {
  border-color: yellow;
  background-color: dimgray;
}
</style>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.label {
  position: relative;
}

</style>
