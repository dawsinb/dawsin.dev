/**
 * Global stores used to access common information across the entire app
 * @module Stores
 * @mergeTarget
 */

import create from 'zustand';

/**  Variables stored in the {@link useLayout layout store} */
interface LayoutState {
  /**
   *  Determines whether a vertical layout should be used.
   *  An event listener in {@link App} updates this value on resize to check if screen width < height
   */
  isVertical: boolean;
}

/**
 * Accessor function for the store used to hold variables relating to page layout.
 *
 * See {@link LayoutState} for the variables it contains
 * @category Store
 */
const useLayout = create<LayoutState>(() => ({
  isVertical: false
}));

export { useLayout };
export type { LayoutState };
