# 🌌 Multiverse Explorer

Aplicación móvil desarrollada con **React Native, Expo y TypeScript** que consume la API pública de **Rick and Morty** para explorar personajes y episodios del multiverso.

El proyecto fue desarrollado con fines académicos, buscando construir una experiencia móvil moderna, rápida y visualmente consistente a partir de una API REST pública.

---

## 📱 Características

- Exploración de personajes mediante scroll infinito.
- Filtros por personajes vivos, muertos y estado desconocido.
- Búsqueda de personajes por nombre.
- Búsqueda asistida mediante algunos alias en español.
- Información detallada de cada personaje.
- Sistema de favoritos almacenados localmente.
- Consulta de episodios en los que aparece cada personaje.
- Información detallada de cada episodio.
- Navegación desde episodios hacia sus personajes.
- Navegación rápida hacia atrás, inicio y parte superior de listas extensas.
- Manejo visual de errores de conexión.
- Reintentos automáticos ante fallos temporales de la API.
- Adaptación para dispositivos móviles y navegador web.
- Pantalla Acerca de / información legal.
- Caché de imágenes mediante `expo-image`.

---

## 🛠️ Tecnologías

- React Native
- Expo
- Expo Router
- TypeScript
- AsyncStorage
- Expo Image
- Rick and Morty REST API
- Git
- GitHub
- Postman

---

## 🌐 API

La aplicación consume la API pública:

**The Rick and Morty API**

Recurso principal:

```text
https://rickandmortyapi.com/api
```

Actualmente la aplicación utiliza principalmente los recursos:

```text
/character
/episode
```

Ejemplos:

```http
GET /character
GET /character/1
GET /character?status=alive
GET /character?name=rick

GET /episode
GET /episode/1
GET /episode/1,2,3
```

La aplicación utiliza únicamente operaciones de consulta mediante HTTP `GET`.

---

## 🔎 Búsqueda asistida

La API almacena los nombres de los personajes en su idioma original.

Multiverse Explorer incorpora una pequeña capa de búsqueda asistida que permite reconocer algunos nombres escritos comúnmente en español.

Por ejemplo:

```text
Señor pantalones de popó
        ↓
Mr. Poopybutthole
```

El nombre oficial que se muestra en los resultados sigue siendo el proporcionado por la API.

---

## ❤️ Favoritos

Los favoritos no se envían a un servidor.

Se almacenan localmente mediante:

```text
AsyncStorage
```

Por esta razón, cada dispositivo mantiene sus propios personajes favoritos de manera independiente.

La aplicación no requiere registro ni inicio de sesión.

---

## 📂 Estructura principal

```text
src/
├── app/
│   ├── (tabs)/
│   │   ├── index.tsx
│   │   ├── search.tsx
│   │   └── favorites.tsx
│   │
│   ├── character/
│   │   └── [id].tsx
│   │
│   ├── episodes/
│   │   └── [characterId].tsx
│   │
│   ├── episode/
│   │   └── [id].tsx
│   │
│   └── about.tsx
│
├── components/
├── constants/
├── services/
└── utils/
```

---

## 🚀 Ejecutar el proyecto

### Requisitos

- Node.js
- npm
- Expo

Clonar el repositorio:

```bash
git clone URL_DEL_REPOSITORIO
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

Si un dispositivo físico tiene problemas para conectarse por la red local:

```bash
npx expo start --tunnel
```

---

## 📱 Plataformas probadas

- iOS mediante Expo Go
- Web
- Android: versión instalable mediante build de Expo/EAS

---

## 🧪 Pruebas de API

Las peticiones principales fueron verificadas adicionalmente mediante **Postman**.

Se probaron consultas de:

```text
Personajes
Filtros por estado
Búsqueda por nombre
Personajes por ID
Episodios
Episodios por ID
Consultas múltiples de episodios
```

---

## 🎨 Identidad visual

La aplicación utiliza una interfaz oscura inspirada en el concepto de dimensiones y portales.

Colores principales:

```text
Fondo:     #090e17
Verde:     #97ce4c
Cyan:      #00b5cc
```

Nombre del proyecto:

**Multiverse Explorer**

Versión:

**1.0.0**

---

## 👨‍💻 Autor

Desarrollado por:

**JOHN MUÑOZ**

Proyecto académico — 2026.

---

## ⚖️ Aviso

Multiverse Explorer es una aplicación no oficial desarrollada con fines académicos y educativos.

Este proyecto no está afiliado, patrocinado ni respaldado oficialmente por Adult Swim ni por los responsables de la franquicia Rick and Morty.

Los nombres, imágenes, personajes y demás contenido relacionado con Rick and Morty pertenecen a sus respectivos propietarios.

Los datos utilizados por la aplicación son proporcionados por **The Rick and Morty API**.