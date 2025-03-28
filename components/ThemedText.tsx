import { Text, TextProps, StyleSheet } from 'react-native';
import { useColorScheme } from '@/hooks/useColorScheme';

interface ThemedTextProps extends TextProps {
  bold?: boolean;
  semibold?: boolean;
  medium?: boolean;
  type?: 'header' | 'title' | 'subtitle' | 'default' | 'small' | 'defaultSemiBold';
  darkColor?: string;
  lightColor?: string;
}

export function ThemedText({ 
  style, 
  bold, 
  semibold, 
  medium,
  type = 'default',
  children, 
  ...props 
}: ThemedTextProps) {
  const themeColors = useColorScheme();

  const getFontFamily = () => {
    if (bold || type === 'header' || type === 'title') return 'Poppins-Bold';
    if (semibold || type === 'defaultSemiBold') return 'Poppins-SemiBold';
    if (medium) return 'Poppins-Medium';
    return 'Poppins-Regular';
  };
  
  const getTextStyle = () => {
    switch (type) {
      case 'header':
        return styles.header;
      case 'title':
        return styles.title;
      case 'subtitle':
        return styles.subtitle;
      case 'small':
        return styles.small;
      case 'defaultSemiBold':
      case 'default':
      default:
        return styles.default;
    }
  };

  return (
    <Text 
      style={[
        getTextStyle(),
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
  header: {
    fontSize: 24,
    lineHeight: 32,
  },
  title: {
    fontSize: 20,
    lineHeight: 28,
  },
  subtitle: {
    fontSize: 18,
    lineHeight: 26,
  },
  default: {
    fontSize: 16,
    lineHeight: 24,
  },
  small: {
    fontSize: 14,
    lineHeight: 20,
  },
});
