/**
 * Global stores used to access common information across the entire app
 * @module Stores
 * @mergeTarget
 */

import { clamp } from 'utils/math';
import { create, GetState, SetState } from 'zustand';
import { subscribeWithSelector, StoreApiWithSubscribeWithSelector } from 'zustand/middleware';

/**  Variables stored in the {@link useScroll scroll store} */
interface ScrollState {
  /** Current scroll position of the page. Starts at 0 and each whole number represents a full screen scroll */
  scrollPosition: number;
  /** The lower bound of scroll position. *defaults to 0* */
  minScroll: number;
  /** The upper bound of scroll position. *defaults to 0* */
  maxScroll: number;
  /** Adds the given number to the scroll position */
  applyScrollDelta: (delta: number) => void;
  /** Snaps the scroll position to the nearest whole number */
  snapScrollPosition: () => void;
}

/**
 * Accessor function for the store used to hold and update the scroll position, alongside scrolling parameters.
 *
 * See {@link ScrollState} for the variables it contains.
 *
 * *To set up a transient subscription to the scroll position that doesn't cause rerenders use the {@link useTransientScroll} hook*
 * @category Store
 */
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

export { useScroll };
export type { ScrollState };
