import { expect } from 'chai';
import { shallowMount } from '@vue/test-utils';
import CreatorCard from '@/components/CreatorCard.vue';

const card_data = {
  question: 'test',
  options: [],
}
describe('CreatorCard.vue', () => {
  it('renders the CreatorCard', () => {
    const wrapper = shallowMount(CreatorCard, {
      propsData: { card_data },
    });
    expect(wrapper.html()).contain('b-card');
  });

  it('renders the CreatorCard edit question button', () => {
    const wrapper = shallowMount(CreatorCard, {
      propsData: { card_data },
    });
    expect(wrapper.find({ name: 'editBtn' }));
  });

  it('renders the CreatorCard delete question button', () => {
    const wrapper = shallowMount(CreatorCard, {
      propsData: { card_data },
    });
    expect(wrapper.find({ name: 'deleteBtn' }));
  });

  it('renders the CreatorCard edit question modal', () => {
    const wrapper = shallowMount(CreatorCard, {
      propsData: { card_data },
    });
    expect(wrapper.html()).contain('b-modal');
  });

  it('renders the CreatorCard edit question modal submit button', () => {
    const wrapper = shallowMount(CreatorCard, {
      propsData: { card_data },
    });
    expect(wrapper.find({ name: 'submitBtn' }));
  });
})
