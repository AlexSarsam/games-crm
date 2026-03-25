# Games CRM

Este proyecto es una plataforma web para gestionar juegos y jugadores. Los administradores pueden crear y publicar juegos, y los jugadores pueden acceder a ellos, jugar y guardar sus partidas. Además el sistema verifica la identidad del jugador con la cámara antes de dejarle jugar, y detecta sus emociones durante la partida.

---

## Tecnologías utilizadas

El backend está hecho con **Laravel 12**, que se encarga de todo lo que ocurre en el servidor: las rutas, la autenticación, la base de datos y la API. Para el frontend se usa **React 18** junto con **Inertia.js**, que permite usar React como sistema de vistas dentro de Laravel sin necesidad de montar una aplicación separada. Los estilos se hacen con **Tailwind CSS**.

La base de datos es **PostgreSQL 16** y corre dentro de un contenedor **Docker**. El reconocimiento facial lo gestiona un microservicio aparte escrito en **Python con Flask**, que usa la librería **DeepFace** para comparar caras. La detección de emociones en cambio se hace directamente en el navegador con **face-api.js**, sin mandar imágenes al servidor. El juego integrado está construido con **Three.js** y **Vue 3**.

---

## Base de datos

La base de datos tiene cinco tablas principales. La tabla `users` guarda los usuarios del sistema junto con su rol y la ruta a su foto facial. La tabla `roles` define los tres tipos de usuario que existen: admin, gestor y jugador. La tabla `games` almacena los juegos con su título, descripción y si están publicados o no. La tabla `game_sessions` registra cada partida jugada, guardando qué usuario jugó, a qué juego, cuándo empezó y terminó y la puntuación final. Por último, la tabla `emotion_events` guarda los eventos de emoción detectados durante cada partida.

Las relaciones entre tablas se definen con Eloquent ORM. Un usuario pertenece a un rol, un juego pertenece al usuario que lo creó, una sesión pertenece a un usuario y a un juego, y los eventos de emoción pertenecen a una sesión.

El seeder crea automáticamente tres roles, tres usuarios de prueba (admin, gestor y jugador, todos con la contraseña `password`) y un juego de ejemplo ya publicado (Runner 3D).

---

## Autenticación

El sistema de login y registro lo proporciona **Laravel Breeze** adaptado para Inertia y React. Cuando un usuario nuevo se registra se le asigna automáticamente el rol de jugador.

Hay tres roles con distintos permisos. El **admin** tiene acceso total. El **gestor** puede crear, editar y publicar juegos. El **jugador** solo puede ver los juegos publicados y jugar. El control de acceso se implementa con un middleware personalizado llamado `EnsureRole` que comprueba el rol del usuario antes de dejarle entrar a cada ruta. Si intenta acceder a algo que no le corresponde recibe un error 403.

---

## API

El proyecto tiene una API REST separada de la aplicación web. Está protegida con **Laravel Sanctum** usando autenticación por cookie.

Los endpoints disponibles son: uno para listar los juegos publicados (público, sin autenticación), otro para iniciar una sesión de juego, otro para cerrarla con la puntuación final, y otro para registrar un evento de emoción. Estos tres últimos requieren estar autenticado. Los juegos se comunican con el servidor únicamente a través de esta API.

---

## Gestión de juegos

Los administradores y gestores tienen un panel donde pueden crear juegos nuevos con título, descripción y URL, editarlos, publicarlos o despublicarlos, y eliminarlos. Los jugadores solo ven en su lista los juegos que están publicados. Un jugador no puede acceder al panel de gestión aunque conozca la URL, el middleware lo bloquea.

---

## Reconocimiento facial y detección de emociones

Antes de jugar, el sistema pide al jugador que se identifique con la cámara. Laravel envía la foto del perfil del usuario y la captura actual al microservicio Python, que las compara con DeepFace y devuelve si coinciden o no. Laravel toma la decisión final de dejarle pasar o no. El microservicio no sabe nada de usuarios ni sesiones, solo compara dos imágenes.

La primera vez que se usa la verificación facial el microservicio descarga los modelos de reconocimiento (~500 MB) y puede tardar 1-2 minutos en responder. Es normal que el botón de verificar parezca que no hace nada durante ese tiempo.

Durante la partida, la webcam analiza la expresión facial del jugador cada pocos segundos usando face-api.js, que corre completamente en el navegador. No se mandan fotos al servidor, solo la emoción detectada, el nivel de confianza y el momento en que ocurrió. Esos datos se guardan en `emotion_events` y permiten saber cómo reacciona el jugador durante el juego.

---

## El juego: Runner 3D

El juego incluido es un runner infinito en 3D construido con Three.js y Vue 3, que vive en la carpeta `public/Runner3D/`. El jugador esquiva obstáculos mientras el personaje corre solo. Antes de cargarlo se verifica la identidad del jugador, y al terminar la puntuación se guarda automáticamente como una sesión de juego vía la API.

---

## Cómo arrancar el proyecto

Primero hay que tener instalados PHP 8.2+, Composer, Node.js y Docker Desktop.

```bash
git clone <url-del-repositorio>
cd games-crm

composer install
cp .env.example .env
php artisan key:generate

docker compose up -d
php artisan migrate --seed

npm install
npm run dev

php artisan serve
```

La aplicación estará en `http://localhost:8000`. Los usuarios de prueba son `admin@example.com`, `gestor@example.com` y `jugador@example.com`, todos con la contraseña `password`.
