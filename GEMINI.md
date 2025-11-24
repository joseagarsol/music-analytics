# Contexto del Proyecto: Spotify Music Analyst

## 1. Resumen del Proyecto

- **Objetivo:** Construir un dashboard de análisis musical para visualizar los datos de un usuario de Spotify.
- **Flujo Principal:** El usuario inicia sesión con Spotify (OAuth 2.0 PKCE), la app obtiene un token, y luego usa ese token para hacer llamadas a la API de Spotify.

## 2. Stack Tecnológico

- **Framework:** React 19.1.1+
- **Bundler:** Vite 7.1.7+
- **Lenguaje:** TypeScript
- **Compilador:** SWC
- **Hosting:** Vercel

## 3. Arquitectura y Estructura

- **Componentes "Tontos" (UI):** Se almacenan en `src/components/ui/`. Son componentes de presentación genéricos (ej: `Button.tsx`, `Card.tsx`).
- **Componentes "Inteligentes" (Features):** Se almacenan en `src/components/features/`. Se agrupan por funcionalidad (ej: `src/components/features/auth/`).
- **Estilos:** Se usan variables CSS globales definidas en `:root` en `index.css` (ej: `var(--bg-principal)`, `var(--acento)`).

## 4. Estándares de Código (Linter y Formato)

- **Linter:** ESLint.
- **Formateador:** Prettier.
- **Configuración ESLint:** Se usa el formato "flat config" (`eslint.config.js`), que extiende las reglas recomendadas de `js`, `tseslint`, `react-hooks` y `react-refresh`. Se integra con Prettier usando `eslint-config-prettier` al final.
- **Reglas Clave de Prettier (`.prettierrc.json`):**
  - **`"semi": true`**: **Usar** punto y coma (`;`) al final de las líneas.
  - **`"singleQuote": true`**: Usar comillas simples (`'`).
  - **`"trailingComma": "es5"`**: Poner coma al final en objetos y arrays (compatible con ES5).
  - **`"printWidth": 80`**: Limitar el ancho de línea a 80 caracteres.
  - **`"tabWidth": 2`**: Usar 2 espacios para la indentación.

## 5. Git y Flujo de Trabajo

- **Commits:** Se debe seguir el estándar de **Conventional Commits**.
  - `feat:` para nuevas funcionalidades.
  - `fix:` para corrección de errores.
  - `refactor:` para limpieza de código sin cambiar la funcionalidad.
  - `chore:` para tareas de mantenimiento (configuración, dependencias).
- **Ramas:** Las ramas de funcionalidad deben tener prefijos (ej: `feat/auth-ui`, `refactor/auth-components`).
- **Pull Requests:** Todo el código debe ser fusionado a `main` a través de un Pull Request (PR), incluso trabajando en solo.

## 6. Respuestas

-**Idioma** Siempre responde en español, independientemente del idioma que se use en la pregunta
