import create from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';
import { clamp } from 'Utils/math';

/* store slices */

const scrollSlice = (set, get) => ({
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

const layoutSlice = () => ({
  isVertical: false
});

/* combine slices into store */

const useStore = create(
  subscribeWithSelector((set, get) => ({
    ...layoutSlice(),
    ...scrollSlice(set, get)
  }))
);

export default useStore;
