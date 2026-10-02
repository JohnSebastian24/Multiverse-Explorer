import { Ionicons } from "@expo/vector-icons";

import {
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { appColors } from "../constants/theme";

import { Episode } from "../services/rickAndMortyApi";

interface EpisodeCardProps {
  episode: Episode;
  onPress: () => void;
}

export default function EpisodeCard({
  episode,
  onPress,
}: EpisodeCardProps) {
  function formatDate(date: string) {
    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return date;
    }

    return parsedDate.toLocaleDateString(
      "es-CO",
      {
        day: "numeric",
        month: "long",
        year: "numeric",
      }
    );
  }

  return (
    <Pressable
  onPress={onPress}
  style={({ pressed }) => [
    styles.card,
    pressed && styles.cardPressed,
  ]}
>
      <View style={styles.episodeIcon}>
        <Ionicons
          name="tv-outline"
          size={23}
          color={appColors.secondary}
        />
      </View>

      <View style={styles.content}>
        <Text style={styles.episodeCode}>
          {episode.episode}
        </Text>

        <Text
          style={styles.name}
          numberOfLines={1}
        >
          {episode.name}
        </Text>

        <Text style={styles.date}>
          {formatDate(episode.air_date)}
        </Text>
      </View>

      <Ionicons
        name="chevron-forward"
        size={21}
        color={appColors.textDisabled}
      />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",

    backgroundColor: appColors.surface,

    borderWidth: 1,
    borderColor: appColors.border,
    borderRadius: 18,

    padding: 12,
    marginBottom: 12,
  },

cardPressed: {
  opacity: 0.82,
  transform: [
    {
      scale: 0.985,
    },
  ],
},

  episodeIcon: {
    width: 48,
    height: 48,
    borderRadius: 15,

    backgroundColor: appColors.surfaceLight,

    justifyContent: "center",
    alignItems: "center",

    marginRight: 13,
  },

  content: {
    flex: 1,
  },

  episodeCode: {
    color: appColors.primary,
    fontSize: 11,
    fontWeight: "800",
    letterSpacing: 1,
  },

  name: {
    color: appColors.text,
    fontSize: 16,
    fontWeight: "800",
    marginTop: 3,
  },

  date: {
    color: appColors.textMuted,
    fontSize: 12,
    marginTop: 4,
  },
});