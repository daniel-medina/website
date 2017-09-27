<template lang='pug'>
#detail
  .wrapper(:style="style")
    .window.col-sm-10.col-md-10.col-lg-10.col-xs-12
      .buttons
        i.fa.fa-window-close(@click="$parent.display()")
      | Test
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
  },
  watch: {
    // Watch: show {{{
    /**
     * Watch for a change in this.show
     * In order to update the display according to that variable
     *
     */
    show: function () {
      /** Update the style with the new value of this.show */
      this.changeStyle()
    }
    // }}}
  }
}
</script>

<style lang="scss" scoped>
@import '../../sass/styles.scss';

/** Should be changed to a "modal" or "popup" class someday */
#detail {
  .wrapper {
    transition: $transition;
    position: fixed;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 9999;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;

    .window {
      padding: 0;
      border: $portfolio-project-popup-border;
      background: $portfolio-project-popup-background;
      height: $portfolio-project-popup-height;

      .buttons {
        text-align: right;
        padding-right: $portfolio-project-popup-buttons-padding;
        font-size: $portfolio-project-popup-buttons-size;
        width: 100%;

        i {
          transition: $transition;
          &:hover {
            cursor: pointer;
            color: $a-hover-color;
          }
        }
      }
    }
  }
}
</style>
