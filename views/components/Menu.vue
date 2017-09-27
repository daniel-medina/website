<template lang="pug">
#menuxs(ref='menuxs')
  .deploy(@click='collapse')
    .button #[i(:class="(collapsed) ? 'fa fa-times' : 'fa fa-bars'")]
    .collapsed
      a(href='/') #[li Blog]
      a(href='/portfolio') #[li Portfolio]
      a(href='/about-me') #[li About me]
      a(href='/contact') #[li Contact]
      a(href='/admin/disconnect' v-if='session.admin') #[li Disconnect]
</template>

<script>
import axios from 'axios'

export default {
  data () {
    return {
      session: [],
      collapsed: false
    }
  },
  async created () {
    try {
      /** We get the current session from the request */
      const session = await this.getSession()
      this.session = session.data
    } catch (error) {
      console.log(error)
    }
  },
  methods: {
    // Method: getSession {{{
    /**
     * Set the session data of the component
     *
     * @see Axios
     */
    getSession: async function () {
      return axios.get('/session/get')
    },
    // }}}
    // Method: collapse {{{
    /**
     * Make the menu collapse on click event
     *
     * @param {Type} tag Description
     * @returns {Type} tag
     */
    collapse: function () {
      const element = document.querySelector('.collapsed')

      this.collapsed = !this.collapsed

      if (this.collapsed) {
        /** scrollHeight is pretty damn useful here */
        element.style.height = element.scrollHeight + 'px'
      } else {
        element.style.height = '0'
      }
    }
    // }}}
  }
}
</script>

<style lang="scss" scoped>
@import '../sass/styles.scss';

// @media {{{
@media (min-width: 1200px) {
  .container {
    width: auto;
    max-width: $container-max-width;
  }
}

// }}}
</style>
