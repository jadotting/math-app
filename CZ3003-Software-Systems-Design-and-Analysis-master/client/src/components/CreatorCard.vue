<template>
  <b-card
    :id='"c_" + id'
    tag='article'
    class='creator-card text-center'
    v-on:click='toggleCollapse("collapse-" + id)'
  >
    <!-- Always Visible Content Area -->
    <b-card-text>
      <h6 class='mb-0'><strong>{{ card_data.question }}</strong></h6>
    </b-card-text>

    <!-- Hidden-By-Default Collapsible Content Area -->
    <b-collapse :id='"collapse-" + id'>
      <b-card-text>
        <b-form-group label='Options:'>
          <b-form-radio
            v-if='card_data.options.length > 0'
            v-for='(option, index) in card_data.options'
            :key='index'
            :value='option'
            disabled
          >
            {{ option }}
          </b-form-radio>
        </b-form-group>
        <b-button
          name='editBtn'
          v-on:click='onEdit'
          class='button mr-3' size='sm' variant='info' pill>
          Edit
        </b-button>
        <b-button
          name='deleteBtn'
          v-on:click='onDelete'
          class='button ml-3' size='sm' variant='danger' pill>
          Delete
        </b-button>
      </b-card-text>
    </b-collapse>

    <!-- Edit CreatorCard Modal -->
    <b-modal
      :id='"edit-creator-card-modal-" + id'
      centered hide-footer
      :header-bg-variant="'dark'" :header-text-variant="'light'"
      :body-bg-variant="'light'" :body-text-variant="'dark'"
      :footer-bg-variant="'dark'" :footer-text-variant="'light'"
    >
      <template v-slot:modal-title>
        Editing Question...
      </template>
      <div class='d-block text-center'>
        <b-form @submit.prevent='onSubmit'>
          <b-form-group id='input-group-1' label='Question' label-for='input-1'>
            <b-form-input id='input-1' v-model='form.question' type='text' required></b-form-input>
          </b-form-group>
          <b-form-group id='input-group-2' label='Option 1' label-for='input-2'>
            <b-form-input id='input-2' v-model='form.options["1"]' type='text'
                          required></b-form-input>
          </b-form-group>
          <b-form-group id='input-group-2' label='Option 2' label-for='input-3'>
            <b-form-input id='input-3' v-model='form.options["2"]' type='text'
                          required></b-form-input>
          </b-form-group>
          <b-form-group id='input-group-2' label='Option 3' label-for='input-4'>
            <b-form-input id='input-4' v-model='form.options["3"]' type='text'
                          required></b-form-input>
          </b-form-group>
          <b-form-group id='input-group-2' label='Option 4' label-for='input-5'>
            <b-form-input id='input-5' v-model='form.options["4"]' type='text'
                          required></b-form-input>
          </b-form-group>
          <b-form-group id='input-group-2' label='Correct Answer' label-for='input-6'>
            <b-form-select v-model="form.answer">
              <option
                v-for='(option, index) in form.options'
                :key='index'
                :value='option'
              >{{option}}</option>
            </b-form-select>
            <div class="mt-3">Selected Answer: <strong>{{ form.answer }}</strong></div>
          </b-form-group>
          <b-button name='submitBtn' id='form-submit-button' type='submit' variant='primary' pill>
            Submit
          </b-button>
        </b-form>
      </div>
    </b-modal>
  </b-card>
</template>

<script>
export default {
  name: 'CreatorCard',

  props: {
    card_data: Object,
    id: String,
  },

  data: () => ({
    form: {
      question: '',
      options: {
        1: '', 2: '', 3: '', 4: '',
      },
      answer: '',
    },
  }),

  methods: {
    onEdit() {
      this.$bvModal.show(`edit-creator-card-modal-${this.id}`);
    },
    onDelete() {
      this.$emit('on-delete', {
        id: this.id,
      });
    },
    onSubmit() {
      // Reformat options into an array
      const optionsArray = [];
      const sortedOptions = Object.entries(this.form.options).sort((a, b) => {
        if (a[0] < b[0]) return -1;
        if (a[0] > b[0]) return 1;
        return 0;
      });
      for (const [key, value] of sortedOptions) {
        optionsArray.push(value);
      }

      this.$emit('on-submit', {
        question: this.form.question,
        options: optionsArray,
        answer: this.form.answer,
        id: this.id,
      });

      this.$bvModal.hide(`edit-creator-card-modal-${this.id}`);
    },
    toggleCollapse(collapseId) {
      // Toggles collapse of a specific UI element based on its id
      this.$root.$emit('bv::toggle::collapse', collapseId);
    },
  },
};
</script>

<style scoped>
  .creator-card {
    max-width: 90%;
    height: 100%;
    margin: auto;
  }
</style>
