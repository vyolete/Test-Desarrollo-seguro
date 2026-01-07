# Plataforma Educativa de Seguridad de Software

## Estado Actual
- **Quiz Teórico**: 132 preguntas de opción múltiple
- **Analizador de Código**: 13 ejercicios interactivos de análisis de vulnerabilidades
- **Estado**: Completamente funcional
- **Último Update**: 6 de Enero de 2026
- **Repositorio**: [GitHub - Test-Desarrollo-seguro](https://github.com/mhaloz/Test-Desarrollo-seguro.git)

## 🎯 Herramientas Educativas

### 📝 [Quiz de Seguridad de Software](quiz.html)
Quiz interactivo con **132 preguntas** de opción múltiple sobre ciberseguridad, desarrollo seguro y auditoría de sistemas de información.

### 🔍 [Analizador de Vulnerabilidades de Código](vulnerability-analyzer.html) - **NUEVO**
Herramienta interactiva para **análisis práctico de código** con 13 ejercicios donde los usuarios identifican líneas vulnerables en código real. Incluye explicaciones detalladas y código seguro alternativo.

---

## 🔍 Analizador de Vulnerabilidades de Código - Características

### Funcionalidades Principales
- **Visualización de código** con sintaxis resaltada (highlight.js)
- **Selección interactiva** de líneas vulnerables
- **Retroalimentación educativa** detallada
- **13 ejercicios prácticos** con código real
- **Soporte multi-lenguaje**: C, C++, Java, JavaScript, Python, PHP, SQL, C#
- **Navegación entre preguntas** con filtros
- **Estadísticas de progreso** del usuario

### Arquitectura del Analizador
- **Componentes modulares**: CodeRenderer, SelectionManager, FeedbackSystem, QuestionManager
- **Tecnologías**: HTML5, CSS3, JavaScript ES6+, highlight.js
- **Seguridad**: Content Security Policy (CSP), escape de HTML
- **Accesibilidad**: WCAG 2.1 AA, navegación por teclado, ARIA labels
- **Responsive**: Diseño adaptable para dispositivos móviles

### Tipos de Vulnerabilidades en el Analizador
| Tipo | Preguntas | Lenguajes | Dificultad |
|------|-----------|-----------|------------|
| **Buffer Overflow** | 2 | C, C++ | Intermedio-Avanzado |
| **SQL Injection** | 2 | PHP, C# | Básico-Intermedio |
| **Cross-Site Scripting (XSS)** | 1 | JavaScript | Básico |
| **Input Validation** | 2 | Java, C | Intermedio |
| **DNS Validation** | 1 | C | Avanzado |
| **Path Validation** | 1 | Java | Básico |
| **Integer Overflow** | 1 | C | Avanzado |
| **Information Disclosure** | 1 | Java | Intermedio |
| **Race Conditions** | 1 | C | Avanzado |
| **Use After Free** | 1 | C | Avanzado |
| **Off by One** | 1 | C | Intermedio |

### Arquitectura del Analizador
- **Componentes modulares**: CodeRenderer, SelectionManager, FeedbackSystem, QuestionManager
- **Tecnologías**: HTML5, CSS3, JavaScript ES6+, highlight.js
- **Seguridad**: Content Security Policy (CSP), escape de HTML
- **Accesibilidad**: WCAG 2.1 AA, navegación por teclado, ARIA labels
- **Responsive**: Diseño adaptable para dispositivos móviles

### Integración con Quiz
- **Navegación cruzada** entre herramientas
- **Estilos compartidos** y diseño consistente
- **Datos complementarios** de progreso del usuario

---

## 📝 Quiz Teórico - Distribución de Preguntas por Tema

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

### 5. Análisis de Código Seguro (Q35-Q85)
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

### 6. Auditoría de Sistemas de Información (Q86-Q132) - **NUEVO**
- Sistemas de Gestión de Seguridad de la Información (SGSI)
- Definiciones de auditoría según Ron Weber
- Control Interno de Tecnologías de Información (CITI)
- Clasificación de activos de información
- Reglamento General de Protección de Datos (RGPD)
- Esquema Nacional de Seguridad (ENS) de España
- Normas PCI DSS
- Metodologías de auditoría (ISSAF, OSSTMM)
- Tipos de auditoría (caja blanca, negra, gris)
- Objetivos y finalidades de control
- Gestión de riesgos en auditoría
- Planificación de auditorías
- Pruebas de cumplimiento vs sustantivas
- Evidencias de auditoría
- Informes de auditoría
- Centros de Procesamiento de Datos (CPD)
- Auditoría interna vs externa
- Clasificación de controles
- Gobierno de TI y alineación estratégica

---

## 🛡️ Tipos de Vulnerabilidades Cubiertas en el Quiz Teórico

| Vulnerabilidad | Preguntas | Descripción |
|---|---|---|
| Integer Overflow | Q24, Q44, Q68 | Desbordamiento de tipos enteros |
| Buffer Overflow | Q27, Q42, Q70 | Acceso fuera de límites de buffers |
| Input Validation | Q25, Q41, Q83 | Validación impropia de entrada |
| DNS Validation | Q21, Q22 | Inyección en resolución DNS |
| Race Conditions | Q43 | TOCTOU (Time-of-check Time-of-use) |
| Exception Handling | Q36, Q37 | Exposición de datos en excepciones |
| Format String | Q20 | Uso de datos sin validar |
| Use After Free | Q45, Q69 | Acceso a memoria liberada |
| SQL Injection | Q69 | Inyección SQL (y defensa) |
| Off by One | Q68 | Error de límite de bucle |

## 🧪 Testing y Calidad

### Test Suite - Jest (Unit + Integration)
- **Total de Tests**: 46 (40+ unitarios, 20+ integración)
- **Estado**: ✅ Todos pasando
- **Cobertura**: Q1-Q10 del quiz (no actualizado para Q11-Q132)

### Test Suite - Playwright (E2E)
- **Total de Tests**: 114
- **Navegadores**: Chromium, Firefox, WebKit
- **Estado**: ✅ Todos pasando
- **Cobertura**: Q1-Q10 del quiz (no actualizado para Q11-Q132)

### Tests del Analizador de Vulnerabilidades
- **Tests básicos**: Validación de HTML escape, estructura de preguntas
- **Estado**: ✅ Funcional
- **Archivo**: [test-vulnerability-analyzer.html](test-vulnerability-analyzer.html)

### Decisiones de Diseño
- Tests originales diseñados para Q1-Q10 del quiz
- Q11-Q132 agregadas sin actualizar tests (intencional)
- Analizador de vulnerabilidades con tests básicos incluidos
- Permite expansión de contenido sin modificar suite de pruebas existente

---

## 🔮 Roadmap y Mejoras Futuras

### Corto Plazo
- [ ] Actualizar Jest/Integration tests para Q11-Q132
- [ ] Expandir tests del analizador de vulnerabilidades
- [ ] Agregar más ejercicios de código al analizador
- [ ] Implementar persistencia de progreso del usuario

### Mediano Plazo
- [ ] Editor de código en vivo para corrección
- [ ] Gamificación con puntos y logros
- [ ] Modo examen con tiempo limitado
- [ ] Análisis de patrones de errores comunes

### Largo Plazo
- [ ] IA para generación automática de preguntas
- [ ] Integración con IDEs como extensión
- [ ] API pública para integración externa
- [ ] Colaboración multi-usuario para equipos

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

## Preguntas Nuevas de Auditoría (Q86-Q132)

| # | Tema | Respuesta Correcta |
|---|---|---|
| 86 | SGSI - Mejora Continua | B - Incorrecta |
| 87 | Definición Auditoría (Ron Weber) | C - Proceso completo |
| 88 | CITI - Garantías | D - Normativas + legales |
| 89 | Clasificación de Activos | D - Propia organización |
| 90 | RGPD - Auditorías | B - DMZ (Incorrecta) |
| 91 | AEPD - Lista Verificación | C - Derecho rectificación |
| 92 | ENS - Objetivos Auditoría | A - Opinión personal (Incorrecta) |
| 93 | PCI DSS - Aplicación | C - Datos tarjetas pago |
| 94 | Activos SI Habituales | D - Completo |
| 95 | Directory Listing | B - Mala configuración |
| 96 | Amenazas Típicas | B - Completo |
| 97 | Auditoría Perimetral | D - Protección exterior |
| 98 | Auditoría Cumplimiento | A - Grado cumplimiento |
| 99 | Clasificación por Visibilidad | A - Caja blanca/negra/gris |
| 100 | Auditoría Móviles | A - Caja blanca |
| ... | ... | ... |
| 132 | Control CIO | B - Alineación estratégica |

---

## Metodologías y Estándares Cubiertos

### Desarrollo Seguro
- **OWASP** - Open Web Application Security Project
- **NIST SP 800-115** - Technical Guide to Information Security Testing
- **Common Criteria ISO 15408** - Evaluation Assurance Levels
- **CVSS** - Common Vulnerability Scoring System

### Auditoría de Sistemas
- **ISO27001** - Norma de Seguridad de la Información
- **PTES** - Penetration Testing Execution Standard
- **ISSAF** - Information System Security Assessment Framework
- **OSSTMM** - Open Source Security Testing Methodology Manual
- **RGPD** - Reglamento General de Protección de Datos
- **ENS** - Esquema Nacional de Seguridad (España)
- **PCI DSS** - Payment Card Industry Data Security Standard
- **ISACA** - Information Systems Audit and Control Association

---

## 🏗️ Estructura del Proyecto

```
/
├── quiz.html                         # Quiz interactivo (219 preguntas)
├── vulnerability-analyzer.html       # Analizador de código (13 ejercicios) - NUEVO
├── js/                              # Módulos JavaScript del analizador - NUEVO
│   ├── app.js                       # Controlador principal
│   ├── code-renderer.js             # Renderizado de código con sintaxis
│   ├── selection-manager.js         # Gestión de selección de líneas
│   ├── feedback-system.js           # Sistema de retroalimentación
│   ├── question-manager.js          # Gestión de preguntas
│   └── interfaces.js                # Interfaces y tipos de datos
├── README.md                        # Este archivo
├── VULNERABILITY-ANALYZER-README.md  # Documentación del analizador - NUEVO
├── test-vulnerability-analyzer.html  # Tests del analizador - NUEVO
├── server.js                        # Servidor Express.js
├── package.json                     # Configuración Node.js
├── Dockerfile                       # Contenedor Docker
├── Procfile                         # Configuración Railway
├── railway.json                     # Configuración despliegue
└── .kiro/                          # Especificaciones y steering - NUEVO
    └── specs/vulnerability-code-analyzer/
        ├── requirements.md          # Requisitos del analizador
        ├── design.md               # Diseño arquitectónico
        └── tasks.md                # Plan de implementación
```

---

## 🚀 Cómo Usar

### 📝 Quiz Teórico
1. **Abre** [quiz.html](quiz.html) en tu navegador
2. **Selecciona** una respuesta para cada pregunta
3. **Revisa** la explicación de la respuesta correcta
4. **Progresa** a través de las 219 preguntas

### 🔍 Analizador de Vulnerabilidades
1. **Abre** [vulnerability-analyzer.html](vulnerability-analyzer.html) en tu navegador
2. **Analiza** el código mostrado con sintaxis resaltada
3. **Selecciona** las líneas que contienen vulnerabilidades
4. **Verifica** tu respuesta para obtener retroalimentación detallada
5. **Aprende** de las explicaciones y código seguro alternativo

### Con Servidor (Opcional)
```bash
# Instalar dependencias
npm install

# Ejecutar servidor
npm start

# Acceder en http://localhost:3000
# Quiz: http://localhost:3000/quiz.html
# Analizador: http://localhost:3000/vulnerability-analyzer.html
```

### Requisitos
- Navegador web moderno (Chrome, Firefox, Safari, Edge)
- No requiere instalación de dependencias
- No requiere servidor web (funciona con archivos locales)

---

## 📚 Valor Educativo

### Enfoque Complementario
- **Quiz Teórico**: Conocimiento conceptual y normativo
- **Analizador Práctico**: Habilidades de análisis de código real
- **Cobertura Integral**: Desde fundamentos hasta auditoría avanzada

### Público Objetivo
- **Estudiantes de Máster**: Desarrollo Seguro
- **Profesionales**: Actualización en ciberseguridad
- **Desarrolladores**: Aprendizaje de buenas prácticas de codificación segura
- **Auditores**: Conocimientos de auditoría de sistemas de información

### Metodología de Aprendizaje
- **Interactividad**: Aprendizaje activo vs. pasivo
- **Casos reales**: Ejemplos de código con vulnerabilidades reales
- **Explicaciones detalladas**: Contexto, explotación y mitigación
- **Progresión gradual**: Diferentes niveles de dificultad

---

## 🤝 Contribuciones

Para agregar más preguntas, ejercicios o mejorar el contenido:

### Quiz Teórico
1. Editar el array `questions` en [quiz.html](quiz.html)
2. Seguir el formato de pregunta establecido
3. Incluir explicación detallada

### Analizador de Vulnerabilidades
1. Editar el método `createSampleQuestions()` en [js/app.js](js/app.js)
2. Seguir la estructura de ejercicio establecida
3. Incluir código vulnerable, líneas correctas y explicaciones
4. Ver [VULNERABILITY-ANALYZER-README.md](VULNERABILITY-ANALYZER-README.md) para detalles

### Proceso de Contribución
1. Fork el repositorio
2. Crea una rama para tus cambios
3. Commit y push tus cambios
4. Abre un Pull Request

---

## Licencia

Este proyecto se utiliza con fines educativos en el programa de Máster en "Desarrollo Seguro" de la Universidad.

---

## 📞 Contacto y Recursos

- **Repositorio**: [GitHub - Test-Desarrollo-seguro](https://github.com/mhaloz/Test-Desarrollo-seguro.git)
- **Documentación Analizador**: [VULNERABILITY-ANALYZER-README.md](VULNERABILITY-ANALYZER-README.md)
- **Especificaciones Técnicas**: [.kiro/specs/vulnerability-code-analyzer/](.kiro/specs/vulnerability-code-analyzer/)
- **Última Actualización**: 06/01/2026
- **Versión**: 4.0 (Quiz: 132 preguntas + Analizador: 13 ejercicios)

---

*Esta plataforma educativa proporciona una experiencia completa de aprendizaje en seguridad de software, combinando conocimiento teórico con análisis práctico de código.*