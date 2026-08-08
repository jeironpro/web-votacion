# STACK: HTML + CSS + JS Vanilla

## Cuándo usar este stack
Si el proyecto es una aplicación web básica, no interactiva o poco dinámica (landing pages, prototipos, sitios ligeros), se usa **HTML, CSS y JS Vanilla**.

## Reglas de código aplicables
Este documento define únicamente la arquitectura y estructura de carpetas. Las reglas de código, linters, testing, diseño y documentación son las ya definidas en: `HTML_RULES.md`, `CSS_RULES.md`, `JAVASCRIPT_RULES.md`, `PRE-COMMIT.md`, `TESTING.md`, `DESIGN.md`, `DOCUMENTATION.md`, `GENERALS_RULES.md`.

### Arquitectura HTML, CSS y JS Vanilla:
┌─────────────────────────────────────────────────┐
│               Sitio Web Estático                │
│                                                 │
│                 ┌────────────┐                  │
│                 │ index.html │                  │
│                 │(Estructura)│                  │
│                 └──────┬─────┘                  │
│                        │                        │
│          ┌─────────────┼─────────────┐          │
│          ▼             ▼             ▼          │
│      ┌──────────┐ ┌────────┐ ┌──────────┐       │
│      │styles.css│ │ app.js │ │ assets/  │       │
│      │ (Diseño) │ │(Lógica)│ │(img/font)│       │
│      └──────────┘ └────┬───┘ └──────────┘       │
│                        │                        │
│          ┌─────────────┼─────────────┐          │
│          ▼             ▼             ▼          │
│      ┌─────────┐ ┌─────────┐ ┌───────────┐      │
│      │ modules/│ │ utils/  │ │  vendor/  │      │
│      │(ES6 mod)│ │(helpers)│ │(librerías)│      │
│      └─────────┘ └─────────┘ └───────────┘      │
└─────────────────────────────────────────────────┘
          │
          ▼
┌──────────────────────────────────────────────────┐
│                  Hosting / CDN                   │
│         (Netlify, Vercel, GitHub Pages)          │
└──────────────────────────────────────────────────┘

Flujo: Navegador solicita index.html → descarga styles.css y app.js → HTML estructura el DOM → CSS aplica estilos → JS manipula el DOM (eventos, fetch, etc.) → interacción usuario → ciclo continúa.

Stack: HTML5 semántico, CSS3 (Flexbox/Grid, Custom Properties, Media Queries), JavaScript ES6+ (módulos, async/await, fetch), estructura plana sin bundler, ideal para landing pages, prototipos y sitios ligeros.

### Estructura:
mi_sitio/
├── index.html
├── pages/
│   ├── about.html
│   ├── contact.html
│   ├── blog/
│   │   ├── post-1.html
│   │   └── post-2.html
│   └── auth/
│       ├── login.html
│       └── register.html
├── css/
│   ├── style.css
│   ├── reset.css
│   ├── variables.css
│   ├── components/
│   │   ├── navbar.css
│   │   ├── cards.css
│   │   ├── buttons.css
│   │   ├── forms.css
│   │   └── modal.css
│   ├── layout/
│   │   ├── header.css
│   │   ├── footer.css
│   │   └── grid.css
│   └── pages/
│       ├── home.css
│       ├── about.css
│       └── contact.css
├── js/
│   ├── app.js              # entry point
│   ├── modules/
│   │   ├── navigation.js
│   │   ├── carousel.js
│   │   ├── accordion.js
│   │   └── formValidator.js
│   ├── services/
│   │   ├── api.js
│   │   └── contactService.js
│   ├── utils/
│   │   ├── dom.js
│   │   ├── format.js
│   │   └── debounce.js
│   └── vendor/
│       ├── alpine.min.js
│       └── swiper-bundle.min.js
├── assets/
│   ├── images/
│   │   ├── logo.svg
│   │   ├── hero.webp
│   │   └── icons/
│   ├── fonts/
│   │   └── inter-variable.woff2
│   └── docs/
├── favicon.ico
├── robots.txt
├── sitemap.xml
└── 404.html
