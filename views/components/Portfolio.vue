<template lang="pug">
#portfolio.col-lg-12
  div(v-for="item in data")
    project(:data='item')

  // .clearfix every 3 item
</template>

<script>
/** Importing components */
import Project from './portfolio/Project.vue'

export default {
  data () {
    return {
      data: ['onche']
    }
  },
  components: {
    project: Project
  }
}
</script>
