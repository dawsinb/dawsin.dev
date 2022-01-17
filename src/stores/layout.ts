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
  /**
   * Percentage of the screen used for horizontal margins.
   * Used to create a margin of `(marginX / 2) * width` on both sides of the page
   */
  marginX: number;
  /**
   * Percentage of the screen used for vertical margins.
   * Used to creates a margin of `(marginY / 2) * height` on both ends of the page
   */
  marginY: number;
}

/**
 * Accessor function for the store used to hold variables relating to page layout.
 *
 * See {@link LayoutState} for the variables it contains
 * @category Store
 */
const useLayout = create<LayoutState>(() => ({
  isVertical: false,
  marginX: 0,
  marginY: 0
}));

export { useLayout };
export type { LayoutState };
