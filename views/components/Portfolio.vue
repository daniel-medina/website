<template lang="pug">
#portfolio.col-lg-12
  project(:data='data')

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
