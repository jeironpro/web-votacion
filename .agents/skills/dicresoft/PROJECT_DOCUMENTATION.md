# PROJECT DOCUMENTATION

## Descripción
Este documento define cómo se debe crear y editar los archivos de documentación del proyecto en el que se está trabajando. Está dirigido a modelos/agentes que mantienen esta documentación de forma autónoma.

## Clasificación

| Categoría | Archivos |
|---|---|
| Documentación | `README.md`, `CHANGELOG.md`, `FAQ.md`, `docs/` |
| Colaboración | `CONTRIBUTING.md`, `CODE_OF_CONDUCT.md` |
| Licencias y aspectos legales | `LICENSE`, `NOTICE` |
| Seguridad | `SECURITY.md` |
| Metadatos del repositorio | Todo lo anterior, más archivos de configuración como `.gitignore`, `.editorconfig`, etc. |

## Reglas por categoría

### Documentación (`README.md`, `CHANGELOG.md`, `FAQ.md`, `docs/`)
Se deben mantener actualizados. Disparadores explícitos:

| Evento | Acción |
|---|---|
| Se agrega una funcionalidad | Actualizar `README.md` (si afecta uso/instalación) y agregar entrada en `CHANGELOG.md` bajo `Added` |
| Se modifica una funcionalidad existente | Actualizar la sección correspondiente en `README.md` y/o `docs/`, y agregar entrada en `CHANGELOG.md` bajo `Changed` |
| Se elimina una funcionalidad | Eliminar o marcar como obsoleta en `README.md`/`docs/`, y agregar entrada en `CHANGELOG.md` bajo `Removed` |
| Se corrige un bug | Agregar entrada en `CHANGELOG.md` bajo `Fixed` |
| Surge una pregunta repetida de usuarios/colaboradores | Agregar entrada a `FAQ.md` |

`CHANGELOG.md` sigue el formato [Keep a Changelog](https://keepachangelog.com/): secciones `Added`, `Changed`, `Deprecated`, `Removed`, `Fixed`, `Security`, agrupadas por versión y fecha.

`docs/`: un archivo Markdown por tema o funcionalidad, nombrado en minúsculas y guiones (ej. `docs/authentication.md`).

Contenido mínimo obligatorio de `docs/`, según el tipo de proyecto:

**Todos los proyectos** deben incluir:
- Funcionamiento completo del software.
- Infraestructura del software.
- Casos de uso.

**Proyectos backend** deben incluir además:
- Diagrama lógico de base de datos.
- Diagrama entidad-relación de base de datos.
- Arquitectura frontend-backend (si el proyecto expone API a un front-end).

**Proyectos frontend** deben incluir además:
- Diagrama de flujos.
- Mapa de navegación.
- Wireframe de baja fidelidad.
- Wireframe de alta fidelidad.
- Diseño UI/UX.
- Libro de estilo (ver regla específica en `RULES.md`).

**Proyectos full-stack**: incluyen todos los puntos de backend y frontend.

### Colaboración (`CONTRIBUTING.md`, `CODE_OF_CONDUCT.md`)
Se crean una única vez con una estructura sólida al inicio del proyecto. Después de creados:
- **No se edita su contenido de forma autónoma** salvo corrección de erratas o enlaces rotos.
- Cualquier cambio de fondo (nuevas reglas de contribución, cambios en el código de conducta) requiere confirmación explícita de una persona antes de aplicarse.

### Licencias y aspectos legales (`LICENSE`, `NOTICE`)
- `LICENSE`: se crea una sola vez al inicio del proyecto. No se modifica de forma autónoma bajo ninguna circunstancia; un cambio de licencia siempre requiere decisión humana explícita.
- `NOTICE`: se puede editar para agregar atribuciones de terceros cuando se incorpora una dependencia que lo requiera.

### Seguridad (`SECURITY.md`)
Se debe mantener actualizado. Debe incluir siempre:
- Versiones del proyecto actualmente soportadas con parches de seguridad.
- Proceso para reportar una vulnerabilidad (canal de contacto, tiempo de respuesta esperado).

Actualizar cuando: cambian las versiones soportadas, o cambia el canal/proceso de reporte.

### Metadatos del repositorio (`.gitignore`, `.editorconfig`, etc.)
Se actualizan cuando el proyecto incorpora una herramienta, lenguaje o entorno que lo requiera (ej. agregar `node_modules/` a `.gitignore` al introducir Node.js). No se recrean desde cero salvo que estén ausentes.
