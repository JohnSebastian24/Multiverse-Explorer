import {
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { Image } from "expo-image";

import { Character } from "../services/rickAndMortyApi";

import {
  translateSpecies,
  translateStatus,
} from "../utils/translations";

interface CharacterCardProps {
  character: Character;
  onPress: () => void;
}

export default function CharacterCard({
  character,
  onPress,
}: CharacterCardProps) {
  const statusColor =
    character.status === "Alive"
      ? "#97ce4c"
      : character.status === "Dead"
      ? "#ef4444"
      : "#9ca3af";

  return (
    <Pressable
      style={styles.card}
      onPress={onPress}
    >
      <Image
        source={character.image}
        style={styles.characterImage}
        contentFit="cover"
        cachePolicy="memory-disk"
        transition={200}
      />

      <View style={styles.cardContent}>
        <Text
          style={styles.characterName}
          numberOfLines={1}
        >
          {character.name}
        </Text>

        <View style={styles.statusContainer}>
          <View
            style={[
              styles.statusDot,
              {
                backgroundColor: statusColor,
              },
            ]}
          />

          <Text style={styles.statusText}>
            {translateStatus(
              character.status
            )}
          </Text>
        </View>

        <Text style={styles.species}>
          {translateSpecies(
            character.species
          )}
        </Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    width: "48%",
    backgroundColor: "#111827",
    borderRadius: 18,
    marginBottom: 18,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#1f2937",
  },

  characterImage: {
    width: "100%",
    aspectRatio: 1,
    backgroundColor: "#172033",
  },

  cardContent: {
    padding: 12,
  },

  characterName: {
    color: "#ffffff",
    fontWeight: "800",
    fontSize: 15,
  },

  statusContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
  },

  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },

  statusText: {
    color: "#d1d5db",
    fontSize: 12,
  },

  species: {
    color: "#6b7280",
    fontSize: 12,
    marginTop: 4,
  },
});