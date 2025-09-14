/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

const tintColorLight = '#0a7ea4';
const tintColorDark = '#fff';

export const Colors = {
  light: {
    text: '#080808',
    background: '#fff',
    tint: tintColorLight,
    icon: '#080808',
    tabIconDefault: '#687076',
    tabIconSelected: tintColorLight,
    gray: '#8E8E93',
    accentBackground: '#F2F2F2',
  },
  dark: {
    text: '#ECEDEE',
    background: '#151718',
    tint: tintColorDark,
    icon: '#9BA1A6',
    tabIconDefault: '#9BA1A6',
    tabIconSelected: tintColorDark,
    gray: '#8E8E93',
    accentBackground: '#2C2C2E',
  },
};
