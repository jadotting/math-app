<template>
  <div class='text-center h-100'>
    <b-row no-gutters align-h='center' class='pt-5'>
      <b-col cols='12' class='title'>
        Login
      </b-col>
    </b-row>

    <b-row no-gutters align-h='center' align-v='center' v-if='renderFlag'>
      <el-input
        class='input'
        placeholder='Email Address'
        v-model='email'
        clearable
      ></el-input>
    </b-row>

    <b-row no-gutters align-h='center' align-v='center' v-if='renderFlag'>
      <el-input
        class='input'
        placeholder='Password'
        type='password'
        v-model='password'
        clearable
        show-password
      ></el-input>
    </b-row>

    <b-row no-gutters align-h='center' align-v='center' v-if='renderFlag'>
      <b-button v-on:click='login' class='button mt-3 mb-5' variant='warning' pill>
        Login
      </b-button>
    </b-row>

    <b-row no-gutters align-h='center' align-v='center' v-if='renderFlag'>
      <p class='mb-3 text-white'>or Login with</p>
      <div class='break'></div>
      <button @click='googleSocialLogin' class='social-button'>
        <img alt='Google Logo' src='../assets/Google_logo.png' />
      </button>
      <button @click="fbSocialLogin" class='social-button ml-3 mr-3'>
        <img alt='Facebook Logo' src='../assets/Facebook_logo.png' />
      </button>
      <button @click="twSocialLogin" class='social-button'>
        <img alt='Twitter Logo' src='../assets/Twitter_logo.png' />
      </button>
      <div class='break'></div>
      <p class='mt-3 mb-0 text-white'>
        No Account?<br>
        <router-link to='/sign-up'>Sign Up Here</router-link>
      </p>
      <div class='break'></div>
      <p class='mt-3 mb-0 text-white'>
        <b-link v-on:click='onPasswordReset' class='button ml-2 mr-2' size='sm' variant='success' pill>
          Forgot Your Password?
        </b-link>
      </p>
    </b-row>

    <!-- Loading Transition -->
    <b-row no-gutters align-v='center' v-if='loadingFlag' class='mt-5 pt-5 pb-5'>
      <b-col cols='12' style='color: white' >
        <b-spinner style="width: 3rem; height: 3rem;" label="Loading"></b-spinner>
      </b-col>
    </b-row>

    <!-- Password Reset -->
    <b-modal
      id='password-reset'
      centered hide-footer
    >
      <template v-slot:modal-title>
        Password Reset
      </template>
      <div class='d-block text-center'>
          <b-row no-gutters align-h='center' align-v='center' v-if='renderFlag'>
            <el-input
              class='input'
              placeholder='Email Address'
              v-model='email'
              clearable
            ></el-input>
          </b-row>
        <b-button v-on:click='onSubmitResetPassword' class='button mt-3 mb-5' variant='warning' pill>
          Reset
        </b-button>
      </div>
    </b-modal>

  </div>
</template>

<script>
import firebase from 'firebase';

export default {
  name: 'login',
  data: () => ({
    renderFlag: true,
    loadingFlag: false,
    email: '',
    password: '',
  }),
  methods: {
    initializeUserData(user) {
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
    login() {
      this.renderFlag = false;
      this.loadingFlag = true;
      firebase
        .auth()
        .signInWithEmailAndPassword(this.email, this.password)
        .then(async (result) => {
          this.$router.replace('home');

          const userId = result.user.uid;
          let tempUserData = {};

          await firebase.database()
            .ref(`data/user/${userId}`)
            .once('value')
            .then((snapshot) => {
              tempUserData = snapshot.val();
            });

          this.$message({
            message: `Welcome back, ${tempUserData.username}!`,
            type: 'success',
            center: true,
            customClass: 'alert-style',
            offset: 60,
          });
        },
        (err) => {
          this.$message.error({
            message: `Oops, something went wrong.\n${err.message}`,
            type: 'error',
            center: true,
            customClass: 'alert-style',
          });

          this.renderFlag = true;
          this.loadingFlag = false;
        });
    },
    googleSocialLogin() {
      const provider = new firebase.auth.GoogleAuthProvider();

      firebase
        .auth()
        .signInWithPopup(provider)
        .then((result) => {
          this.$router.replace('home');
          const userName = result.user.displayName
            ? result.user.displayName
            : result.user.email;
          this.$message({
            message: `Welcome, ${userName}`,
            type: 'success',
          });
          if (result.additionalUserInfo.isNewUser) {
            this.initializeUserData(result.user);
          }
        })
        .catch((err) => {
          this.$message.error(`Oops, something went wrong. ${err.message}`);
        });
    },
    fbSocialLogin() {
      const provider = new firebase.auth.FacebookAuthProvider();

      firebase.auth().signInWithPopup(provider).then((result) => {
        this.$router.replace('home');
        // This gives you a Facebook Access Token. You can use it to access the Facebook API.
        const token = result.credential.accessToken;

        let userName;
        // eslint-disable-next-line prefer-const
        userName = result.user.displayName
          ? result.user.displayName
          : result.user.email;
        this.$message({
          message: `Welcome, ${userName}`,
          type: 'success',
        });
        if (result.additionalUserInfo.isNewUser) {
          this.initializeUserData(result.user);
        }
      })
        .catch((err) => {
          this.$message.error(`Oops, something went wrong. ${err.message}`);
        });
    },
    twSocialLogin() {
      const provider = new firebase.auth.TwitterAuthProvider();
      firebase.auth().signInWithPopup(provider).then((result) => {
        this.$router.replace('home');
        // This gives you a the Twitter OAuth 1.0 Access Token and Secret.
        // You can use these server side with your app's credentials to access the Twitter API
        if (result.additionalUserInfo.isNewUser) {
          this.initializeUserData(result.user);
        }
        const token = result.credential.accessToken;
        const { secret } = result.credential;
        // The signed-in user info.
        const { user } = result;
      }).catch((error) => {
        // Handle Errors here.
        const errorCode = error.code;
        const errorMessage = error.message;
        // The email of the user's account used.
        const { email } = error;
        // The firebase.auth.AuthCredential type that was used.
        const { credential } = error;
      });
    },
    onPasswordReset() {
      this.$bvModal.show('password-reset');
    },

    onSubmitResetPassword() {
      const auth = firebase.auth();
      const emailAddress = this.email;

      auth.sendPasswordResetEmail(emailAddress).then(() => {
        // Email sent.

        this.$message({
          message: 'Email Sent! Please check your email.',
          type: 'success',
        });
        console.log('Sent Email');
      }).catch((error) => {
        // An error happened.
        console.log(error);
        this.$message.error({
          message: `Oops, something went wrong.\n${error.message}`,
          type: 'error',
          center: true,
          customClass: 'alert-style',
        });
      });
    },


  },
};
</script>

<style scoped>
.title {
  font-family: 'Autumn', 'Avenir', Helvetica, Arial, sans-serif;
  letter-spacing: 5px;
  font-size: 44px;
  color: white;
}
.login {
  margin-top: 40px;
}
.input {
  width: 75%;
  padding-bottom: 10px;
  padding-top: 10px;
}
button {
  cursor: pointer;
}
p a {
  text-decoration: underline;
  color: #fffb11;
  cursor: pointer;
}
.social-button {
  width: 60px;
  background: white;
  padding: 3px;
  border-radius: 100%;
  box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.2);
  outline: 0;
  border: 0;
}
.social-button:active {
  box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.1);
}
.social-button img {
  width: 100%;
}
.alert-style {
  min-width: 200px;
}
/* Inserting this collapsed row between two flex items will make
* the flex item that comes after it break to a new row */
.break {
  flex-basis: 100%;
  height: 0;
}
#password-reset .modal-header {
  color: white;
  background-color: #FD884C !important;
}

</style>
