import {
  View,
  Text,
  StatusBar,
  Animated,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import { useEffect, useRef, useState, useCallback } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import * as SecureStore from "expo-secure-store";
import { Ionicons } from "@expo/vector-icons";
import { useRouter, useFocusEffect } from "expo-router";
import { Spinner } from "../../components/ui/Spinner";

import { useFeed } from "../../hooks/feed/useFeed";
import { useSwipe } from "../../hooks/feed/useSwipe";
import { useProfile } from "../../hooks/profile/useProfile";
import { useSwipeButtons } from "../../components/feed/useSwipeButtons";
import { useSwipeGesture } from "../../components/feed/useSwipeGesture";

import { FeedItem } from "../../types/feed";
import { AUTH_TOKEN_KEY } from "../../constants/auth";
import { styles } from "../../styles/homeFeed.styles";

import HomeCard from "../../components/feed/HomeCard";
import { SwipeActions } from "../../components/feed/SwipeActions";

import {
  homeScreenStyles as s,
  COLORS,
  LAYOUT,
} from "../../styles/homeFeed.screen.styles";

const { width } = Dimensions.get("window");

const ROTATION = 12;
const SWIPE_OUT = width * 1.2;
const DROP_ZONE_Y = LAYOUT.DROP_ZONE_Y;

export default function HomeScreen() {
  const [feedIndex, setFeedIndex] = useState(0);
  const [token, setToken] = useState<string | null>(null);
  const [showMatchModal, setShowMatchModal] = useState(false);

  const { data: feed, isLoading, refetch } = useFeed();
  const { data: me, refetch: refetchProfile } = useProfile();
  const swipe = useSwipe();
  const router = useRouter();

  const hasPrefetchedRef = useRef(false);
  const activeProfileIdRef = useRef<number | null>(null);

  
  useFocusEffect(
    useCallback(() => {
      refetch();
      refetchProfile();
      setFeedIndex(0);
      hasPrefetchedRef.current = false;
    }, []),
  );

  useEffect(() => {
    if (feedIndex === 15 && !hasPrefetchedRef.current) {
      hasPrefetchedRef.current = true;
      refetch();
    }
  }, [feedIndex]);

  useEffect(() => {
    if (feed && feedIndex >= feed.length && !isLoading) {
      refetch().then(() => setFeedIndex(0));
    }
  }, [feedIndex, feed, isLoading]);

  useEffect(() => {
    SecureStore.getItemAsync(AUTH_TOKEN_KEY).then(setToken);
  }, []);


  const onlyHasProfilePicture =
    me?.media?.length === 1 && me.media[0].order_index === 0;

  const item: FeedItem | null = feed?.[feedIndex] ?? null;
  const profile = item?.profile ?? null;

  useEffect(() => {
    activeProfileIdRef.current = profile?.id ?? null;
  }, [profile?.id]);

  
  const position = useRef(new Animated.ValueXY()).current;

  const {
    skipScale,
    jamScale,
    skipOpacity,
    jamOpacity,
    animateButtons,
  } = useSwipeButtons();

  const rotate = position.x.interpolate({
    inputRange: [-width / 2, 0, width / 2],
    outputRange: [`-${ROTATION}deg`, "0deg", `${ROTATION}deg`],
  });

  const cardStyle = {
    transform: [
      { translateX: position.x },
      { translateY: position.y },
      { rotate },
    ],
  };

  const resetCard = () => {
    Animated.spring(position, {
      toValue: { x: 0, y: 0 },
      useNativeDriver: false,
    }).start();
    animateButtons(null);
  };

  const forceSwipe = (direction: "skip" | "jam") => {
    const profileId = activeProfileIdRef.current;
    if (!profileId) return resetCard();

    Animated.timing(position, {
      toValue: { x: direction === "jam" ? SWIPE_OUT : -SWIPE_OUT, y: 0 },
      duration: 220,
      useNativeDriver: false,
    }).start(() => {
      position.setValue({ x: 0, y: 0 });

      swipe.mutate(
        { profile_id: profileId, direction },
        {
          onSuccess: (data) => {
            if (data.matched) setShowMatchModal(true);
          },
        },
      );

      setFeedIndex((i) => i + 1);
      animateButtons(null);
    });
  };

  
  const panResponder = useSwipeGesture({
    position,
    dropZoneY: DROP_ZONE_Y,
    onHover: animateButtons,
    onRelease: (dir) => {
      if (dir) forceSwipe(dir);
      else resetCard();
    },
  });


  if (!isLoading && feed && feed.length === 0) {
    return (
      <SafeAreaView style={styles.screen}>
        <StatusBar hidden />
        <View style={s.emptyContainer}>
          <Ionicons name="people-outline" size={72} color={COLORS.PRIMARY} />
          <Text style={s.emptyTitle}>No musicians available right now</Text>
          <Text style={s.emptySubtitle}>New musicians will appear soon</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!token || (!profile && isLoading)) {
    return (
      <SafeAreaView style={styles.loading}>
        <Spinner size={44} />
      </SafeAreaView>
    );
  }

  if (onlyHasProfilePicture) {
    return (
      <SafeAreaView style={styles.screen}>
        <StatusBar hidden />
        <View style={s.emptyContainer}>
          <Ionicons name="images-outline" size={72} color={COLORS.PRIMARY} />
          <Text style={s.emptyTitle}>Upload media to continue</Text>
        </View>
      </SafeAreaView>
    );
  }


  return (
    <SafeAreaView style={styles.screen}>
      <StatusBar hidden />

      <HomeCard
        profile={profile}
        token={token}
        panHandlers={panResponder.panHandlers}
        cardStyle={cardStyle}
      />

      {showMatchModal && (
        <Animated.View style={s.matchOverlay}>
          <Text style={s.matchTitle}>It's a Jam!</Text>
          <TouchableOpacity
            onPress={() => {
              setShowMatchModal(false);
              router.push("/matches");
            }}
          >
            <Text style={s.matchButtonText}>View Match</Text>
          </TouchableOpacity>
        </Animated.View>
      )}

      <SwipeActions
        skipScale={skipScale}
        jamScale={jamScale}
        skipOpacity={skipOpacity}
        jamOpacity={jamOpacity}
        onSkip={() => forceSwipe("skip")}
        onJam={() => forceSwipe("jam")}
      />
    </SafeAreaView>
  );
}
