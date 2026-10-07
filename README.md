# 🌌 Multiverse Explorer

Aplicación multiplataforma desarrollada con **React Native, Expo y TypeScript** que consume la API pública de Rick and Morty para explorar personajes y episodios del multiverso.

El proyecto fue desarrollado con fines académicos, aplicando consumo de API REST, navegación, persistencia local, manejo de errores y diseño responsive.

## ✨ Características

- Exploración de personajes.
- Scroll infinito y paginación.
- Filtros por estado.
- Búsqueda por nombre.
- Búsqueda asistida con algunos alias en español.
- Detalle completo de personajes.
- Favoritos persistentes mediante AsyncStorage.
- Episodios asociados a cada personaje.
- Detalle de episodios.
- Personajes participantes en cada episodio.
- Navegación entre personajes y episodios.
- Manejo de errores y reintentos.
- Caché de imágenes.
- Interfaz adaptada para móvil y web.
- Pantalla Acerca de e información del proyecto.

## 🛠️ Tecnologías

- React Native
- Expo
- Expo Router
- TypeScript
- AsyncStorage
- Expo Image
- Git y GitHub
- Postman
- The Rick and Morty API

## 🌐 API REST

La aplicación consume:

```text
https://rickandmortyapi.com/api
```

Entre las peticiones utilizadas se encuentran:

```http
GET /character
GET /character/1
GET /character?status=alive
GET /character?name=rick

GET /episode
GET /episode/1
GET /episode/1,2,3
```

La aplicación utiliza la API como fuente de consulta mediante peticiones HTTP `GET`.

## 🔎 Búsqueda asistida

La API almacena los nombres de los personajes en su idioma original.

Multiverse Explorer añade una pequeña capa de búsqueda asistida para reconocer algunos términos comunes en español.

Por ejemplo:

```text
Señor pantalones de popó
        ↓
Mr. Poopybutthole
```

El resultado siempre conserva el nombre oficial entregado por la API.

## ❤️ Favoritos

Los favoritos se almacenan localmente mediante **AsyncStorage**.

No se requiere:

- cuenta de usuario;
- inicio de sesión;
- backend propio.

Cada dispositivo conserva independientemente sus favoritos.

## 📂 Arquitectura

```text
src/
├── app/
│   ├── (tabs)/
│   │   ├── index.tsx
│   │   ├── search.tsx
│   │   └── favorites.tsx
│   ├── character/
│   ├── episode/
│   ├── episodes/
│   └── about.tsx
│
├── components/
├── constants/
├── services/
└── utils/
```

La navegación se gestiona mediante **Expo Router**.

## 🚀 Ejecutar localmente

Clonar:

```bash
git clone https://github.com/JohnSebastian24/multiverse-explorer.git
```

Entrar al proyecto:

```bash
cd multiverse-explorer
```

Instalar dependencias:

```bash
npm install
```

Iniciar Expo:

```bash
npx expo start
```

En caso de problemas con la conexión LAN:

```bash
npx expo start --tunnel
```

## 🧪 Postman

Las principales peticiones de la API fueron verificadas mediante Postman:

- listado de personajes;
- filtros;
- búsqueda;
- personaje por ID;
- listado de episodios;
- episodio por ID;
- consulta múltiple de episodios.

## 🎨 Identidad visual

**Multiverse Explorer — v1.0.0**

Paleta principal:

```text
Fondo    #090e17
Verde    #97ce4c
Cyan     #00b5cc
```

La identidad está inspirada en portales y exploración interdimensional.

## 👨‍💻 Autor

Desarrollado por:

**JOHN MUÑOZ**

Proyecto académico — 2026.

## ⚖️ Aviso

Multiverse Explorer es una aplicación no oficial desarrollada con fines académicos y educativos.

El proyecto no está afiliado ni patrocinado oficialmente por Adult Swim ni por los responsables de la franquicia Rick and Morty.

Los nombres, personajes, imágenes y demás contenido relacionado pertenecen a sus respectivos propietarios.

Los datos mostrados por la aplicación son proporcionados por The Rick and Morty API.