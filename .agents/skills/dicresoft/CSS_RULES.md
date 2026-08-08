# CSS RULES

## Descripción
Este documento define las reglas específicas de CSS, aplicables sin importar el stack que lo consuma (HTML vanilla, React, React Native/Expo usa su propio sistema de estilos y no aplica aquí).

## Responsive
El diseño responsive siempre se implementa con media queries (o `container queries` si el proyecto ya las adoptó explícitamente); no se permite maquetación fija sin puntos de quiebre. Se sigue un enfoque **mobile-first**: los estilos base son para móvil y las media queries amplían el layout hacia pantallas más grandes (`min-width`), no al revés.

## Variables y libro de estilo
Los valores del libro de estilo (`GENERALS_RULES.md`: colores, tipografía, espaciados) se definen como **custom properties** de CSS (`--color-primary`, `--spacing-md`) en un único punto centralizado, y se referencian desde ahí en todo el proyecto — no se repiten valores hex o `px` sueltos por los distintos archivos de estilos.

## Nomenclatura de clases
Se sigue una convención de nombres consistente en todo el proyecto (ej. BEM: `bloque__elemento--modificador`), evitando nombres genéricos de una sola palabra (`.title`, `.box`) que puedan chocar entre componentes distintos.

## Especificidad
No se usa `!important` salvo para sobreescribir estilos de una librería de terceros que no expone otra vía; nunca para resolver conflictos de especificidad dentro del propio código del proyecto (en ese caso se reordena o se ajusta la especificidad real de los selectores).
