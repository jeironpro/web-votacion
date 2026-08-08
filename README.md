# La Papeleta

## Descripción

**La Papeleta** es una aplicación web de votación por partidos, pensada como pieza de portafolio. Cualquier persona vota por un partido —entre los inscritos— y el partido con más votos gana. El escrutinio es único, vivo y en abierto.

La página ocupa **todo el viewport**: la papeleta (filas de partidos con barras de porcentaje y recuento) llena la zona principal, y un **padrón derecho** permite inscribir y retirar partidos con su color de campaña.

Puntos de diseño:

- Un voto total por persona, **modificable** (el voto anterior se descuenta al cambiar).
- El partido en cabeza aparece señalado con «va en cabeza» en la mesa de escrutinio.
- Persistencia **local** (`localStorage`): sin servidores, sin cuentas. Los datos viven únicamente en el navegador.
- Estilo editorial de papeleta/urna: Fraunces + Source Serif 4 + IBM Plex Mono.

## Requisitos

- Un navegador moderno (Chrome, Edge, Firefox, Safari). Sin dependencias ni instalación.

## Uso

El proyecto es HTML, CSS y JS en estado puro (vanilla). Dos formas de abrirlo:

1. **Directo local**: doble clic sobre `index.html`.
2. **Con un servidor local** (recomendado, porque el JS usa módulos ES):

   ```bash
   # Python
   python3 -m http.server 8080

   # Node
   npx serve .
   ```

   Y abrir `http://localhost:8080`.

> Los módulos `js/` requieren servirse vía HTTP(S); abrir `index.html` con el protocolo `file://` puede bloquearlos.

## Cómo funciona

1. **Inscribe un partido** en el padrón derecho: nombre + color de campaña.
2. **Vota** desde la papeleta pulsando el botón de un partido. El voto es único y modificable.
3. **Sigue el escrutinio**: barras de porcentaje, votos por partido, total emitido y quién va en cabeza.
4. **Retira un partido** desde el padrón (con deshacer disponible).

El estado se guarda en `localStorage`: al recargar, el resultado permanece.

## Estructura

```
index.html
css/
  reset.css          reinicio mínimo
  tokens.css         tokens de diseño (colores, tipografía, espacios)
  layout/app.css     esqueleto del viewport (masthead + shell + padrón + colofón)
  components/        botones, formulario, papeleta, padrón, avisos
  style.css          base tipográfica y de superficie
js/
  app.js             punto de entrada
  modules/           partidos, votos, render
  services/          storage (localStorage)
  utils/             utilidades seguras de DOM
assets/              favicon
docs/                documentación (arquitectura, casos de uso, maquetas)
```

## Contribuir

Consulta [`CONTRIBUTING.md`](CONTRIBUTING.md).

## Licencia

MIT. Consulta [`LICENSE`](LICENSE).
