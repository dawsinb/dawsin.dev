import create from 'zustand';

type LayoutState = {
  isVertical: boolean;
};

const useLayout = create<LayoutState>(() => ({
  isVertical: false
}));

export default useLayout;
