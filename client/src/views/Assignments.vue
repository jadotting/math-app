<template>
  <div class='text-center h-100' id='assignments'>
    <b-row align-h='center' class='mb-3' no-gutters>
      <b-col cols='12' class='title'>
        Assignments
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
  name: 'Assignments',

  components: { NavTile },

  data: () => ({
    navTiles: [],
  }),

  async beforeCreate() {
    await this.$store.dispatch('getUserData');
    await this.$store.dispatch('getQuestionSets', 'assignments');

    // Form navTiles for every unique world across all assignment question sets
    let incrementedId = 0;
    let worlds = [];
    await this.allAssignments.forEach((assignment) => {
      if (!worlds.includes(assignment.world)) {
        this.navTiles.push({
          id: incrementedId,
          title: assignment.world.split('_').join(' '),
          to: `/assignments/${assignment.world}`,
          description: '',
        });
        worlds.push(assignment.world);
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
    allAssignments: {
      get() {
        return this.$store.state.allAssignments;
      },
    },
  }
};
</script>

<style scoped>
#assignments {
  margin: 1.0rem;
}
.title {
  font-family: "Autumn", 'Avenir', Helvetica, Arial, sans-serif;
  letter-spacing: 5px;
  font-size: 44px;
  color: white;
}
</style>
