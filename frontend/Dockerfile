# ============================================================
# BUILD STAGE
# ============================================================
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

# Vite inlines VITE_* variables at BUILD time, not runtime — so the API URL
# must be supplied here, not as a container env var. Override per environment:
#   docker build --build-arg VITE_API_URL=https://api.example.com/api/v1 .
ARG VITE_API_URL=https://api.imararent.com/api/v1
ARG VITE_APP_NAME=ImaraRent
ARG VITE_ENABLE_MPESA=true
ARG VITE_ENABLE_REALTIME=true
ARG VITE_ENABLE_PWA=true
ARG VITE_MPESA_SHORTCODE=
ARG VITE_SENTRY_DSN=

ENV VITE_API_URL=$VITE_API_URL \
    VITE_APP_NAME=$VITE_APP_NAME \
    VITE_ENABLE_MPESA=$VITE_ENABLE_MPESA \
    VITE_ENABLE_REALTIME=$VITE_ENABLE_REALTIME \
    VITE_ENABLE_PWA=$VITE_ENABLE_PWA \
    VITE_MPESA_SHORTCODE=$VITE_MPESA_SHORTCODE \
    VITE_SENTRY_DSN=$VITE_SENTRY_DSN

RUN npm run build

# ============================================================
# PRODUCTION STAGE
# ============================================================
FROM nginx:alpine

COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Run as the unprivileged nginx user rather than root.
RUN touch /var/run/nginx.pid \
 && chown -R nginx:nginx /var/run/nginx.pid /var/cache/nginx /usr/share/nginx/html

USER nginx

EXPOSE 80

HEALTHCHECK --interval=30s --timeout=10s --start-period=10s --retries=3 \
  CMD wget --quiet --tries=1 --spider http://localhost/ || exit 1
