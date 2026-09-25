# Trabajo práctico 03

## Descripción
API REST desarrollada con Node.js y Express que permite consultar, filtrar y crear instrumentos musicales. Los datos se leen desde un archivo JSON (`datos/instrumentos.json`).

## Instalación
Parado en la raíz del proyecto se ejecuta: npm install
(Este comando lee el `package.json` e instala todas las dependencias necesarias, entre ellas Express, el framework utilizado para levantar el servidor HTTP.)

## Ejecución
Para iniciar el servidor se ejecuta: npm start

Por defecto, queda escuchando en `http://localhost:3000`.

Para **detener el servidor**, hay que volver a la terminal donde quedó corriendo el proceso y presionar `Ctrl + C`. Esto corta el proceso de Node y libera el puerto 3000.

## Endpoints
| Método | Ruta | Descripción |
|---|---|---|
| GET | `/` | Mensaje de bienvenida con la lista de rutas disponibles. |
| GET | `/api/instrumentos` | Obtiene todos los instrumentos. |
| GET | `/api/instrumentos?familia=nombreFamilia` | Filtra los instrumentos por familia. |
| GET | `/api/instrumentos/:id` | Obtiene un instrumento puntual por su ID. |
| POST | `/api/instrumentos` | Crea un nuevo instrumento a partir del cuerpo enviado. |

**Diferencia entre parámetro de ruta y parámetro de consulta:**
- El **parámetro de ruta** (`/api/instrumentos/:id`) es parte de la URL misma y siempre identifica un recurso puntual; en el código se accede con `req.params` (por ejemplo, `req.params.id`). Es obligatorio: sin ese valor la ruta ni siquiera coincide.
- El **parámetro de consulta** (`/api/instrumentos?familia=cuerdas`) va después del `?` y sirve para filtrar u opcionalmente modificar el resultado de una colección; en el código se accede con `req.query` (por ejemplo, `req.query.familia`). Es opcional: si no se envía, la ruta responde igual, devolviendo todos los instrumentos.

## Ejemplos de solicitudes

**Obtener todos los instrumentos**: GET /api/instrumentos

**Obtener un instrumento por ID**: GET /api/instrumentos/3 (ejemplo para obtener el instrumento con el id 3).

**Filtrar por familia**: GET /api/instrumentos?familia=cuerdas (ejemplo para obtener los instrumentos de la familia de cuerdas).

**Crear un instrumento**: POST /api/instrumentos
Content-Type: application/json
{
  "nombre": "Bongó",
  "familia": "Percusión",
  "origen": "Cuba",
  "descripcion": "Instrumento musical de percusión membranófono formado por un juego de dos tambores pequeños unidos entre sí",
  "disponible": true
}

El cuerpo del POST debe incluir obligatoriamente los campos `nombre`, `familia`, `origen`, `descripcion` y `disponible`. El campo `id` **no** se envía: se genera automáticamente en el servidor a partir del último registro existente.

Respuesta esperada (201 Created):
```json
{
  "id": 9,
  "nombre": "Bongó",
  "familia": "Percusión",
  "origen": "Cuba",
  "descripcion": "Instrumento musical de percusión membranófono formado por un juego de dos tambores pequeños unidos entre sí",
  "disponible": true
}

Para que Express pueda leer ese `body` en formato JSON, la aplicación usa el middleware `express.json()`. Sin él, `req.body` llegaría `undefined` y el servidor no podría interpretar los datos enviados en el POST.

## Códigos de estado
- **200 OK**: la lectura fue exitosa. Se devuelve tanto para `GET /api/instrumentos`, `GET /api/instrumentos/:id` (cuando existe) como para el filtro por familia, incluso cuando no hay coincidencias (en ese caso se responde `[]`, un array vacío, y no un error).
- **201 Created**: el `POST /api/instrumentos` creó el recurso correctamente y lo devuelve en el cuerpo de la respuesta.
- **400 Bad Request**: el `POST` no incluyó alguno de los campos obligatorios (`nombre`, `familia`, `origen`, `descripcion` o `disponible`).
- **404 Not Found**: se pidió `GET /api/instrumentos/:id` con un ID que no existe en los datos.

## Persistencia de los datos
Al arrancar el servidor, `leerIntrumentos` lee una única vez el archivo `datos/instrumentos.json` y carga su contenido en el array `datosInstr`, que vive en la memoria del proceso de Node mientras el servidor esté corriendo.

A partir de ahí, todas las operaciones (incluidas las altas por `POST`) se hacen sobre ese array en memoria; en ningún momento el código vuelve a escribir el archivo `instrumentos.json` en disco.

Por eso **los instrumentos creados desaparecen al reiniciar el servidor**: al detener el proceso (`Ctrl + C`) se pierde toda la memoria RAM donde vivía `datosInstr`, y al volver a ejecutar `npm start` se repite la lectura original del JSON, que sigue teniendo los datos de siempre, sin los que se agregaron durante la ejecución anterior.
