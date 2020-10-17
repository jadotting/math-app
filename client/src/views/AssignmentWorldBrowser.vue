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
  name: 'AssignmentWorldBrowser',

  props: { 'assignment_world': String },

  components: { NavTile },

  data: () => ({
    navTiles: [],
  }),

  mounted() {
    // Form navTiles for every unique level across all assignment question sets
    let incrementedId = 0;
    let levels = [];
    this.allAssignments.forEach((assignment) => {
      if (assignment.world === this.assignment_world && !levels.includes(assignment.level)) {
        this.navTiles.push({
          id: incrementedId,
          title: assignment.level.split('_').join(' '),
          to: `/assignments/${assignment.world}/${assignment.level}`,
          description: '',
        });
        levels.push(assignment.level);
        incrementedId += 1;
      }
    });
  },

  computed: {
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
