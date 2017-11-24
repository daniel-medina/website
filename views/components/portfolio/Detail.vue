<template lang='pug'>
#detail
  .wrapper(:style='style')
    .window.col-sm-12.col-md-10.col-lg-10.col-xs-12
      .buttons
        i.fa.fa-window-close(@click='$parent.display()')
        .name
          | #[i.fa.fa-arrow-circle-o-right] {{ this.data.title }}
      .images-wrapper.col-md-7.col-lg-7.col-xs-12
        .images
          a(:href='/assets/ + data.images[currentImage].path', target='_blank') #[img(:src='/assets/ + data.images[currentImage].path')]
          .to-left(v-if='data.images.length > 1',@click='previousImage')
            i.fa.fa-chevron-left
          .to-right(v-if='data.images.length > 1', @click='nextImage')
            i.fa.fa-chevron-right
      .information.col-md-5.col-xs-12
        .category(v-if='data.description.length > 0')
          .title
            | Description #[i.fa.fa-info-circle]
          .description
            nl2br(tag='p', :text='data.description')
        .category(v-if='data.languages.length > 0')
          .title
            | Languages #[i.fa.fa-tags]
          .tags
            li(v-for='language in this.data.languages') #[button(:class='language.color') {{ language.name }}]
        .category(v-if='data.frameworks.length > 0')
          .title
            | Frameworks #[i.fa.fa-tags]
          .tags
            li(v-for='framework in this.data.frameworks') #[button(:class='framework.color') {{ framework.name }}]
        .category(v-if='data.url.length > 0 || data.source.length > 0')
          .title
            | Links #[i.fa.fa-external-link]
          .links
            a.button.btn.btn-xs.btn-success(v-if='data.url.length > 0', :href='data.url', target='_blank') Access
            a.button.pull-right.btn.btn-xs.btn-danger(v-if='data.source.length > 0' :href='data.source', target='_blank') Source code
</template>

<script>
/** Importing components */
import nl2br from 'vue-nl2br'

export default {
  props: ['data', 'show'],
  data () {
    return {
      style: {
        opacity: '0'
      },
      currentImage: 0
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
    },
    // }}}
    // Method: previousImage {{{
    /**
     * Goes to the previous image
     *
     */
    previousImage: function () {
      /** If the previous image is not the first one */
      if (this.currentImage - 1 > 0) {
        this.currentImage--
      } else {
        /** If it is, go back to the last index */
        this.currentImage = this.data.images.length - 1
      }
    },
    // }}}
    // Method: nextImage {{{
    /**
     * Goes to the next image
     *
     */
    nextImage: function () {
      /** If the next image is not the last one */
      if (this.currentImage + 1 < this.data.images.length) {
        this.currentImage++
      } else {
        /** If it is, go back to the first index */
        this.currentImage = 0
      }
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
  },
  components: {
    nl2br: nl2br
  }
}
</script>

<style lang="scss" scoped>
@import '../../sass/styles.scss';

/** Should be changed to a "modal" or "popup" class someday */
#detail {
  .wrapper {
    background: $popup-background;
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
    min-height: 88px;

    .window {
      overflow-x: hidden;
      overflow-y: auto;
      padding: 0;
      padding-bottom: $portfolio-project-popup-padding;
      border: $portfolio-project-popup-border;
      background: $portfolio-project-popup-background;
      box-shadow: $popup-shadow;
      height: $portfolio-project-popup-height;

      &::-webkit-scrollbar {
        display: none;
      }

      .buttons {
        text-align: right;
        font-size: $portfolio-project-popup-buttons-size;
        width: 100%;
        z-index: 999999;

        i {
          padding-right: $portfolio-project-popup-buttons-padding;
          transition: $transition;
          &:hover {
            cursor: pointer;
            color: $a-hover-color;
          }
        }
      }
      .name {
        z-index: 999999;
        text-align: left;
        overflow: hidden;
        max-height: 80px;
        background: $color9;
        color: $color1;
        margin-bottom: $portfolio-project-name-margin;
        width: 100%;
        padding: 5px;
        font-family: $font-all;
        font-weight: bold;
        font-size: $font-big;
        text-transform: uppercase;
      }

      .images-wrapper {
        display: flex;
        align-items: center;

        .images {
          display: flex;
          position: relative;
          overflow: hidden;
          align-items: center;

          height: 0;
          min-height: $portfolio-project-detail-image-min-height;
          max-height: $portfolio-project-detail-image-max-height;
          width: 100%;

          img {
            max-width: 100%;
            max-height: 100%;
            padding: 0;
          }
          .to-left {
            position: absolute;
            display: flex;
            align-items: center;
            justify-content: center;

            top: 0;
            left: 0;

            width: $popup-chevron-width;
            height: 100%;

            background: $popup-chevron-background;
            color: $popup-chevron-color;
            font-size: $popup-chevron-size;

            &:hover {
              cursor: pointer;
            }
          }

          .to-right {
            position: absolute;
            display: flex;
            align-items: center;
            justify-content: center;

            top: 0;
            right: 0;

            width: $popup-chevron-width;
            height: 100%;

            background: $popup-chevron-background;
            color: $popup-chevron-color;
            font-size: $popup-chevron-size;

            &:hover {
              cursor: pointer;
            }
          }

        }
      }
      .information {
        .category {
          margin-top: $portfolio-project-information-category-margin;
          .title {
            text-align: right;
            text-transform: uppercase;
            font-weight: bold;
            font-size: $portfolio-project-information-category-title-font-size;
            border-bottom: $portfolio-project-information-category-title-border;
          }
          .tags {
            margin-top: $portfolio-project-information-category-tags-margin;
            li {
              display: inline;
              list-style: none;
              button {
                color: white;
                font-weight: bold;
                font-size: $font-tiny;
                text-transform: uppercase;
                border: $portfolio-project-information-tags-border;
                border-radius: 4px;

                margin: $portfolio-project-information-tags-margin;
              }

              /** Different colors for different tags */
              .green {
                background: $portfolio-project-information-tags-background-green;
                border: $portfolio-project-information-tags-border-green;
              }
              .red {
                background: $portfolio-project-information-tags-background-red;
                border: $portfolio-project-information-tags-border-red;
              }
              .grey {
                background: $portfolio-project-information-tags-background-grey;
                border: $portfolio-project-information-tags-border-grey;
              }
              .orange {
                background: $portfolio-project-information-tags-background-orange;
                border: $portfolio-project-information-tags-border-orange;
              }
              .pink {
                background: $portfolio-project-information-tags-background-pink;
                border: $portfolio-project-information-tags-border-pink;
              }
              .black {
                background: $portfolio-project-information-tags-background-black;
                border: $portfolio-project-information-tags-border-black;
              }
            }
          }
          .links {
            margin-top: $portfolio-project-information-category-tags-margin;
            list-style: none;
          }
          .description {
            word-break: break-all;
            font-size: $font-small;
            font-family: $font-read;
          }
        }
      }
    }
  }
}
</style>
