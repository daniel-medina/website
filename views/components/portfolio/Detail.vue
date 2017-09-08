<template lang='pug'>
#detail
  .wrapper(:style="style")
    | onche
</template>

<script>
export default {
  props: ['data', 'show'],
  data () {
    return {
      style: {
        opacity: '0'
      }
    }
  },
  created () {
    this.changeStyle()
    console.log(this.style.opacity)
  },
  methods: {
    // Method: changeStyle {{{
    /**
     * Change the style of the current component
     * In order to display it or hide it
     *
     */
    changeStyle: function () {
      const display = {
        opacity: '1',
        visibility: 'visible'
      }
      const hide = {
        opacity: '0',
        visibility: 'hidden'
      }

      /** If we have to display it OR hide it, we change the style to the proper variable */
      if (this.show) this.style = display
      else this.style = hide
    }
    // }}}
  }
}
</script>

<style>
@import './views/sass/_variables';

#detail {
  .wrapper {
    position: $color9;
    display: flex;
    z-index: 9999;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;

    .window {
      background: red;
    }
  }
}
</style>
