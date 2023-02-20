TODO: Añadir una descripción del proyecto, funcionalidades y eventos con los sockets
# Nombre del proyecto

Este es un proyecto de chat dividido en dos partes: el lado del cliente, desarrollado con REACT y Javascript, y el lado del servidor, desarrollado con Node y Express.

## Instalación

Para instalar el proyecto, sigue estos pasos:

1. Clona este repositorio en tu ordenador
2. Abre una terminal y dirígete a la carpeta correspondiente al cliente (`/client`) o al servidor (`/server`)
3. Ejecuta `npm install`

Repite el proceso en ambas carpetas (`/client` y `/server`).

## Ejecución

Para ejecutar el proyecto, sigue estos pasos:

### Cliente

1. Abre una terminal y dirígete a la carpeta correspondiente al cliente (`/cliente`)
2. Ejecuta `npm start`

### Servidor

1. Abre una terminal y dirígete a la carpeta correspondiente al servidor (`/servidor`)
2. Ejecuta `npm run dev`

## Endpoints de la API

Estos son los endpoints disponibles en la API Rest del servidor:

| Método | Endpoint | Descripción |
| ------ | -------- | ----------- |
| POST   | /signup  | Registra un nuevo usuario |
| POST   | /login   | Inicia sesión con un usuario registrado |
| GET    | /logout  | Cierra la sesión del usuario |
| GET    | /verify  | Verifica si el usuario tiene una sesión activa |
