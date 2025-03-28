import { Text, TextProps, StyleSheet } from 'react-native';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Colors } from '@/constants/Colors';

interface StyledTextProps extends TextProps {
  bold?: boolean;
  semibold?: boolean;
  medium?: boolean;
}

export function StyledText({ 
  style, 
  bold, 
  semibold, 
  medium,
  children, 
  ...props 
}: StyledTextProps) {
  const theme = useColorScheme();
  const themeColors = Colors[theme];

  const getFontFamily = () => {
    if (bold) return 'Poppins-Bold';
    if (semibold) return 'Poppins-SemiBold';
    if (medium) return 'Poppins-Medium';
    return 'Poppins-Regular';
  };

  return (
    <Text 
      style={[
        styles.text, 
        { color: themeColors.text },
        { fontFamily: getFontFamily() },
        style
      ]} 
      {...props}
    >
      {children}
    </Text>
  );
}

const styles = StyleSheet.create({
  text: {
    fontSize: 16,
  },
});