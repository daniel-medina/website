/**
 * Eslint doesn't understand that there are other files interacting with this one
 * So it is necessary to disable eslint on some lines
 *
 * We avoid using async/await feature; instead we use Promises, to ensure compatibility with the maximum possible web browsers
 */

// portfolio {{{
const portfolio = Vue.component('portfolio', { // eslint-disable-line
  data () {
    return {
      projects: []
    }
  },
  template: `
  <div id="portfolio">
    <li v-for="project in projects">
      title : {{ project.title }} - description : {{ project.description }}
    </li>
  </div>
  `,
  created () {
    /** We load all the projects, with Axios */
    this.getProjects()
  },
  methods: {
    getProjects: function () {
      axios.get('/xhr/portfolio/projects', { // eslint-disable-line
        /** This header is obligatory; it ensures the ajax request is accepted by the affected middleware */
        headers: {'X-Requested-With': 'XMLHttpRequest'}
      }) // eslint-disable-line
        .then(function (response) {
          const data = response.data

          this.projects = data
          /** Since we are inside a function, `this` is redefined; need to bind the original `this` from the component */
        }.bind(this))
        .catch(function (error) {
          console.log(error)
        })
    }
  }
})
// }}}
// menuxs {{{
const menuxs = Vue.component('menuxs', { // eslint-disable-line
  data () {
    return {
      collapsed: false
    }
  },
  /** has to contain the same links as in the normal menu */
  template: `
  <div id="menuxs" ref="menuxs">
    <div class="deploy" @click="collapse">
      <div class="button"><i :class="(collapsed) ? 'fa fa-times' : 'fa fa-bars'"></i></div>
      <div class="text">Menu</div>
    </div>
    <div class="collapsed">
      <a href='/'><li>Blog</li></a>
      <a href='/portfolio'><li>Portfolio</li></a>
      <a href='/about-me'><li>About me</li></a>
      <a href='/contact'><li>Contact</li></a>
    </div>
  </div>
  `,
  methods: {
    collapse: function () {
      let element = document.querySelector('.collapsed')

      this.collapsed = !this.collapsed

      if (this.collapsed) {
        /** scrollHeight is pretty damn useful here */
        element.style.height = element.scrollHeight + 'px'
      } else {
        element.style.height = '0'
      }
    }
  }
})
// }}}

new Vue({ // eslint-disable-line
  el: '#website',
  components: {
    portfolio: portfolio,
    menuxs: menuxs
  }
})
