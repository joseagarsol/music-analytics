# 🎵 Spotify Music Analyst

Aplicación web para visualizar y analizar tus datos de escucha de Spotify. Descubre tus canciones favoritas, artistas más escuchados y desglose de géneros musicales en diferentes rangos de tiempo.

🔗 **Demo en vivo:** [https://sage-halva-fb4068.netlify.app](https://sage-halva-fb4068.netlify.app)

---

## ⚠️ Nota Importante sobre el Acceso

Actualmente, esta aplicación se encuentra en **modo de desarrollo** ("Development Mode") dentro de la plataforma de desarrolladores de Spotify. Esto significa que **solo los usuarios explícitamente autorizados pueden iniciar sesión**.

> **¿Quieres probar la app?**
> Debes solicitar acceso para que tu correo de Spotify sea añadido a la lista de usuarios permitidos. Por favor, contacta con el administrador del proyecto a través del correo joseagarsol@gmail.com para habilitar tu acceso.

---

## 🚀 Características

- **Autenticación Segura:** Inicio de sesión con Spotify mediante OAuth 2.0 con PKCE.
- **Top Canciones:** Visualiza tus temas más escuchados (4 semanas, 6 meses o histórico completo).
- **Top Artistas:** Ranking de tus artistas favoritos.
- **Análisis de Géneros:** Gráfico interactivo que muestra la distribución de tus géneros musicales.
- **Interfaz Moderna:** Diseño responsivo y animado.

## 🛠️ Stack Tecnológico

- **Frontend:** [React 19](https://react.dev/)
- **Lenguaje:** [TypeScript](https://www.typescriptlang.org/)
- **Build Tool:** [Vite](https://vitejs.dev/) (con SWC)
- **Enrutamiento:** [Wouter](https://github.com/molefrog/wouter)
- **Gráficos:** [Recharts](https://recharts.org/)
- **Estilos:** CSS Modules + Variables CSS nativas
- **Calidad de Código:** ESLint + Prettier

## 📦 Instalación y Configuración Local

1. **Clonar el repositorio:**
   ```bash
   git clone https://github.com/tu-usuario/music-analytics.git
   cd music-analytics
   ```

2. **Instalar dependencias:**
   ```bash
   npm install
   ```

3. **Configurar variables de entorno:**
   Crea un archivo `.env` en la raíz del proyecto basándote en las siguientes variables:

   ```env
   VITE_SPOTIFY_CLIENT_ID=tu_client_id_de_spotify
   VITE_SPOTIFY_REDIRECT_URI=http://localhost:5173/callback
   ```
   > Nota: Debes registrar una aplicación en [Spotify for Developers](https://developer.spotify.com/dashboard) para obtener tu Client ID. Asegúrate de añadir `http://localhost:5173/callback` en la configuración de "Redirect URIs" de tu app en Spotify.

4. **Ejecutar el servidor de desarrollo:**
   ```bash
   npm run dev
   ```

## 📜 Scripts Disponibles

- `npm run dev`: Inicia el servidor de desarrollo.
- `npm run build`: Compila la aplicación para producción.
- `npm run lint`: Ejecuta ESLint para buscar problemas en el código.
- `npm run format`: Formatea el código usando Prettier.

## 📂 Estructura del Proyecto

```
src/
├── components/
│   ├── features/    # Componentes con lógica de negocio (Analytics, User, Auth)
│   └── ui/          # Componentes de presentación reutilizables
├── context/         # Contexto global (Auth)
├── helpers/         # Funciones de utilidad
├── pages/           # Vistas principales (Dashboard, Login, Profile)
├── services/        # Lógica de comunicación con APIs (Spotify API)
├── types/           # Definiciones de tipos TypeScript
└── routes/          # Configuración de rutas
```

## 📄 Licencia

Este proyecto es para fines educativos y personales.
