const BASE_URL = "https://rickandmortyapi.com/api";

/* =========================================================
   TIPOS
========================================================= */

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

  url: string;
  created: string;
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

export interface Episode {
  id: number;
  name: string;
  air_date: string;
  episode: string;
  characters: string[];
  url: string;
  created: string;
}

/* =========================================================
   FUNCIONES AUXILIARES
========================================================= */

async function wait(ms: number) {
  return new Promise((resolve) =>
    setTimeout(resolve, ms)
  );
}

/*
 * Realiza una petición y vuelve a intentarla
 * cuando hay problemas temporales de conexión.
 *
 * Cada intento tiene un límite de 8 segundos.
 */
async function fetchWithRetry(
  url: string,
  retries = 3,
  timeoutMs = 8000
): Promise<Response> {
  let lastError: unknown;

  for (
    let attempt = 0;
    attempt <= retries;
    attempt++
  ) {
    const controller =
      new AbortController();

    const timeout = setTimeout(() => {
      controller.abort();
    }, timeoutMs);

    try {
      const response = await fetch(
        url,
        {
          signal: controller.signal,
        }
      );

      if (response.ok) {
        return response;
      }

      /*
       * Un error 4xx normalmente no mejora
       * repitiendo la petición.
       *
       * Excepción: 429 puede ser temporal.
       */
      if (
        response.status >= 400 &&
        response.status < 500 &&
        response.status !== 429
      ) {
        return response;
      }

      lastError = new Error(
        `Error HTTP ${response.status}`
      );
    } catch (error) {
      lastError = error;
    } finally {
      clearTimeout(timeout);
    }

    if (attempt < retries) {
      await wait(
        500 * (attempt + 1)
      );
    }
  }

  throw lastError instanceof Error
    ? lastError
    : new Error(
      "No se pudo conectar con la API"
    );
}

/*
 * Convierte URLs como:
 *
 * https://rickandmortyapi.com/api/episode/27
 *
 * en:
 *
 * 27
 */
export function extractIdsFromUrls(
  urls: string[]
): number[] {
  return urls
    .map((url) => {
      const parts = url.split("/");

      return Number(
        parts[parts.length - 1]
      );
    })
    .filter(
      (id) => !Number.isNaN(id)
    );
}

/* =========================================================
   PERSONAJES
========================================================= */

export async function getCharacters(
  page = 1,
  status?: string
): Promise<CharacterResponse> {
  let url =
    `${BASE_URL}/character?page=${page}`;

  if (status) {
    url += `&status=${status}`;
  }

  const response =
    await fetchWithRetry(url);

  if (!response.ok) {
    throw new Error(
      "No se pudieron cargar los personajes"
    );
  }

  return response.json();
}

export async function getCharacterById(
  id: string | number
): Promise<Character> {
  const response =
    await fetchWithRetry(
      `${BASE_URL}/character/${id}`
    );

  if (!response.ok) {
    throw new Error(
      "No se pudo cargar el personaje"
    );
  }

  return response.json();
}

export async function searchCharacters(
  name: string
): Promise<Character[]> {
  const response =
    await fetchWithRetry(
      `${BASE_URL}/character/?name=${encodeURIComponent(
        name
      )}`
    );

  /*
   * Para búsquedas sin resultados,
   * la API responde 404.
   *
   * Nosotros lo convertimos en
   * una lista vacía.
   */
  if (response.status === 404) {
    return [];
  }

  if (!response.ok) {
    throw new Error(
      "No se pudo realizar la búsqueda"
    );
  }

  const data: CharacterResponse =
    await response.json();

  return data.results;
}

/*
 * Obtiene varios personajes.
 *
 * Se divide en grupos para evitar URLs
 * demasiado largas y demasiada carga.
 */
export async function getCharactersByIds(
  ids: number[]
): Promise<Character[]> {
  if (ids.length === 0) {
    return [];
  }

  const BATCH_SIZE = 20;

  const characters: Character[] = [];

  for (
    let i = 0;
    i < ids.length;
    i += BATCH_SIZE
  ) {
    const batch = ids.slice(
      i,
      i + BATCH_SIZE
    );

    const idsString =
      batch.join(",");

    const response =
      await fetchWithRetry(
        `${BASE_URL}/character/${idsString}`
      );

    if (!response.ok) {
      throw new Error(
        "No se pudieron cargar los personajes"
      );
    }

    const data =
      await response.json();

    const batchCharacters:
      Character[] =
      Array.isArray(data)
        ? data
        : [data];

    characters.push(
      ...batchCharacters
    );
  }

  return characters;
}

/* =========================================================
   EPISODIOS
========================================================= */

export async function getEpisodeById(
  id: string | number
): Promise<Episode> {
  const response =
    await fetchWithRetry(
      `${BASE_URL}/episode/${id}`
    );

  if (!response.ok) {
    throw new Error(
      "No se pudo cargar el episodio"
    );
  }

  return response.json();
}

/*
 * Obtiene varios episodios.
 *
 * Rick tiene más de 50 apariciones,
 * así que no enviamos todos los IDs
 * en una sola URL.
 */
export async function getEpisodesByIds(
  ids: number[]
): Promise<Episode[]> {
  if (ids.length === 0) {
    return [];
  }

  const BATCH_SIZE = 20;

  const episodes: Episode[] = [];

  for (
    let i = 0;
    i < ids.length;
    i += BATCH_SIZE
  ) {
    const batch = ids.slice(
      i,
      i + BATCH_SIZE
    );

    const idsString =
      batch.join(",");

    const response =
      await fetchWithRetry(
        `${BASE_URL}/episode/${idsString}`
      );

    if (!response.ok) {
      throw new Error(
        "No se pudieron cargar los episodios"
      );
    }

    const data =
      await response.json();

    const batchEpisodes:
      Episode[] =
      Array.isArray(data)
        ? data
        : [data];

    episodes.push(
      ...batchEpisodes
    );
  }

  return episodes;
}