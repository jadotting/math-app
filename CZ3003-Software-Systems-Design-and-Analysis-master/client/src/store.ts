import Vue from 'vue';
import Vuex from 'vuex';
import * as firebase from 'firebase';

Vue.use(Vuex);

const EQUIP_CHARACTER = 'EQUIP_CHARACTER';
const GET_USER_INFO = 'GET_USER_INFO';
const BUY_CHARACTER = 'BUY_CHARACTER';
const BUY_COMPANION = 'BUY_COMPANION';
const UPDATE_USER_INFO = 'UPDATE_USER_INFO';
const SHOW_PURCHASE_NOTIFICATION = 'SHOW_PURCHASE_NOTIFICATION';
const SHOW_UPDATE_USER_INFO_NOTIFICATION = 'SHOW_UPDATE_USER_INFO_NOTIFICATION';
const PUSH_QUESTION_SET = 'PUSH_QUESTION_SET';
const GET_QUESTION_SETS = 'GET_QUESTION_SETS';
const GET_QUESTION_SET_BY_ID = 'GET_QUESTION_SET_BY_ID';
const ADD_USER_COINS = 'ADD_USER_COINS';
const ADD_USER_EXP = 'ADD_USER_EXP';
const SAVE_RESULT = 'SAVE_RESULT';
const GET_RESULTS = 'GET_RESULTS';

export default new Vuex.Store({
  state: {
    showPurchaseSuccessful: false,
    showPurchaseUnsuccessful: false,
    showUpdateUserInfoSuccessful: false,
    showUpdateUserInfoUnsuccessful: false,
    showUpdateUserPwSuccessful: false,
    showUpdateUserPwUnsuccessful: false,
    userData: { // The currently logged-in user (this is placeholder data)
      id: 1,
      username: 'Test User',
      coins: 0,
      exp: 0,
      character: 0, // ID of currently-equipped character
      companion: 2000, // ID of currently-equipped companion
      ownedCollectibles: {
        characters: [0, 1, 1001], // IDs of owned characters (default: 0)
        companions: [2000, 2001], // IDs of owned companions (default: 2000)
      },
      results: {},
    },
    allCollectibles: { // All available collectibles
      allCharacters: [
        {
          id: 0, name: 'No Avatar', value: 0, src: '../../img/characters/male-00-0.png',
        },
        {
          id: 1, name: 'Male 01-1', value: 10, src: '../../img/characters/male-01-1.png',
        },
        {
          id: 2, name: 'Male 01-2', value: 10, src: '../../img/characters/male-01-2.png',
        },
        {
          id: 3, name: 'Male 01-3', value: 10, src: '../../img/characters/male-01-3.png',
        },
        {
          id: 4, name: 'Male 01-4', value: 12, src: '../../img/characters/male-01-4.png',
        },
        {
          id: 5, name: 'Male 02-1', value: 12, src: '../../img/characters/male-02-1.png',
        },
        {
          id: 6, name: 'Male 02-2', value: 12, src: '../../img/characters/male-02-2.png',
        },
        {
          id: 7, name: 'Male 02-3', value: 15, src: '../../img/characters/male-02-3.png',
        },
        {
          id: 8, name: 'Male 02-4', value: 15, src: '../../img/characters/male-02-4.png',
        },
        {
          id: 9, name: 'Male 03-1', value: 15, src: '../../img/characters/male-03-1.png',
        },
        {
          id: 10, name: 'Male 03-2', value: 15, src: '../../img/characters/male-03-2.png',
        },
        {
          id: 11, name: 'Male 03-3', value: 15, src: '../../img/characters/male-03-3.png',
        },
        {
          id: 12, name: 'Male 03-4', value: 15, src: '../../img/characters/male-03-4.png',
        },
        {
          id: 13, name: 'Male 04-1', value: 20, src: '../../img/characters/male-04-1.png',
        },
        {
          id: 14, name: 'Male 04-2', value: 20, src: '../../img/characters/male-04-2.png',
        },
        {
          id: 15, name: 'Male 04-3', value: 20, src: '../../img/characters/male-04-3.png',
        },
        {
          id: 16, name: 'Male 04-4', value: 20, src: '../../img/characters/male-04-4.png',
        },
        {
          id: 17, name: 'Male 05-1', value: 20, src: '../../img/characters/male-05-1.png',
        },
        {
          id: 18, name: 'Male 05-2', value: 20, src: '../../img/characters/male-05-2.png',
        },
        {
          id: 19, name: 'Male 05-3', value: 25, src: '../../img/characters/male-05-3.png',
        },
        {
          id: 20, name: 'Male 05-4', value: 25, src: '../../img/characters/male-05-4.png',
        },
        {
          id: 21, name: 'Male 06-1', value: 25, src: '../../img/characters/male-06-1.png',
        },
        {
          id: 22, name: 'Male 06-2', value: 25, src: '../../img/characters/male-06-2.png',
        },
        {
          id: 23, name: 'Male 06-3', value: 25, src: '../../img/characters/male-06-3.png',
        },
        {
          id: 24, name: 'Male 06-4', value: 30, src: '../../img/characters/male-06-4.png',
        },
        {
          id: 25, name: 'Male 07-1', value: 30, src: '../../img/characters/male-07-1.png',
        },
        {
          id: 26, name: 'Male 07-2', value: 30, src: '../../img/characters/male-07-2.png',
        },
        {
          id: 27, name: 'Male 07-3', value: 30, src: '../../img/characters/male-07-3.png',
        },
        {
          id: 28, name: 'Male 07-4', value: 30, src: '../../img/characters/male-07-4.png',
        },
        {
          id: 29, name: 'Male 09-1', value: 35, src: '../../img/characters/male-09-1.png',
        },
        {
          id: 30, name: 'Male 09-2', value: 35, src: '../../img/characters/male-09-2.png',
        },
        {
          id: 31, name: 'Male 09-3', value: 35, src: '../../img/characters/male-09-3.png',
        },
        {
          id: 32, name: 'Male 09-4', value: 35, src: '../../img/characters/male-09-4.png',
        },
        {
          id: 33, name: 'Male 13-1', value: 35, src: '../../img/characters/male-13-1.png',
        },
        {
          id: 34, name: 'Male 13-2', value: 35, src: '../../img/characters/male-13-2.png',
        },
        {
          id: 35, name: 'Male 13-3', value: 40, src: '../../img/characters/male-13-3.png',
        },
        {
          id: 36, name: 'Male 13-4', value: 40, src: '../../img/characters/male-13-4.png',
        },
        {
          id: 37, name: 'Male 14-1', value: 40, src: '../../img/characters/male-14-1.png',
        },
        {
          id: 38, name: 'Male 14-2', value: 40, src: '../../img/characters/male-14-2.png',
        },
        {
          id: 39, name: 'Male 14-3', value: 40, src: '../../img/characters/male-14-3.png',
        },
        {
          id: 40, name: 'Male 14-4', value: 45, src: '../../img/characters/male-14-4.png',
        },
        {
          id: 41, name: 'Male 16-1', value: 45, src: '../../img/characters/male-16-1.png',
        },
        {
          id: 42, name: 'Male 16-2', value: 45, src: '../../img/characters/male-16-2.png',
        },
        {
          id: 43, name: 'Male 16-3', value: 45, src: '../../img/characters/male-16-3.png',
        },
        {
          id: 44, name: 'Male 16-4', value: 45, src: '../../img/characters/male-16-4.png',
        },
        {
          id: 1001, name: 'Female 01-1', value: 10, src: '../../img/characters/female-01-1.png',
        },
        {
          id: 1002, name: 'Female 01-2', value: 10, src: '../../img/characters/female-01-2.png',
        },
        {
          id: 1003, name: 'Female 01-3', value: 10, src: '../../img/characters/female-01-3.png',
        },
        {
          id: 1004, name: 'Female 01-4', value: 12, src: '../../img/characters/female-01-4.png',
        },
        {
          id: 1005, name: 'Female 02-1', value: 12, src: '../../img/characters/female-02-1.png',
        },
        {
          id: 1006, name: 'Female 02-2', value: 12, src: '../../img/characters/female-02-2.png',
        },
        {
          id: 1007, name: 'Female 02-3', value: 15, src: '../../img/characters/female-02-3.png',
        },
        {
          id: 1008, name: 'Female 02-4', value: 15, src: '../../img/characters/female-02-4.png',
        },
        {
          id: 1009, name: 'Female 03-1', value: 15, src: '../../img/characters/female-03-1.png',
        },
        {
          id: 1010, name: 'Female 03-2', value: 15, src: '../../img/characters/female-03-2.png',
        },
        {
          id: 1011, name: 'Female 03-3', value: 15, src: '../../img/characters/female-03-3.png',
        },
        {
          id: 1012, name: 'Female 03-4', value: 20, src: '../../img/characters/female-03-4.png',
        },
        {
          id: 1013, name: 'Female 04-1', value: 20, src: '../../img/characters/female-04-1.png',
        },
        {
          id: 1014, name: 'Female 04-2', value: 20, src: '../../img/characters/female-04-2.png',
        },
        {
          id: 1015, name: 'Female 04-3', value: 20, src: '../../img/characters/female-04-3.png',
        },
        {
          id: 1016, name: 'Female 04-4', value: 20, src: '../../img/characters/female-04-4.png',
        },
        {
          id: 1017, name: 'Female 05-1', value: 20, src: '../../img/characters/female-05-1.png',
        },
        {
          id: 1018, name: 'Female 05-2', value: 25, src: '../../img/characters/female-05-2.png',
        },
        {
          id: 1019, name: 'Female 05-3', value: 25, src: '../../img/characters/female-05-3.png',
        },
        {
          id: 1020, name: 'Female 05-4', value: 25, src: '../../img/characters/female-05-4.png',
        },
        {
          id: 1021, name: 'Female 06-1', value: 25, src: '../../img/characters/female-06-1.png',
        },
        {
          id: 1022, name: 'Female 06-2', value: 25, src: '../../img/characters/female-06-2.png',
        },
        {
          id: 1023, name: 'Female 06-3', value: 25, src: '../../img/characters/female-06-3.png',
        },
        {
          id: 1024, name: 'Female 06-4', value: 30, src: '../../img/characters/female-06-4.png',
        },
        {
          id: 1025, name: 'Female 09-1', value: 30, src: '../../img/characters/female-09-1.png',
        },
        {
          id: 1026, name: 'Female 09-2', value: 30, src: '../../img/characters/female-09-2.png',
        },
        {
          id: 1027, name: 'Female 09-3', value: 30, src: '../../img/characters/female-09-3.png',
        },
        {
          id: 1028, name: 'Female 09-4', value: 30, src: '../../img/characters/female-09-4.png',
        },
        {
          id: 1029, name: 'Female 15-1', value: 30, src: '../../img/characters/female-15-1.png',
        },
        {
          id: 1030, name: 'Female 15-2', value: 35, src: '../../img/characters/female-15-2.png',
        },
        {
          id: 1031, name: 'Female 15-3', value: 35, src: '../../img/characters/female-15-3.png',
        },
        {
          id: 1032, name: 'Female 15-4', value: 35, src: '../../img/characters/female-15-4.png',
        },
        {
          id: 1033, name: 'Female 16-1', value: 35, src: '../../img/characters/female-16-1.png',
        },
        {
          id: 1034, name: 'Female 16-2', value: 35, src: '../../img/characters/female-16-2.png',
        },
        {
          id: 1035, name: 'Female 16-3', value: 40, src: '../../img/characters/female-16-3.png',
        },
        {
          id: 1036, name: 'Female 16-4', value: 40, src: '../../img/characters/female-16-4.png',
        },
        {
          id: 1037, name: 'Female 20-1', value: 40, src: '../../img/characters/female-20-1.png',
        },
        {
          id: 1038, name: 'Female 20-2', value: 45, src: '../../img/characters/female-20-2.png',
        },
        {
          id: 1039, name: 'Female 20-3', value: 45, src: '../../img/characters/female-20-3.png',
        },
        {
          id: 1040, name: 'Female 20-4', value: 50, src: '../../img/characters/female-20-4.png',
        },
      ],
      allCompanions: [
        {
          id: 2000, name: 'No Companion', value: 0, src: '../../img/companions/cat-00-0.png',
        },
        {
          id: 2001, name: 'Cat-01-1', value: 10, src: '../../img/companions/cat-01-1.png',
        },
        {
          id: 2002, name: 'Cat-01-2', value: 15, src: '../../img/companions/cat-01-2.png',
        },
        {
          id: 2003, name: 'Cat-01-3', value: 20, src: '../../img/companions/cat-01-3.png',
        },
        {
          id: 2004, name: 'Dog-01-1', value: 25, src: '../../img/companions/dog-01-1.png',
        },
        {
          id: 2005, name: 'Dog-01-2', value: 30, src: '../../img/companions/dog-01-2.png',
        },
        {
          id: 2006, name: 'Dog-01-3', value: 35, src: '../../img/companions/dog-01-3.png',
        },
        {
          id: 2007, name: 'Slime-01-1', value: 40, src: '../../img/companions/slime-01-1.png',
        },
        {
          id: 2008, name: 'Slime-01-2', value: 50, src: '../../img/companions/slime-01-2.png',
        },
        {
          id: 2009, name: 'Slime-01-3', value: 50, src: '../../img/companions/slime-01-3.png',
        },
      ],
    },
    allAssignments: {},
    allChallenges: {},
    allLessons: {},
    questionSetById: {},
    justPushedQuestionSetId: '',
    allResults: [],
  },

  mutations: {
    [EQUIP_CHARACTER](state, collectibleId) {
      state.userData.character = collectibleId;
    },
    [SHOW_PURCHASE_NOTIFICATION](state) {
      if (state.showPurchaseSuccessful) {
        state.showPurchaseSuccessful = false;
      }
      if (state.showPurchaseUnsuccessful) {
        state.showPurchaseUnsuccessful = false;
      }
    },
    [SHOW_UPDATE_USER_INFO_NOTIFICATION](state) {
      if (state.showUpdateUserInfoSuccessful) {
        state.showUpdateUserInfoSuccessful = false;
      }
      if (state.showUpdateUserInfoUnsuccessful) {
        state.showUpdateUserInfoUnsuccessful = false;
      }
      if (state.showUpdateUserPwSuccessful) {
        state.showUpdateUserPwSuccessful = false;
      }
      if (state.showUpdateUserPwUnsuccessful) {
        state.showUpdateUserPwUnsuccessful = false;
      }
    },
    [GET_USER_INFO](state, userData) {
      state.userData = userData;
    },
    [UPDATE_USER_INFO](state, form) {
      if (form.name != null && form.name !== '') {
        state.userData.username = form.name;
      }
    },
    [BUY_CHARACTER](state, characterId) {
      for (let i = 0; i < state.allCollectibles.allCharacters.length; i++) {
        if (state.allCollectibles.allCharacters[i].id == characterId) {
          const tempUserData = state.userData;

          if (!state.userData.ownedCollectibles.characters.includes(characterId)) {
            if (state.allCollectibles.allCharacters[i].value <= state.userData.coins) {
              // means user got enough coins to buy character
              tempUserData.ownedCollectibles.characters.push(characterId);
              // deduct coins from user
              tempUserData.coins -= state.allCollectibles.allCharacters[i].value;
              // equip character
              tempUserData.character = characterId;
              const tempUserDataJSON = tempUserData;
              const { currentUser } = firebase.auth(); // *ensure user is logged in
              if (currentUser == null) {
                console.log('user returned null');
                return;
              }
              const userId = currentUser.uid;
              firebase
                .database()
                .ref(`data/user/${userId}`)
                .set(tempUserDataJSON)
                .then(
                  (success) => {
                    console.log('equipped new character');
                    console.log('update user data success');
                    state.showPurchaseSuccessful = true;
                  },
                  (error) => {
                    console.log('update user data error: ', error);
                    state.showPurchaseUnsuccessful = true;
                  },
                );
            } else {
              // user too poor to buy
              console.log('take more lessons to get more coins boi');
              state.showPurchaseUnsuccessful = true;
            }
          } else {
            console.log('user already have this character, dont need add again');
            // equip character
            tempUserData.character = characterId;
            const tempUserDataJSON = tempUserData;
            const { currentUser } = firebase.auth(); // *ensure user is logged in
            if (currentUser == null) {
              console.log('user returned null');
              return;
            }
            const userId = currentUser.uid;
            firebase
              .database()
              .ref(`data/user/${userId}`)
              .set(tempUserDataJSON)
              .then(
                (success) => {
                  console.log('equipped new character');
                  console.log('update user data success');
                  state.showPurchaseSuccessful = true;
                },
                (error) => {
                  console.log('update user data error: ', error);
                  state.showPurchaseUnsuccessful = true;
                },
              );
          }
        }
      }
    },
    [BUY_COMPANION](state, companionId) {
      for (let i = 0; i < state.allCollectibles.allCompanions.length; i++) {
        if (state.allCollectibles.allCompanions[i].id == companionId) {
          const tempUserData = state.userData;

          if (!state.userData.ownedCollectibles.companions.includes(companionId)) {
            if (state.allCollectibles.allCompanions[i].value <= state.userData.coins) {
              // means user got enough coins totodo buy companion
              tempUserData.ownedCollectibles.companions.push(companionId);
              // deduct coins from user
              tempUserData.coins -= state.allCollectibles.allCompanions[i].value;
              // equip character
              tempUserData.companion = companionId;
              const tempUserDataJSON = tempUserData;
              const { currentUser } = firebase.auth(); // *ensure user is logged in
              if (currentUser == null) {
                console.log('user returned null');
                return;
              }
              const userId = currentUser.uid;
              firebase
                .database()
                .ref(`data/user/${userId}`)
                .set(tempUserDataJSON)
                .then(
                  (success) => {
                    console.log('equipped new companion');
                    console.log('update user data success');
                    state.showPurchaseSuccessful = true;
                  },
                  (error) => {
                    console.log('update user data error: ', error);
                    state.showPurchaseUnsuccessful = true;
                  },
                );
            } else {
              // user too poor to buy
              console.log('take more lessons to get more coins boi');
              state.showPurchaseUnsuccessful = true;
            }
          } else {
            console.log('user already have this character, dont need add again');
            // equip character
            tempUserData.companion = companionId;
            const tempUserDataJSON = tempUserData;
            const { currentUser } = firebase.auth(); // *ensure user is logged in
            if (currentUser == null) {
              console.log('user returned null');
              return;
            }
            const userId = currentUser.uid;
            firebase
              .database()
              .ref(`data/user/${userId}`)
              .set(tempUserDataJSON)
              .then(
                (success) => {
                  console.log('equipped new companion');
                  console.log('update user data success');
                  state.showPurchaseSuccessful = true;
                },
                (error) => {
                  console.log('update user data error: ', error);
                  state.showPurchaseUnsuccessful = true;
                },
              );
          }
        }
      }
    },
    [PUSH_QUESTION_SET](state, payload) {
      // Payload: { type: String, questionSet: Object }
      const { currentUser } = firebase.auth(); // *ensure user is logged in
      if (currentUser == null) {
        console.log('user returned null');
        return;
      }

      if (payload.type === 'assignments' || payload.type === 'lessons') {
        const dyRef = payload.type + '/' + payload.world + '/' + payload.level;
        firebase.database().ref(`data/questions/` + dyRef)
          .push(payload.questionSet)
          .then(
            (success) => {
              // @ts-ignore
              state.justPushedQuestionSetId = success.key;
              console.log('Push to Firebase - Success');
            },
            (error) => {
              console.log('Push to Firebase - Failed', error);
            },
          );
      } else if (payload.type === 'challenges') {
        const dyRef = payload.type;
        let newRef = firebase.database().ref(`data/questions/` + dyRef)
          .push(payload.questionSet)
          .then(
            (success) => {
              // @ts-ignore
              state.justPushedQuestionSetId = success.key;
              console.log('Push to Firebase - Success');
            },
            (error) => {
              console.log('Push to Firebase - Failed', error);
            },
          );
      }
    },
    [GET_QUESTION_SETS](state, data) {
      // Data: {
      //     type: String,
      //     data: Worlds -> Levels -> { firebase_id : { creator, id, questions, title } }
      // }

      // Flatten data based on type
      if (data.type === 'assignments') {
        let arrayOfAssignments = [];
        for (let world of Object.keys(data.data)) {
          for (let level of Object.keys((data.data[world]))) {
            for (let [firebase_key, value] of Object.entries(data.data[world][level])) {
              // @ts-ignore
              value.id = firebase_key; // Replace internal creation id with Firebase-assigned id
              // @ts-ignore
              value.world = world;
              // @ts-ignore
              value.level = level;
              // @ts-ignore
              // value.reqExp = reqExp;
              arrayOfAssignments.push(value);
            }
          }
        }
        state.allAssignments = arrayOfAssignments;
      } else if (data.type === 'challenges') {
        let arrayOfChallenges = [];
        for (let [firebase_key, value] of Object.entries(data.data)) {
          // @ts-ignore
          value.id = firebase_key; // Replace internal creation id with Firebase-assigned id
          arrayOfChallenges.push(value);
        }
        state.allChallenges = arrayOfChallenges;
      } else if (data.type === 'lessons') {
        let arrayOfLessons = [];
        for (let world of Object.keys(data.data)) {
          for (let [level, value] of Object.entries((data.data[world]))) {
            // @ts-ignore
            value.world = world;
            // @ts-ignore
            value.level = level;
            arrayOfLessons.push(value);
          }
        }
        state.allLessons = arrayOfLessons;
      } else {
        console.log('Unsupported type in getQuestionSets action')
      }
    },
    [GET_QUESTION_SET_BY_ID](state, data) {
      // Data: {
      //     type: String, world: String, level: String, id: String, data: snapshot.val()
      // }

      let questionSet = data.data;
      if (questionSet === null) {
        console.log('No such question set with id found');
        return;
      }

      questionSet.id = data.id;
      questionSet.type = data.type;
      questionSet.world = data.world || '';
      questionSet.level = data.level || '';

      state.questionSetById = questionSet;
    },
    [ADD_USER_COINS](state, coins) {
      const { currentUser } = firebase.auth(); // *ensure user is logged in
      if (currentUser == null) {
        console.log('user returned null');
        return;
      }

      const tempUserData = state.userData;
      tempUserData.coins += coins;
      const tempUserDataJSON = tempUserData;

      const userId = currentUser.uid;
      const username = tempUserData.username;
      firebase
        .database()
        .ref(`data/user/${userId}`)
        .set(tempUserDataJSON)
        .then(
          (success) => {
            console.log(`Added ${coins} coins to ${username}`);
          },
          (error) => {
            console.log(`Error adding coins to ${username}: ${error}`);
          },
        );
    },
    [ADD_USER_EXP](state, exp) {
      const { currentUser } = firebase.auth(); // *ensure user is logged in
      if (currentUser == null) {
        console.log('user returned null');
        return;
      }

      const tempUserData = state.userData;
      tempUserData.exp += exp;
      const tempUserDataJSON = tempUserData;

      const userId = currentUser.uid;
      const username = tempUserData.username;
      firebase
        .database()
        .ref(`data/user/${userId}`)
        .set(tempUserDataJSON)
        .then(
          (success) => {
            console.log(`Added ${exp} exp to ${username}`);
          },
          (error) => {
            console.log(`Error adding exp to ${username}: ${error}`);
          },
        );
    },
    [SAVE_RESULT](state, payload) {
      // Payload: { id: id of the question set,
      //            type: type of question set,
      //            results: { correct: Number, incorrect: Number }
      //            }
      const { currentUser } = firebase.auth(); // *ensure user is logged in
      if (currentUser == null) {
        console.log('user returned null');
        return;
      }

      // Update user's results in userData
      const userId = currentUser.uid;
      firebase.database().ref(`data/user/${userId}/results`)
        .push(payload)
        .then(
          (success) => {
            console.log('Push to Firebase - Success');
          },
          (error) => {
            console.log('Push to Firebase - Failed', error);
          },
        );

      // Update global results
      firebase.database().ref(`data/results`)
        .push(payload)
        .then(
          (success) => {
            console.log('Push to Firebase - Success');
          },
          (error) => {
            console.log('Push to Firebase - Failed', error);
          },
        );
    },
    [GET_RESULTS](state, payload) {
      let arrayOfResults = [];
      for (let [result, value] of Object.entries(payload)) {
        arrayOfResults.push(value);
      }
      // @ts-ignore
      state.allResults = arrayOfResults;
    },
  },

  actions: {
    async getUserData({ commit }) {
      const { currentUser } = firebase.auth(); // *ensure user is logged in
      if (currentUser == null) {
        console.log('user returned null');
        return;
      }
      const userId = currentUser.uid;

      let ref = firebase.database().ref(`data/user/${userId}`);
      let snapshot = await ref.once('value');
      await commit(GET_USER_INFO, snapshot.val());
    },
    buyCharacter({ commit }, characterId) {
      commit(BUY_CHARACTER, characterId);
    },
    buyCompanion({ commit }, companionId) {
      commit(BUY_COMPANION, companionId);
    },
    showPurchaseNotification({ commit }) {
      commit(SHOW_PURCHASE_NOTIFICATION);
    },
    showUpdateUserInfoNotification({ commit }) {
      commit(SHOW_UPDATE_USER_INFO_NOTIFICATION);
    },
    updateUserInfo({ commit }, form) {
      let tempUserData = this.state.userData;

      const { currentUser } = firebase.auth(); // *ensure user is logged in
      if (currentUser == null) {
        console.log('user returned null');
        return;
      }
      const userId = currentUser.uid;

      firebase.database()
        .ref(`data/user/${userId}`)
        .once('value')
        .then((snapshot) => {
          tempUserData = snapshot.val();
        });

      if (form.name != null || form.name != '') {
        tempUserData.username = form.name;
        firebase
          .database()
          .ref(`data/user/${userId}`)
          .set(tempUserData)
          .then(
            (success) => {
              console.log('update user data success');
              this.state.showUpdateUserInfoSuccessful = true;
            },
            (error) => {
              console.log('update user data error: ', error);
              this.state.showUpdateUserInfoUnsuccessful = true;
            },
          );
      }

      commit(UPDATE_USER_INFO, form);

      if (form.password != null && form.password != '') {
        currentUser.updatePassword(form.password).then(() => {
          // Update successful.
          console.log('updated user password successfully!');
          this.state.showUpdateUserPwSuccessful = true;
        }).catch((error) => {
          // An error happened.
          console.log(`unable to user password! ${error}`);
          this.state.showUpdateUserPwUnsuccessful = true;
        });
      }
    },
    pushQuestionSet({ commit }, payload) {
      // Payload: { type: String, questionSet: Object }
      commit(PUSH_QUESTION_SET, payload);
    },
    async getQuestionSets({ commit }, type) {
      // Type: String
      const { currentUser } = firebase.auth(); // *ensure user is logged in
      if (currentUser == null) {
        console.log('user returned null');
        return;
      }

      let ref = firebase.database().ref(`data/questions/` + type);
      let snapshot = await ref.once('value');
      await commit(GET_QUESTION_SETS, {type: type, data: snapshot.val()});
    },
    async getQuestionSetById({ commit }, data) {
      // data: { type: String, world: String, level: String, id: String }
      const { currentUser } = firebase.auth(); // *ensure user is logged in
      if (currentUser == null) {
        console.log('user returned null');
        return;
      }

      if (data.type === 'assignments' || data.type === 'lessons') {
        const dyRef = data.type + '/' + data.world + '/' + data.level + '/' + data.id;
        let ref = firebase.database().ref(`data/questions/` + dyRef);
        let snapshot = await ref.once('value');
        await commit(GET_QUESTION_SET_BY_ID, {
          type: data.type,
          world: data.world,
          level: data.level,
          id: data.id,
          data: snapshot.val(),
        });
      } else if (data.type === 'challenges') {
        const dyRef = data.type + '/' + data.id;
        let ref = firebase.database().ref(`data/questions/` + dyRef);
        let snapshot = await ref.once('value');
        await commit(GET_QUESTION_SET_BY_ID, {
          type: data.type,
          id: data.id,
          data: snapshot.val(),
        });
      } else {
        console.log('Unsupported type in getQuestionSetById action')
      }
    },
    addUserCoins({ commit }, coins) {
      // Coins: Number
      commit(ADD_USER_COINS, coins);
    },
    addUserExp({ commit }, exp) {
      // Coins: Number
      commit(ADD_USER_EXP, exp);
    },
    saveResult({ commit }, payload) {
      // Payload: { id: id of the question set,
      //            type: type of question set,
      //            results: { correct: Number, incorrect: Number }
      //            }
      commit(SAVE_RESULT, payload);
    },
    async getResults({ commit }) {
      const { currentUser } = firebase.auth(); // *ensure user is logged in
      if (currentUser == null) {
        console.log('user returned null');
        return;
      }

      let ref = firebase.database().ref(`data/results`);
      let snapshot = await ref.once('value');
      await commit(GET_RESULTS, snapshot.val());
    },
  },
});
