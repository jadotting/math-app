<template>
  <div class='text-center h-100' id="creator">
    <b-row align-h='center' class='mb-3' no-gutters>
      <b-col cols='12' class='title'>
        Creator
      </b-col>
    </b-row>

    <b-row align-h='center' no-gutters>
      <b-col sm='8'>
        <b-button v-on:click='addCreatorCard' class='button ml-2 mr-2' size='sm' variant='warning' pill>
          Add New Question
        </b-button>
        <b-button v-on:click='onFinalize' class='button ml-2 mr-2' size='sm' variant='warning' pill>
          Finalize and Submit
        </b-button>
      </b-col>
    </b-row>

    <b-row align-h='center' class='mt-3 mb-3' no-gutters>
      <b-col cols='12' class='mt-3 mb-3 justify-content-center'>
        <div id='creator-list'>
          <creator-card
            v-for='(creatorCard, index) in creatorCards' v-bind:key='index'
            class='creator-list-item--isDraggable'
            :card_data='creatorCard'
            :id='creatorCard.id'
            v-on:on-submit='updateCreatorCard'
            v-on:on-delete='deleteCreatorCard'
          />
        </div>
      </b-col>
    </b-row>

    <!-- Question Set Confirmation Modal -->
    <b-modal
      id='confirmation-modal'
      centered hide-footer
      :header-bg-variant="'dark'" :header-text-variant="'light'"
      :body-bg-variant="'light'" :body-text-variant="'dark'"
      :footer-bg-variant="'dark'" :footer-text-variant="'light'"
    >
      <template v-slot:modal-title>
        Finalizing Question Set...
      </template>
      <div class='d-block text-center'>
        <b-form @submit.prevent='onModalSubmit'>
          <b-form-group id='input-group-1' label='Title:' label-for='input-1'>
            <b-form-input id='input-1' v-model='questionSetTitle' type='text' required></b-form-input>
          </b-form-group>
          <b-form-group id='input-group-2' label='Category To Be Submitted To:'>
            <b-form-radio-group required>
              <b-form-radio
                v-if='teacherOnlyRenderFlag'
                v-model='questionSetType' name='Assignments' value='assignments'>Assignments</b-form-radio>
              <b-form-radio v-model='questionSetType' name='Challenges' value='challenges'>Challenges</b-form-radio>
            </b-form-radio-group>
          </b-form-group>
          <b-form-group id='input-group-3' label='EXP Required:' label-for='input-3'>
            <b-form-input :disabled='questionSetType === "challenges"' id='input-3' v-model='requiredExp' type='number' required ></b-form-input>
          </b-form-group>
          <b-form-group id='input-group-4' label='World:' :disabled='questionSetType === "challenges"'>
            <b-form-radio-group required>
              <b-form-radio v-model='questionSetWorld' name='Addition & Subtraction' value='Addition_&_Subtraction'>Addition & Subtraction</b-form-radio>
              <b-form-radio v-model='questionSetWorld' name='Multiplication' value='Multiplication'>Multiplication</b-form-radio>
              <b-form-radio v-model='questionSetWorld' name='Decimals' value='Decimals'>Decimals</b-form-radio>
              <b-form-radio v-model='questionSetWorld' name='Fractions' value='Fractions'>Fractions</b-form-radio>
            </b-form-radio-group>
          </b-form-group>
          <b-form-group id='input-group-5' label='Level:' :disabled='questionSetType === "challenges"'>
            <b-form-radio-group required>
              <b-form-radio v-model='questionSetLevel' name='1' value='Level 1'>1</b-form-radio>
              <b-form-radio v-model='questionSetLevel' name='2' value='Level 2'>2</b-form-radio>
              <b-form-radio v-model='questionSetLevel' name='3' value='Level 3'>3</b-form-radio>
              <b-form-radio v-model='questionSetLevel' name='4' value='Level 4'>4</b-form-radio>
            </b-form-radio-group>
          </b-form-group>
          <b-form-group id='input-group-6' label='Description:' label-for='input-6'>
            <b-form-input id='input-6' v-model='questionSetDescription' type='text' required></b-form-input>
          </b-form-group>
          <b-button id='form-submit-button' type='submit' variant='warning' pill>Submit</b-button>
        </b-form>
      </div>
    </b-modal>

    <!-- Question Set Submitted Modal -->
    <b-modal
      id='submitted-modal'
      centered hide-header hide-footer
    >
      <template v-slot:modal-title>
        Submission Successful!
      </template>
      <div class='d-block text-center'>
        <p class='mb-3 text-accent'>
          You have successfully submitted a new
          {{ questionSetType === 'assignments' ? 'assignment' : 'challenge' }}!
        </p>

        <p class='mb-0'>
          {{ questionSetType === 'assignments' ? 'Assignment' : 'Challenge' }} ID:
        </p>

        <p class='mb-3'>
          {{ justPushedQuestionSetId }}
        </p>

        <b-button
          href='http://www.facebook.com/sharer/sharer.php?u=cz3003-assignment.firebaseapp.com'
          target='_blank' class='ml-2 mr-2 mb-3' variant='none'>
          <img alt='Facebook Logo' class='social-button' src='../assets/Facebook_logo.png' />
        </b-button>

        <b-button
          :href='this.twitterShareString'
          target='_blank' class='ml-2 mr-2 mb-3' variant='none'>
          <img alt='Twitter Logo' class='social-button' src='../assets/Twitter_logo.png' />
        </b-button>

        <b-button v-if='questionSetType === "assignments"' to='/assignments' pill variant='warning'>
          View Assignments
        </b-button>
        <b-button v-else-if='questionSetType === "challenges"' to='/challenges' pill variant='warning'>
          View Challenges
        </b-button>
      </div>
    </b-modal>
  </div>
</template>

<script>
import { Sortable } from '@shopify/draggable';
import CreatorCard from '../components/CreatorCard.vue';

export default {
  name: 'Creator',
  components: { CreatorCard },

  data: () => ({
    creatorCards: [],
    questionSetTitle: '',
    questionSetDescription: '',
    requiredExp: '',
    questionSetType: '',
    questionSetWorld: '',
    questionSetLevel: '',
    teacherOnlyRenderFlag: true,
  }),

  async beforeCreate() {
    await this.$store.dispatch('getUserData');
    // Role-specific rendering
    if (this.userData.role !== 'teacher') {
      this.teacherOnlyRenderFlag = false;
    }
  },

  mounted() {
    // Find the parent container and make its immediate children draggable
    const containerSelector = '#creator-list';
    const containers = document.querySelectorAll(containerSelector);

    if (containers.length === 0) {
      return false;
    }

    const sortable = new Sortable(containers, {
      draggable: '.creator-list-item--isDraggable',
      mirror: {
        appendTo: containerSelector,
        constrainDimensions: true,
      },
    });

    // Set listener(s) on Sortable events
    // Reference: https://github.com/Shopify/draggable/tree/master/src/Sortable
    sortable.on('sortable:sorted', (event) => {
      // Whenever an item is switched with another item, swap the items in the creatorCards array
      const { oldIndex } = event.data;
      const { newIndex } = event.data;
      const itemAtOldIndex = this.creatorCards[oldIndex];
      this.creatorCards[oldIndex] = this.creatorCards[newIndex];
      this.creatorCards[newIndex] = itemAtOldIndex;
      this.updateLocalStorage();
    });

    // Checks for localStorage availability
    if (this.checkForLocalStorageAvailability('localStorage')) {
      console.log('localStorage enabled!');

      // Fetch any previously stored data
      if (localStorage.getItem('creator-history')) {
        this.creatorCards = JSON.parse(localStorage.getItem('creator-history'));
      }
    } else {
      console.log('localStorage not enabled!');
    }
  },

  methods: {
    generateUniqueId() {
      // Generate unique ID for each CreatorCard
      // Math.random is seeded using the user's id in seedrandom
      // Convert to base 36 (numbers + letters), then take the first 8 characters after decimal
      return Math.random().toString(36).substr(2, 8);
    },
    addCreatorCard() {
      this.creatorCards.push({
        question: 'Click to Edit Me! Drag me to re-arrange!',
        options: [1, 2, 3, 4],
        answer: 1,
        id: `q_${this.generateUniqueId()}`,
      });

      this.updateLocalStorage();
    },
    updateCreatorCard(value) {
      // value: {
      //    question: this.form.question,
      //    options: optionsArray,
      //    answer: this.form.answer,
      // }
      const card = this.creatorCards.find(card => card.id === value.id);

      if (card) {
        card.question = value.question;
        card.options = value.options;
        card.answer = value.answer;
      }

      const index = this.creatorCards.indexOf(card);
      if (index > -1) {
        this.creatorCards[index] = card;
      }

      this.updateLocalStorage();
    },
    deleteCreatorCard(value) {
      // value: { id: an id set during creation }
      const card = this.creatorCards.find(card => card.id === value.id);

      const index = this.creatorCards.indexOf(card);
      if (index > -1) {
        this.creatorCards.splice(index, 1);
      }

      this.updateLocalStorage();
    },
    onFinalize() {
      this.$bvModal.show('confirmation-modal');
    },
    onModalSubmit() {
      this.addQuestionSet();
      this.$bvModal.hide('confirmation-modal');
    },
    checkForLocalStorageAvailability(type) {
      // Adapted From:
      // https://developer.mozilla.org/en-US/docs/Web/API/Web_Storage_API/Using_the_Web_Storage_API
      let storage;
      try {
        storage = window[type];
        const x = '__storage_test__';
        storage.setItem(x, x);
        storage.removeItem(x);
        return true;
      } catch (e) {
        return e instanceof DOMException && (
        // everything except Firefox
          e.code === 22
          // Firefox
          || e.code === 1014
          // test name field too, because code might not be present
          // everything except Firefox
          || e.name === 'QuotaExceededError'
          // Firefox
          || e.name === 'NS_ERROR_DOM_QUOTA_REACHED')
          // acknowledge QuotaExceededError only if there's something already stored
          && (storage && storage.length !== 0);
      }
    },
    updateLocalStorage() {
      if (this.checkForLocalStorageAvailability('localStorage')) {
        localStorage.setItem('creator-history', JSON.stringify(this.creatorCards));
      }
    },
    addQuestionSet() {
      if (this.creatorCards.length <= 0) {
        this.$message.error({
          message: 'You can\'t submit an empty question set!',
          center: true,
          customClass: 'alert-style',
          offset: 60,
        });
        return;
      }

      if (this.questionSetTitle === '') {
        this.$message.error({
          message: 'You can\'t submit a question set that as no title!',
          center: true,
          customClass: 'alert-style',
          offset: 60,
        });
        return;
      }

      if (this.checkForLocalStorageAvailability('localStorage')) {
        // Save to localStorage
        const questionSet = {};
        questionSet.id = `qset_${this.generateUniqueId()}`;
        questionSet.title = this.questionSetTitle;
        questionSet.description = this.questionSetDescription;
        questionSet.requiredExp = this.requiredExp;
        questionSet.creator = this.userData.username;
        questionSet.questions = this.creatorCards;

        localStorage.setItem('last-pushed-question-set', JSON.stringify(questionSet));
        let questionSetPayload;

        if (this.questionSetType === 'challenges') {
          console.log('challenge')
          questionSetPayload = {
            type: this.questionSetType,
            world: this.questionSetWorld,
            level: this.questionSetLevel,
            questionSet
          }
        } else {
          console.log('not challnge')

          questionSetPayload = {
            type: this.questionSetType,
            world: this.questionSetWorld,
            level: this.questionSetLevel,
            reqExp: this.requiredExp,
            questionSet
          }
        }

        this.$store.dispatch('pushQuestionSet', questionSetPayload);


        this.$bvModal.show('submitted-modal');

        // Clear creator-history in localStorage and data()
        this.creatorCards = [];
        localStorage.setItem('creator-history', JSON.stringify(this.creatorCards));
      }
    },
  },

  computed: {
    userData: {
      get() {
        return this.$store.state.userData;
      },
    },
    justPushedQuestionSetId: {
      get() {
        return this.$store.state.justPushedQuestionSetId;
      }
    },
    twitterShareString: {
      get() {
        let type = this.questionSetType === 'assignments' ? 'assignment' : 'challenge';
        let path = '';
        if (type === 'assignment') {
          path = 'assignments/' + this.questionSetWorld + '/' + this.questionSetLevel + '/' +
            this.$store.state.justPushedQuestionSetId;
        } else if (type === 'challenge') {
          path = 'challenges/' + this.$store.state.justPushedQuestionSetId;
        }
        return 'https://twitter.com/intent/tweet?text=I%20created%20a%20new%20' + type +
          '%20using%20Untitled%20Learning%20App!%20View%20it%20here:%20cz3003-assignment.firebaseapp.com/'
          + path
      }
    },
  },
};
</script>

<style>
.title {
  font-family: "Autumn", 'Avenir', Helvetica, Arial, sans-serif;
  letter-spacing: 5px;
  font-size: 44px;
  color: white;
}
.text-accent {
  font-weight: bold;
  color: #FD884C;
}
.alert-style {
  min-width: 200px;
}
.draggable-mirror {
  opacity: 0.8;
}
.draggable--over {
  background-color: #FFC640;
}
#confirmation-modal .modal-header {
  color: white;
  background-color: #FD884C !important;
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
</style>
