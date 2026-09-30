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
  page = 1,
  status?: string
): Promise<CharacterResponse> {
  let url = `${BASE_URL}/character?page=${page}`;

  if (status) {
    url += `&status=${status}`;
  }

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error("No se pudieron cargar los personajes");
  }

  return response.json();
}

async function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function fetchWithRetry(
  url: string,
  retries = 3
): Promise<Response> {
  let lastError: unknown;

  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const response = await fetchWithRetry(url);

      if (response.ok) {
        return response;
      }

      // Errores 4xx normales no tiene sentido repetirlos,
      // excepto 429 (demasiadas solicitudes).
      if (
        response.status >= 400 &&
        response.status < 500 &&
        response.status !== 429
      ) {
        throw new Error(
          `Error HTTP ${response.status}`
        );
      }

      lastError = new Error(
        `Error HTTP ${response.status}`
      );
    } catch (error) {
      lastError = error;
    }

    if (attempt < retries) {
      // Esperamos un poco más en cada intento.
      await wait(500 * (attempt + 1));
    }
  }

  throw lastError instanceof Error
    ? lastError
    : new Error(
        "No se pudo conectar con la API"
      );
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