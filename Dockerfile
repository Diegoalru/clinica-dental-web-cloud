# Imagen del frontend: compila la SPA con Node y la sirve con nginx sin privilegios.
#   docker build --build-arg API_BASE_URL=http://localhost:5125/api/v1 -t clinica-dental-web .

# --- Etapa 1: compilación ---
FROM node:24-alpine AS build
WORKDIR /app

# Primero solo las dependencias: mientras no cambie package-lock.json, Docker reutiliza la capa de npm ci
COPY package.json package-lock.json ./
RUN npm ci --no-audit --no-fund

COPY . .

# Vite incrusta las variables API_* al compilar (ver src/config/env.js); no son secretos
ARG API_BASE_URL
ARG API_TIMEOUT=15000
ENV API_BASE_URL=$API_BASE_URL \
    API_TIMEOUT=$API_TIMEOUT
RUN test -n "$API_BASE_URL" || { echo "Falta el build-arg API_BASE_URL (ej.: http://localhost:5125/api/v1)"; exit 1; }
RUN npm run build

# --- Etapa 2: servidor estático ---
# nginx sin root (usuario 101), escuchando en el puerto 8080. La variante slim no trae módulos extra (njs,
# geoip...) que una SPA no necesita: la imagen queda en unos 21 MB
FROM nginxinc/nginx-unprivileged:stable-alpine-slim AS final
LABEL org.opencontainers.image.title="clinica-dental-web" \
      org.opencontainers.image.description="Frontend (SPA) del sistema de citas para consultorios dentales" \
      org.opencontainers.image.source="https://github.com/Diegoalru/clinica-dental-web-cloud"

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 8080
