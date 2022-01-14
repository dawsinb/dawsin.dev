import { clamp } from 'Utils/math';
import create, { GetState, SetState } from 'zustand';
import { subscribeWithSelector, StoreApiWithSubscribeWithSelector } from 'zustand/middleware';

type ScrollState = {
  scrollPosition: number;
  minScroll: number;
  maxScroll: number;
  applyScrollDelta: (delta: number) => void;
  snapScrollPosition: () => void;
};

const useScroll = create(
  subscribeWithSelector<
    ScrollState,
    SetState<ScrollState>,
    GetState<ScrollState>,
    StoreApiWithSubscribeWithSelector<ScrollState>
  >((set, get) => ({
    scrollPosition: 0,
    minScroll: 0,
    maxScroll: 0,
    applyScrollDelta: (delta: number) => {
      set({
        scrollPosition: clamp(get().scrollPosition + delta, get().minScroll, get().maxScroll)
      });
    },
    snapScrollPosition: () => {
      set({
        scrollPosition: clamp(Math.round(get().scrollPosition), get().minScroll, get().maxScroll)
      });
    }
  }))
);

export default useScroll;
