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
  name: 'Lessons',

  components: { NavTile },

  data: () => ({
    navTiles: [],
  }),

  async beforeCreate() {
    await this.$store.dispatch('getUserData');
    await this.$store.dispatch('getQuestionSets', 'lessons');

    // Form navTiles for every unique world across all lesson question sets
    let incrementedId = 0;
    let worlds = [];
    await this.allLessons.forEach((lesson) => {
      if (!worlds.includes(lesson.world)) {
        this.navTiles.push({
          id: incrementedId,
          title: lesson.world.split('_').join(' '),
          to: `/lessons/${lesson.world}`,
          description: '',
        });
        worlds.push(lesson.world);
        incrementedId += 1;
      }
    });
  },

  computed: {
    userData: {
      get() {
        return this.$store.state.userData;
      },
    },
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
