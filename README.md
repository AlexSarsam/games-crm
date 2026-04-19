# Games CRM

Una plataforma de juegos construida con Laravel donde los jugadores se identifican con su cara, juegan y chatean en tiempo real. Por dentro es un CRM que gestiona usuarios, roles, juegos, sesiones, emociones y mensajes.

La idea del proyecto es aprender a diseñar un sistema donde cada pieza tiene una responsabilidad clara: Laravel como núcleo, un microservicio Python para el reconocimiento facial, el juego como cliente independiente y WebSockets para la comunicación en tiempo real.

---

## Arquitectura del sistema

El sistema está dividido en cuatro piezas que se comunican entre sí:

**Laravel (núcleo)** — gestiona usuarios, roles, autenticación, la API y toda la lógica de seguridad. Nunca compara caras directamente, pero sí decide si el acceso se concede o no según la respuesta que recibe del microservicio.

**Microservicio Python en Docker** — recibe dos imágenes, las compara usando DeepFace y devuelve un resultado técnico. No conoce usuarios ni sesiones. Solo compara rostros.

**Juego cliente (Runner 3D)** — aplicación independiente en Three.js embebida en un iframe. Se comunica con Laravel exclusivamente a través de la API. No accede directamente a la base de datos.

**Chat en tiempo real** — Laravel Reverb gestiona los WebSockets. El acceso a cada canal está protegido por la sesión autenticada de Laravel, igual que cualquier otra ruta.

La separación entre `routes/web.php` (vistas y navegación) y `routes/api.php` (servicios consumidos por el juego y el chat) es central en el diseño.

---

## ¿Qué hace cada rol?

| Rol | Puede hacer |
|---|---|
| **Admin** | Gestionar juegos, ver y editar usuarios, cambiar roles |
| **Gestor** | Crear, editar, publicar y despublicar juegos |
| **Jugador** | Ver juegos publicados, pasar verificación facial, jugar, chatear |

---

## Flujo de una partida

1. El jugador inicia sesión con su cuenta.
2. Si no tiene foto registrada, va a **Registro Facial** y se hace una foto con la cámara. Laravel la guarda sin procesarla.
3. Antes de entrar al juego, pasa por **Verificación Facial** — Laravel envía la foto guardada y la captura actual al microservicio Python. Si coinciden, guarda en sesión que la verificación fue correcta.
4. Si la verificación es reciente y válida, puede acceder al juego.
5. Al entrar, el navegador crea una sesión de juego vía API.
6. Mientras juega, la cámara detecta emociones localmente con `face-api.js`. No se mandan fotos al servidor — solo el nombre de la emoción, la confianza y el momento.
7. El chat del juego está abierto en tiempo real. Solo pueden entrar jugadores autenticados con verificación facial reciente.
8. Al terminar, el jugador guarda su puntuación y la sesión queda registrada.

---

## Decisiones de diseño importantes

**El reconocimiento facial no está en Laravel.** Las librerías de visión artificial tienen dependencias que no encajan en el ciclo de una petición web. Por eso vive en un microservicio Python separado, dentro de Docker.

**El navegador nunca habla directamente con el microservicio.** Todo pasa por Laravel, que es quien toma la decisión de acceso.

**Las emociones se detectan en el cliente, no en el servidor.** `face-api.js` analiza la webcam localmente y solo manda datos abstractos (nombre de emoción + confianza). No se envían imágenes.

**Los mensajes del chat se guardan en base de datos.** Están asociados a un juego concreto, no son efímeros, para poder consultarlos después.

**La seguridad del chat también está en el servidor.** El canal WebSocket valida que el usuario sea jugador, que el juego esté publicado y que tenga una verificación facial reciente.

---

## API disponible

### Pública

- `GET /api/games` — lista de juegos publicados

### Protegida (requiere sesión autenticada)

- `POST /api/games/{game}/sessions` — inicia una sesión de juego
- `PATCH /api/games/{game}/sessions/{session}` — cierra la sesión y guarda la puntuación
- `POST /api/games/{game}/sessions/{session}/emotions` — registra un evento emocional
- `GET /api/games/{game}/messages` — historial reciente del chat
- `POST /api/games/{game}/messages` — envía un mensaje al chat

---

## Tecnologías utilizadas

| Tecnología | Para qué se usa |
|---|---|
| Laravel 12 + PHP 8.2 | Núcleo del sistema: autenticación, API, lógica y seguridad |
| PostgreSQL 16 | Base de datos relacional |
| Laravel Sanctum | Autenticación de la API con cookies de sesión |
| Inertia.js + React 18 | Interfaz del CRM (sin recargar la página) |
| Tailwind CSS | Estilos |
| Laravel Reverb | Servidor WebSockets para el chat en tiempo real |
| Laravel Echo + Pusher.js | Cliente WebSocket en el navegador |
| Python + Flask + DeepFace | Microservicio de reconocimiento facial |
| Docker Compose | Orquestación del microservicio y la base de datos |
| Three.js + Vue 3 | Juego Runner 3D (cliente independiente) |
| face-api.js | Detección de emociones en el navegador |

---

## Cómo arrancarlo

### Requisitos

- PHP 8.2 o superior
- Composer
- Node.js
- Docker Desktop

### Pasos

```bash
composer install
cp .env.example .env
php artisan key:generate

docker compose up -d
php artisan migrate --seed

npm install
composer dev
```

`composer dev` arranca Laravel, Vite, Reverb y la cola de trabajos todo a la vez.

Si prefieres hacerlo por separado:

```bash
php artisan serve
php artisan reverb:start
php artisan queue:work
npm run dev
```

### Usuarios de prueba

| Email | Contraseña | Rol |
|---|---|---|
| admin@example.com | password | Admin |
| gestor@example.com | password | Gestor |
| jugador@example.com | password | Jugador |

---

## Notas

- La **primera verificación facial** puede tardar un par de minutos porque DeepFace descarga los modelos al arrancar por primera vez.
- La **verificación facial caduca** pasado un tiempo. Si lleva mucho tiempo sin verificarse, el sistema le pedirá que repita el proceso antes de entrar al juego.
- El **chat es por juego**, no global. Solo ven los mensajes quienes tienen acceso a ese juego.
- El campo URL de los juegos acepta rutas internas (`/Runner3D/dist/index.html`) y URLs externas, lo que permite alojar los juegos en otro servidor sin cambiar el backend.
