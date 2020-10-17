<template>
  <div class='text-center h-100' id='profile'>
    <b-row align-h='center' class='mb-3' no-gutters>
      <b-col cols='12' class='title'>
        Profile
      </b-col>
    </b-row>

    <b-row class='mb-5' no-gutters>
      <b-col cols='12'>
        <user-avatar :userData='userData'></user-avatar>
      </b-col>
    </b-row>

    <b-row class='text-left' no-gutters>
      <b-col cols='12'>
        <strong>Name:</strong>
      </b-col>
    </b-row>

    <b-row class='text-left mb-2' no-gutters>
      <b-col cols='12' class='h2'>
        {{ userData.username || 'No Display Name Set' }}
      </b-col>
    </b-row>

    <b-row class='text-left' no-gutters>
      <b-col cols='12'>
        <strong>Email:</strong>
      </b-col>
    </b-row>

    <b-row class='text-left mb-5' no-gutters>
      <b-col cols='12' class='h2'>
        {{ userData.email }}
      </b-col>
    </b-row>

    <b-row no-gutters>
      <b-col cols='12'>
        <b-button v-on:click='onEditProfile' class='button ml-2 mr-2' size='sm' variant='success' pill>
          Edit Profile
        </b-button>
        <b-button v-on:click='onLogOut' class='button ml-2 mr-2' size='sm' variant='danger' pill>
          Log Out
        </b-button>
      </b-col>
    </b-row>

    <!-- Edit Profile Modal -->
    <b-modal
      id='edit-profile-modal'
      centered hide-footer
    >
      <template v-slot:modal-title>
       Editing Profile...
      </template>
      <div class='d-block text-center'>
        <b-form @submit='onSubmit' @reset='onReset' v-if='show'>
          <b-form-group
            id='change-name-group'
            label='Change Display Name'
            label-for='change-name'
            description='Input your new Display Name'
          >
            <b-form-input
              id='change-name'
              v-model.lazy='form.name'
              type='text'
              placeholder='AzureDiamond'
            ></b-form-input>
          </b-form-group>

          <b-form-group
            id='change-pw-group'
            label='Change Password'
            label-for='change-pw'
            description='Your new password should be at least 8 alpha-numeric characters long'
          >
            <b-form-input
              id='change-pw'
              v-model='form.password'
              type='password'
              placeholder='hunter2'
            ></b-form-input>
          </b-form-group>

          <b-form-group
            id='repeat-pw-group'
            label='Repeat New Password'
            label-for='repeat-pw'
            description='Your new password should be at least 8 alpha-numeric characters long'
          >
            <b-form-input
              id='repeat-pw'
              v-model='form.repeatpassword'
              type='password'
              placeholder='hunter2'
            ></b-form-input>
          </b-form-group>

          <b-button type='submit' pill variant='warning' class='ml-3 mr-3'>Submit</b-button>
          <b-button type='reset' pill variant='danger' class='ml-3 mr-3'>Reset</b-button>
        </b-form>
      </div>
    </b-modal>
  </div>
</template>

<script>
import firebase from 'firebase';
import UserAvatar from '../components/UserAvatar.vue';

export default {
  name: 'Profile',

  components: { UserAvatar },

  data: () => ({
    profilePic: {
      blank: true,
      blankColor: '#777',
      width: 75,
      height: 75,
      class: 'm1',
    },
    show: true,
    errors: [],
    form: {
      name: '',
      password: '',
      repeatpassword: '',
    },
  }),

  created() {
    this.$store.dispatch('getUserData');
  },

  methods: {
    logout() {
      firebase
        .auth()
        .signOut()
        .then(() => {
          this.$router.replace('login');
        });
    },
    onSubmit(evt) {
      evt.preventDefault();
      if (this.form.password !== this.form.repeatpassword) {
        this.errors.push(
          'Both passwords are not the same. Please verify that the passwords are the same!',
        );
      }
      this.$store.dispatch('updateUserInfo', this.form);
    },
    onReset(evt) {
      evt.preventDefault();
      this.resetForm();
    },
    resetForm() {
      // Reset our form values
      this.form.name = '';
      this.form.password = '';
      this.form.repeatpassword = '';
      // Trick to reset/clear native browser form validation state
      this.show = false;
      this.errors = [];
      this.$nextTick(() => {
        this.show = true;
      });
    },
    makeToast(append = false) {
      if (this.errors.length === 0) {
        this.$bvToast.toast(
          'Congratulations, you\'ve successfully updated your user profile!',
          {
            title: 'Update User Details',
            variant: 'primary',
            autoHideDelay: 5000,
            appendToast: append,
          },
        );
      } else {
        this.$bvToast.toast(
          'Your form submission is invalid. Please double check your form input!',
          {
            title: 'Invalid Form Submissions',
            variant: 'danger',
            autoHideDelay: 5000,
            appendToast: append,
          },
        );
      }
    },
    onEditProfile() {
      this.$bvModal.show('edit-profile-modal');
    },
    onLogOut() {
      this.logout();
    }
  },

  watch: {
    showUpdateUserInfoSuccessful() {
      if (this.$store.state.showUpdateUserInfoSuccessful) {
        this.$message.success({
          message: 'Updated user info',
          center: true,
          customClass: 'alert-style',
          offset: 60,
        });
        this.$store.dispatch('showUpdateUserInfoNotification');
      }
    },
    showUpdateUserInfoUnsuccessful() {
      if (this.$store.state.showUpdateUserInfoUnsuccessful) {
        this.$message.error({
          message: 'Something went wrong?',
          center: true,
          customClass: 'alert-style',
          offset: 60,
        });
        this.$store.dispatch('showUpdateUserInfoNotification');
      }
    },
    showUpdateUserPwSuccessful() {
      if (this.$store.state.showUpdateUserPwSuccessful) {
        this.$message.success({
          message: `Updated ${this.$store.state.userData.userName}'s password successfully!`,
          center: true,
          customClass: 'alert-style',
          offset: 60,
        });
        this.$store.dispatch('showUpdateUserInfoNotification');
      }
    },
    showUpdateUserPwUnsuccessful() {
      if (this.$store.state.showUpdateUserPwUnsuccessful) {
        this.$message.error({
          message: 'Something went wrong?',
          center: true,
          customClass: 'alert-style',
          offset: 60,
        });
        this.$store.dispatch('showUpdateUserInfoNotification');
      }
    },
  },

  computed: {
    userData: {
      get() {
        return this.$store.state.userData;
      },
    },
    showUpdateUserInfoSuccessful: {
      get() {
        return this.$store.state.showUpdateUserInfoSuccessful;
      },
    },
    showUpdateUserInfoUnsuccessful: {
      get() {
        return this.$store.state.showUpdateUserInfoUnsuccessful;
      },
    },
    showUpdateUserPwSuccessful: {
      get() {
        return this.$store.state.showUpdateUserPwSuccessful;
      },
    },
    showUpdateUserPwUnsuccessful: {
      get() {
        return this.$store.state.showUpdateUserPwUnsuccessful;
      },
    },
  },
};
</script>

<style>
#profile {
  margin: 1.0rem;
}
.alert-style {
  min-width: 200px;
}
#edit-profile-modal .modal-header {
  color: white;
  background-color: #FD884C !important;
}
.title {
  font-family: "Autumn", 'Avenir', Helvetica, Arial, sans-serif;
  letter-spacing: 5px;
  font-size: 44px;
  color: white;
}
</style>
