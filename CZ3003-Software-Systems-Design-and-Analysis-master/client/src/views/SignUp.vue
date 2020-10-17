<template>
  <b-row class="sign-up"  align-h='center' align-v='center'>
    <b-col align-h='center' align-v='center'>
      <b-row align-h='center' align-v='center' class='title'>
        Sign Up
      </b-row>
      <b-row align-h='center' align-v='center'>
        <el-input class="input" placeholder="Email Address" v-model="email" clearable/>
      </b-row>
      <b-row align-h='center' align-v='center'>
        <el-input class="input" placeholder="Password" type="password" v-model="password" clearable show-password />
      </b-row>
      <b-row align-h='center' align-v='center'>
        <el-input class="input" placeholder="Re-enter Password" v-model="rpassword" clearable show-password />
      </b-row>
      <b-row align-h='center' align-v='center'>
        <el-input class="input" placeholder="Instructor Token" v-model="token" clearable/>
      </b-row>
      <b-row align-h='center' align-v='center'>
        <b-button v-on:click='signUp' class='button mt-3 mb-5' variant='warning' pill>
        Sign Up
        </b-button>
      </b-row>
      <b-row align-h='center' align-v='center'>
        <p class='mt-1 mb-0 text-white text-center'>Already have an account?<br>
          <router-link to='/login'>Log in here</router-link>
        </p>
      </b-row>
    </b-col>
  </b-row>
</template>

<script>
import firebase from 'firebase';

export default {
  name: 'signUp',
  data() {
    return {
      email: '',
      password: '',
      rpassword: '',
      token: '',
    };
  },
  methods: {
    initializeUserData(user) {
      // Validate Instructor Token
      let role = '';
      if (this.token === 'teacher') {
        role = 'teacher';
      } else {
        role = 'student';
      }

      const initialUserData = {
        id: user.uid,
        username: 'New User',
        email: user.email,
        coins: 100,
        character: 0,
        companion: 2000,
        exp: 0,
        ownedCollectibles: {
          characters: [0, 1, 1001],
          companions: [2000, 2001],
        },
        role: role,
      };

      firebase
        .database()
        .ref(`data/user/${user.uid}`)
        .set(initialUserData)
        .then(
          (success) => {
            console.log('initialize user data success');
          },
          (error) => {
            console.log('initialize user data error: ', error);
          },
        );
    },
    signUp() {
      firebase
        .auth()
        .createUserWithEmailAndPassword(this.email, this.password)
        .then(
          (userObj) => {
            this.initializeUserData(userObj.user);
            this.$router.replace('home');
          },
          (err) => {
            alert(`Oops. ${err.message}`);
          },
        );
    },
  },
};
</script>

<style scoped>
.sign-up {
  margin-top: 40px;
}
.title {
  font-family: "Autumn", 'Avenir', Helvetica, Arial, sans-serif;
  letter-spacing: 5px;
  font-size: 44px;
  color: white;
}
.input {
  width: 75%;
  padding-bottom: 10px;
  padding-top: 10px;
}

button {
  margin-top: 10px;
  cursor: pointer;
}
p a {
  text-decoration: underline;
  color: #fffb11;
  cursor: pointer;
}
span {
  display: block;
  margin-top: 20px;
  font-size: 11px;
}
</style>
