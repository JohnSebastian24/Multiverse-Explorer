import {Pressable,StyleSheet,Text,View,} from "react-native";
import { Image } from "expo-image";
import { Character } from "../services/rickAndMortyApi";
import { translateSpecies,translateStatus,} from "../utils/translations";
import { appColors } from "../constants/theme";

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
    ? appColors.primary
    : character.status === "Dead"
    ? appColors.danger
    : appColors.textMuted;

  return (
    <Pressable
  onPress={onPress}
  style={({ pressed }) => [
    styles.card,
    pressed && styles.cardPressed,
  ]}
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
    backgroundColor: appColors.surface,
    borderRadius: 18,
    marginBottom: 18,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: appColors.border,
  },

  characterImage: {
    width: "100%",
    aspectRatio: 1,
    backgroundColor: appColors.surfaceLight,
  },

  cardPressed: {
  opacity: 0.82,
  transform: [
    {
      scale: 0.98,
    },
  ],
},

  cardContent: {
    padding: 12,
  },

  characterName: {
    color: appColors.text,
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
    color: appColors.textSoft,
    fontSize: 12,
  },

  species: {
    color: appColors.textDisabled,
    fontSize: 12,
    marginTop: 4,
  },
});