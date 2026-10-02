import { Ionicons } from "@expo/vector-icons";
import { Href, useLocalSearchParams, useRouter, } from "expo-router";
import { checkIsFavorite, toggleFavorite } from "../../services/favoritesStorage";
import { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Character, getCharacterById, } from "../../services/rickAndMortyApi";
import { appColors } from "../../constants/theme";
import TopNavigationButtons from "../../components/TopNavigationButtons";
import {
  ActivityIndicator,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import {
  translateGender,
  translateSpecies,
  translateStatus,
  translateUnknown,
} from "../../utils/translations";



export default function CharacterDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();

  const [character, setCharacter] =
    useState<Character | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [favorite, setFavorite] =
    useState(false);

  async function loadCharacter() {
    try {
      setLoading(true);
      setError(false);

      const data = await getCharacterById(id);

      setCharacter(data);

      const savedAsFavorite =
        await checkIsFavorite(data.id);

      setFavorite(savedAsFavorite);
    } catch (err) {
      console.error(err);
      setError(true);
    } finally {
      setLoading(false);
    }
  }

  async function handleFavorite() {
    if (!character) {
      return;
    }

    try {
      const newFavoriteState =
        await toggleFavorite(character);

      setFavorite(newFavoriteState);
    } catch (error) {
      console.log(
        "No se pudo actualizar favoritos:",
        error
      );
    }
  }

  useEffect(() => {
    if (id) {
      loadCharacter();
    }
  }, [id]);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator
          size="large"
          color={appColors.primary}
        />

        <Text style={styles.loadingText}>
          Viajando entre dimensiones...
        </Text>
      </View>
    );
  }

  if (error || !character) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorIcon}>🛸</Text>

        <Text style={styles.errorTitle}>
          Esta dimensión parece no existir
        </Text>

        <Pressable
          style={styles.retryButton}
          onPress={loadCharacter}
        >
          <Text style={styles.retryText}>
            Intentar nuevamente
          </Text>
        </Pressable>

        <Pressable
          style={styles.backErrorButton}
          onPress={handleBack}
        >
          <Text style={styles.backErrorText}>
            Volver
          </Text>
        </Pressable>
      </View>
    );
  }

  const statusColor =
    character.status === "Alive"
      ? appColors.primary
      : character.status === "Dead"
        ? appColors.danger
        : appColors.textMuted;

  function handleBack() {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace("/");
    }
  }
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: character.image }}
            style={styles.image}
          />

        </View>

        <View style={styles.content}>
          <View style={styles.statusRow}>
            <View
              style={[
                styles.statusDot,
                { backgroundColor: statusColor },
              ]}
            />

            <Text style={styles.status}>
              {translateStatus(character.status)}
            </Text>
          </View>

          <Text style={styles.name}>
            {character.name}
          </Text>

          <Text style={styles.species}>
            {translateSpecies(character.species)}
          </Text>

          <View style={styles.infoCard}>
            <InfoRow
              icon="person-outline"
              label="Género"
              value={translateGender(character.gender)}
            />

            <InfoRow
              icon="planet-outline"
              label="Origen"
              value={translateUnknown(character.origin.name)}
            />

            <InfoRow
              icon="location-outline"
              label="Ubicación"
              value={translateUnknown(character.location.name)}
            />

            <InfoRow
              icon="flask-outline"
              label="Tipo"
              value={character.type || "Sin especificar"}
            />

            <InfoRow
              icon="tv-outline"
              label="Episodios"
              value={`${character.episode.length} apariciones`}
              last
              onPress={() =>
                router.push(
                  `/episodes/${character.id}` as Href
                )
              }
            />
          </View>

          <Pressable
            style={[
              styles.favoriteButton,
              favorite &&
              styles.favoriteButtonActive,
            ]}
            onPress={handleFavorite}
          >
            <Ionicons
              name={
                favorite
                  ? "heart"
                  : "heart-outline"
              }
              size={22}
              color={
                favorite
                  ? appColors.text
                  : appColors.primary
              }
            />

            <Text
              style={[
                styles.favoriteButtonText,
                favorite &&
                styles.favoriteButtonTextActive,
              ]}
            >
              {favorite
                ? "Quitar de favoritos"
                : "Agregar a favoritos"}
            </Text>
          </Pressable>
        </View>
      </ScrollView>

      <TopNavigationButtons
        onBack={handleBack}
        onHome={() =>
          router.replace("/")
        }
      />
    </SafeAreaView>
  );
}

interface InfoRowProps {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value: string;
  last?: boolean;
  onPress?: () => void;
}

function InfoRow({
  icon,
  label,
  value,
  last = false,
  onPress,
}: InfoRowProps) {
  return (
    <Pressable
      onPress={onPress}
      disabled={!onPress}
      style={({ pressed }) => [
        styles.infoRow,
        last && styles.lastInfoRow,
        onPress &&
        pressed &&
        styles.infoRowPressed,
      ]}
    >
      <View style={styles.infoIcon}>
        <Ionicons
          name={icon}
          size={20}
          color={appColors.secondary}
        />
      </View>

      <View style={styles.infoText}>
        <Text style={styles.infoLabel}>
          {label}
        </Text>

        <Text style={styles.infoValue}>
          {value}
        </Text>
      </View>

      {onPress && (
        <Ionicons
          name="chevron-forward"
          size={22}
          color={appColors.textDisabled}
        />
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: appColors.background,
  },

  scrollContent: {
    paddingBottom: 40,
  },

  center: {
    flex: 1,
    backgroundColor: appColors.background,
    justifyContent: "center",
    alignItems: "center",
    padding: 30,
  },

  loadingText: {
    color: appColors.text,
    marginTop: 16,
    fontWeight: "600",
  },

  errorIcon: {
    fontSize: 60,
  },

  errorTitle: {
    color: appColors.text,
    fontSize: 22,
    fontWeight: "800",
    textAlign: "center",
    marginTop: 16,
  },

  retryButton: {
    backgroundColor: appColors.primary,
    paddingHorizontal: 25,
    paddingVertical: 14,
    borderRadius: 14,
    marginTop: 25,
  },

  retryText: {
    color: appColors.textDark,
    fontWeight: "800",
  },

  backErrorButton: {
    marginTop: 15,
  },

  backErrorText: {
    color: appColors.textMuted,
  },

  imageContainer: {
    position: "relative",
  },

  image: {
    width: "100%",
    aspectRatio: 1,
    backgroundColor: appColors.surfaceLight,
  },

  content: {
    padding: 22,
  },

  statusRow: {
    flexDirection: "row",
    alignItems: "center",
  },

  statusDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 8,
  },

  status: {
    color: appColors.textSoft,
    fontWeight: "700",
    textTransform: "uppercase",
    fontSize: 12,
    letterSpacing: 1,
  },

  name: {
    color: appColors.text,
    fontSize: 34,
    fontWeight: "900",
    marginTop: 10,
  },

  species: {
    color: appColors.secondary,
    fontSize: 17,
    fontWeight: "600",
    marginTop: 3,
  },

  infoCard: {
    backgroundColor: appColors.surface,
    borderRadius: 20,
    marginTop: 28,
    paddingHorizontal: 18,
    borderWidth: 1,
    borderColor: appColors.border,
  },

  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 17,
    borderBottomWidth: 1,
    borderBottomColor: appColors.border,
  },

  lastInfoRow: {
    borderBottomWidth: 0,
  },

  infoIcon: {
    width: 42,
    height: 42,
    borderRadius: 14,
    backgroundColor: appColors.surfaceLight,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 14,
  },

  infoText: {
    flex: 1,
  },

  infoRowPressed: {
    opacity: 0.65,
  },

  infoLabel: {
    color: appColors.textDisabled,
    fontSize: 12,
    fontWeight: "600",
  },

  infoValue: {
    color: appColors.text,
    fontSize: 15,
    fontWeight: "700",
    marginTop: 3,
  },

  favoriteButton: {
    marginTop: 22,
    height: 54,
    borderRadius: 17,
    borderWidth: 1,
    borderColor: appColors.primary,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 9,
  },

  favoriteButtonActive: {
    backgroundColor: appColors.danger,
    borderColor: appColors.danger,
  },

  favoriteButtonText: {
    color: appColors.primary,
    fontSize: 15,
    fontWeight: "800",
  },

  favoriteButtonTextActive: {
    color: appColors.text,
  },
});