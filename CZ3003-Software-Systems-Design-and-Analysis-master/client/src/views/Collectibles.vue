<template>
  <div class='text-center h-100' id="collectibles">
    <b-row align-h='center' class='mb-3' no-gutters>
      <b-col cols='12' class='title'>
        Collectibles
      </b-col>
    </b-row>

    <b-row class='text-center' align-h='center' no-gutters>
      <h4>Currently Equipped:</h4>
    </b-row>

    <b-row align-h='center' class='mb-3' no-gutters>
      <b-col cols='12'>
        <user-avatar :userData='userData'></user-avatar>
      </b-col>
    </b-row>

    <b-row align-h='center' class='h-50' no-gutters>
      <b-col cols='12' class='h-100'>
        <b-tabs id='collectibles-tabs' class='h-100' content-class='h-75'>
          <b-tab title='Character' active class='h-100'>
            <b-row class='no-gutters h-100'>
              <b-col cols='12' class='h-100 overflow-auto bg-white rounded-bottom-corners'>
                <collectible-tile
                  v-for='character in allCharacters'
                  v-bind:key='character.id'
                  v-bind:class="{ 'is-active': characterDetails.id === character.id }"
                  :collectible='character'
                  :owned='ownedCharacters.includes(character.id)'
                  v-on:click='onDisplayCharacterDetails'
                  :value="character.value"
                  style="display: inline-block"
                />
              </b-col>
            </b-row>
          </b-tab>

          <b-tab title='Companions' class='h-100'>
            <b-row class='no-gutters h-100'>
              <b-col cols='12' class='h-100 overflow-auto bg-white rounded-bottom-corners'>
                <collectible-tile
                  v-for='companion in allCompanions'
                  v-bind:key='companion.id'
                  v-bind:class="{ 'is-active': companionDetails.id === companion.id }"
                  :collectible='companion'
                  :owned='ownedCompanions.includes(companion.id)'
                  :value="companion.value"
                  style="display: inline-block"
                  v-on:click='onDisplayCompanionDetails' />
              </b-col>
            </b-row>
          </b-tab>

          <b-tab title='Coming Soon!' disabled>
            <p>I'm a disabled tab!</p>
          </b-tab>
        </b-tabs>

      </b-col>
    </b-row>
    <b-card bg-variant="dark" text-variant="white" title="Equip/Buy" v-if="selectedCharacter !== null">
      <b-card-text>
        You've selected the following character/companion
      </b-card-text>
      <span v-if="selectedCharacter">
        <collectible-tile
          v-bind:key='characterDetails.id'
          :collectible='characterDetails'
          :owned='ownedCharacters.includes(characterDetails.id)'
          :value="characterDetails.value"
          style="display: inline-block" />
          <br>
          <br>
          <b-button v-on:click='onBuyCharacter' variant="primary">
            <span v-if='ownedCharacters.includes(characterDetails.id)'>Equip Character</span>
            <span v-else>Buy Character</span>
          </b-button>
      </span>
      <span v-if="!selectedCharacter">
        <collectible-tile
          v-bind:key='companionDetails.id'
          :collectible='companionDetails'
          :owned='ownedCompanions.includes(companionDetails.id)'
          :value="companionDetails.value"
          style="display: inline-block" />
          <br>
          <br>
          <b-button  v-on:click='onBuyCompanion' variant="primary">
            <span v-if='ownedCompanions.includes(companionDetails.id)'>Equip Companion</span>
            <span v-else>Buy Companion</span>
          </b-button>
      </span>
    </b-card>
    <div style="height: 100px;" />
  </div>
</template>

<script>
import UserAvatar from '../components/UserAvatar.vue';
import CollectibleTile from '../components/CollectibleTile.vue';

export default {
  name: 'Collectibles',

  components: { UserAvatar, CollectibleTile },

  data: () => ({
    characterDetails: {},
    companionDetails: {},
    selectedCharacter: null,
  }),

  methods: {
    onDisplayCharacterDetails(value) {
      // value = collectible = { id, name, value, src }
      this.characterDetails = value;
      this.selectedCharacter = true;
    },
    onDisplayCompanionDetails(value) {
      // value = collectible = { id, name, value, src }
      this.companionDetails = value;
      this.selectedCharacter = false;
    },
    onBuyCharacter() {
      this.$store.dispatch('buyCharacter', this.characterDetails.id);
      // this.$store.dispatch('showPurchaseNotification');
    },
    onBuyCompanion() {
      this.$store.dispatch('buyCompanion', this.companionDetails.id);
      // this.$store.dispatch('showPurchaseNotification');
    },
  },

  created() {
    this.$store.dispatch('getUserData');
  },

  watch: {
    showPurchaseUnsuccessful() {
      if (this.$store.state.showPurchaseUnsuccessful) {
        this.$message.error({
          message: 'Maybe you don\'t have enough coins?',
          center: true,
          customClass: 'alert-style',
          offset: 60,
        });
        this.$store.dispatch('showPurchaseNotification');
      }
    },
    showPurchaseSuccessful() {
      if (this.$store.state.showPurchaseSuccessful) {
        this.$message.success({
          message: 'Equipped character/companion',
          center: true,
          customClass: 'alert-style',
          offset: 60,
        });
        this.$store.dispatch('showPurchaseNotification');
      }
    },
  },

  computed: {
    userData: {
      get() {
        return this.$store.state.userData;
      },
    },
    allCharacters: {
      get() {
        return this.$store.state.allCollectibles.allCharacters;
      },
    },
    allCompanions: {
      get() {
        return this.$store.state.allCollectibles.allCompanions;
      },
    },
    ownedCharacters: {
      get() {
        return this.$store.state.userData.ownedCollectibles.characters;
      },
    },
    ownedCompanions: {
      get() {
        return this.$store.state.userData.ownedCollectibles.companions;
      },
    },
    showPurchaseSuccessful: {
      get() {
        return this.$store.state.showPurchaseSuccessful;
      },
    },
    showPurchaseUnsuccessful: {
      get() {
        return this.$store.state.showPurchaseUnsuccessful;
      },
    },
  },
};
</script>

<style>
/* For use in development to display row / col boundaries */
/* div.row > [class*='col'] {
  border: 1px dashed black;
} */
.is-active {
  /*background-color: #42b983;*/
}
.alert-style {
  min-width: 200px;
}
#collectibles-tabs.tabs {
  margin: 1.0rem;
}
#collectibles {
  overflow-x: scroll;
}
.title {
  font-family: "Autumn", 'Avenir', Helvetica, Arial, sans-serif;
  letter-spacing: 5px;
  font-size: 44px;
  color: white;
}
#collectibles-tabs .nav-tabs {
  background-color: white;
  flex-wrap: nowrap;
  white-space: nowrap;
  overflow-x: auto;
  overflow-y: hidden;
  border-bottom: 2px solid white;
  border-top-left-radius: 25px;
  border-top-right-radius: 25px;
}
#collectibles-tabs .nav-link {
  color: #FB3C32;
}
#collectibles-tabs .nav-link.active {
  box-shadow: inset 0 -4px 0 0 #FB6058;
}
#collectibles-tabs .nav-link.disabled {
  color: #7f7f7f;
  opacity: 0.4;
}
#collectibles-tabs .rounded-bottom-corners {
  border-bottom-left-radius: 25px;
  border-bottom-right-radius: 25px;
}
</style>
