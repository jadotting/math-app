<template>
  <b-card
    :id='"navtile_" + id'
    tag='article'
    class='nav-tile text-center'
    v-on:click='navigateOnClick(nav_tile_data.to)'
    v-on:contextmenu.prevent='toggleCollapse("collapse-" + id)'
  >
    <b-card-text class='mb-0'>
      <h6 class='mb-0'><strong>{{ nav_tile_data.title }}</strong></h6>
    </b-card-text>

    <!-- Hidden-By-Default Collapsible Content Area -->
    <b-collapse :id='"collapse-" + id' class='mt-3'>
      <b-card-text>
        {{ nav_tile_data.description }}
      </b-card-text>
    </b-collapse>
  </b-card>
</template>

<script>
import firebase from 'firebase';

export default {
  name: 'NavTile',
  components: {
  },

  props: {
    nav_tile_data: Object,
  },

  data: () => ({
    active: false,
    id: '',
  }),

  beforeMount() {
    // Generate unique ID for each NavTile
    // Math.random is seeded using the user's id in seedrandom
    // Convert to base 36 (numbers + letters), then take the first 4 characters after decimal
    this.id = Math.random().toString(36).substr(2, 4);
  },

  methods: {
    navigateOnClick(route) {
      if (route === '/logout') {
        this.logout();
        return;
      }
      // if reqExp exists (assignments and lessons), 
      // and if userdata.exp < reqExp,
      // toast an error
      if (this.$props.nav_tile_data.reqExp) {
        const reqExp = this.$props.nav_tile_data.reqExp;
        const currExp = this.userData.exp;
        if (currExp < reqExp) {
          this.makeToast(false, reqExp - currExp);
          return
        }
      }
      this.$router.push(route);
    },
    toggleCollapse(collapseId) {
      // Toggles collapse of a specific UI element based on its id
      this.$root.$emit('bv::toggle::collapse', collapseId);
    },
    logout() {
      firebase
        .auth()
        .signOut()
        .then(() => {
          this.$router.replace('login');
        });
    },
    makeToast(append = false, exp) {
      const toastMsg = `You need ${exp} more exp!`

      this.$bvToast.toast(toastMsg, {
        title: 'Teacher says...',
        autoHideDelay: 1500,
        variant: 'danger',
        appendToast: append,
        toaster: 'b-toaster-bottom-center',
      });
    },
  },
  computed: {
    userData: {
      get() {
        return this.$store.state.userData;
      },
    }
  },
};
</script>

<style scoped>
.nav-tile {
  max-width: 90%;
  margin: auto auto 30px;
  border-radius: 50px;
  background-color: #FFC640;
  -webkit-box-shadow: 0px 0px 20px -10px rgba(0,0,0,0.75);
  -moz-box-shadow: 0px 0px 20px -10px rgba(0,0,0,0.75);
  box-shadow: 0px 0px 20px -10px rgba(0,0,0,0.75);
}
.nav-tile:hover {
  outline: 2px solid #FD884C;
  outline-offset: 4px;
}
.card-body {
  padding: 0.50rem;
}
.card-img-left {
  height: 30px;
  margin: auto;
  top: 50%;
  border-radius: 0;
}
.card-footer {
  border-top: 0;
  padding: 0;
  margin: auto;
  top: 50%;
  border-radius: 0;
}
</style>
