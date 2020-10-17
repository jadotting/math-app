<template>
  <b-row align-h='center' align-v='center' class='h-100' no-gutters>
    <b-col cols='12' class='d-flex justify-content-center'>
      <collectible-tile :collectible='retrieveCharacter(userData.character)'></collectible-tile>
      <collectible-tile :collectible='retrieveCompanion(userData.companion)'></collectible-tile>
    </b-col>
  </b-row>
</template>

<script>
import CollectibleTile from './CollectibleTile.vue';

export default {
  name: 'UserAvatar',

  components: { CollectibleTile },

  props: {
    userData: Object,
  },

  methods: {
    retrieveCharacter(collectibleId) {
      return this.$store.state.allCollectibles.allCharacters.find(character => collectibleId === character.id);
    },
    retrieveCompanion(collectibleId) {
      return this.$store.state.allCollectibles.allCompanions.find(companion => collectibleId === companion.id);
    },
  },
};
</script>

<style scoped>

</style>
