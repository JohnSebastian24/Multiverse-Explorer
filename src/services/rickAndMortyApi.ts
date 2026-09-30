const BASE_URL = "https://rickandmortyapi.com/api";

export interface Character {
  id: number;
  name: string;
  status: "Alive" | "Dead" | "unknown";
  species: string;
  type: string;
  gender: string;
  image: string;
  origin: {
    name: string;
    url: string;
  };
  location: {
    name: string;
    url: string;
  };
  episode: string[];
}

export interface CharacterResponse {
  info: {
    count: number;
    pages: number;
    next: string | null;
    prev: string | null;
  };
  results: Character[];
}

export async function getCharacters(
  page = 1
): Promise<CharacterResponse> {
  const response = await fetch(
    `${BASE_URL}/character?page=${page}`
  );

  if (!response.ok) {
    throw new Error("No se pudieron cargar los personajes");
  }

  return response.json();
}

export async function getCharacterById(
  id: string | number
): Promise<Character> {
  const response = await fetch(
    `${BASE_URL}/character/${id}`
  );

  if (!response.ok) {
    throw new Error("No se pudo cargar el personaje");
  }

  return response.json();
}

export async function searchCharacters(
  name: string
): Promise<Character[]> {
  const response = await fetch(
    `${BASE_URL}/character/?name=${encodeURIComponent(name)}`
  );

  if (response.status === 404) {
    return [];
  }

  if (!response.ok) {
    throw new Error("No se pudo realizar la búsqueda");
  }

  const data: CharacterResponse = await response.json();

  return data.results;
}