import AsyncStorage from "@react-native-async-storage/async-storage";

import { Character } from "./rickAndMortyApi";

const FAVORITES_KEY = "@rick_morty_favorites";

export async function getFavorites(): Promise<Character[]> {
  try {
    const storedFavorites =
      await AsyncStorage.getItem(FAVORITES_KEY);

    if (!storedFavorites) {
      return [];
    }

    return JSON.parse(storedFavorites);
  } catch (error) {
    console.log(
      "No se pudieron cargar los favoritos:",
      error
    );

    return [];
  }
}

export async function checkIsFavorite(
  characterId: number
): Promise<boolean> {
  const favorites = await getFavorites();

  return favorites.some(
    (character) =>
      character.id === characterId
  );
}

export async function toggleFavorite(
  character: Character
): Promise<boolean> {
  const favorites = await getFavorites();

  const alreadyFavorite =
    favorites.some(
      (item) =>
        item.id === character.id
    );

  let updatedFavorites: Character[];

  if (alreadyFavorite) {
    updatedFavorites =
      favorites.filter(
        (item) =>
          item.id !== character.id
      );
  } else {
    updatedFavorites = [
      character,
      ...favorites,
    ];
  }

  await AsyncStorage.setItem(
    FAVORITES_KEY,
    JSON.stringify(updatedFavorites)
  );

  return !alreadyFavorite;
}