<template lang="pug">
#portfolio.col-lg-12
  div(v-for="item in data")
    project(:data="item")

  // .clearfix every 3 item
</template>

<script>
/** Importing modules */
import axios from 'axios'

/** Importing components */
import Project from './portfolio/Project.vue'

export default {
  data () {
    return {
      data: []
    }
  },
  created () {
    this.getProjects()
  },
  methods: {
    // Method: getProjects {{{
    /**
     * Gets all projects from the database
     *
     * @returns {Promise} Promise containing all visible projects
     */
    getProjects: function () {
      axios.get('/portfolio/projects')
        .then(function (response) {
          this.data = response.data
        }.bind(this))
        .catch(function (error) {
          console.log(error)
        })
    }
    // }}}
  },
  components: {
    project: Project
  }
}
</script>
