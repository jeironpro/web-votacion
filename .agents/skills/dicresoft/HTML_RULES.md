# HTML RULES

## Descripción
Este documento define las reglas específicas de HTML.

## Estructura semántica
Siempre se usa estructura semántica (`header`, `nav`, `main`, `section`, `article`, `footer`, etc.); no se usan `div`/`span` para elementos que tienen una etiqueta semántica equivalente.

## Accesibilidad
- Toda imagen que aporta información lleva `alt` descriptivo; las imágenes puramente decorativas usan `alt=""` (no se omite el atributo).
- Los elementos interactivos que no son nativamente accesibles (ej. un `div` usado como botón) llevan los atributos ARIA correspondientes (`role`, `aria-label`) — aunque la preferencia siempre es usar el elemento nativo (`button`, `a`) en vez de recurrir a ARIA para simularlo.
- Los formularios asocian cada `input` con su `label` correspondiente (`for`/`id`), no se usa solo `placeholder` como única indicación del campo.
- El orden del DOM respeta un orden de lectura/tabulación lógico; no se reordena visualmente con CSS de forma que contradiga el orden semántico sin necesidad.

## Metadatos
Todo documento HTML define `<html lang="es">` (o el idioma correspondiente), `<meta charset="utf-8">`, `<meta name="viewport" content="width=device-width, initial-scale=1">`, y un `<title>` descriptivo por página.
