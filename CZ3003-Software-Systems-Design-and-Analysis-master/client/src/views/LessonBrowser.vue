<template>
  <div class='text-center h-100' id='lesson-browser'>
    <b-row v-if='renderFlag' align-h='center' class='mt-3 mb-3' no-gutters>
      <b-col cols='12' style='color: white'>
        <h1>{{ toRender.title }}</h1>
        <p class='mb-0'>Created by {{ toRender.creator }}</p>
      </b-col>
    </b-row>

    <b-row class='h-100' align-v='center' no-gutters>
      <b-col cols='12' v-if='renderFlag && !loadingFlag' class='h-100'>
        <el-carousel
          type='card' direction='vertical' :indicator='true'
          trigger='click' :autoplay='false' :loop='false'
        >
          <el-carousel-item v-for='question in toRender.questions' v-bind:key='question.id'>
            <card
              :card_data='question'
              :show-results-immediately='false'
              v-on:click='onSelectionSubmit'/>
          </el-carousel-item>
        </el-carousel>
      </b-col>

      <b-col v-else-if='loadingFlag' cols='12' class='text-center' style='color: white' >
        <p>Loading...</p>
      </b-col>

      <b-col v-else cols='12' class='text-center' style='color: white' >
        <p>Oops. Something went wrong.</p>
        <b-button to='/lessons' pill variant='warning'>
          Back to Safety
        </b-button>
      </b-col>
    </b-row>
  </div>
</template>

<script>
import Card from '../components/Card.vue';

export default {
  name: 'LessonBrowser',

  components: { Card },

  props: { lesson_world: String, lesson_level: String, lesson_id: String },

  data: () => ({
    renderFlag: false,
    loadingFlag: true,
    toRender: null, // Question set to be rendered
    attempt: {}, // Records selected answers as the user is answering the questions
    awardParameter: 1.0,
  }),

  async beforeMount() {
    // Find the matching lesson question set based on lesson_id
    if (this.allLessons.hasOwnProperty('length')) {
      this.toRender = this.allLessons.find(lesson => lesson.id === this.lesson_id);
    } else {
      await this.$store.dispatch('getQuestionSetById', {
        type: 'lessons',
        world: this.lesson_world,
        level: this.lesson_level,
        id: this.lesson_id,
      });

      this.toRender = this.questionSetById;
    }

    // Check if toRender is valid
    if (this.toRender.hasOwnProperty('id')) {
      this.renderFlag = true;

      // Store the user's selections + metadata
      const attempt = {};
      attempt.user = this.userData.username;
      attempt.startTime = Date.now();

      const selectedAnswers = [];
      this.toRender.questions.forEach((question) => {
        const singleSel = {};
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
      console.log(`DEBUG === Received: ${JSON.stringify(toUpdate)}`);

      toUpdate.value = value.value;
      toUpdate.isCorrect = value.isCorrect;
      console.log(`DEBUG === Current Selection: ${JSON.stringify(this.attempt.selection)}`);

      this.makeToast(value.isCorrect, value.card.answer)

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

      console.log('DEBUG === All Questions Answered');
      console.log(`DEBUG === Total Score: Correct: ${correct} | Incorrect: ${incorrect}`);

      // Calculate coin award - customise this by modifying the award parameter
      const coinAward = 10 * this.awardParameter * correct;
      this.$store.dispatch('addUserCoins', coinAward);

      // award exp, same as coin award
      const expAward = coinAward
      this.$store.dispatch('addUserExp', expAward)

      // Save results of any question set to userData
      // Result:
      // { id: id of the question set,
      //   type: type of question set,
      //   results: { correct: Number, incorrect: Number } }
      const result = {};
      result.id = this.toRender.id;
      result.type = 'lessons';
      result.results = { correct, incorrect };
      result.coins = coinAward;
      result.user = this.userData.username;
      result.userId = this.userData.id;
      this.$store.dispatch('saveResult', result);

      this.$bvToast.toast(`All done! You gained ${coinAward} XP and coins!`, {
        title: 'Teacher says...',
        autoHideDelay: 2000,
        variant: 'success',
        appendToast: true,
        toaster: 'b-toaster-bottom-center',
      });

    },

    makeToast(isCorrect, cardAns) {
      const toastMsg = isCorrect
      ? `Yes, that's correct!`
      : `Wrong! The correct answer is ${cardAns}!`;

      this.$bvToast.toast(toastMsg, {
        title: 'Teacher says...',
        autoHideDelay: isCorrect ? 1000 : 5000,
        variant: isCorrect ? 'success' : 'danger',
        appendToast: true,
        toaster: 'b-toaster-bottom-center',
      });
    },
  },

  computed: {
    userData: {
      get() {
        return this.$store.state.userData;
      },
    },
    allLessons: {
      get() {
        return this.$store.state.allLessons;
      },
    },
    questionSetById: {
      get() {
        return this.$store.state.questionSetById;
      },
    },
  },
};
</script>

<style scoped>
#lesson-browser {
  margin: 1.0rem;
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
  border-radius: 5px;
  background: linear-gradient(transparent, transparent), linear-gradient(to top, #FFC640, #FD884C);
  background-origin: padding-box, border-box;
  background-repeat: no-repeat; /* this is important */
  border: 5px solid transparent;
}
</style>
