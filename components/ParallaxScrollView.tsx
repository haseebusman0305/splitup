import { ReactNode } from 'react';
import { StyleSheet, ScrollView, View } from 'react-native';
import { useColorScheme } from '@/hooks/useColorScheme';

interface Props {
  children: ReactNode;
  headerImage?: ReactNode;
  headerBackgroundColor?: {
    light: string;
    dark: string;
  };
}

export default function ParallaxScrollView({
  children,
  headerImage,
  headerBackgroundColor,
}: Props) {
  const themeColors = useColorScheme();

  return (
    <View style={styles.container}>
      {headerImage && (
        <View 
          style={[
            styles.header,
            {
              backgroundColor: headerBackgroundColor?.light || themeColors.background
            }
          ]}>
          {headerImage}
        </View>
      )}
      <ScrollView
        contentContainerStyle={styles.scrollContent}>
        <View style={styles.headerPlaceholder} />
        <View style={styles.childrenContainer}>{children}</View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 200,
    zIndex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  headerPlaceholder: {
    height: 200,
  },
  childrenContainer: {
    flex: 1,
    padding: 20,
  },
});
