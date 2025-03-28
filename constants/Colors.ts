export interface ThemeColors {
  background: string;
  text: string;
  textSecondary: string;
  tint: string;
  tabIconDefault: string;
  tabIconSelected: string;
  secondary: string;
  border: string;
  primary: string;
  card: string;
}

// Define themes as an array for more flexibility
export const THEMES: ThemeColors[] = [
  // greenBlue
  {
    background: '#E9EFEC',
    text: '#16423C',
    textSecondary: '#16423C',
    tint: '#6A9C89',
    tabIconDefault: '#C4DAD2',
    tabIconSelected: '#16423C',
    secondary: '#C4DAD2',
    border: '#C4DAD2',
    primary: '#6A9C89',
    card: '#FFFFFF',
  },
  // pinkRose
  {
    background: '#FFD0D0',
    text: '#A87676',
    textSecondary: '#A87676',
    tint: '#CA8787',
    tabIconDefault: '#E1ACAC',
    tabIconSelected: '#A87676',
    secondary: '#E1ACAC',
    border: '#E1ACAC',
    primary: '#CA8787',
    card: '#FFFFFF',
  },
  // earthBrown
  {
    background: '#F8F4E1',
    text: '#543310',
    textSecondary: '#74512D',
    tint: '#AF8F6F',
    tabIconDefault: '#AF8F6F',
    tabIconSelected: '#543310',
    secondary: '#AF8F6F',
    border: '#AF8F6F',
    primary: '#74512D',
    card: '#FFFFFF',
  },
  // tealGrey
  {
    background: '#EEEEEE',
    text: '#222831',
    textSecondary: '#393E46',
    tint: '#00ADB5',
    tabIconDefault: '#393E46',
    tabIconSelected: '#00ADB5',
    secondary: '#393E46',
    border: '#393E46',
    primary: '#00ADB5',
    card: '#FFFFFF',
  },
  // redPink
  {
    background: '#F4D9D0',
    text: '#921A40',
    textSecondary: '#C75B7A',
    tint: '#C75B7A',
    tabIconDefault: '#D9ABAB',
    tabIconSelected: '#921A40',
    secondary: '#D9ABAB',
    border: '#D9ABAB',
    primary: '#C75B7A',
    card: '#FFFFFF',
  },
];

// Theme names for display purposes
export const THEME_NAMES = ['Green & Blue', 'Pink & Rose', 'Earth Brown', 'Teal & Grey', 'Red & Pink'];

export const DEFAULT_THEME_INDEX = 0; // Default to first theme
