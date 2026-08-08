# TASK

## Descripción
Este documento define cómo se debe trabajar por ticket, realizando tareas en ramas individuales según corresponda y mediante pull requests. Está dirigido a modelos/agentes que ejecutan el flujo de trabajo de Git de forma autónoma.

## Requisitos previos: determinar el modo de trabajo
Antes de iniciar, determinar si la tarea usa **Jira** o **no usa Jira**:
- **Con Jira**: la tarea tiene un identificador con formato `ABC-123` (prefijo de proyecto en mayúsculas + guion + número).
- **Sin Jira**: la tarea no tiene ese identificador; se trabaja únicamente con prefijo/categoría.

Este modo determina el formato de commits y títulos de PR (ver `Convenciones`).


## Ciclo del flujo de trabajo
1. **Crear la rama** desde la rama base `main` (o la que el equipo indique explícitamente).
   - Comando: `git checkout main && git pull && git checkout -b <prefijo>/<categoria>`
   - Revisar la sección `Convención de nombres de ramas`.
2. **Implementar** la funcionalidad, la corrección o modificación solicitada.
3. **Verificar que los tests pasan** ejecutando el comando de test del proyecto (ej. `npm test`, `pytest`, etc.).
   - Si los tests fallan: corregir el código y repetir este paso. No continuar al paso 4 mientras existan fallos.
4. **Realizar el commit.**
   - Comando: `git add . && git commit -m "<mensaje>"` (Para poder hacer git add . se debe mantener el .gitignore con los archivos que no deben llegar al remoto).
   - El formato del mensaje depende del modo de trabajo (ver `Convención de commit`).
5. **Crear la pull request** contra la rama base `main`.
   - Comando: `gh pr create --base main --title "<titulo>" --body "<descripción>"`
   - El formato del título depende del modo de trabajo (ver `Convención de título de pull request`).
6. **Verificar que los workflows (CI) pasen.**
   - Si fallan: corregir el código en la misma rama, hacer un nuevo commit (no usar `amend`) y volver al paso 3.
   - Si pasan: continuar al paso 7.
7. **Realizar squash and merge y eliminar rama** de la pull request hacia `main`.
   - Comando: `gh pr merge --squash --delete-branch`

## Convenciones

### Convención de nombres de ramas
Estructura: `prefijo/categoría`
- **Prefijo**: indica el tipo de trabajo.
- **Categoría**: describe el cambio o la funcionalidad, en minúsculas y separada por guiones si tiene varias palabras.

Prefijos válidos y su uso:

| Prefijo | Uso |
|---|---|
| `feature` | Nueva funcionalidad |
| `bugfix` | Corrección de un error no crítico |
| `fix` | Corrección menor |
| `hotfix` | Corrección urgente en producción |
| `release` | Preparación de una versión |
| `docs` | Cambios de documentación |
| `refactor` | Refactorización sin cambio de comportamiento |
| `test` | Cambios o adición de tests |
| `chore` | Tareas de mantenimiento (dependencias, config, etc.) |
| `ci` | Cambios en pipelines de integración continua |

Ejemplos: `feature/login`, `bugfix/api-timeout`, `hotfix/payment-crash`, `docs/readme`.

### Convención de commit y de título de pull request
Los commits y los títulos de pull request usan el **mismo formato**, que depende del modo de trabajo:

- **Sin Jira**: `<prefijo>/<categoría>: <mensaje>`
  - Ejemplo: `feature/login: agrega validación de formulario de inicio de sesión`
- **Con Jira**: `<identificador-jira>: <mensaje>`
  - Ejemplo: `PROJ-123: agrega validación de formulario de inicio de sesión`

Reglas del `<mensaje>`:
- En minúsculas, salvo nombres propios.
- Modo imperativo (ej. "agrega", "corrige", "elimina"), no gerundio ni pasado.
- Debe resumir el conjunto de cambios de la rama, no un cambio puntual dentro de ella.
- Sin punto final.
