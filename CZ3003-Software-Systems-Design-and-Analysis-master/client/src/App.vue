<template>
  <b-row id='app' class='h-100' no-gutters>
    <b-col cols='12' v-if='showNavBar'>
      <b-navbar toggleable='true'>
        <b-navbar-toggle target='nav-collapse'></b-navbar-toggle>

        <b-nav-text v-if="userData.coins"><img src="./assets/Coin.png" />&nbsp;<strong>{{ userData.coins }}</strong></b-nav-text>
        <b-nav-text><img src="./assets/XP.png" />&nbsp;<strong>{{ userData.exp }}</strong></b-nav-text>

        <b-collapse id='nav-collapse' is-nav>
          <b-navbar-nav :fill='true'>
            <b-navbar-brand href='#'>Untitled Learning App</b-navbar-brand>
            <div class='break'></div>
            <b-nav-item to='/home' active-class='active'>
              <v-icon name='project-diagram' label='Home' title='Home'/>
              <br>Home
            </b-nav-item>
            <b-nav-item to='/profile' exact active-class='active'>
              <v-icon name='user' label='Profile' title='Profile'/>
              <br>Profile
            </b-nav-item>
            <b-nav-item to='/collectibles' exact active-class='active'>
              <v-icon name='gem' label='Collectibles' title='Collectibles'/>
              <br>Collectibles
            </b-nav-item>
            <div class='break'></div>
            <b-nav-item to='/lessons' exact active-class='active'>
              <v-icon name='book' label='Lessons' title='Lessons'/>
              <br>Lessons
            </b-nav-item>
            <b-nav-item to='/assignments' exact active-class='active'>
              <v-icon name='leaf' label='Assignments' title='Assignments'/>
              <br>Assignments
            </b-nav-item>
            <b-nav-item to='/challenges' exact active-class='active'>
              <v-icon name='book' label='Challenges' title='Challenges'/>
              <br>Challenges
            </b-nav-item>
            <div class='break'></div>
            <b-nav-item to='/leaderboard' exact active-class='active'>
              <v-icon name='trophy' label='Leaderboard' title='Leaderboard'/>
              <br>Leaderboard
            </b-nav-item>
            <b-nav-item to='/creator' exact active-class='active'>
              <v-icon name='vials' label='Creator' title='Creator'/>
              <br>Creator
            </b-nav-item>
          </b-navbar-nav>
        </b-collapse>
      </b-navbar>
    </b-col>

    <b-col
      cols='12' id='view' class='overflow-auto'
      v-bind:style="{ backgroundImage: 'url(' + bgImg + ')',
      backgroundSize: 'cover', backgroundRepeat: 'no-repeat'}"
    >
      <router-view></router-view>
    </b-col>
  </b-row>
</template>

<script>
import firebase from 'firebase';
import Icon from 'vue-awesome/components/Icon';
import 'vue-awesome/icons/leaf';
import 'vue-awesome/icons/bars';
import 'vue-awesome/icons/home';
import 'vue-awesome/icons/project-diagram';
import 'vue-awesome/icons/vials';
import 'vue-awesome/icons/user';
import 'vue-awesome/icons/trophy';
import 'vue-awesome/icons/gem';
import 'vue-awesome/icons/book';
const seedrandom = require('seedrandom');

export default {
  components: {
    'v-icon': Icon,
  },

  data: () => ({
    showNavBar: false,
    bgImg: 'img/backgrounds/APP_BG_V1.png', // Default
  }),

  beforeMount() {
    if (this.firebaseCurrentUser !== null) {
      this.showNavBar = true;

      // Set Global PRNG seed based on user id
      seedrandom(this.userData.id, { global: true });
    }
  },

  watch: {
    $route (to, from) {
      // Detect changes in route and set the background-image accordingly
      const bgOne = ['Login', 'SignUp', 'Home', 'Start'];
      const bgTwo = ['Profile', 'Collectibles', 'Lessons', 'Challenges', 'Assignments'];
      console.log(this.$route.name);
      if (bgOne.includes(this.$route.name)) {
        this.bgImg = 'img/backgrounds/APP_BG_V1.png';
      } else if (bgTwo.includes(this.$route.name)) {
        this.bgImg = 'img/backgrounds/APP_BG_V2.png';
      } else {
        this.bgImg = 'img/backgrounds/APP_BG_V2.png'; // Default
      }
    }
  },

  computed: {
    userData: {
      get() {
        return this.$store.state.userData;
      },
    },
    firebaseCurrentUser: {
      get() {
        return firebase.auth().currentUser;
      }
    },
  },
};
</script>

<style>
@font-face {
  font-family: 'Autumn';
  src: url('../public/fonts/Autumn.TTF') format('truetype');
  font-style: normal;
  font-weight: normal;
}
html, body {
  height: 100%;
  overflow: hidden;
}
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}
#view {
  width: 100%;
  height: 100%;
}
/* Inserting this collapsed row between two flex items will make
 * the flex item that comes after it break to a new row */
.break {
  flex-basis: 100%;
  height: 0;
}
.navbar {
  background-color: #FD884C;
}
.navbar-nav {
  flex-direction: row;
  flex-wrap: wrap;
}
.navbar-nav .nav-item {
  flex: 1 1 0px;
}
.navbar-nav .navbar-brand {
  flex: 1 1 0px;
  text-align: center;
}
.navbar-nav .nav-item .nav-link.active {
  background: linear-gradient(#FD884C, #FB6058), linear-gradient(to top, #FFC640, #FD884C);
  background-origin: padding-box, border-box;
  background-repeat: no-repeat; /* this is important */
  border: 2px solid transparent;
}
.alert-style {
  min-width: 90% !important;
}
</style>
