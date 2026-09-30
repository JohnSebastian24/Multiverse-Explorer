import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from "react-native";

import {
  Character,
  getCharacters,
} from "../../services/rickAndMortyApi";

import { Href, useRouter } from "expo-router";

export default function HomeScreen() {
  const [characters, setCharacters] = useState<Character[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const router = useRouter();

  async function loadCharacters() {
    try {
      setLoading(true);
      setError(false);

      const data = await getCharacters();

      setCharacters(data.results);
    } catch (err) {
      console.error(err);
      setError(true);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadCharacters();
  }, []);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator
          size="large"
          color="#97ce4c"
        />

        <Text style={styles.loadingText}>
          Abriendo portal...
        </Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorIcon}>🛸</Text>

        <Text style={styles.errorTitle}>
          No pudimos conectar con esta dimensión
        </Text>

        <Text style={styles.errorText}>
          Revisa tu conexión a internet e inténtalo nuevamente.
        </Text>

        <Pressable
          style={styles.retryButton}
          onPress={loadCharacters}
        >
          <Text style={styles.retryButtonText}>
            Intentar nuevamente
          </Text>
        </Pressable>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={characters}
        keyExtractor={(item) => item.id.toString()}
        numColumns={2}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <View style={styles.header}>
            <Text style={styles.badge}>
              MULTIVERSE DATABASE
            </Text>

            <Text style={styles.title}>
              Rick & Morty
            </Text>

            <Text style={styles.subtitle}>
              Explorer
            </Text>

            <Text style={styles.description}>
              Explora personajes de todas las dimensiones.
            </Text>
          </View>
        }
        renderItem={({ item }) => (
         <Pressable
  style={styles.card}
  onPress={() =>
    router.push(`/character/${item.id}` as Href)
  }
>
            <Image
              source={{ uri: item.image }}
              style={styles.characterImage}
            />

            <View style={styles.cardContent}>
              <Text
                style={styles.characterName}
                numberOfLines={1}
              >
                {item.name}
              </Text>

              <View style={styles.statusContainer}>
                <View
                  style={[
                    styles.statusDot,
                    {
                      backgroundColor:
                        item.status === "Alive"
                          ? "#97ce4c"
                          : item.status === "Dead"
                          ? "#ef4444"
                          : "#9ca3af",
                    },
                  ]}
                />

                <Text style={styles.statusText}>
                  {item.status}
                </Text>
              </View>

              <Text style={styles.species}>
                {item.species}
              </Text>
            </View>
          </Pressable>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#090e17",
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
    fontSize: 16,
    fontWeight: "600",
  },

  errorIcon: {
    fontSize: 60,
    marginBottom: 20,
  },

  errorTitle: {
    color: "#ffffff",
    fontSize: 24,
    fontWeight: "800",
    textAlign: "center",
  },

  errorText: {
    color: "#9ca3af",
    fontSize: 15,
    textAlign: "center",
    marginTop: 12,
    lineHeight: 22,
  },

  retryButton: {
    marginTop: 25,
    backgroundColor: "#97ce4c",
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 14,
  },

  retryButtonText: {
    color: "#090e17",
    fontWeight: "800",
  },

  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 30,
  },

  header: {
    paddingTop: 35,
    paddingBottom: 24,
  },

  badge: {
    color: "#97ce4c",
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 2,
    marginBottom: 8,
  },

  title: {
    color: "#ffffff",
    fontSize: 38,
    fontWeight: "900",
  },

  subtitle: {
    color: "#00b5cc",
    fontSize: 38,
    fontWeight: "900",
    marginTop: -5,
  },

  description: {
    color: "#9ca3af",
    marginTop: 12,
    fontSize: 15,
  },

  row: {
    justifyContent: "space-between",
  },

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