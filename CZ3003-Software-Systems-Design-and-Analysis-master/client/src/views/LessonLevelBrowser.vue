<template>
  <div class='text-center h-100' id='lessons'>
    <b-row align-h='center' class='mb-3' no-gutters>
      <b-col cols='12' class='title'>
        Lessons
      </b-col>
    </b-row>

    <b-row>
      <b-col cols='12'>
        <nav-tile
          v-for='(navTile, index) in navTiles' v-bind:key='index'
          :nav_tile_data='navTile'
        />
      </b-col>
    </b-row>
  </div>
</template>

<script>
import NavTile from '../components/NavTile.vue';

export default {
  name: 'LessonLevelBrowser',

  props: { 'lesson_world': String, 'lesson_level': String },

  components: { NavTile },

  data: () => ({
    navTiles: [],
  }),

  mounted() {
    // Form navTiles for every matching lesson question set
    let incrementedId = 0;
    this.allLessons.forEach((lesson) => {
      if (lesson.world === this.lesson_world && lesson.level === this.lesson_level) {
        this.navTiles.push({
          id: incrementedId,
          title: lesson.title.split('_').join(' '),
          to: `/lessons/${lesson.world}/${lesson.level}/${lesson.id}`,
          description: '',
          reqExp: lesson.reqExp,
        });
        incrementedId += 1;
      }
    });
  },

  computed: {
    allLessons: {
      get() {
        return this.$store.state.allLessons;
      },
    },
  }
};
</script>

<style scoped>
#lessons {
  margin: 1.0rem;
}
.title {
  font-family: "Autumn", 'Avenir', Helvetica, Arial, sans-serif;
  letter-spacing: 5px;
  font-size: 44px;
  color: white;
}
</style>
