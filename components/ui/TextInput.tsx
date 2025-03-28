import { StyleSheet, TextInput as RNTextInput, TextInputProps, View } from 'react-native';
import { useColorScheme } from '@/hooks/useColorScheme';

export function TextInput({ style, ...props }: TextInputProps) {
  const themeColors = useColorScheme();

  return (
    <View style={[
      styles.container, 
      { 
        backgroundColor: themeColors.card,
        borderColor: themeColors.border 
      }
    ]}>
      <RNTextInput 
        style={[
          styles.input, 
          { color: themeColors.text },
          style
        ]} 
        placeholderTextColor={themeColors.textSecondary + '99'}  // Adding transparency to placeholder
        {...props}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
    paddingHorizontal: 16,
  },
  input: {
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
    height: 24,
  }
});
