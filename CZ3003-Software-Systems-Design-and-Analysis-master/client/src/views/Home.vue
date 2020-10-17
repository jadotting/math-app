<template>
  <div class='text-center h-100'>
    <b-row align-h='center' class='mb-3' no-gutters>
      <b-col cols='12' class='title'>
        Home
      </b-col>
    </b-row>

    <b-row no-gutters v-if='renderFlag'>
      <b-col cols='12'>
        <nav-tile
          v-for='navTile in navTiles' v-bind:key='navTile.id'
          :nav_tile_data='navTile'
        />
        <nav-tile
          v-if="teacherOnlyRenderFlag"
          :nav_tile_data='resultsNavTile'
        />
        <nav-tile
          :nav_tile_data='specialNavTile'
        />
      </b-col>
    </b-row>
  </div>
</template>

<script>
import NavTile from '../components/NavTile.vue';

export default {
  name: 'Home',

  components: { NavTile },

  data: () => ({
    renderFlag: false,
    teacherOnlyRenderFlag: true,
    navTiles: [
      {
        id: 1,
        title: 'Lessons',
        to: '/lessons',
        description: 'Begin your learning journey here!',
      },
      {
        id: 2,
        title: 'Assignments',
        to: '/assignments',
        description: 'Homework. No one likes them, but alas :C',
      },
      {
        id: 3,
        title: 'Challenges',
        to: '/challenges',
        description: 'Lessons too easy? Why don\'t you give these harder questions a try?',
      },
      {
        id: 4,
        title: 'Leaderboard',
        to: '/leaderboard',
        description: 'See your score on the leaderboards!',
      },
      {
        id: 5,
        title: 'Collectibles',
        to: '/collectibles',
        description: 'Buy and collect them all!',
      },
    ],
    resultsNavTile:
      {
        id: 6,
        title: 'Results',
        to: '/results',
        description: 'Show student results for further data analysis',
      },
    specialNavTile:
      {
        id: 7,
        title: 'Log Out',
        to: '/logout',
        description: 'Do real-life stuff for a while. We\'ll miss you!',
      },
  }),

  async beforeCreate() {
    await this.$store.dispatch('getUserData');
    if (this.userData.role !== 'teacher') {
      this.teacherOnlyRenderFlag = false;
    }
    this.renderFlag = true;
  },

  computed: {
    userData: {
      get() {
        return this.$store.state.userData;
      },
    },
  },
};
</script>

<style scoped>
.title {
  font-family: "Autumn", 'Avenir', Helvetica, Arial, sans-serif;
  letter-spacing: 5px;
  font-size: 44px;
  color: white;
}
.title {
  height: 100%;
  width: 80%;
}
</style>
