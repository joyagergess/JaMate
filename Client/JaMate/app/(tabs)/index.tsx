import {
  View,
  Text,
  StatusBar,
  Animated,
  PanResponder,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import { useEffect, useRef, useState, useCallback } from "react"; // ✅ ADDED useCallback
import { SafeAreaView } from "react-native-safe-area-context";
import * as SecureStore from "expo-secure-store";
import { Ionicons } from "@expo/vector-icons";
import { useRouter, useFocusEffect } from "expo-router"; // ✅ ADDED useFocusEffect
import { Spinner } from "../../components/ui/Spinner";

import { useFeed } from "../../hooks/feed/useFeed";
import { useSwipe } from "../../hooks/feed/useSwipe";
import { useProfile } from "../../hooks/profile/useProfile"; // ✅ ADDED
import { FeedItem } from "../../types/feed";
import { AUTH_TOKEN_KEY } from "../../constants/auth";
import { styles } from "../../styles/homeFeed.styles";

import HomeCard from "../../components/feed/HomeCard";

const { width, height } = Dimensions.get("window");

const ROTATION = 12;
const SWIPE_OUT = width * 1.2;
const DROP_ZONE_Y = height - 160;

export default function HomeScreen() {
  const [feedIndex, setFeedIndex] = useState(0);
  const [token, setToken] = useState<string | null>(null);
  const [showMatchModal, setShowMatchModal] = useState(false);

  const { data: feed, isLoading, refetch } = useFeed();
  const { data: me, refetch: refetchProfile } = useProfile(); // ✅ ADDED
  const swipe = useSwipe();
  const router = useRouter();

  /* ------------------ 🔄 REFRESH ON OPEN ------------------ */

  useFocusEffect(
    useCallback(() => {
      refetch();
      refetchProfile();
      setFeedIndex(0);
    }, [])
  );

  /* ------------------ 🚨 MEDIA CHECK (ADDED) ------------------ */

  /**
   * Block feed if:
   * - user has exactly ONE media
   * - and it is ONLY the profile picture (order_index === 0)
   */
  const onlyHasProfilePicture =
    me?.media?.length === 1 && me.media[0].order_index === 0;

  /* ------------------ ANIMATIONS ------------------ */

  const position = useRef(new Animated.ValueXY()).current;
  const skipScale = useRef(new Animated.Value(1)).current;
  const jamScale = useRef(new Animated.Value(1)).current;
  const skipOpacity = useRef(new Animated.Value(0.6)).current;
  const jamOpacity = useRef(new Animated.Value(0.6)).current;

  const activeProfileIdRef = useRef<number | null>(null);
  const hoveredRef = useRef<"skip" | "jam" | null>(null);

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

  /* ------------------ HELPERS ------------------ */

  const animateButtons = (target: "skip" | "jam" | null) => {
    Animated.parallel([
      Animated.spring(skipScale, {
        toValue: target === "skip" ? 1.35 : 1,
        friction: 5,
        useNativeDriver: true,
      }),
      Animated.spring(jamScale, {
        toValue: target === "jam" ? 1.35 : 1,
        friction: 5,
        useNativeDriver: true,
      }),
      Animated.timing(skipOpacity, {
        toValue: target === "skip" ? 1 : 0.6,
        duration: 120,
        useNativeDriver: true,
      }),
      Animated.timing(jamOpacity, {
        toValue: target === "jam" ? 1 : 0.6,
        duration: 120,
        useNativeDriver: true,
      }),
    ]).start();
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
        }
      );

      setFeedIndex((i) => i + 1);
      animateButtons(null);
    });
  };

  /* ------------------ PAN RESPONDER ------------------ */

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, g) =>
        Math.abs(g.dx) > 5 || Math.abs(g.dy) > 5,

      onPanResponderMove: (_, g) => {
        position.setValue({ x: g.dx, y: g.dy });

        if (g.moveY > DROP_ZONE_Y) {
          const dir = g.moveX < width / 2 ? "skip" : "jam";
          hoveredRef.current = dir;
          animateButtons(dir);
        } else {
          hoveredRef.current = null;
          animateButtons(null);
        }
      },

      onPanResponderRelease: () => {
        if (hoveredRef.current) forceSwipe(hoveredRef.current);
        else resetCard();
        hoveredRef.current = null;
      },
    })
  ).current;

  /* ------------------ DATA ------------------ */

  useEffect(() => {
    SecureStore.getItemAsync(AUTH_TOKEN_KEY).then(setToken);
  }, []);

  const item: FeedItem | null = feed?.[feedIndex] ?? null;
  const profile = item?.profile ?? null;

  useEffect(() => {
    activeProfileIdRef.current = profile?.id ?? null;
  }, [profile?.id]);

  if (isLoading || !token || !profile) {
    return (
      <SafeAreaView
        style={[
          styles.loading,
          { justifyContent: "center", alignItems: "center" },
        ]}
      >
        <Spinner size={44} />
      </SafeAreaView>
    );
  }

  /* ------------------ 🚫 BLOCK FEED (ADDED) ------------------ */

  if (onlyHasProfilePicture) {
    return (
      <SafeAreaView style={styles.screen}>
        <StatusBar hidden />

        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            paddingHorizontal: 32,
          }}
        >
          <Ionicons name="images-outline" size={72} color="#6D5DF6" />

          <Text
            style={{
              color: "#fff",
              fontSize: 22,
              fontWeight: "600",
              marginTop: 20,
              textAlign: "center",
            }}
          >
            Upload media to continue
          </Text>

          <Text
            style={{
              color: "#9CA3AF",
              fontSize: 14,
              marginTop: 10,
              textAlign: "center",
            }}
          >
            Add photos or videos so others can see your vibe.
          </Text>

        </View>
      </SafeAreaView>
    );
  }

  /* ------------------ RENDER (UNCHANGED) ------------------ */

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
        <Animated.View style={styles.matchOverlay}>
          <Text style={styles.matchTitle}>It’s a Jam! 🎶</Text>
          <TouchableOpacity
            onPress={() => {
              setShowMatchModal(false);
              router.push("/matches");
            }}
          >
            <Text style={styles.matchButtonText}>View Match</Text>
          </TouchableOpacity>
        </Animated.View>
      )}

      <View style={styles.actions}>
        <Animated.View
          style={{ transform: [{ scale: skipScale }], opacity: skipOpacity }}
        >
          <TouchableOpacity
            style={styles.skipBtn}
            onPress={() => forceSwipe("skip")}
          >
            <Ionicons name="close" size={20} color="#fff" />
            <Text style={styles.btnText}>Skip</Text>
          </TouchableOpacity>
        </Animated.View>

        <Animated.View
          style={{ transform: [{ scale: jamScale }], opacity: jamOpacity }}
        >
          <TouchableOpacity
            style={styles.jamBtn}
            onPress={() => forceSwipe("jam")}
          >
            <Ionicons name="musical-notes" size={20} color="#fff" />
            <Text style={styles.btnTextBold}>Jam</Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </SafeAreaView>
  );
}
