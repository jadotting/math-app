import { expect } from 'chai';
import { shallowMount } from '@vue/test-utils';
import CollectibleTile from '@/components/CollectibleTile.vue';

describe('CollectibleTile.vue', () => {
  const collectible = {
    src: 'test.png',
  };
  it('renders the CollectibleTile', () => {
    const wrapper = shallowMount(CollectibleTile, {
      propsData: { collectible },
    });
    expect(wrapper.html()).contain('b-img');
  });
});
