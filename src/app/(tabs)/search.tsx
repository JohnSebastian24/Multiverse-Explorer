import { Ionicons } from "@expo/vector-icons";
import { Href, useRouter } from "expo-router";
import { useState } from "react";
import { appColors } from "../../constants/theme";
import {
  ActivityIndicator,
  FlatList,
  Image,
  Keyboard,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  Character,
  searchCharacters,
} from "../../services/rickAndMortyApi";

import {
  translateSpecies,
  translateStatus,
} from "../../utils/translations";

import { resolveCharacterSearch,} from "../../utils/searchAliases";

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

    const apiSearch =
      resolveCharacterSearch(text);

    const data =
      await searchCharacters(apiSearch);

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
          BUSQUEDA INTERDIMENSIONAL
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
            color={appColors.textDisabled}
          />

          <TextInput
            style={styles.input}
            placeholder="Ej. Rick, Morty, Summer..."
            placeholderTextColor={appColors.textDisabled}
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
                color={appColors.textDisabled}
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
            color={appColors.primary}
          />

          <Text style={styles.loadingText}>
            Buscando en el multiverso...
          </Text>
        </View>
      )}

      {!loading && error && (
  <View style={styles.center}>
    <Text style={styles.emptyIcon}>
      🛸
    </Text>

    <Text style={styles.emptyTitle}>
      No pudimos conectar con esta dimensión
    </Text>

    <Text style={styles.emptyText}>
      Revisa tu conexión e intenta nuevamente.
    </Text>

    <Pressable
      style={styles.retryButton}
      onPress={handleSearch}
    >
      <Ionicons
        name="refresh"
        size={18}
        color={appColors.textDark}
      />

      <Text style={styles.retryButtonText}>
        Reintentar
      </Text>
    </Pressable>
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
                            ? appColors.primary
                            : item.status === "Dead"
                              ? appColors.danger
                              : appColors.textMuted,
                      },
                    ]}
                  />

                  <Text style={styles.statusText}>
                    {translateStatus(item.status)}
                  </Text>
                </View>

                <Text style={styles.species}>
                  {translateSpecies(item.species)}
                </Text>
              </View>

              <Ionicons
                name="chevron-forward"
                size={22}
                color={appColors.textDisabled}
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
    backgroundColor: appColors.background,
  },

  header: {
  width: "100%",
  maxWidth: 760,
  alignSelf: "center",

  paddingHorizontal: 20,
  paddingTop: 35,
  paddingBottom: 15,
},

  badge: {
    color: appColors.primary,
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 2,
  },

  title: {
    color: appColors.text,
    fontSize: 36,
    fontWeight: "900",
    marginTop: 8,
  },

  subtitle: {
    color: appColors.textMuted,
    fontSize: 15,
    marginTop: 5,
  },

  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: appColors.surface,
    borderWidth: 1,
    borderColor: appColors.border,
    borderRadius: 16,
    paddingHorizontal: 15,
    marginTop: 25,
    height: 54,
  },

  input: {
    flex: 1,
    color: appColors.text,
    fontSize: 15,
    marginHorizontal: 10,
  },

  searchButton: {
    height: 50,
    borderRadius: 15,
    backgroundColor: appColors.primary,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 12,
  },

  searchButtonText: {
    color: appColors.textDark,
    fontWeight: "800",
    fontSize: 15,
  },

retryButton: {
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "center",

  gap: 7,

  backgroundColor: appColors.primary,

  paddingHorizontal: 20,
  paddingVertical: 12,

  borderRadius: 14,

  marginTop: 20,
},

retryButtonText: {
  color: appColors.textDark,
  fontSize: 14,
  fontWeight: "800",
},

  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 30,
  },

  loadingText: {
    color: appColors.textSoft,
    marginTop: 15,
  },

  emptyIcon: {
    fontSize: 55,
  },

  emptyTitle: {
    color: appColors.text,
    fontSize: 21,
    fontWeight: "800",
    textAlign: "center",
    marginTop: 15,
  },

  emptyText: {
    color: appColors.textMuted,
    textAlign: "center",
    marginTop: 8,
  },

  results: {
  width: "100%",
  maxWidth: 760,
  alignSelf: "center",

  paddingHorizontal: 20,
  paddingBottom: 30,
},

  resultCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: appColors.surface,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: appColors.border,
    padding: 10,
    marginBottom: 12,
  },

  image: {
    width: 82,
    height: 82,
    borderRadius: 14,
    backgroundColor: appColors.surfaceLight,
  },

  resultInfo: {
    flex: 1,
    marginLeft: 14,
  },

  characterName: {
    color: appColors.text,
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
    color: appColors.textSoft,
    fontSize: 12,
  },

  species: {
    color: appColors.textDisabled,
    fontSize: 12,
    marginTop: 4,
  },
});