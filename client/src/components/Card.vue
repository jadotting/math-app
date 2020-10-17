<template>
  <div
    name='card'
    class='card'
  >
    <h4>{{ card_data.question }}</h4>
    <b-form-group label='Options:'>
      <b-form-radio
        v-for='(option, index) in $data.options'
        v-bind:key='index'
        :value='option'
        :disabled='disableRadioButtons'
        v-model='selected_option'
      >
        {{ option }}
      </b-form-radio>
    </b-form-group>
    <b-button
      :id='"submit-button-" + card_data.id'
      :disabled='disableSubmitButton'
      v-on:click='onSelectionSubmit'
      class='button' size='sm' variant='warning' name='submitBtn' pill
    >
      {{ buttonDisplayText }}
    </b-button>
    <v-icon
      v-if='isCorrect && showResultsImmediately'
      name='check-circle' label='Correct' title='Correct'
      style='margin: auto' scale='2'
    ></v-icon>
  </div>
</template>

<script>
import Icon from 'vue-awesome/components/Icon';
import 'vue-awesome/icons/check-circle';

export default {
  name: 'Card',

  components: {
    'v-icon': Icon,
  },

  props: {
    card_data: Object,
    showResultsImmediately: Boolean,
  },

  data: () => ({
    selected_option: '',
    disableSubmitButton: false,
    disableRadioButtons: false,
    buttonDisplayText: 'Submit',
    isCorrect: false,
    options: [],
  }),

  beforeMount() {
    const options = Object.values(this.$props.card_data.options).sort(() => Math.random() - 0.5)
    this.$data.options = options
  },

  methods: {
    onSelectionSubmit() {
      if (this.selected_option === '') {
        return;
      }

      // One-time submit - no re-attempts
      this.disableSubmitButton = true;
      this.disableRadioButtons = true;

      // Check if submitted answer is correct
      if (this.selected_option === this.card_data.answer) {
        if (this.showResultsImmediately) {
          this.buttonDisplayText = 'Correct';
        }
        this.isCorrect = true;
      } else {
        if (this.showResultsImmediately) {
          this.buttonDisplayText = 'Incorrect';
        }
      }

      // Propagate selection and correctness back to parent component
      console.log(`DEBUG === Submit Button Clicked for card id:${this.card_data.id}`);
      this.$emit('click', {
        card: this.card_data,
        value: this.selected_option,
        isCorrect: this.isCorrect,
      });
    },
  },
};
</script>

<style scoped>
.card {
  height: 100%;
  overflow: auto;
  background-color: rgba(255, 255, 255, 0.85);
  background-image: url('../../public/img/backgrounds/CardOverlay.png');
  background-size: 100%;
  border-radius: 25px;
}
</style>
