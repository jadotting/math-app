<template>
  <div class='text-center h-100' id='challenge-browser'>
    <b-row v-if='renderFlag' align-h='center' class='mb-3' no-gutters>
      <b-col cols='12' style='color: white'>
        <h1>{{ toRender.title }}</h1>
      </b-col>
    </b-row>

    <b-row class='h-100' align-v='start' no-gutters>
      <b-col cols='12' v-if='renderFlag && !loadingFlag && !startedFlag' class='w-100 h-auto p-2 start-card'>
        <p class='mb-0 text-accent'>Created by</p>
        <p class='mb-3'>{{ toRender.creator }}</p>
        <p class='mb-0 text-left text-accent'>Description:</p>
        <p class='mb-3 text-left'>{{ toRender.description }}</p>
        <p class='mb-0 text-left text-accent'>Score:</p>

        <!-- Score -->
        <p v-if='attemptedFlag' class='mb-3' style='font-size: x-large'>
          {{ result.results.correct + '/' + (result.results.correct + result.results.incorrect) }}
        </p>
        <p v-else class='mb-5' style='font-size: x-large'>0</p>

        <b-button
          v-if='attemptedFlag'
          href='http://www.facebook.com/sharer/sharer.php?u=cz3003-assignment.firebaseapp.com'
          target='_blank' class='ml-2 mr-2 mb-3' variant='none'>
          <img alt='Facebook Logo' class='social-button' src='../assets/Facebook_logo.png' />
        </b-button>

        <b-button
          v-if='attemptedFlag'
          :href='this.twitterShareString'
          target='_blank' class='ml-2 mr-2 mb-3' variant='none'>
          <img alt='Twitter Logo' class='social-button' src='../assets/Twitter_logo.png' />
        </b-button>

        <br>

        <!-- Navigation Buttons -->
        <b-button
          to='/leaderboard'
          pill variant='warning' size='sm' class='ml-2 mr-2'
        >
          Leaderboard
        </b-button>

        <b-button
          v-if='!attemptedFlag' v-on:click='startedFlag = true'
          pill variant='warning' size='sm' class='ml-2 mr-2'
        >
          Start
        </b-button>

        <b-button
          v-else to='/challenges'
           pill variant='warning' size='sm' class='ml-2 mr-2'
        >
          Challenges List
        </b-button>
      </b-col>

      <!-- Carousel with Questions -->
      <b-col cols='12' v-else-if='renderFlag && !loadingFlag && startedFlag' class='h-100'>
        <el-carousel
          type='card' direction='vertical' :indicator='true'
          trigger='click' :autoplay='false' :loop='false'
        >
          <el-carousel-item v-for='question in toRender.questions' v-bind:key='question.id'>
            <card
              :card_data='question'
              :show-results-immediately='false'
              v-on:click='onSelectionSubmit'
            />
          </el-carousel-item>
        </el-carousel>
      </b-col>

      <!-- Loading Transition -->
      <b-col v-else-if='loadingFlag' cols='12' class='align-self-center justify-content-center' style='color: white'>
        <b-spinner style="width: 3rem; height: 3rem;" label="Loading"></b-spinner>
      </b-col>

      <!-- Error Transition -->
      <b-col v-else cols='12' class='text-center align-self-center' style='color: white' >
        <p>Oops. Something went wrong.</p>
        <b-button to='/challenges' pill variant='warning'>
          Back to Safety
        </b-button>
      </b-col>
    </b-row>

    <!-- Completion Modal -->
    <b-modal
      id='completion-modal'
      centered hide-header hide-footer
    >
      <div class='d-block text-center'>
        <p class='mb-3 text-accent'>You have completed this challenge!</p>
        <p class='mb-0 text-accent'>Score:</p>
        <p class='mb-3'>{{ result.results.correct + '/' + (result.results.correct + result.results.incorrect) }}</p>
        <p class='mb-0 text-accent'>Coins Earned:</p>
        <p class='mb-3'>{{ result.coins }}</p>

        <b-button
          v-if='justCompletedFlag'
          href='http://www.facebook.com/sharer/sharer.php?u=cz3003-assignment.firebaseapp.com'
          target='_blank' class='ml-2 mr-2 mb-3' variant='none'>
          <img alt='Facebook Logo' class='social-button' src='../assets/Facebook_logo.png' />
        </b-button>

        <b-button
          v-if='justCompletedFlag'
          :href='this.twitterShareString'
          target='_blank' class='ml-2 mr-2 mb-3' variant='none'>
          <img alt='Twitter Logo' class='social-button' src='../assets/Twitter_logo.png' />
        </b-button>

        <b-button to='/challenges' pill variant='warning'>
          Back to Challenges
        </b-button>
      </div>
    </b-modal>
  </div>
</template>

<script>
import Card from '../components/Card.vue';

export default {
  name: 'ChallengeBrowser',

  components: { Card },

  props: { 'challenge_id': String },

  data: () => ({
    renderFlag: false,
    loadingFlag: true,
    startedFlag: false,
    attemptedFlag: false,
    justCompletedFlag: false,
    toRender: null, // Question set to be rendered
    attempt: {}, // Records selected answers as the user is answering the questions
    result: { results: { correct: 0, incorrect: 0 }, coins: 0 },
    awardParameter: 1.0,
  }),

  async beforeMount() {
    await this.$store.dispatch('getUserData'); // Get latest userData

    // Find the matching challenge question set based on challenge_id
    if (this.allChallenges.hasOwnProperty('length')) {
      this.toRender = this.allChallenges.find((challenge) => {
        return challenge.id === this.challenge_id;
      });
    } else {
      await this.$store.dispatch('getQuestionSetById', {
        type: 'challenges',
        id: this.challenge_id,
      });

      this.toRender = this.questionSetById;
    }

    // Find the matching result using challenge_id first, if not found, then create placeholders
    if (this.userData.hasOwnProperty('results')) {
      for (let [key, value] of Object.entries(this.userData.results)) {
        if (value.id === this.challenge_id) {
          this.result = value;
          this.loadingFlag = false;
          this.attemptedFlag = true;
          this.renderFlag = true;
          return;
        }
      }
    }

    // Check if toRender is valid
    if (this.toRender.hasOwnProperty('id')) {
      this.renderFlag = true;

      // Create placeholders to store the user's selections + metadata
      let attempt = {};
      attempt.user = this.userData.username;
      attempt.startTime = Date.now();

      let selectedAnswers = [];
      this.toRender.questions.forEach((question) => {
        let singleSel = {};
        singleSel.id = question.id;
        singleSel.value = '';
        singleSel.isCorrect = '';
        selectedAnswers.push(singleSel);
      });
      attempt.selection = selectedAnswers;

      this.attempt = attempt;
    }
    this.loadingFlag = false;
  },

  methods: {
    onSelectionSubmit(value) {
      // value = {
      //     card: card_data, (card_data = question)
      //     value: selected_option,
      //     isCorrect: Boolean,
      // }
      const toUpdate = this.attempt.selection.find(item => item.id === value.card.id);
      // console.log(`DEBUG === Received: ${JSON.stringify(toUpdate)}`);

      toUpdate.value = value.value;
      toUpdate.isCorrect = value.isCorrect;
      // console.log(`DEBUG === Current Selection: ${JSON.stringify(this.attempt.selection)}`);

      // Check if all questions have been answered (also count correct/incorrect answers)
      let correct = 0;
      let incorrect = 0;
      let unanswered = 0;
      this.attempt.selection.forEach((question) => {
        if (question.value === '') {
          unanswered += 1;
        } else if (question.isCorrect) {
          correct += 1;
        } else {
          incorrect += 1;
        }
      });

      if (unanswered > 0) {
        return;
      }

      this.justCompletedFlag = true;
      // console.log(`DEBUG === All Questions Answered`);
      // console.log(`DEBUG === Total Score: Correct: ${correct} | Incorrect: ${incorrect}`);

      // Calculate coin award - customise this by modifying the award parameter
      let coinAward = 10 * this.awardParameter * correct;
      this.$store.dispatch('addUserCoins', coinAward);

      // award exp, same as coin award
      const expAward = coinAward
      this.$store.dispatch('addUserExp', expAward)

      // Save results of any question set to userData
      let result = {};
      result.id = this.toRender.id;
      result.type = 'challenges';
      result.results = {correct: correct, incorrect: incorrect};
      result.coins = coinAward;
      result.user = this.userData.username;
      result.userId = this.userData.id;
      this.result = result;
      this.$store.dispatch('saveResult', result);

      // Show completion-modal and reset route
      this.$bvModal.show('completion-modal');
    },
  },

  computed: {
    userData: {
      get() {
        return this.$store.state.userData;
      },
    },
    allChallenges: {
      get() {
        return this.$store.state.allChallenges;
      },
    },
    questionSetById: {
      get() {
        return this.$store.state.questionSetById;
      }
    },
    twitterShareString: {
      get() {
        let score = this.result.results.correct + '/' +
          (this.result.results.correct + this.result.results.incorrect);
        return 'https://twitter.com/intent/tweet?text=I%20completed%20a%20challenge%20on%20' +
          'Untitled%20Learning%20App%20and%20got%20' + score + '!'
      }
    },
  }
};
</script>

<style scoped>
#challenge-browser {
  margin: 1.0rem;
}
.start-card {
  background-color: rgba(255, 255, 255, 0.85);
  background-image: url('../../public/img/backgrounds/CardOverlay.png');
  background-size: 100%;
  border-radius: 25px;
}
.text-accent {
  font-weight: bold;
  color: #FD884C;
}
.el-carousel__item.is-in-stage {
  opacity: 0.20;
}
.el-carousel__item--card {
  width: 100%;
}
.el-carousel--vertical {
  height: 100%;
}
.el-carousel__item.is-in-stage.is-active {
  opacity: 1.00;
  border-radius: 25px;
  background: linear-gradient(transparent, transparent), linear-gradient(to top, #FFC640, #FD884C);
  background-origin: padding-box, border-box;
  background-repeat: no-repeat; /* this is important */
  border: 5px solid transparent;
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
