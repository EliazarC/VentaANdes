# VetAndes Frontend

SPA empresarial desarrollada con Angular standalone para el caso VetAndes del Examen Parcial II, Versión B.

## Requisitos
- Node.js compatible con Angular CLI 22.
- Backend VetAndes levantado y accesible en `http://localhost:8080`.
- Visual Studio Code.

## Instalación y ejecución
Abre esta carpeta en Visual Studio Code y ejecuta en la terminal:

```bash
npm install
npm start
```

Luego abre `http://localhost:4200`.

Para compilar:
```bash
npm run build
```

## Configuración de API
La URL está en `src/environments/environment.ts`:

```ts
apiUrl: 'http://localhost:8080/api/v1'
```

Cámbiala únicamente si tu backend usa otra dirección.

## Usuarios de prueba del enunciado
- `admin` / `Vet2026*`
- `recepcion` / `Vet2026*`
- `veterinario` / `Vet2026*`
- `inactivo` / `Vet2026*` (debe ser rechazado por el backend)

Los usuarios deben existir en la base de datos y el backend debe tener sus contraseñas BCrypt configuradas.

## Estructura
- `core/auth`: sesión, signals y login JWT.
- `core/guards`: authGuard, invitadoGuard y permisoGuard.
- `core/interceptors`: Authorization y manejo de 401.
- `core/services`: consumo HTTP del API.
- `shared/pages`: acceso denegado y 404.
- `layout`: navegación y estructura principal.
- `features`: login, dashboard, prestaciones, mascotas, atenciones y reportes.

## Contrato esperado
El frontend consume las rutas `/auth/login`, `/auth/me`, `/propietarios`, `/prestaciones`, `/mascotas`, `/atenciones` y `/reportes/atenciones-por-especie` bajo `/api/v1`.

## Importante
El contrato del PDF es la referencia. Los nombres de propiedades de los DTO del backend deben coincidir con los modelos TypeScript. En particular, revisa que:
- El endpoint de estado de prestación acepte `{ "activo": true/false }`.
- El endpoint de anulación acepte `{ "motivo": "..." }`.
- Las respuestas de listas sean arreglos JSON directos.
- La respuesta de atención incluya `detalles` y, si deseas mostrar nombres, `prestacionNombre` y `mascotaNombre`.

Las reglas RN-03, RN-04, RN-05, los permisos y los cálculos definitivos deben seguir siendo validados por el backend. El cálculo mostrado en el formulario de atención es solo una vista previa.
