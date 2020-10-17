<template>
	<div class='text-center' id='leaderboard'>
		<b-row no-gutters>
			<b-col class='title'>
        Leaderboard
			</b-col>
		</b-row>

		<b-row no-gutters v-if='renderFlag'>
			<b-col>
				<b-dropdown
          id='dropdown-challenge'
          variant='light' size='sm'
          :text="filter.title ? filter.title : 'Select challenge'"
          class='m-2'>
					<b-dropdown-group
            v-for='(challenge, index) in this.allChallenges' v-bind:key='index'
          >
            <b-dropdown-item-button
              v-on:click='setFilter(challenge)'
              :class='{ active: filter.challengeId === challenge.id }'
            >
              {{ challenge.title }}
            </b-dropdown-item-button>
					</b-dropdown-group>
				</b-dropdown>
			</b-col>
		</b-row>

    <b-row no-gutters v-if='renderFlag'>
      <b-col>
        <b-table
          style='background: white; border-radius: 25px; border-top: 0'
          per-page='5' foot-clone no-footer-sorting
          :fields='fields' :items='this.filterItems'
          :tbody-tr-class='highlightSelf'
        >
          <!-- Virtual Index Column -->
          <template v-slot:cell(index)='data'>
            {{ data.index + 1 }}
          </template>

          <!-- Override Footer Cell -->
          <template v-slot:foot(index)='data'>
          </template>

          <!-- Override Footer Cell -->
          <template v-slot:foot(username)='data'>
          </template>

          <!-- Override Footer Cell -->
          <template v-slot:foot(score)='data'>
          </template>
        </b-table>
      </b-col>
    </b-row>

    <b-row no-gutters v-if='renderFlag && displayShareOptionsFlag'>
			<b-col>
        <p class='mb-0 text-white'>
          Share your results on:
        </p>
        <b-button
          onclick="return !window.open(this.href, 'Facebook', 'width=640,height=300')"
          href='http://www.facebook.com/sharer/sharer.php?u=cz3003-assignment.firebaseapp.com' target='_blank' class='ml-2 mr-2 mb-3' variant='none'>
          <img alt='Facebook Logo' class='social-button' src='../assets/Facebook_logo.png' />
        </b-button>
        <b-button
          :href='this.twitterShareString'
          target='_blank' class='ml-2 mr-2 mb-3' variant='none'>
          <img alt='Twitter Logo' class='social-button' src='../assets/Twitter_logo.png' />
        </b-button>
			</b-col>
		</b-row>
	</div>
</template>

<script>
export default {
  name: 'Leaderboard',

  data: () => ({
    renderFlag: false,
    displayShareOptionsFlag: false,
    fields: [
      {
        key: 'index',
        label: 'Rank',
      },
      'username',
      {
        key: 'score',
        sortable: true,
      },
    ],
    maxFilterCount: 10,
    filter: {
		  challengeId: '',
      title: '',
    },
    results: [],
  }),

  async beforeCreate() {
    await this.$store.dispatch('getUserData');
    await this.$store.dispatch('getQuestionSets', 'challenges');
    await this.$store.dispatch('getResults');

    // Populate results in data()
    if (this.allResults !== null) {
      this.allResults.forEach((result) => {
        let reformattedResult = {};
        reformattedResult.id = result.id;
        reformattedResult.score = result.results.correct;
        reformattedResult.userId = result.userId;
        reformattedResult.username = result.user;
        this.results.push(reformattedResult);
      });
    } else {
      console.log('Global results is null - there is nothing to display')
    }

    this.renderFlag = true;
  },

  methods: {
	  setFilter(challenge) {
      this.filter.challengeId = challenge.id;
      this.filter.title = challenge.title;
      this.displayShareOptionsFlag = false;
    },
    highlightSelf(item, type) {
	    if (!item) return;
	    if (item.userId === this.userData.id) {
        this.displayShareOptionsFlag = true;
	      return 'highlight-self-result';
      }
    }
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
    allResults: {
      get() {
        return this.$store.state.allResults;
      },
    },
    filterItems: {
      get() {
        return this.results.filter((result) => {
          return result.id === this.filter.challengeId;
        });
      }
    },
    twitterShareString: {
      get() {
        // Find the matching result (if any) and form the share string
        let userResults = this.$store.state.userData.results;
        let matchingResult = null;
        for (let [key, result] of Object.entries(userResults)) {
          if (result.id === this.filter.challengeId) {
            matchingResult = result;
            break;
          }
        }

        if (matchingResult !== null) {
          let score = matchingResult.results.correct + '/' +
            (matchingResult.results.correct + matchingResult.results.incorrect);
          return 'https://twitter.com/intent/tweet?text=I%20completed%20a%20challenge%20on%20' +
            'Untitled%20Learning%20App%20and%20got%20' + score + '!'
        }
      }
    },
  },
};

</script>

<style>
#leaderboard {
  margin: 1.0rem;
}
.title {
  font-family: 'Autumn', 'Avenir', Helvetica, Arial, sans-serif;
  letter-spacing: 5px;
  font-size: 44px;
  color: white;
}
#dropdown-challenge button {
  border-radius: 25px;
}
#leaderboard .table thead th[role*='columnheader'] {
  border-top: 0;
  border-bottom: 0;
}
.text-accent {
  font-weight: bold;
  color: #FD884C;
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
.highlight-self-result {
  background-color: #FFC640;
}
</style>
