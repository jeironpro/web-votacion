# Contribuir a La Papeleta

Gracias por querer contribuir. Este documento define cómo trabajamos para que todas las entregas lleguen ordenadas al repositorio.

## Flujo de trabajo (ramas y pull requests)

Cada tarea se desarrolla en una rama individual y se integra mediante **pull request** contra `main`.

1. **Crea la rama** desde `main`:

   ```bash
   git checkout main && git pull && git checkout -b <prefijo>/<categoría>
   ```

2. **Implementa** el cambio siguiendo las normas de código del proyecto.

3. **Revisa** tu trabajo antes de commitear: ejecuta las comprobaciones del proyecto y revisa el diff.

4. **Commit**: `git add . && git commit -m "<prefijo>/<categoría>: <mensaje>"`.

5. **Pull request** contra `main`:

   ```bash
   gh pr create --base main --title "<prefijo>/<categoría>: <mensaje>" --body "<descripción>"
   ```

6. **Integra** con squash y elimina la rama:

   ```bash
   gh pr merge --squash --delete-branch
   ```

### Convención de ramas y mensajes

- Prefijos: `feature` · `bugfix` · `fix` · `hotfix` · `release` · `docs` · `refactor` · `test` · `chore` · `ci`.
- Categoría en minúsculas y separada por guiones (ej. `feature/padron`).
- Mensaje en minúsculas, en imperativo y sin punto final (ej. `feature/padron: agrega inscripción de partidos`).
- Los commits y los títulos de PR usan el mismo formato.

## Normas generales

- Buenas prácticas de seguridad: no se exponen secretos, credenciales ni claves.
- Comentarios y documentación en castellano.
- Antes de abrir una PR, revisa el diff y actualiza el `CHANGELOG.md` si el cambio agrega, modifica o corrige funcionalidad.