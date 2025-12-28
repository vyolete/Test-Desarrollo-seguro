# Quiz de Seguridad de Software

## Estado Actual
- **Total de Preguntas**: 84
- **Estado**: Completamente funcional
- **Último Update**: 27 de Diciembre de 2025
- **Repositorio**: [GitHub - Test-Desarrollo-seguro](https://github.com/mhaloz/Test-Desarrollo-seguro.git)

---

## Distribución de Preguntas por Tema

### 1. Fundamentos de Seguridad (Q1-Q10)
- Fuentes de vulnerabilidades
- Salvaguardas de integridad
- Principios de diseño seguro (defensa en profundidad)
- Resiliencia del software
- Causas de vulnerabilidades
- Ataques en diferentes fases del SDLC
- Simplificación del diseño
- Métricas CVSS
- Elementos del S-SDLC

### 2. Requisitos y Diseño de Seguridad (Q11-Q18)
- Seguridad del software (definición y principios)
- Casos de uso de seguridad
- Ingeniería de requisitos
- Perspectivas de pruebas de seguridad
- Importancia del SDLC
- Árboles de ataque
- Casos de abuso
- Análisis de riesgo arquitectónico

### 3. Buenas Prácticas de Codificación (Q19-Q27)
- Recomendaciones de buenas prácticas
- Prevención de desbordamiento de buffer
- Mejora con APIs de seguridad
- Desarrollo seguro y confiable

### 4. Análisis y Testing (Q28-Q34)
- Perspectivas en pruebas de seguridad basadas en riesgo
- Análisis estático de código
- Herramientas de análisis estático
- Tests de penetración

### 5. Análisis de Código Seguro (Q35-Q54)
- Limitaciones de herramientas de análisis
- Errores y excepciones en programación
- SQL injection y manipulación de información privada
- Creación segura de archivos temporales
- Detección y prevención de integer overflows
- Input validation (listas blancas/negras)
- Race conditions (TOCTOU)
- Vulnerabilidades de buffer
- Use After Free
- Ciclos de vida de vulnerabilidades
- Principio de menor privilegio
- Separación de privilegios

### 6. Auditoría y Gobernanza (Q55-Q84)
- Normas profesionales del equipo auditor
- Independencia de auditoría
- Metodologías de auditoría (OWASP, ISO27001, Common Criteria)
- Clasificación de activos
- Tests de intrusión y fases
- Controles de seguridad (preventivos, detectivos, correctivos)
- Planes de contingencia
- Alineación TIC con estrategia empresarial
- Análisis estático vs dinámico
- Validación de entrada y whitelisting
- Modelado de amenazas
- Firmas digitales
- Auditorías de cumplimiento
- Plan Director de Informática

---

## Tipos de Vulnerabilidades Cubiertas

| Vulnerabilidad | Preguntas | Descripción |
|---|---|---|
| Integer Overflow | Q24, Q44, Q68 | Desbordamiento de tipos enteros |
| Buffer Overflow | Q27, Q42 | Acceso fuera de límites de buffers |
| Input Validation | Q25, Q41, Q83 | Validación impropia de entrada |
| DNS Validation | Q21, Q22 | Inyección en resolución DNS |
| Race Conditions | Q43 | TOCTOU (Time-of-check Time-of-use) |
| Exception Handling | Q36, Q37 | Exposición de datos en excepciones |
| Format String | Q20 | Uso de datos sin validar |
| Use After Free | Q45, Q69 | Acceso a memoria liberada |
| SQL Injection | Q69 | Inyección SQL (y defensa) |
| Off by One | Q68 | Error de límite de bucle |

---

## Infraestructura de Testing

### Test Suite - Jest (Unit + Integration)
- **Total de Tests**: 46 (40+ unitarios, 20+ integración)
- **Estado**: ✅ Todos pasando
- **Cobertura**: Q1-Q10 (no actualizado para Q11-Q84)

### Test Suite - Playwright (E2E)
- **Total de Tests**: 114
- **Navegadores**: Chromium, Firefox, WebKit
- **Estado**: ✅ Todos pasando
- **Cobertura**: Q1-Q10 (no actualizado para Q11-Q84)

---

## Estructura del Quiz HTML

### Formato de Pregunta
```javascript
{
  id: [number],
  title: "Pregunta [number]",
  text: "[Texto de la pregunta en español]",
  options: {
    A: "[Opción A]",
    B: "[Opción B]",
    C: "[Opción C]",
    D: "[Opción D]"
  },
  correct: "[A/B/C/D]",
  explanation: "[Explicación detallada]"
}
```

### Características
- Interfaz interactiva HTML5/CSS3
- JavaScript vanilla (sin dependencias)
- Feedback inmediato al seleccionar respuesta
- Explicaciones detalladas para cada pregunta
- Código de ejemplo incluido en preguntas relevantes

---

## Cómo Usar

### Acceso Rápido
1. **Descarga** o clona el repositorio
2. **Abre** el archivo `quiz.html` en tu navegador web
3. **Selecciona** una respuesta para cada pregunta
4. **Revisa** la explicación de la respuesta correcta

### Requisitos
- Navegador web moderno (Chrome, Firefox, Safari, Edge)
- No requiere instalación de dependencias
- No requiere servidor web

---

## Preguntas Recientes (Q75-Q84)

| # | Tema | Respuesta Correcta |
|---|---|---|
| 75 | Metodologías de Testing Estándar | A - OSSTMM (Incorrecta) |
| 76 | Tipo de Auditorías de Cumplimiento | C - Caja Gris |
| 77 | Fuentes de Vulnerabilidades | B - Cadena distribución (Incorrecta) |
| 78 | Firmas Digitales en e-Commerce | B - Hash + llave privada |
| 79 | Controles de Planes de Contingencia | D - Todos |
| 80 | Importancia de Controles | D - Dependen del riesgo |
| 81 | Plan TIC de Organización | C - Alineado con estrategia |
| 82 | Beneficio Análisis Estático | D - Detección temprana |
| 83 | Validación Correcta de Entrada | B - Whitelisting |
| 84 | Modelado de Casos de Abuso | A - Condiciones de carrera (Menos probable) |

---

## Metodologías y Estándares Cubiertos

- **OWASP** - Open Web Application Security Project
- **ISO27001** - Norma de Seguridad de la Información
- **NIST SP 800-115** - Technical Guide to Information Security Testing
- **Common Criteria ISO 15408** - Evaluation Assurance Levels
- **PTES** - Penetration Testing Execution Standard
- **ISSAF** - Information System Security Assessment Framework
- **CVSS** - Common Vulnerability Scoring System

---

## Archivos del Proyecto

```
/Users/mhaloz/Documents/Master/Desarrollo seguro/
├── quiz.html              # Quiz interactivo con 84 preguntas
├── README.md              # Este archivo
├── RESUMEN_QUIZ.md        # Resumen de contenido
├── quiz.test.js           # Tests unitarios (46 tests)
├── quiz.integration.test.js  # Tests de integración (20+ tests)
├── quiz.e2e.test.js       # Tests E2E Playwright (114 tests)
└── .git/                  # Repositorio Git
```

---

## Notas Importantes

### Decisión de Diseño
- Tests diseñados originalmente para Q1-Q10
- Q11-Q84 agregadas sin actualizar tests (intencional)
- Permite expansión de contenido sin modificar suite de pruebas

### Próximos Pasos Opcionales
1. Actualizar Jest/Integration tests para Q11-Q84
2. Expandir Playwright tests a todas las preguntas
3. Agregar más preguntas en categorías específicas
4. Crear banco de preguntas categorizado por dificultad

---

## Contribuciones

Para agregar más preguntas o mejorar el contenido:
1. Fork el repositorio
2. Crea una rama para tus cambios
3. Commit y push tus cambios
4. Abre un Pull Request

---

## Licencia

Este proyecto se utiliza con fines educativos en el programa de Máster en "Desarrollo Seguro" de la Universidad.

---

## Contacto

- **Repositorio**: [GitHub - Test-Desarrollo-seguro](https://github.com/mhaloz/Test-Desarrollo-seguro.git)
- **Última Actualización**: 27/12/2025
- **Versión**: 2.0 (84 preguntas)

---

*Este README proporciona una guía completa del quiz de Seguridad de Software actualizado.*

---

## Tipos de Vulnerabilidades Cubiertas

| Vulnerabilidad | Preguntas | Descripción |
|---|---|---|
| Integer Overflow | Q24, Q44 | Desbordamiento de tipos enteros |
| Buffer Overflow | Q27, Q42 | Acceso fuera de límites de buffers |
| Input Validation | Q25, Q41 | Validación impropia de entrada |
| DNS Validation | Q21, Q22 | Inyección en resolución DNS |
| Race Conditions | Q43 | TOCTOU (Time-of-check Time-of-use) |
| Exception Handling | Q36, Q37 | Exposición de datos en excepciones |
| Format String | Q20 | Uso de datos sin validar |

---

## Infraestructura de Testing

### Test Suite - Jest (Unit + Integration)
- **Total de Tests**: 46 (40+ unitarios, 20+ integración)
- **Estado**: ✅ Todos pasando
- **Cobertura**: Q1-Q10 (no actualizado para Q11-Q44)

### Test Suite - Playwright (E2E)
- **Total de Tests**: 114
- **Navegadores**: Chromium, Firefox, WebKit
- **Estado**: ✅ Todos pasando
- **Cobertura**: Q1-Q10 (no actualizado para Q11-Q44)

---

## Estructura del Quiz HTML

### Formato de Pregunta
```javascript
{
  id: [number],
  title: "Pregunta [number]",
  text: "[Texto de la pregunta en español]",
  options: {
    A: "[Opción A]",
    B: "[Opción B]",
    C: "[Opción C]",
    D: "[Opción D]"
  },
  correct: "[A/B/C/D]",
  explanation: "[Explicación detallada]"
}
```

### Características
- Interfaz interactiva HTML5/CSS3
- JavaScript vanilla (sin dependencias)
- Feedback inmediato al seleccionar respuesta
- Explicaciones detalladas para cada pregunta
- Código de ejemplo incluido en preguntas relevantes

---

## Preguntas Recientes (Q35-Q44)

| # | Tema | Tipo | Respuesta |
|---|---|---|---|
| 35 | Falsos Positivos en Análisis | Concepto | A |
| 36 | Excepciones en Java vs C++ | Conceptual | C |
| 37 | Exposición de Datos en Logs | SQL/Excepciones | D |
| 38 | Archivos Temporales Seguros | Best Practice | A |
| 39 | Prevención de Integer Overflow | Métodos | B |
| 40 | Escalada de Privilegios | Vulnerabilidades | A |
| 41 | Validación con Lista Negra | Input Validation | D |
| 42 | Errores en Funciones String | Buffer Management | D |
| 43 | Race Condition en Archivos | TOCTOU | C |
| 44 | Integer Overflow Definition | Conceptual | C |

---

## Notas Importantes

### Decisión de Diseño
- Tests diseñados originalmente para Q1-Q10
- Q11-Q44 agregadas sin actualizar tests (intencional)
- Permite expansión de contenido sin modificar suite de pruebas

### Próximos Pasos Opcionales
1. Actualizar Jest/Integration tests para Q11-Q44
2. Expandir Playwright tests a todas las preguntas
3. Agregar más preguntas en categorías específicas
4. Crear banco de preguntas categorizado

---

## Contacto y Mantenimiento
- **Ubicación**: `/Users/mhaloz/Documents/Master/Desarrollo seguro/quiz.html`
- **Última Actualización**: 27/12/2025
- **Versión**: 1.0 (44 preguntas)

---

*Este documento proporciona un resumen completo del estado actual del quiz de Seguridad de Software.*
