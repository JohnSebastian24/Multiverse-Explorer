import { Ionicons } from "@expo/vector-icons";
import { Href, useFocusEffect, useRouter, } from "expo-router";
import { useCallback, useState } from "react";
import { appColors } from "../../constants/theme";
import {
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { Image } from "expo-image";
import { SafeAreaView } from "react-native-safe-area-context";
import { Character } from "../../services/rickAndMortyApi";
import { getFavorites } from "../../services/favoritesStorage";
import { translateSpecies, translateStatus, } from "../../utils/translations";

export default function FavoritesScreen() {
  const router = useRouter();

  const [favorites, setFavorites] =
    useState<Character[]>([]);

  useFocusEffect(
    useCallback(() => {
      async function loadFavorites() {
        const savedFavorites =
          await getFavorites();

        setFavorites(savedFavorites);
      }

      loadFavorites();
    }, [])
  );

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={favorites}
        keyExtractor={(item) =>
          item.id.toString()
        }
        contentContainerStyle={[
          styles.content,
          favorites.length === 0 &&
          styles.emptyContent,
        ]}
        ListHeaderComponent={
          favorites.length > 0 ? (
            <View style={styles.header}>
              <Text style={styles.badge}>
                PERSONAJES GUARDADOS
              </Text>

              <Text style={styles.title}>
                Favoritos
              </Text>

              <Text
                style={styles.subtitle}
              >
                Tu colección personal del multiverso.
              </Text>
            </View>
          ) : null
        }
        ListEmptyComponent={
          <View style={styles.empty}>
            <View
              style={styles.emptyIcon}
            >
              <Ionicons
                name="heart-outline"
                size={48}
                color={appColors.primary}
              />
            </View>

            <Text
              style={styles.emptyTitle}
            >
              Aún no tienes favoritos
            </Text>

            <Text
              style={styles.emptyText}
            >
              Explora el multiverso y guarda los personajes que más te gusten.
            </Text>
          </View>
        }
        renderItem={({ item }) => (
          <Pressable
            style={({ pressed }) => [
              styles.card,
              pressed && styles.cardPressed,
            ]}
            onPress={() =>
              router.push(
                `/character/${item.id}` as Href
              )
            }
          >
            <Image
              source={item.image}
              style={styles.image}
              contentFit="cover"
              cachePolicy="memory-disk"
              transition={200}
            />

            <View
              style={styles.info}
            >
              <Text
                style={styles.name}
                numberOfLines={1}
              >
                {item.name}
              </Text>

              <View
                style={
                  styles.statusRow
                }
              >
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

                <Text
                  style={
                    styles.status
                  }
                >
                  {translateStatus(
                    item.status
                  )}
                </Text>
              </View>

              <Text
                style={styles.species}
              >
                {translateSpecies(
                  item.species
                )}
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
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: appColors.background,
  },

  content: {
    width: "100%",
    maxWidth: 760,
    alignSelf: "center",

    paddingHorizontal: 20,
    paddingBottom: 100,
  },

  emptyContent: {
    width: "100%",
    maxWidth: 760,
    alignSelf: "center",

    flexGrow: 1,

    // conserva aquí tus demás estilos
  },

  header: {
    paddingTop: 30,
    paddingBottom: 25,
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
    marginTop: 6,
  },

  card: {
    flexDirection: "row",
    alignItems: "center",

    backgroundColor: appColors.surface,

    borderRadius: 18,

    borderWidth: 1,
    borderColor: appColors.border,

    padding: 10,
    marginBottom: 12,
  },

  cardPressed: {
  opacity: 0.82,

  transform: [
    {
      scale: 0.99,
    },
  ],
},

  image: {
    width: 82,
    height: 82,
    borderRadius: 14,
    backgroundColor: appColors.surfaceLight,
  },

  info: {
    flex: 1,
    marginLeft: 14,
  },

  name: {
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

  status: {
    color: appColors.textSoft,
    fontSize: 12,
  },

  species: {
    color: appColors.textDisabled,
    fontSize: 12,
    marginTop: 4,
  },

  empty: {
    alignItems: "center",
    paddingHorizontal: 30,
  },

  emptyIcon: {
    width: 90,
    height: 90,
    borderRadius: 45,

    backgroundColor: appColors.surface,

    justifyContent: "center",
    alignItems: "center",

    borderWidth: 1,
    borderColor: appColors.border,
  },

  emptyTitle: {
    color: appColors.text,
    fontSize: 22,
    fontWeight: "800",
    marginTop: 22,
    textAlign: "center",
  },

  emptyText: {
    color: appColors.textMuted,
    fontSize: 14,
    lineHeight: 21,
    marginTop: 10,
    textAlign: "center",
  },
});