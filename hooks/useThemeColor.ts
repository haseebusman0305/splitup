/**
 * Learn more about light and dark modes:
 * https://docs.expo.dev/guides/color-schemes/
 */

import { ThemeColors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

type ColorKey = keyof ThemeColors;

export function useThemeColor(
  props: { light?: string; dark?: string },
  colorName: ColorKey
) {
  const theme = useColorScheme();
  const colorFromProps = props.light; // We're not using light/dark props anymore, but keeping for compatibility

  if (colorFromProps) {
    return colorFromProps;
  } else {
    return theme[colorName];
  }
}
