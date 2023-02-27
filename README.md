# socketChat | Fin Sprint5 It Academy Node JS

Este es un proyecto de chat dividido en dos partes: el lado del cliente, desarrollado con Bootstrap y Javascript, y el lado del servidor, desarrollado con Node y Express.

## Instalación

Para instalar el proyecto, sigue estos pasos:

1. Clona este repositorio en tu ordenador: [socketChat](https://github.com/ivanlegranbizarro/socketChat/tree/vainillaClient)
2. Abre una terminal y dirígete a la carpeta correspondiente al cliente (`/client`) o al servidor (`/server`)
3. Ejecuta `npm install`

Repite el proceso en ambas carpetas (`/client` y `/server`).

## Ejecución

Para ejecutar el proyecto, sigue estos pasos:

### Cliente

1. Abre una terminal y dirígete a la carpeta correspondiente al cliente (`/cliente`)
2. Ejecuta `npm run dev`

### Servidor

1. Abre una terminal y dirígete a la carpeta correspondiente al servidor (`/servidor`)
2. Ejecuta `npm run dev`

## Endpoints de la API

Estos son los endpoints disponibles en la API Rest del servidor:

| Método | Endpoint | Descripción |
| ------ | -------- | ----------- |
| POST   | /signup  | Registra un nuevo usuario |
| POST   | /login   | Inicia sesión con un usuario registrado |

## Funcionalidades del chat y eventos de los sockets

Este chat permite a múltiples usuarios conectarse a diferentes salas de chat, enviar mensajes en tiempo real y ver los mensajes anteriores.

### Eventos de los sockets

| Evento | Descripción |
| ------ | ----------- |
| connection | El servidor escucha esta señal para detectar nuevas conexiones de sockets. |
| channelList | Cuando un usuario se une a una sala, el servidor envía la lista de salas disponibles para el usuario. |
| joinRoom | Cuando un usuario se une a una sala, se emite este evento. |
| message | Cuando un usuario envía un mensaje, se emite este evento para enviarlo a la sala. |
| roomMessages | Cuando un usuario se une a una sala, se envía una lista de los mensajes más recientes en la sala. |
| leaveRoom | Cuando un usuario abandona una sala, se emite este evento. |
| roomUsers | Cada vez que un usuario se une o abandona una sala, el servidor envía una lista actualizada de los usuarios en la sala. |
| disconnect | El servidor detecta cuándo un usuario se desconecta y emite este evento para notificar a la sala. |
