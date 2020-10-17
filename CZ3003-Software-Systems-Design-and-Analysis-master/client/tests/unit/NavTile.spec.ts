import { expect } from 'chai';
import { mount } from '@vue/test-utils';
import NavTile from '@/components/NavTile.vue';

describe('NavTile.vue', () => {
  // eslint-disable-next-line camelcase
  const nav_tile_data = {
    id: 1,
    title: 'Algebra I',
    to: '/test',
    banner: '../../img/banners/roman-mager-5mZ_M06Fc9g-unsplash.jpg',
    banner_alt: 'Image showing a blackboard with mathematical equations',
    description: 'Morbi vulputate felis ornare enim placerat lacinia. Nullam congue, metus ac pharetra rhoncus, tortor tellus scelerisque mauris, eu ultricies ante.',
  };

  it('renders the NavTile', () => {
    const wrapper = mount(NavTile, {
      propsData: {
        nav_tile_data,
      },
    });
    expect(wrapper.html()).contain('b-card');
  });
  it('renders the NavTile title correctly', () => {
    const wrapper = mount(NavTile, {
      propsData: {
        nav_tile_data,
      },
    });
    expect(wrapper.text()).to.include(nav_tile_data.title);
  });
});
