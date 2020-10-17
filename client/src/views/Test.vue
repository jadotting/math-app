<template>
  <div class='text-center h-100' id="test">
    <b-row align-h='center' class='mb-3' no-gutters>
      <b-col cols='12' class='title'>
        Test
      </b-col>
    </b-row>

    <!-- Change the question set type to display in data() to retrieve different types -->
    <b-row no-gutters>
      <b-col
        v-if='showAssignments' cols='12' align-h='center'
        style='display: flex; flex-direction:row; flex-wrap: nowrap; overflow-x: scroll'
      >
        <b-button
          v-for='(assignment, index) in this.allAssignments' v-bind:key='index'
          v-on:click='onQuestionSetSelect(assignment)'
        >
          {{ index }}
        </b-button>
      </b-col>
    </b-row>

    <!-- Change the question set type to display in data() to retrieve different types -->
    <b-row no-gutters>
      <b-col
        v-if='showChallenges' cols='12' align-h='center'
        style='display: flex; flex-direction:row; flex-wrap: nowrap; overflow-x: scroll'
      >
        <b-button
          v-for='(challenge, index) in this.allChallenges' v-bind:key='index'
          v-on:click='onQuestionSetSelect(challenge)'
        >
          {{ index }}
        </b-button>
      </b-col>
    </b-row>

    <!-- Change the question set type to display in data() to retrieve different types -->
    <b-row no-gutters>
      <b-col
        v-if='showLessons' cols='12' align-h='center'
        style='display: flex; flex-direction:row; flex-wrap: nowrap; overflow-x: scroll'
      >
        <b-button
          v-for='(lesson, index) in this.allLessons' v-bind:key='index'
          v-on:click='onQuestionSetSelect(lesson)'
        >
          {{ index }}
        </b-button>
      </b-col>
    </b-row>

    <b-row class='h-100' no-gutters>
      <b-col cols='12' v-if='renderFlag' class='h-100'>
        <el-carousel
          type='card' direction='vertical' :indicator='true'
          trigger='click' :autoplay='false' :loop='false'
        >
          <el-carousel-item v-for='question in toRender.questions' v-bind:key='question.id'>
            <card :card_data='question' v-on:click='onSelectionSubmit'/>
          </el-carousel-item>
        </el-carousel>
      </b-col>
    </b-row>
  </div>
</template>

<script>
import Card from '../components/Card.vue';

export default {
  name: 'Test',

  components: {
    Card,
  },

  data: () => ({
    showAssignments: false, // Only one type should be shown at a time
    showChallenges: true, // Only one type should be shown at a time
    showLessons: false, // Only one type should be shown at a time
    renderFlag: false,
    toRender: {}, // Question set to be rendered
    attempt: {}, // Records selected answers as the user is answering the questions
    awardParameter: 1.0,
  }),

  async beforeCreate() {
    await this.$store.dispatch('getUserData');
    await this.$store.dispatch('getQuestionSets', 'assignments');
    await this.$store.dispatch('getQuestionSets', 'challenges');
    await this.$store.dispatch('getQuestionSets', 'lessons');
    this.renderFlag = true;
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

      console.log(`DEBUG === All Questions Answered`);
      console.log(`DEBUG === Total Score: Correct: ${correct} | Incorrect: ${incorrect}`);

      // Calculate coin award - customise this by modifying the award parameter
      let coinAward = 10 * this.awardParameter * correct;
      this.$store.dispatch('addUserCoins', coinAward);

      // award exp, same as coin award
      const expAward = coinAward
      this.$store.dispatch('addUserExp', expAward)

      // Save results of any question set to userData
      // Result:
      // { id: id of the question set,
      //   type: type of question set,
      //   results: { correct: Number, incorrect: Number } }
      let result = {};
      result.id = this.toRender.id;
      if (this.showAssignments) {
        result.type = 'assignments';
      } else if (this.showChallenges) {
        result.type = 'challenges';
      } else if (this.showLessons) {
        result.type = 'lessons';
      } else {
        console.log(`Type malformed - results saving cancelled`);
      }
      result.results = {correct: correct, incorrect: incorrect};
      this.$store.dispatch('saveResult', result);
    },
    onQuestionSetSelect(assignment) {
      this.toRender = assignment;

      // Store the user's selections + metadata
      let attempt = {};
      attempt.user = this.userData.username;
      attempt.startTime = Date.now();

      let selectedAnswers = [];
      assignment.questions.forEach((question) => {
        let singleSel = {};
        singleSel.id = question.id;
        singleSel.value = '';
        singleSel.isCorrect = '';
        selectedAnswers.push(singleSel);
      });
      attempt.selection = selectedAnswers;

      this.attempt = attempt;
      this.renderFlag = true;
    },
  },

  computed: {
    userData: {
      get() {
        return this.$store.state.userData;
      },
    },
    allAssignments: {
      get() {
        return this.$store.state.allAssignments;
      },
    },
    allChallenges: {
      get() {
        return this.$store.state.allChallenges;
      },
    },
    allLessons: {
      get() {
        return this.$store.state.allLessons;
      },
    },
  }
};
</script>

<style scoped>
#test {
  margin: 1.0rem;
}
.title {
  font-family: "Autumn", 'Avenir', Helvetica, Arial, sans-serif;
  letter-spacing: 5px;
  font-size: 44px;
  color: white;
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
