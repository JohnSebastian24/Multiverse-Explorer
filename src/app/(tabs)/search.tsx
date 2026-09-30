import { Ionicons } from "@expo/vector-icons";
import { Href, useRouter } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  Keyboard,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

import {
  Character,
  searchCharacters,
} from "../../services/rickAndMortyApi";

export default function SearchScreen() {
  const router = useRouter();

  const [query, setQuery] = useState("");
  const [results, setResults] =
    useState<Character[]>([]);

  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [error, setError] = useState(false);

  async function handleSearch() {
    const text = query.trim();

    if (!text) {
      return;
    }

    try {
      Keyboard.dismiss();

      setLoading(true);
      setError(false);
      setSearched(true);

      const data = await searchCharacters(text);

      setResults(data);
    } catch (err) {
      console.error(err);

      setResults([]);
      setError(true);
    } finally {
      setLoading(false);
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.badge}>
          INTERDIMENSIONAL SEARCH
        </Text>

        <Text style={styles.title}>
          Buscar
        </Text>

        <Text style={styles.subtitle}>
          Encuentra personajes en cualquier dimensión.
        </Text>

        <View style={styles.searchContainer}>
          <Ionicons
            name="search"
            size={20}
            color="#6b7280"
          />

          <TextInput
            style={styles.input}
            placeholder="Ej. Rick, Morty, Summer..."
            placeholderTextColor="#6b7280"
            value={query}
            onChangeText={setQuery}
            onSubmitEditing={handleSearch}
            returnKeyType="search"
          />

          {query.length > 0 && (
            <Pressable
              onPress={() => {
                setQuery("");
                setResults([]);
                setSearched(false);
              }}
            >
              <Ionicons
                name="close-circle"
                size={20}
                color="#6b7280"
              />
            </Pressable>
          )}
        </View>

        <Pressable
          style={styles.searchButton}
          onPress={handleSearch}
        >
          <Text style={styles.searchButtonText}>
            Buscar personaje
          </Text>
        </Pressable>
      </View>

      {loading && (
        <View style={styles.center}>
          <ActivityIndicator
            size="large"
            color="#97ce4c"
          />

          <Text style={styles.loadingText}>
            Buscando en el multiverso...
          </Text>
        </View>
      )}

      {!loading && error && (
        <View style={styles.center}>
          <Text style={styles.emptyIcon}>🛸</Text>

          <Text style={styles.emptyTitle}>
            No pudimos conectar con esta dimensión
          </Text>
        </View>
      )}

      {!loading &&
        !error &&
        searched &&
        results.length === 0 && (
          <View style={styles.center}>
            <Text style={styles.emptyIcon}>🌀</Text>

            <Text style={styles.emptyTitle}>
              Nadie respondió al portal
            </Text>

            <Text style={styles.emptyText}>
              No encontramos personajes con ese nombre.
            </Text>
          </View>
        )}

      {!loading && results.length > 0 && (
        <FlatList
          data={results}
          keyExtractor={(item) =>
            item.id.toString()
          }
          contentContainerStyle={styles.results}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (

            <Pressable
  style={styles.resultCard}
  onPress={() =>
    router.push(`/character/${item.id}` as Href)
  }
>
              <Image
                source={{ uri: item.image }}
                style={styles.image}
              />

              <View style={styles.resultInfo}>
                <Text
                  style={styles.characterName}
                  numberOfLines={1}
                >
                  {item.name}
                </Text>

                <View style={styles.statusRow}>
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

              <Ionicons
                name="chevron-forward"
                size={22}
                color="#6b7280"
              />
            </Pressable>
          )}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#090e17",
  },

  header: {
    paddingHorizontal: 20,
    paddingTop: 35,
    paddingBottom: 15,
  },

  badge: {
    color: "#97ce4c",
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 2,
  },

  title: {
    color: "#ffffff",
    fontSize: 36,
    fontWeight: "900",
    marginTop: 8,
  },

  subtitle: {
    color: "#9ca3af",
    fontSize: 15,
    marginTop: 5,
  },

  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#111827",
    borderWidth: 1,
    borderColor: "#1f2937",
    borderRadius: 16,
    paddingHorizontal: 15,
    marginTop: 25,
    height: 54,
  },

  input: {
    flex: 1,
    color: "#ffffff",
    fontSize: 15,
    marginHorizontal: 10,
  },

  searchButton: {
    height: 50,
    borderRadius: 15,
    backgroundColor: "#97ce4c",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 12,
  },

  searchButtonText: {
    color: "#090e17",
    fontWeight: "800",
    fontSize: 15,
  },

  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 30,
  },

  loadingText: {
    color: "#d1d5db",
    marginTop: 15,
  },

  emptyIcon: {
    fontSize: 55,
  },

  emptyTitle: {
    color: "#ffffff",
    fontSize: 21,
    fontWeight: "800",
    textAlign: "center",
    marginTop: 15,
  },

  emptyText: {
    color: "#9ca3af",
    textAlign: "center",
    marginTop: 8,
  },

  results: {
    paddingHorizontal: 20,
    paddingBottom: 30,
  },

  resultCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#111827",
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "#1f2937",
    padding: 10,
    marginBottom: 12,
  },

  image: {
    width: 82,
    height: 82,
    borderRadius: 14,
  },

  resultInfo: {
    flex: 1,
    marginLeft: 14,
  },

  characterName: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "800",
  },

  statusRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 7,
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