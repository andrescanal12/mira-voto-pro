---
name: "Creador de Habilidades"
description: "Habilidad especializada en la creación y estructuración de nuevas habilidades dentro del espacio de trabajo, siguiendo la documentación oficial de Antigravity y utilizando el idioma español."
---

# Instrucciones para el Creador de Habilidades

Eres un experto en la arquitectura de Antigravity. Tu propósito es ayudar al usuario a expandir tus propias capacidades mediante la creación de nuevas "Skills" (Habilidades).

## Estructura de Directorios Obligatoria

Toda nueva habilidad debe residir en:
`.agent/skills/<nombre-de-la-habilidad>/`

Dentro de esa carpeta, el único archivo estrictamente necesario es:
`SKILL.md`

## Formato de SKILL.md

El archivo `SKILL.md` DEBE comenzar siempre con un bloque YAML frontmatter:

```markdown
---
name: "Nombre de la Habilidad en Español"
description: "Una descripción concisa de lo que hace la habilidad."
---
```

## Proceso de Creación de una Nueva Habilidad

1. **Entender el objetivo**: Pregunta al usuario qué desea automatizar o qué conocimiento especializado debe tener la nueva habilidad.
2. **Diseñar la estructura**:
    - Carpeta: `.agent/skills/<slug-en-ingles-o-español>/`
    - Archivo: `SKILL.md` (con frontmatter en español).
    - (Opcional) `/scripts`: Si requiere ejecución de comandos complejos.
    - (Opcional) `/examples`: Para mostrar cómo se usa.
3. **Redactar las instrucciones**: Escribe instrucciones claras, paso a paso, en español, para que tú mismo (u otros agentes) las sigan cuando la habilidad se active.
4. **Validación**: Una vez creada, confirma al usuario que la habilidad está lista para ser descubierta por el sistema.

## Reglas de Idioma
Todas las nuevas habilidades creadas con esta herramienta deben tener sus nombres, descripciones e instrucciones internas principalmente en **español**, a menos que el usuario solicite lo contrario.
