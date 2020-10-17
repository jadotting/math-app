<template>
  <div class='text-center h-100' id='challenges'>
    <b-row align-h='center' class='mb-3' no-gutters>
      <b-col cols='12' class='title'>
        Challenges
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
  name: 'Challenges',

  components: { NavTile },

  data: () => ({
    navTiles: [],
  }),

  async beforeCreate() {
    await this.$store.dispatch('getUserData');
    await this.$store.dispatch('getQuestionSets', 'challenges');

    // Form navTiles for every challenge question set
    await this.allChallenges.forEach((challenge) => {
      this.navTiles.push({
        id: challenge.id,
        title: challenge.title,
        to: `/challenges/${challenge.id}`,
        description: challenge.description,
      });
    });
  },

  computed: {
    userData: {
      get() {
        return this.$store.state.userData;
      },
    },
    allChallenges: {
      get() {
        return this.$store.state.allChallenges;
      },
    },
  }
};
</script>

<style scoped>
#challenges {
  margin: 1.0rem;
}
.title {
  font-family: "Autumn", 'Avenir', Helvetica, Arial, sans-serif;
  letter-spacing: 5px;
  font-size: 44px;
  color: white;
}
</style>
