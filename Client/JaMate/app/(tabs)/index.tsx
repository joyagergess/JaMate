import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StatusBar,
  Animated,
  Pressable,
  PanResponder,
  Dimensions,
  StyleSheet,
} from "react-native";
import { Video, ResizeMode } from "expo-av";
import { Ionicons } from "@expo/vector-icons";
import { useEffect, useMemo, useRef, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import * as SecureStore from "expo-secure-store";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";

import { calculateAge } from "../../utils/date";
import { useFeed } from "../../hooks/feed/useFeed";
import { useSwipe } from "../../hooks/feed/useSwipe";
import { FeedItem } from "../../types/feed";
import { AUTH_TOKEN_KEY } from "../../constants/auth";
import { styles } from "../../styles/homeFeed.styles";

/* ───────────────── CONSTANTS ───────────────── */

const { width } = Dimensions.get("window");
const SWIPE_THRESHOLD = width * 0.25;
const SWIPE_OUT_DURATION = 220;
const ROTATION = 12;

/* ───────────────── SCREEN ───────────────── */

export default function HomeScreen() {
  const { data: feed, isLoading } = useFeed();
  const swipe = useSwipe();

  const [token, setToken] = useState<string | null>(null);
  const [mediaIndex, setMediaIndex] = useState(0);
  const [collapsed, setCollapsed] = useState(false);

  const animatedHeight = useRef(new Animated.Value(1)).current;
  const animatedOpacity = useRef(new Animated.Value(1)).current;

  /* ───────── SWIPE ANIMATION ───────── */

  const position = useRef(new Animated.ValueXY()).current;

  const rotate = position.x.interpolate({
    inputRange: [-SWIPE_THRESHOLD, 0, SWIPE_THRESHOLD],
    outputRange: [`-${ROTATION}deg`, "0deg", `${ROTATION}deg`],
  });

  const cardStyle = {
    transform: [
      { translateX: position.x },
      { translateY: position.y },
      { rotate },
    ],
  };

  const forceSwipe = (direction: "skip" | "jam") => {
    const x = direction === "jam" ? 1000 : -1000;

    Animated.timing(position, {
      toValue: { x, y: 0 },
      duration: SWIPE_OUT_DURATION,
      useNativeDriver: false,
    }).start(() => {
      position.setValue({ x: 0, y: 0 });
      handleSwipe(direction);
    });
  };

  const resetPosition = () => {
    Animated.spring(position, {
      toValue: { x: 0, y: 0 },
      useNativeDriver: false,
    }).start();
  };

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,

      onPanResponderMove: (_, gesture) => {
        position.setValue({ x: gesture.dx, y: gesture.dy });
      },

      onPanResponderRelease: (_, gesture) => {
        if (gesture.dx > SWIPE_THRESHOLD) {
          forceSwipe("jam");
        } else if (gesture.dx < -SWIPE_THRESHOLD) {
          forceSwipe("skip");
        } else {
          resetPosition();
        }
      },
    })
  ).current;

  /* ───────── INIT ───────── */

  useEffect(() => {
    SecureStore.getItemAsync(AUTH_TOKEN_KEY).then(setToken);
  }, []);

  const item: FeedItem | null = feed?.[0] ?? null;
  const profile = item?.profile ?? null;

  const media = useMemo(() => {
    if (!profile) return [];
    return profile.media.filter((m) => m.order !== 0);
  }, [profile?.id]);

  const current = media[mediaIndex];

  if (isLoading || !token || !profile || !current) {
    return (
      <SafeAreaView style={styles.loading}>
        <Text style={{ color: "#fff" }}>Loading…</Text>
      </SafeAreaView>
    );
  }

  /* ───────── ACTIONS ───────── */

  const handleSwipe = (direction: "skip" | "jam") => {
    swipe.mutate({ profile_id: profile.id, direction });
    setMediaIndex(0);
  };

  const nextMedia = () => {
    if (mediaIndex < media.length - 1) setMediaIndex(i => i + 1);
  };

  const prevMedia = () => {
    if (mediaIndex > 0) setMediaIndex(i => i - 1);
  };

  const toggleInfo = () => {
    const toValue = collapsed ? 1 : 0;

    Animated.parallel([
      Animated.timing(animatedHeight, {
        toValue,
        duration: 220,
        useNativeDriver: false,
      }),
      Animated.timing(animatedOpacity, {
        toValue,
        duration: 160,
        useNativeDriver: false,
      }),
    ]).start();

    setCollapsed(!collapsed);
  };

  /* ───────────────── RENDER ───────────────── */

  return (
    <SafeAreaView style={styles.screen}>
      <StatusBar hidden />

      {/* ───────── MEDIA CARD ───────── */}
      <View style={styles.card}>
        <Animated.View
          {...panResponder.panHandlers}
          style={[StyleSheet.absoluteFillObject, cardStyle]}
        >
          {current.type === "image" ? (
            <Image source={{ uri: current.url }} style={styles.media} />
          ) : (
            <Video
              source={{
                uri: current.url,
                headers: { Authorization: `Bearer ${token}` },
              }}
              style={styles.media}
              resizeMode={ResizeMode.COVER}
              shouldPlay
              isLooping
            />
          )}

          {/* TAP ZONES */}
          <View style={styles.tapZones}>
            <TouchableOpacity style={styles.tapZone} onPress={prevMedia} />
            <TouchableOpacity style={styles.tapZone} onPress={nextMedia} />
          </View>

          {/* PROGRESS */}
          <View style={styles.progressContainer}>
            {media.map((_, i) => (
              <View
                key={i}
                style={[
                  styles.progressBar,
                  {
                    backgroundColor:
                      i <= mediaIndex
                        ? "#fff"
                        : "rgba(255,255,255,0.3)",
                  },
                ]}
              />
            ))}
          </View>

          {/* INFO OVERLAY */}
          <Pressable style={styles.infoWrapper} onPress={toggleInfo}>
            <BlurView intensity={18} tint="dark" style={styles.blurBox}>
              <LinearGradient
                colors={["rgba(0,0,0,0.08)", "rgba(0,0,0,0.35)"]}
                style={StyleSheet.absoluteFillObject}
              />

              <Text style={styles.name}>
                {profile.name}
                {profile.birth_date && (
                  <Text style={styles.age}>
                    {" "}
                    - {calculateAge(profile.birth_date)}
                  </Text>
                )}
                {collapsed && profile.instruments.length > 0 && (
                  <Text style={styles.collapsedInstruments}>
                    {" "}
                    · {profile.instruments.map(i => i.name).join(" · ")}
                  </Text>
                )}
              </Text>

              <Animated.View
                style={{
                  opacity: animatedOpacity,
                  maxHeight: animatedHeight.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, 500],
                  }),
                  overflow: "hidden",
                  marginTop: 6,
                }}
              >
                {profile.location && (
                  <Text style={styles.metaText}>
                    📍 {profile.location}
                  </Text>
                )}

                <Text style={styles.skillLine}>
                  {profile.instruments.map(i => i.name).join(" · ")}
                  {profile.experience_level && (
                    <> - {profile.experience_level}</>
                  )}
                </Text>

                <View style={styles.genresRow}>
                  {profile.genres.map(g => (
                    <View key={g.id} style={styles.genreChip}>
                      <Text style={styles.genreText}>{g.name}</Text>
                    </View>
                  ))}
                </View>

                {profile.objectives.length > 0 && (
                  <Text style={styles.objectivesText}>
                    Looking for{" "}
                    {profile.objectives
                      .map(o => o.name.toLowerCase())
                      .join(" / ")}
                  </Text>
                )}

                {profile.bio && (
                  <Text
                    style={styles.objectivesText}
                    numberOfLines={4}
                  >
                    {profile.bio}
                  </Text>
                )}
              </Animated.View>
            </BlurView>
          </Pressable>
        </Animated.View>
      </View>

      {/* ACTION BUTTONS */}
      <View style={styles.actions}>
        <TouchableOpacity
          style={styles.skipBtn}
          onPress={() => forceSwipe("skip")}
        >
          <Ionicons name="close" size={20} color="#fff" />
          <Text style={styles.btnText}>Skip</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.jamBtn}
          onPress={() => forceSwipe("jam")}
        >
          <Ionicons name="musical-notes" size={20} color="#fff" />
          <Text style={styles.btnTextBold}>Jam</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
