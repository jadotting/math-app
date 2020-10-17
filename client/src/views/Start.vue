<template>
  <div class='text-center h-100'>
    <b-row align-h='center' no-gutters class='mt-5'>
      <b-col cols='12' class='mt-5'>
        <p class='title mt-5 mb-0'>Untitled</p>
        <p class='subtitle mb-5'>Learning App</p>
      </b-col>
    </b-row>

    <b-row align-h='center'>
      <b-col cols='12'>
        <b-button to='/login' class='ml-2 mr-2' variant='warning' pill>
          Login
        </b-button>
        <b-button to='/sign-up' class='ml-2 mr-2' variant='warning' pill>
          Sign Up
        </b-button>
      </b-col>
    </b-row>
  </div>
</template>

<script>
export default {
  name: "Start"
}
</script>

<style scoped>
.title {
  font-family: 'Autumn', 'Avenir', Helvetica, Arial, sans-serif;
  letter-spacing: 5px;
  font-size: 64px;
  color: white;
}
.subtitle {
  line-height: 0px;
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  font-size: 24px;
  color: white;
}
</style>
