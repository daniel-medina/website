<template lang='pug'>
//- This shit is necessary to be able to display 
div
  detail(:data="data", :show="show")

  .project.col-md-4.col-xs-4.col-sm-4.col-lg-3(@click="display()")
    .wrapper
      .screenshot
        img(:src="/assets/ + this.data.images[0].path")
        .title {{ this.data.title }}
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
@import '../../sass/styles.scss';
</style>
