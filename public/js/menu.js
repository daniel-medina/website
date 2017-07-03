let menuxs = Vue.component('menuxs', { // eslint-disable-line
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
      <a href='/'><li>Portfolio</li></a>
      <a href='/'><li>About me</li></a>
      <a href='/'><li>Contact</li></a>
    </div>
  </div>`,
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

new Vue({ // eslint-disable-line
  el: '#website',
  components: {
    menuxs: menuxs
  }
})
