import { TextProps } from 'react-native';
import { StyledText } from '@/components/ui/StyledText';

interface ThemedTextProps extends TextProps {
  bold?: boolean;
  semibold?: boolean;
  medium?: boolean;
  type?: String;
}

export function ThemedText(props: ThemedTextProps) {
  return <StyledText {...props} />;
}
