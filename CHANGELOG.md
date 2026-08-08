# Changelog

Todos los cambios notables de **La Papeleta** se documentan aquí.

El formato sigue [Keep a Changelog](https://keepachangelog.com/es-ES/1.1.0/) y este proyecto usa [Versionado Semántico](https://semver.org/lang/es/).

## [0.2.0] — 2026-08-08

### Added

- Padrón funcional en el panel derecho: alta de partidos con nombre y color de campaña (paleta de 10 sellos).
- Validación del formulario (nombre obligatorio, máx. 40 caracteres, sin duplicados, color válido) con estados de error accesibles.
- Baja de partidos optimista desde el padrón, con aviso de deshacer.
- Persistencia del estado en `localStorage` (servicio `storage.js`) y renderizado seguro en módulos ES (`dom.js`, sin `innerHTML`).
- Presentación mínima de los partidos en la columna principal; el escrutinio llega en la siguiente entrega.

## [0.1.0] — 2026-08-08

### Added

- Estructura de proyecto vanilla (HTML + CSS + JS), con carpetas `css/`, `js/`, `assets/` y `docs/`.
- Sistema de tokens de diseño: paleta OKLCH (papel marfil, tinta sepia, acento rojo de papeleta), tipografías (Fraunces, Source Serif 4, IBM Plex Mono), escala 4 pt y movimiento.
- Esqueleto de la página a viewport completo: masthead de papeleta, columna principal, padrón derecho deslizable en móvil y colofón. *(Se completa en las próximas entregas.)*
- Metadatos del repositorio: `.gitignore`, `.editorconfig`, `README.md`, `CONTRIBUTING.md`, `CODE_OF_CONDUCT.md`.