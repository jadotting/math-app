import { expect } from 'chai';
import { mount, createLocalVue } from '@vue/test-utils';
import Vuex from 'vuex';
import UserAvatar from '@/components/UserAvatar.vue';

const localVue = createLocalVue();

localVue.use(Vuex);

describe('UserAvatar.vue', () => {
  const store = new Vuex.Store({
    state: {
      userData: {
        id: 1,
        username: 'Test User',
        coins: 0,
        character: 0, // ID of currently-equipped character
        companion: 2000, // ID of currently-equipped companion
        ownedCollectibles: {
          characters: [0, 1, 1001], // IDs of owned characters (default: 0)
          companions: [2000, 2001], // IDs of owned companions (default: 2000)
        },
      },
      allCollectibles: { // All available collectibles
        allCharacters: [
          {
            id: 0, name: 'No Avatar', value: 0, src: '../../img/characters/male-00-0.png',
          },
        ],
        allCompanions: [
          {
            id: 2000, name: 'No Companion', value: 0, src: '../../img/companions/cat-00-0.png',
          },
        ],
      },
    },
  });

  const userData = {
    id: 1,
    username: 'Test User',
    coins: 0,
    character: 0, // ID of currently-equipped character
    companion: 2000, // ID of currently-equipped companion
    ownedCollectibles: {
      characters: [0, 1, 1001], // IDs of owned characters (default: 0)
      companions: [2000, 2001], // IDs of owned companions (default: 2000)
    },
  };

  it('renders the UserAvatar', () => {
    const wrapper = mount(UserAvatar, {
      store, localVue, propsData: { userData },
    });
    expect(wrapper.html()).contain('collectible-tile');
  });

  it('renders the UserAvatar username correctly', () => {
    const wrapper = mount(UserAvatar, {
      store, localVue, propsData: { userData },
    });
    expect(wrapper.text()).to.include(store.state.userData.username);
  });
});
