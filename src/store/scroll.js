import { clamp } from 'Utils/math';

const scroll = (set, get) => ({
  scrollPosition: 0,
  minScroll: 0,
  maxScroll: 0,
  applyScrollDelta: (delta) => {
    set({
      scrollPosition: clamp(get().scrollPosition + delta, get().minScroll, get().maxScroll)
    });
  },
  snapScrollPosition: () => {
    set({
      scrollPosition: clamp(Math.round(get().scrollPosition), get().minScroll, get().maxScroll)
    });
  }
});

export default scroll;
