import create from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';
import { scroll, layout, theme } from '../../store/index';

// combine slices into store
const useStore = create(
  subscribeWithSelector((set, get) => ({
    ...scroll(set, get),
    ...layout(),
    ...theme()
  }))
);

export default useStore;
