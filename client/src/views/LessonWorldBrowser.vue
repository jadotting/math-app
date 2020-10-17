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
  name: 'LessonWorldBrowser',

  props: { 'lesson_world': String },

  components: { NavTile },

  data: () => ({
    navTiles: [],
  }),

  mounted() {
    // Form navTiles for every unique level across all lesson question sets
    let incrementedId = 0;
    let levels = [];
    this.allLessons.forEach((lesson) => {
      if (lesson.world === this.lesson_world && !levels.includes(lesson.level)) {
        this.navTiles.push({
          id: incrementedId,
          title: lesson.level.split('_').join(' '),
          to: `/lessons/${lesson.world}/${lesson.level}`,
          description: '',
        });
        levels.push(lesson.level);
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
