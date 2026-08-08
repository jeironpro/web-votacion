# JAVASCRIPT RULES

## Descripción
Este documento define las reglas específicas de JavaScript, aplicables a cualquier proyecto que lo use (vanilla, React, React Native/Expo).

## Inyección de HTML
No se permite ningún método que inyecte HTML de forma insegura: `innerHTML`, `outerHTML`, `insertAdjacentHTML`, ni (en React/React Native) `dangerouslySetInnerHTML`. Si se necesita renderizar contenido dinámico, se usa el renderizado seguro del framework (JSX/texto) o una librería de sanitización explícitamente aprobada para el proyecto.

## Declaración de variables
No se usa `var`. Se usa `const` por defecto; `let` solo cuando la variable realmente se reasigna.

## Comparaciones
Se usa siempre igualdad estricta (`===`/`!==`); no se usa `==`/`!=` salvo el caso explícito de comparar contra `null`/`undefined` a la vez (`x == null`).

## Asincronía
Se usa `async`/`await` para código asíncrono, no cadenas de `.then()` anidadas ni callbacks, salvo APIs de terceros que solo expongan callbacks. Toda promesa/`await` que pueda fallar se envuelve en `try/catch` con manejo explícito del error (no se descartan errores silenciosamente).

## Valores literales
No se usan "números mágicos" ni strings repetidos sin explicación en la lógica de negocio (ej. `if (status === 3)`); se declaran como constantes con nombre (`const STATUS_APPROVED = 3`).

## Módulos
Se usa `import`/`export` (ES Modules); no se usa `require` en proyectos nuevos (ver también `NODEJS_RULES.md`).
