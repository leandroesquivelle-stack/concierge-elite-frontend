# Concierge Elite

App de viajes de lujo (Omnia Luxury Concierge). React + Vite en el
frontend, backend propio en Node/Express con Postgres, desplegado en
Railway.

## Desarrollo local

```
npm install
npm run dev
```

## Variables de entorno

Ninguna requerida del lado del frontend por ahora — el cliente de
API (`src/api/apiClient.js`) apunta directo a la URL del backend en
Railway.

## Backend

El backend vive en un repo aparte (`concierge-elite-backend`) y
expone endpoints REST sobre las mismas entities que usa esta app.
