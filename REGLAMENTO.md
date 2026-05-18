# Reglamento de Actualización y Mantenimiento — Questions

## 1. Estructura de Commits y Ramas

- **Rama principal:** `main` — siempre estable y desplegable
- **Ramas de características:** `feature/<nombre>` para nuevas funcionalidades
- **Ramas de corrección:** `fix/<descripcion>` para bugs
- **Mensajes de commit:** Usar [Conventional Commits](https://www.conventionalcommits.org/):
  - `feat:` nueva funcionalidad
  - `fix:` corrección de bug
  - `refactor:` cambio sin agregar funcionalidad ni corregir bug
  - `style:` cambios de formato/estilo
  - `docs:` documentación
  - `chore:` tareas de mantenimiento

## 2. Flujo para Agregar Nueva Funcionalidad

1. Crear rama `feature/<nombre>` desde `main`
2. Implementar siguiendo la arquitectura existente (types → store → componentes)
3. Verificar que `npm run build` pase sin errores
4. Verificar que `npm run lint` pase sin errores
5. Hacer merge a `main` mediante PR (si hay colaboradores) o merge directo
6. Eliminar la rama de feature

## 3. Estándares de Código

- **TypeScript estricto:** Todos los archivos nuevos deben ser `.tsx`/`.ts` con tipos definidos
- **Estado global:** Toda la lógica de estado debe ir en `store.ts` usando Zustand
- **Componentes puros:** Los componentes deben recibir datos por props, no acceder al store directamente a menos que sea necesario
- **Sin comentarios inline:** El código debe ser auto-documentado
- **Naming:**
  - Componentes: PascalCase (`QuizDetail.tsx`)
  - Utilidades/funciones: camelCase (`labelOptions`)
  - Tipos: PascalCase (`DraftQuestion`)
  - Constantes: camelCase

## 4. Pruebas

- Toda nueva funcionalidad debe incluir tests unitarios
- Usar Vitest (ya incluido en el ecosistema Vite)
- Ubicar tests junto al archivo: `Form.test.tsx`, `store.test.ts`
- Ejecutar `npx vitest` antes de hacer merge

## 5. Versionado Semántico

- **MAJOR (x.0.0):** Cambios incompatibles (ej: cambiar formato de exportación)
- **MINOR (0.x.0):** Nuevas funcionalidades compatibles (ej: agregar importación)
- **PATCH (0.0.x):** Correcciones de bugs
- Actualizar la versión en `src/App.tsx` (footer) y `package.json`

## 6. Stack Tecnológico — Reglas

| Tecnología | Permitido | Observaciones |
|---|---|---|
| React 19 | ✅ | No migrar a otra versión sin discusión |
| TypeScript | ✅ | Siempre estricto |
| Zustand | ✅ | Única solución de estado global |
| Tailwind CSS 4 | ✅ | No agregar CSS modules ni SASS |
| Headless UI | ✅ | Para modales, menús, etc. |
| Vitest | ✅ Para tests | No agregar Jest |
| React Router | ✅ Si se necesita | Para futuras páginas |
| react-query | ⚠️ Solo si hay API | No necesario hoy |

## 7. Mejoras Prioritarias Recomendadas

1. **Alta:**
   - Agregar tests unitarios (Vitest)
   - Corregir typo `coutn` → `count` en `Sidebar.tsx`
   - Agregar categorización de preguntas
   - Validación más estricta en el formulario

2. **Media:**
   - Funcionalidad de importación XML
   - Búsqueda y filtrado de preguntas
   - Soporte para otros tipos de pregunta Moodle

3. **Baja:**
   - Tema oscuro
   - Autenticación multi-usuario
   - Paginación

## 8. Checklist Pre-Merge

```
[ ] `npm run build` exitoso
[ ] `npm run lint` sin errores
[ ] Tests nuevos pasan
[ ] Tipos TypeScript correctos
[ ] No hay console.log ni código comentado
[ ] README.md actualizado si hay cambios relevantes
[ ] Versión actualizada según semver
```
