import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Pressable,
  Animated,
} from "react-native";
import { Video, ResizeMode, AVPlaybackStatus } from "expo-av";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import { useEffect, useMemo, useRef, useState, useCallback } from "react";
import { useFocusEffect } from "expo-router";

import { Spinner } from "../../components/ui/Spinner";
import { calculateAge } from "../../utils/date";
import { styles } from "../../styles/homeFeed.styles";

type Props = {
  profile: any;
  token: string;
  panHandlers: any;
  cardStyle: any;
};

export default function HomeCard({
  profile,
  token,
  panHandlers,
  cardStyle,
}: Props) {
  const [mediaIndex, setMediaIndex] = useState(0);
  const [videoLoading, setVideoLoading] = useState(true);
  const [collapsed, setCollapsed] = useState(false);

  const videoRef = useRef<Video | null>(null);

  const animatedHeight = useRef(new Animated.Value(1)).current;
  const animatedOpacity = useRef(new Animated.Value(1)).current;

  const media = useMemo(() => {
    return profile?.media?.filter((m: any) => m.order !== 0) ?? [];
  }, [profile?.media]);

  const current = media[mediaIndex];

  if (!current) {
    return (
      <View style={styles.card}>
        <View style={styles.media}>
          <View style={styles.videoLoader}>
            <Spinner />
          </View>
        </View>
      </View>
    );
  }

  useEffect(() => {
    setMediaIndex(0);
    setVideoLoading(true);
  }, [profile.id]);

  useEffect(() => {
    if (current.type === "video") {
      setVideoLoading(true);
    }
  }, [mediaIndex]);

  useFocusEffect(
    useCallback(() => {
      videoRef.current?.playAsync().catch(() => {});

      return () => {
        videoRef.current?.pauseAsync().catch(() => {});
      };
    }, [current.url]),
  );

  const nextMedia = () => {
    if (mediaIndex < media.length - 1) {
      setMediaIndex((i) => i + 1);
    }
  };

  const prevMedia = () => {
    if (mediaIndex > 0) {
      setMediaIndex((i) => i - 1);
    }
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

  return (
    <View style={styles.card}>
      <Animated.View
        {...panHandlers}
        style={[StyleSheet.absoluteFillObject, cardStyle]}
      >
        {current.type === "image" ? (
          <Image source={{ uri: current.url }} style={styles.media} />
        ) : (
          <View style={styles.media}>
            {videoLoading && (
              <View style={styles.videoLoader}>
                <Spinner />
              </View>
            )}

            <Video
              ref={videoRef}
              key={current.url}
              source={{
                uri: current.url,
                headers: { Authorization: `Bearer ${token}` },
              }}
              style={StyleSheet.absoluteFill}
              resizeMode={ResizeMode.COVER}
              shouldPlay
              isLooping
              onPlaybackStatusUpdate={(status: AVPlaybackStatus) => {
                if (status.isLoaded && status.isPlaying && videoLoading) {
                  setVideoLoading(false);
                }
              }}
              onReadyForDisplay={() => setVideoLoading(false)}
              onError={() => setVideoLoading(false)}
            />
          </View>
        )}

        <View style={styles.tapZones}>
          <TouchableOpacity style={styles.tapZone} onPress={prevMedia} />
          <TouchableOpacity style={styles.tapZone} onPress={nextMedia} />
        </View>

        <View style={styles.progressContainer}>
          {media.map((_: any, i: number) => (
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
                {profile.instruments.map((i: any) => i.name).join(" · ")}
                {profile.experience_level && <> - {profile.experience_level}</>}
              </Text>

              <View style={styles.genresRow}>
                {profile.genres.map((g: any) => (
                  <View key={g.id} style={styles.genreChip}>
                    <Text style={styles.genreText}>{g.name}</Text>
                  </View>
                ))}
              </View>

              {profile.objectives.length > 0 && (
                <Text style={styles.objectivesText}>
                  Looking for{" "}
                  {profile.objectives
                    .map((o: any) => o.name.toLowerCase())
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
  );
}
