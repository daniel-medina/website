<template lang='pug'>
//- This shit is necessary to be able to display 
div
  detail(:data='data', :show='show')

  .project.col-md-4(@click="display()")
    .wrapper
      .screenshot
        img(src='/assets/images/projects/rice-1.png')
      .title
        | Project's title
</template>

<script>
/** Importing components */
import Detail from './Detail.vue'

export default {
  props: ['data'],
  data () {
    return {
      show: false
    }
  },
  created () {
    setTimeout(function () {
      console.log(this.$children)
    }, 1000)
  },
  components: {
    detail: Detail
  },
  methods: {
    // Method: display {{{
    /**
     * Display the detail window
     *
     */
    display: function () {
      this.show = !this.show
    }
    // }}}
  }
}
</script>

<style lang="scss" scoped>
@import './views/sass/_variables';
</style>
