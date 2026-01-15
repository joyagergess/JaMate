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

const { width, height } = Dimensions.get("window");

const ROTATION = 12;
const SWIPE_OUT = width * 1.2;
const DROP_ZONE_Y = height - 160;

export default function HomeScreen() {
  const skipOpacity = useRef(new Animated.Value(0.6)).current;
  const jamOpacity = useRef(new Animated.Value(0.6)).current;

  const { data: feed, isLoading } = useFeed();
  const swipe = useSwipe();

  const [token, setToken] = useState<string | null>(null);
  const [mediaIndex, setMediaIndex] = useState(0);
  const [collapsed, setCollapsed] = useState(false);

  /* ------------------ ANIMATIONS ------------------ */

  const position = useRef(new Animated.ValueXY()).current;
  const skipScale = useRef(new Animated.Value(1)).current;
  const jamScale = useRef(new Animated.Value(1)).current;

  const animatedHeight = useRef(new Animated.Value(1)).current;
  const animatedOpacity = useRef(new Animated.Value(1)).current;

  /* ------------------ STABLE REFS ------------------ */

  const activeProfileIdRef = useRef<number | null>(null);
  const hoveredRef = useRef<"skip" | "jam" | null>(null);

  /* ------------------ ROTATION ------------------ */

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

  /* ------------------ BUTTON ANIMATION ------------------ */

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

  /* ------------------ INFO TOGGLE ------------------ */

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

  /* ------------------ RESET ------------------ */

  const resetCard = () => {
    Animated.parallel([
      Animated.spring(position, {
        toValue: { x: 0, y: 0 },
        useNativeDriver: false,
      }),
      Animated.spring(skipScale, { toValue: 1, useNativeDriver: true }),
      Animated.spring(jamScale, { toValue: 1, useNativeDriver: true }),
    ]).start();
  };

  /* ------------------ SWIPE ------------------ */

  const forceSwipe = (direction: "skip" | "jam") => {
    const profileId = activeProfileIdRef.current;

    if (!profileId) {
      resetCard();
      return;
    }

    Animated.timing(position, {
      toValue: {
        x: direction === "jam" ? SWIPE_OUT : -SWIPE_OUT,
        y: 0,
      },
      duration: 220,
      useNativeDriver: false,
    }).start(() => {
      position.setValue({ x: 0, y: 0 });
      animateButtons(null);

      swipe.mutate({ profile_id: profileId, direction });
      setMediaIndex(0);
    });
  };

  /* ------------------ PAN RESPONDER ------------------ */

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => false,

      onMoveShouldSetPanResponder: (_, g) => {
        return Math.abs(g.dx) > 5 || Math.abs(g.dy) > 5;
      },

      onPanResponderMove: (_, g) => {
        position.setValue({ x: g.dx, y: g.dy });

        if (g.moveY > DROP_ZONE_Y) {
          if (g.moveX < width / 2) {
            hoveredRef.current = "skip";
            animateButtons("skip");
          } else {
            hoveredRef.current = "jam";
            animateButtons("jam");
          }
        } else {
          hoveredRef.current = null;
          animateButtons(null);
        }
      },

      onPanResponderRelease: () => {
        if (!activeProfileIdRef.current) {
          resetCard();
          hoveredRef.current = null;
          return;
        }

        if (hoveredRef.current === "skip") {
          forceSwipe("skip");
        } else if (hoveredRef.current === "jam") {
          forceSwipe("jam");
        } else {
          resetCard();
        }

        hoveredRef.current = null;
      },
    })
  ).current;

  /* ------------------ EFFECTS ------------------ */

  useEffect(() => {
    SecureStore.getItemAsync(AUTH_TOKEN_KEY).then(setToken);
  }, []);

  const item: FeedItem | null = feed?.[0] ?? null;
  const profile = item?.profile ?? null;

  useEffect(() => {
    activeProfileIdRef.current = profile?.id ?? null;
  }, [profile?.id]);

  const media = useMemo(() => {
    if (!profile) return [];
    return profile.media.filter((m) => m.order !== 0);
  }, [profile?.id]);

  const current = media[mediaIndex];

  const nextMedia = () => {
    if (mediaIndex < media.length - 1) setMediaIndex((i) => i + 1);
  };

  const prevMedia = () => {
    if (mediaIndex > 0) setMediaIndex((i) => i - 1);
  };

  if (isLoading || !token || !profile || !current) {
    return (
      <SafeAreaView style={styles.loading}>
        <Text style={{ color: "#fff" }}>Loading…</Text>
      </SafeAreaView>
    );
  }

  /* ------------------ RENDER ------------------ */

  return (
    <SafeAreaView style={styles.screen}>
      <StatusBar hidden />

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
                      i <= mediaIndex ? "#fff" : "rgba(255,255,255,0.3)",
                  },
                ]}
              />
            ))}
          </View>

          {/* INFO */}
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
                  <Text style={styles.metaText}>📍 {profile.location}</Text>
                )}

                <Text style={styles.skillLine}>
                  {profile.instruments.map((i) => i.name).join(" · ")}
                  {profile.experience_level && (
                    <> - {profile.experience_level}</>
                  )}
                </Text>

                <View style={styles.genresRow}>
                  {profile.genres.map((g) => (
                    <View key={g.id} style={styles.genreChip}>
                      <Text style={styles.genreText}>{g.name}</Text>
                    </View>
                  ))}
                </View>

                {profile.objectives.length > 0 && (
                  <Text style={styles.objectivesText}>
                    Looking for{" "}
                    {profile.objectives
                      .map((o) => o.name.toLowerCase())
                      .join(" / ")}
                  </Text>
                )}

                {profile.bio && (
                  <Text style={styles.objectivesText} numberOfLines={4}>
                    {profile.bio}
                  </Text>
                )}
              </Animated.View>
            </BlurView>
          </Pressable>
        </Animated.View>
      </View>

      {/* ACTIONS / DROP ZONES */}
      <View style={styles.actions}>
        <Animated.View
          style={{
            transform: [{ scale: skipScale }],
            opacity: skipOpacity,
          }}
        >
          <TouchableOpacity
            activeOpacity={0.8}
            style={styles.skipBtn}
            onPress={() => forceSwipe("skip")}
          >
            <Ionicons name="close" size={20} color="#fff" />
            <Text style={styles.btnText}>Skip</Text>
          </TouchableOpacity>
        </Animated.View>

        <Animated.View
          style={{
            transform: [{ scale: jamScale }],
            opacity: jamOpacity,
          }}
        >
          <TouchableOpacity
            activeOpacity={0.8}
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
