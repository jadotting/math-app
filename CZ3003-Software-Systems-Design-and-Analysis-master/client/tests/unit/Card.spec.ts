import { expect } from 'chai';
import { shallowMount } from '@vue/test-utils';
import Card from '@/components/Card.vue';

describe('Card.vue', () => {
  const card_data = {
    question: 'test qns',
    options: [],
    answer: 'answer',
  };
  it('renders the Card', () => {
    const wrapper = shallowMount(Card, {
      propsData: { card_data },
    });
    expect(wrapper.find({ name: 'card' }));
  });
  it('renders the Card submit button', () => {
    const wrapper = shallowMount(Card, {
      propsData: { card_data },
    });
    expect(wrapper.find({ name: 'submitBtn' }));
  });
});
