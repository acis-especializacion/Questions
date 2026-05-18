# ACIS Quiz Generator

Sistema web para la creación de cuestionarios tipo test con exportación a formato XML compatible con Moodle.

## Características

- **Registro de docentes** — Pantalla de bienvenida obligatoria para registrar al menos un docente
- **CRUD de preguntas** — Crear, leer, actualizar y eliminar preguntas de opción múltiple
- **Hasta 6 alternativas** por pregunta, con selección de respuesta correcta mediante radio button
- **Selección de docente** — Combobox con búsqueda (Headless UI) en el panel lateral
- **Agrupación visual** — Las preguntas se agrupan por docente en la lista
- **Soporte de imágenes** — Agregar/quitar imagen desde el modal de vista previa (formato base64)
- **Exportación XML Moodle** — Descarga un archivo XML listo para importar en Moodle
- **Confirmación modal** — Diálogos de confirmación para reiniciar la app y descargar XML
- **Persistencia local** — Los datos se guardan automáticamente en localStorage
- **Diseño responsive** — Sidebar adaptable, panel derecho con scroll y footer fijo

## Tecnologías

| Tecnología | Versión |
|---|---|
| React | 19 |
| TypeScript | 5.8 |
| Vite | 6 |
| Tailwind CSS | 4 |
| Zustand | 5 |
| Headless UI | 2 |
| Heroicons | 2 |
| react-toastify | 11 |

## Instalación

```bash
# Clonar el repositorio
git clone <repo-url>
cd questions

# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm run dev
```

La app se abre automáticamente en `http://localhost:3000`.

## Estructura del proyecto

```
src/
├── App.tsx                    # Layout principal, generación XML, modales
├── store.ts                   # Estado global (Zustand + persist)
├── types/index.ts             # Tipos Question, DraftQuestion, Option, Teacher
├── utils/index.ts             # Funciones auxiliares
├── index.css                  # Estilos globales (Tailwind + Poppins)
└── components/
    ├── Welcome.tsx            # Pantalla de registro de docentes
    ├── Sidebar.tsx            # Formulario de preguntas en panel lateral
    ├── QuizDetail.tsx         # Tarjeta de pregunta en la lista
    ├── ViewModal.tsx          # Modal de detalle + gestión de imágenes
    ├── ConfirmModal.tsx       # Modal de confirmación (reset/download)
    └── TeacherCombobox.tsx    # Combobox con búsqueda para docentes
```

## Flujo de uso

1. **Registro de docentes** — Al iniciar la app, se muestra la pantalla de bienvenida. Ingrese al menos un docente para continuar.
2. **Crear preguntas** — En el panel lateral izquierdo, seleccione un docente, escriba la pregunta, agregue alternativas (mínimo 3, máximo 6), marque la correcta y opcionalmente añada retroalimentación.
3. **Gestionar preguntas** — Cada pregunta en la lista tiene botones para 👁 ver detalle, ✏️ editar (carga los datos en el panel lateral) y 🗑 eliminar.
4. **Agregar imagen** — Desde el modal de vista (👁), puede agregar, cambiar o quitar una imagen por pregunta.
5. **Exportar a Moodle** — Presione el botón de descarga ⬇️ en el encabezado, confirme y obtendrá un archivo `Cuestionario.xml`.
6. **Reiniciar** — El botón 🔄 rojo elimina todas las preguntas y docentes, y recarga la app.

## Formato XML de exportación

El XML generado sigue el estándar Moodle para preguntas de opción múltiple:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<quiz>
  <question type="multichoice">
    <name>
      <text>Pregunta 01 — Nombre Docente</text>
    </name>
    <questiontext format="html">
      <text><![CDATA[
        <p>Texto de la pregunta</p>
        <p><img src="@@PLUGINFILE@@/image-01.png" /></p>
        <small style="color: #999;">#01 — Nombre Docente</small>
      ]]></text>
      <file name="image-01.png" path="/" encoding="base64">
        iVBORw0KGgo...
      </file>
    </questiontext>
    <answer fraction="100" format="html">
      <text><![CDATA[<p>Alternativa correcta</p>]]></text>
    </answer>
    <answer fraction="0" format="html">
      <text><![CDATA[<p>Alternativa incorrecta</p>]]></text>
    </answer>
  </question>
</quiz>
```

Las imágenes se codifican en base64 y se envuelven a 76 caracteres por línea para compatibilidad con Moodle.

## Persistencia de datos

- **Preguntas**: Se almacenan en localStorage bajo la clave `questions-store` mediante Zustand persist
- **Docentes**: Se almacenan en localStorage bajo la clave `docentes`

Ambas persisten entre sesiones del navegador.

## Scripts disponibles

| Comando | Descripción |
|---|---|
| `npm run dev` | Inicia servidor de desarrollo (puerto 3000) |
| `npm run build` | Compila TypeScript y construye para producción |
| `npm run preview` | Vista previa de la build de producción |
| `npm run lint` | Ejecuta ESLint |
