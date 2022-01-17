/**
 * Global stores used to access common information across the entire app
 * @module Stores
 * @mergeTarget
 */

import create from 'zustand';

/**  Variables stored in the {@link useTheme theme store} */
interface ThemeState {
  /** Primary color of the theme */
  primaryColor: string;
  /** Secondary color of the theme */
  secondaryColor: string;
  /** Alternate bright version of the primary color */
  primaryBright: string;
  /** Alternate bright version of the secondary color */
  secondaryBright: string;
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
 * Accessor function for the store used to hold variables relating to theme.
 *
 * See {@link ThemeState} for the variables it contains
 * @category Store
 */
const useTheme = create<ThemeState>(() => ({
  primaryColor: '#E60050',
  secondaryColor: '#2AD1AF',
  primaryBright: '#FF005A',
  secondaryBright: '#2FE8C3',
  marginX: 0.1,
  marginY: 0.05
}));

export { useTheme };
export type { ThemeState };
