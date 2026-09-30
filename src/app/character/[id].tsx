import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

import {
  Character,
  getCharacterById,
} from "../../services/rickAndMortyApi";

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

  async function loadCharacter() {
    try {
      setLoading(true);
      setError(false);

      const data = await getCharacterById(id);

      setCharacter(data);
    } catch (err) {
      console.error(err);
      setError(true);
    } finally {
      setLoading(false);
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
          color="#97ce4c"
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
          onPress={() => router.back()}
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
      ? "#97ce4c"
      : character.status === "Dead"
      ? "#ef4444"
      : "#9ca3af";

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

          <Pressable
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Ionicons
              name="arrow-back"
              size={24}
              color="#ffffff"
            />
          </Pressable>
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
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

interface InfoRowProps {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value: string;
  last?: boolean;
}

function InfoRow({
  icon,
  label,
  value,
  last = false,
}: InfoRowProps) {
  return (
    <View
      style={[
        styles.infoRow,
        last && styles.lastInfoRow,
      ]}
    >
      <View style={styles.infoIcon}>
        <Ionicons
          name={icon}
          size={20}
          color="#00b5cc"
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#090e17",
  },

  scrollContent: {
    paddingBottom: 40,
  },

  center: {
    flex: 1,
    backgroundColor: "#090e17",
    justifyContent: "center",
    alignItems: "center",
    padding: 30,
  },

  loadingText: {
    color: "#ffffff",
    marginTop: 16,
    fontWeight: "600",
  },

  errorIcon: {
    fontSize: 60,
  },

  errorTitle: {
    color: "#ffffff",
    fontSize: 22,
    fontWeight: "800",
    textAlign: "center",
    marginTop: 16,
  },

  retryButton: {
    backgroundColor: "#97ce4c",
    paddingHorizontal: 25,
    paddingVertical: 14,
    borderRadius: 14,
    marginTop: 25,
  },

  retryText: {
    color: "#090e17",
    fontWeight: "800",
  },

  backErrorButton: {
    marginTop: 15,
  },

  backErrorText: {
    color: "#9ca3af",
  },

  imageContainer: {
    position: "relative",
  },

  image: {
    width: "100%",
    aspectRatio: 1,
  },

  backButton: {
    position: "absolute",
    top: 20,
    left: 20,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(9,14,23,0.8)",
    justifyContent: "center",
    alignItems: "center",
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
    color: "#d1d5db",
    fontWeight: "700",
    textTransform: "uppercase",
    fontSize: 12,
    letterSpacing: 1,
  },

  name: {
    color: "#ffffff",
    fontSize: 34,
    fontWeight: "900",
    marginTop: 10,
  },

  species: {
    color: "#00b5cc",
    fontSize: 17,
    fontWeight: "600",
    marginTop: 3,
  },

  infoCard: {
    backgroundColor: "#111827",
    borderRadius: 20,
    marginTop: 28,
    paddingHorizontal: 18,
    borderWidth: 1,
    borderColor: "#1f2937",
  },

  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 17,
    borderBottomWidth: 1,
    borderBottomColor: "#1f2937",
  },

  lastInfoRow: {
    borderBottomWidth: 0,
  },

  infoIcon: {
    width: 42,
    height: 42,
    borderRadius: 14,
    backgroundColor: "#172033",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 14,
  },

  infoText: {
    flex: 1,
  },

  infoLabel: {
    color: "#6b7280",
    fontSize: 12,
    fontWeight: "600",
  },

  infoValue: {
    color: "#f3f4f6",
    fontSize: 15,
    fontWeight: "700",
    marginTop: 3,
  },
});