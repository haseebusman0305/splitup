import { useColorScheme } from '@/hooks/useColorScheme';
import { StyleSheet, TextInput as RNTextInput, TextInputProps } from 'react-native';

export function TextInput(props: TextInputProps) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  return (
    <RNTextInput
      {...props}
      style={[
        styles.input,
        {
          backgroundColor: isDark ? '#2C2C2C' : '#F5F5F5',
          color: isDark ? '#FFFFFF' : '#000000',
          borderColor: isDark ? '#404040' : '#E0E0E0',
        },
        props.style,
      ]}
      placeholderTextColor={isDark ? '#808080' : '#A0A0A0'}
    />
  );
}

const styles = StyleSheet.create({
  input: {
    height: 50,
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
    borderWidth: 1,
  },
});
