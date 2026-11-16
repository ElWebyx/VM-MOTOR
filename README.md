# VM MOTOR

Web y panel de administración de **VM MOTOR**, concesionario de vehículos de ocasión en Guanarteme (Calle Almansa 78, Las Palmas de Gran Canaria).

## Qué hay aquí

| Ruta | Qué es |
|---|---|
| `public/index.html` | La web pública |
| `public/admin/` | Panel de administración (coches, fotos, mensajes y ajustes) |
| `public/css/`, `public/js/` | Estilos y código de la web |
| `public/img/` | Fotos de la web y de los coches |
| `firestore.rules` | Reglas de seguridad de la base de datos (Firebase) |
| `wrangler.jsonc` | Configuración de Cloudflare Workers |

## Cómo funciona

- La web lee los coches y los ajustes de **Firebase Firestore**. Si la base de datos no responde, enseña los coches que vienen en `public/js/inventory.js`.
- El **panel** (`/admin`) permite añadir, editar y marcar coches como reservados o vendidos, subir fotos, leer los mensajes del formulario y cambiar horario, aviso de portada, WhatsApp y nota de Google.
- Solo pueden editar las cuentas que tengan un documento en la colección `admins` de Firestore (el ID del documento es el UID del usuario).
- Cloudflare despliega la web automáticamente cada vez que se sube un cambio a la rama `main`.

## Dar acceso a un administrador

1. Firebase → Authentication → Usuarios → **Agregar usuario** (correo y contraseña).
2. Copia su **UID**.
3. Firestore → crea la colección `admins` con un documento cuyo ID sea ese UID (vale cualquier campo, por ejemplo `nombre`).
