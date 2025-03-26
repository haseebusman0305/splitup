import { useRouter } from 'expo-router';
import { StyleSheet, ImageURISource, SafeAreaView, ViewToken } from 'react-native';
import Animated, {
  useAnimatedRef,
  useAnimatedScrollHandler,
  useSharedValue,
} from 'react-native-reanimated';
import { useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useEffect } from 'react';
import { ThemedView } from '@/components/ThemedView';
import ListItem from '@/components/onboarding/ListItem';
import PaginationElement from '@/components/onboarding/PaginationElement';
import OnboardingButton from '@/components/onboarding/OnboardingButton';
import { useOnboarding } from '@/contexts/OnboardingContext';

const pages = [
  {
    text: 'Track Your Bills',
    description: 'Easily manage and split expenses with your friends',
    image: require('@/assets/images/bill.png'),
  },
  {
    text: 'Save Time & Money',
    description: 'Split expenses fairly and settle up with ease',
    image: require('@/assets/images/saving.png'),
  },
  {
    text: 'Start Tracking Today',
    description: 'Join thousands of users managing their shared expenses',
    image: require('@/assets/images/bill.png')
  },
];

export default function SplashScreen() {
  const { user } = useAuth();
  const router = useRouter();
  const { setHasCompletedOnboarding } = useOnboarding();
  const x = useSharedValue(0);
  const flatListIndex = useSharedValue(0);
  const flatListRef = useAnimatedRef<
    Animated.FlatList<{
      text: string;
      description: string;
      image: ImageURISource;
    }>
  >();

  const onViewableItemsChanged = useCallback(
    ({ viewableItems }: { viewableItems: ViewToken[] }) => {
      flatListIndex.value = viewableItems[0]?.index ?? 0;
    },
    []
  );

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      x.value = event.contentOffset.x;
    },
  });

  const renderItem = useCallback(
    ({
      item,
      index,
    }: {
      item: { text: string; description: string; image: ImageURISource };
      index: number;
    }) => {
      return <ListItem item={item} index={index} x={x} />;
    },
    [x]
  );

  const handleGetStarted = useCallback(async () => {
    if (flatListIndex.value === pages.length - 1) {
      await setHasCompletedOnboarding(true);
      if (user) {
        router.replace('/(tabs)');
      } else {
        router.replace('/auth/login');
      }
    } else {
      flatListRef?.current?.scrollToIndex({
        index: flatListIndex.value + 1,
      });
    }
  }, [flatListIndex.value, setHasCompletedOnboarding]);

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <Animated.FlatList
          ref={flatListRef}
          onScroll={scrollHandler}
          horizontal
          scrollEventThrottle={16}
          pagingEnabled={true}
          data={pages}
          keyExtractor={(_, index) => index.toString()}
          bounces={false}
          renderItem={renderItem}
          showsHorizontalScrollIndicator={false}
          onViewableItemsChanged={onViewableItemsChanged}
        />
        <ThemedView style={styles.bottomContainer}>
          <PaginationElement length={pages.length} x={x} />
          <OnboardingButton
            currentIndex={flatListIndex}
            length={pages.length}
            flatListRef={flatListRef}
            onPress={handleGetStarted}
          />
        </ThemedView>
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  bottomContainer: {
    flexDirection: 'row',

    justifyContent: 'space-between',
    alignItems: 'flex-end',
    paddingHorizontal: 24,
    paddingBottom: 40,
    height: 100,
    maxHeight: 100,

  },
});
