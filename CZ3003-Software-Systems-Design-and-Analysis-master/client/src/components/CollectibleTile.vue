<template>
  <span>
    <b-img
      rounded
      class='collectible-tile'
      :src='collectible.src'
      v-on:click='displayDetails'
    >
    </b-img>
    <span v-if='value >= 0' class="tile">
      <img src="../assets/Coin.png" /> {{ value }}
    </span>
  </span>
</template>

<script>

export default {
  name: 'CollectibleTile',

  props: {
    value: Number,
    collectible: Object,
    owned: Boolean,
  },

  methods: {
    displayDetails() {
      this.$emit('click', this.collectible);
    },
  },
};
</script>

<style scoped>
.tile {
  display: block;
}
.collectible-tile {
  margin: 5px;
}
.collectible-tile:hover {
  background-color: #2c3e50;
  cursor: pointer;
}
</style>
