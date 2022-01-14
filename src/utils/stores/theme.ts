import create from 'zustand';

type ThemeState = {
  primaryColor: string;
  secondaryColor: string;
  primaryBright: string;
  secondaryBright: string;
  marginX: number;
  marginY: number;
};

const useTheme = create<ThemeState>(() => ({
  primaryColor: '#E60050',
  secondaryColor: '#2AD1AF',
  primaryBright: '#FF005A',
  secondaryBright: '#2FE8C3',
  marginX: 0.1,
  marginY: 0.05
}));

export default useTheme;
