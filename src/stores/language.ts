/**
 * Global stores used to access language information across the entire app
 * @module Stores
 * @mergeTarget
 */

import { create } from 'zustand';

/**  Variables stored in the {@link useLayout layout store} */
interface LanguageState {
  /**
   *  Determines whether to use Japanese localization
   */
  isJapanese: boolean;
}

/**
 * Accessor function for the store used to hold variables relating to page language.
 *
 * See {@link LanguageState} for the variables it contains
 * @category Store
 */
const useLanguage = create<LanguageState>(() => ({
  isJapanese: false
}));

export { useLanguage };
export type { LanguageState };
