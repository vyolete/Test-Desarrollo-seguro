---
inclusion: always
---

# Steering: Quiz de Seguridad de Software

## Descripción del Proyecto

Este proyecto es un **quiz interactivo de seguridad de software** desarrollado como herramienta educativa para el programa de Máster en "Desarrollo Seguro". Contiene **132 preguntas** sobre diversos aspectos de la ciberseguridad, desarrollo seguro de software y auditoría de sistemas de información.

## Arquitectura del Sistema

### Estructura de Archivos
```
/
├── quiz.html              # Aplicación principal (HTML + CSS + JS)
├── server.js              # Servidor Express.js
├── package.json           # Configuración Node.js
├── README.md              # Documentación completa
├── Dockerfile             # Contenedor Docker
├── Procfile               # Configuración Railway
└── railway.json           # Configuración despliegue
```

### Stack Tecnológico
- **Frontend**: HTML5, CSS3, JavaScript Vanilla (sin frameworks)
- **Backend**: Node.js con Express.js (servidor estático)
- **Despliegue**: Railway, Docker
- **Testing**: Jest (unitarios), Playwright (E2E)

## Funcionalidades Principales

### 1. Quiz Interactivo
- **132 preguntas** de opción múltiple (A, B, C, D)
- **Feedback inmediato** al seleccionar respuesta
- **Explicaciones detalladas** para cada pregunta
- **Interfaz responsive** y accesible

### 2. Categorías de Contenido

#### Desarrollo Seguro (Q1-Q85)
- Fundamentos de Seguridad (Q1-Q10)
- Requisitos y Diseño (Q11-Q18)
- Buenas Prácticas de Codificación (Q19-Q27)
- Análisis y Testing (Q28-Q34)
- Análisis de Código Seguro (Q35-Q54)
- Auditoría y Gobernanza (Q55-Q85)

#### Auditoría de Sistemas de Información (Q86-Q132) - **NUEVO**
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

### 3. Tipos de Vulnerabilidades Cubiertas

| Vulnerabilidad | Preguntas | Descripción |
|---|---|---|
| Integer Overflow | Q24, Q44, Q68 | Desbordamiento de tipos enteros |
| Buffer Overflow | Q27, Q42, Q70 | Acceso fuera de límites |
| Input Validation | Q25, Q41, Q83 | Validación impropia de entrada |
| SQL Injection | Q69 | Inyección SQL y defensa |
| Race Conditions | Q43 | TOCTOU vulnerabilities |
| Use After Free | Q45, Q69 | Acceso a memoria liberada |

## Patrones de Desarrollo

### 1. Estructura de Pregunta
```javascript
{
  id: [number],
  title: "Pregunta [number]",
  text: "[Texto de la pregunta]",
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

### 2. Gestión de Estado
- **Sin estado persistente**: Cada pregunta es independiente
- **Feedback inmediato**: Respuesta mostrada al seleccionar opción
- **Event-driven**: Uso de event listeners para interactividad

### 3. Estilos CSS
- **Sistema de diseño**: Colores consistentes, tipografía legible
- **Responsive**: Adaptable a diferentes tamaños de pantalla
- **Accesibilidad**: Contraste adecuado, navegación por teclado

## Metodologías y Estándares Referenciados

### Frameworks de Seguridad
- **OWASP** - Open Web Application Security Project
- **ISO27001** - Norma de Seguridad de la Información
- **NIST SP 800-115** - Technical Guide to Information Security Testing
- **Common Criteria ISO 15408** - Evaluation Assurance Levels

### Metodologías de Testing
- **PTES** - Penetration Testing Execution Standard
- **ISSAF** - Information System Security Assessment Framework
- **OSSTMM** - Open Source Security Testing Methodology Manual
- **CVSS** - Common Vulnerability Scoring System

### Auditoría y Cumplimiento
- **RGPD** - Reglamento General de Protección de Datos
- **ENS** - Esquema Nacional de Seguridad (España)
- **PCI DSS** - Payment Card Industry Data Security Standard
- **ISACA** - Information Systems Audit and Control Association

## Buenas Prácticas de Desarrollo

### 1. Código Limpio
- **JavaScript Vanilla**: Sin dependencias externas
- **Separación de responsabilidades**: HTML estructura, CSS presentación, JS comportamiento
- **Nombres descriptivos**: Variables y funciones con nombres claros

### 2. Seguridad
- **Validación de entrada**: Aunque es un quiz estático, buenas prácticas aplicadas
- **Sin datos sensibles**: Todo el contenido es educativo y público
- **HTTPS**: Configurado para despliegue seguro

### 3. Mantenibilidad
- **Estructura modular**: Fácil agregar nuevas preguntas
- **Documentación completa**: README detallado
- **Versionado**: Control de versiones con Git

## Consideraciones de Testing

### Suite de Pruebas Actual
- **Jest**: 46 tests unitarios + integración (Q1-Q10)
- **Playwright**: 114 tests E2E en múltiples navegadores
- **Estado**: ✅ Todos los tests pasando

### Cobertura de Testing
- **Funcionalidad básica**: Completamente cubierta
- **Preguntas Q11-Q132**: Sin tests específicos (decisión de diseño)
- **Cross-browser**: Chrome, Firefox, Safari, Edge

## Despliegue y Distribución

### Configuración de Servidor
```javascript
// server.js - Servidor Express simple
app.use(express.static('.'));
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'quiz.html'));
});
```

### Opciones de Despliegue
1. **Local**: Abrir `quiz.html` directamente en navegador
2. **Servidor**: `npm start` para servidor Express
3. **Docker**: Contenedor configurado
4. **Railway**: Despliegue en la nube

## Extensibilidad

### Agregar Nuevas Preguntas
1. Añadir objeto pregunta al array `questions`
2. Seguir estructura estándar
3. Incluir explicación detallada
4. Actualizar documentación

### Mejoras Futuras Posibles
- **Categorización visual**: Filtros por tema
- **Progreso del usuario**: Tracking de respuestas
- **Modo examen**: Tiempo limitado
- **Estadísticas**: Análisis de rendimiento

## Contexto Educativo

### Público Objetivo
- **Estudiantes de Máster**: Desarrollo Seguro
- **Profesionales**: Actualización en ciberseguridad
- **Desarrolladores**: Aprendizaje de buenas prácticas
- **Auditores**: Conocimientos de auditoría de SI

### Valor Educativo
- **Casos reales**: Ejemplos de código con vulnerabilidades
- **Explicaciones detalladas**: Contexto y soluciones
- **Cobertura amplia**: Desde fundamentos hasta auditoría
- **Interactividad**: Aprendizaje activo vs. pasivo

## Comandos Útiles

### Desarrollo Local
```bash
# Instalar dependencias
npm install

# Ejecutar servidor
npm start

# Ejecutar tests
npm test

# Ejecutar tests E2E
npx playwright test
```

### Docker
```bash
# Construir imagen
docker build -t quiz-seguridad .

# Ejecutar contenedor
docker run -p 3000:3000 quiz-seguridad
```

## Actualización Reciente (Enero 2026)

### Nuevas Preguntas Agregadas (Q86-Q132)
- **47 preguntas nuevas** sobre auditoría de sistemas de información
- **Temática complementaria**: Auditoría, cumplimiento y gobernanza
- **Metodologías adicionales**: ISSAF, OSSTMM, RGPD, ENS, PCI DSS
- **Conceptos avanzados**: Gestión de riesgos, controles, evidencias

### Beneficios de la Expansión
- **Cobertura integral**: Desarrollo seguro + Auditoría
- **Preparación completa**: Para profesionales de ciberseguridad
- **Actualización normativa**: Incluye regulaciones recientes
- **Perspectiva holística**: Desde desarrollo hasta auditoría

Este steering proporciona una comprensión completa del proyecto actualizado para facilitar el desarrollo, mantenimiento y extensión del quiz de seguridad de software con 132 preguntas.