/**
 * Main Application Controller
 * Coordinates all components and manages application state
 */

class VulnerabilityAnalyzerApp {
    /**
     * Initialize the application
     */
    constructor() {
        // Component instances
        this.codeRenderer = null;
        this.selectionManager = null;
        this.feedbackSystem = null;
        this.questionManager = null;
        
        // Application state
        this.isInitialized = false;
        this.currentAnswer = null;
        this.userProgress = {
            completed: new Set(),
            correct: new Set(),
            incorrect: new Set(),
            categoryProgress: new Map()
        };
        
        // DOM elements
        this.elements = {};
        
        // Sample questions for demonstration
        this.sampleQuestions = this.createSampleQuestions();
        
        // Initialize when DOM is ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.initialize());
        } else {
            this.initialize();
        }
    }

    /**
     * Initialize the application
     */
    async initialize() {
        try {
            console.log('Initializing Vulnerability Analyzer App...');
            
            // Cache DOM elements
            this.cacheElements();
            
            // Initialize components
            this.initializeComponents();
            
            // Set up event listeners
            this.setupEventListeners();
            
            // Load questions
            this.loadQuestions();
            
            // Update UI
            this.updateUI();
            
            this.isInitialized = true;
            console.log('Application initialized successfully');
            
        } catch (error) {
            console.error('Failed to initialize application:', error);
            this.showError('Error al inicializar la aplicación. Por favor, recarga la página.');
        }
    }

    /**
     * Cache frequently used DOM elements
     */
    cacheElements() {
        this.elements = {
            // Navigation
            prevButton: document.getElementById('prev-button'),
            nextButton: document.getElementById('next-button'),
            progressText: document.getElementById('progress-text'),
            progressFill: document.getElementById('progress-fill'),
            
            // Question display
            questionTitle: document.getElementById('question-title'),
            questionContext: document.getElementById('question-context'),
            questionText: document.getElementById('question-text'),
            codeBlock: document.getElementById('code-block'),
            verifyButton: document.getElementById('verify-button'),
            
            // Feedback
            answerCard: document.getElementById('answer-card'),
            answerPlaceholder: document.getElementById('answer-placeholder'),
            feedbackContent: document.getElementById('feedback-content'),
            
            // Filters
            difficultyFilter: document.getElementById('difficulty-filter'),
            categoryFilter: document.getElementById('category-filter'),
            languageFilter: document.getElementById('language-filter'),
            
            // Stats
            totalQuestions: document.getElementById('total-questions'),
            completedQuestions: document.getElementById('completed-questions'),
            correctAnswers: document.getElementById('correct-answers'),
            accuracyRate: document.getElementById('accuracy-rate')
        };
        
        // Validate required elements
        const requiredElements = [
            'prevButton', 'nextButton', 'progressText', 'progressFill',
            'questionTitle', 'questionContext', 'questionText', 'codeBlock',
            'verifyButton', 'feedbackContent'
        ];
        
        for (const elementName of requiredElements) {
            if (!this.elements[elementName]) {
                throw new Error(`Required element not found: ${elementName}`);
            }
        }
    }

    /**
     * Initialize all components
     */
    initializeComponents() {
        // Initialize code renderer
        this.codeRenderer = new CodeRenderer('code-block');
        
        // Initialize selection manager
        this.selectionManager = new SelectionManager('code-block');
        
        // Initialize feedback system
        this.feedbackSystem = new FeedbackSystem('feedback-content');
        
        // Initialize question manager
        this.questionManager = new QuestionManager();
        
        // Set up component callbacks
        this.setupComponentCallbacks();
    }

    /**
     * Set up callbacks between components
     */
    setupComponentCallbacks() {
        // Selection manager callbacks
        this.selectionManager.setOnSelectionChange((selectedLines) => {
            this.onSelectionChange(selectedLines);
        });
        
        // Question manager callbacks
        this.questionManager.setOnQuestionLoad((question, index) => {
            this.onQuestionLoad(question, index);
        });
        
        this.questionManager.setOnQuestionChange((newQuestion, oldQuestion, direction) => {
            this.onQuestionChange(newQuestion, oldQuestion, direction);
        });
        
        this.questionManager.setOnFilterChange((filteredQuestions, filters) => {
            this.onFilterChange(filteredQuestions, filters);
        });
    }

    /**
     * Set up event listeners
     */
    setupEventListeners() {
        // Navigation buttons
        this.elements.prevButton.addEventListener('click', () => this.previousQuestion());
        this.elements.nextButton.addEventListener('click', () => this.nextQuestion());
        
        // Verify button
        this.elements.verifyButton.addEventListener('click', () => this.verifyAnswer());
        
        // Filter controls
        this.elements.difficultyFilter?.addEventListener('change', () => this.applyFilters());
        this.elements.categoryFilter?.addEventListener('change', () => this.applyFilters());
        this.elements.languageFilter?.addEventListener('change', () => this.applyFilters());
        
        // Keyboard shortcuts
        document.addEventListener('keydown', (event) => this.handleKeyboardShortcuts(event));
    }

    /**
     * Load questions into the application
     */
    loadQuestions() {
        this.questionManager.loadQuestions(this.sampleQuestions);
    }

    /**
     * Handle selection changes
     * @param {number[]} selectedLines - Currently selected lines
     */
    onSelectionChange(selectedLines) {
        const currentQuestion = this.questionManager.getCurrentQuestion();
        
        // If no current question, disable button
        if (!currentQuestion) {
            this.elements.verifyButton.disabled = true;
            this.elements.verifyButton.textContent = '🔍 Verificar Respuesta';
            return;
        }
        
        // Enable verify button if:
        // 1. Lines are selected, OR
        // 2. No lines selected but question has no vulnerabilities (secure code)
        const hasVulnerabilities = currentQuestion.vulnerableLines.length > 0;
        const shouldEnableButton = selectedLines.length > 0 || !hasVulnerabilities;
        
        this.elements.verifyButton.disabled = !shouldEnableButton;
        
        // Update button text
        const count = selectedLines.length;
        if (count > 0) {
            this.elements.verifyButton.textContent = `🔍 Verificar Respuesta (${count} línea${count !== 1 ? 's' : ''} seleccionada${count !== 1 ? 's' : ''})`;
        } else if (!hasVulnerabilities) {
            this.elements.verifyButton.textContent = '🔍 Verificar Respuesta (Código Seguro)';
        } else {
            this.elements.verifyButton.textContent = '🔍 Verificar Respuesta';
        }
    }

    /**
     * Handle question loading
     * @param {Question} question - Loaded question
     * @param {number} index - Question index
     */
    onQuestionLoad(question, index) {
        if (!question) return;
        
        // Update question display first (this renders the code)
        this.displayQuestion(question);
        
        // Use setTimeout to ensure DOM is fully updated before enabling selection
        setTimeout(() => {
            // Then reset components for new question (this will work with the new code lines)
            this.resetForNewQuestion(question);
        }, 0);
        
        // Update navigation
        this.updateNavigation();
        
        // Update progress
        this.updateProgress();
    }

    /**
     * Handle question changes
     * @param {Question} newQuestion - New question
     * @param {Question} oldQuestion - Previous question
     * @param {string} direction - Navigation direction
     */
    onQuestionChange(newQuestion, oldQuestion, direction) {
        // Save progress for old question if answered
        if (oldQuestion && this.currentAnswer) {
            this.saveQuestionProgress(oldQuestion, this.currentAnswer);
        }
        
        // Reset for new question
        this.currentAnswer = null;
    }

    /**
     * Handle filter changes
     * @param {Question[]} filteredQuestions - Filtered questions
     * @param {Object} filters - Applied filters
     */
    onFilterChange(filteredQuestions, filters) {
        this.updateStats();
        this.updateNavigation();
        this.updateProgress();
    }

    /**
     * Display a question
     * @param {Question} question - Question to display
     */
    displayQuestion(question) {
        // Update question info
        this.elements.questionTitle.textContent = question.title;
        this.elements.questionContext.textContent = question.context || 'Analiza el siguiente código para identificar vulnerabilidades de seguridad.';
        this.elements.questionText.textContent = question.question;
        
        // Render code
        this.codeRenderer.renderCode(question.code, question.language);
        
        // Clear feedback (but don't enable selection here - that's done in resetForNewQuestion)
        this.feedbackSystem.clear();
    }

    /**
     * Reset components for new question
     * @param {Question} question - Current question (optional)
     */
    resetForNewQuestion(question = null) {
        // Get current question if not provided
        const currentQuestion = question || this.questionManager.getCurrentQuestion();
        
        // Reset selection manager first
        this.selectionManager.reset();
        
        // Enable selection for the new question (code should be rendered by now)
        this.selectionManager.enableSelection();
        
        // Clear feedback
        this.feedbackSystem.clear();
        
        const hasVulnerabilities = currentQuestion && currentQuestion.vulnerableLines.length > 0;
        
        // Set initial button state
        this.elements.verifyButton.disabled = hasVulnerabilities; // Enable for secure code, disable for vulnerable code
        this.elements.verifyButton.textContent = hasVulnerabilities ? '🔍 Verificar Respuesta' : '🔍 Verificar Respuesta (Código Seguro)';
        
        // Trigger onSelectionChange to ensure button state is correct
        this.onSelectionChange([]);
    }

    /**
     * Verify the user's answer
     */
    verifyAnswer() {
        const currentQuestion = this.questionManager.getCurrentQuestion();
        if (!currentQuestion) return;
        
        const selectedLines = this.selectionManager.getSelectedLines();
        const hasVulnerabilities = currentQuestion.vulnerableLines.length > 0;
        
        // Allow verification even with no selection for secure code questions
        if (selectedLines.length === 0 && hasVulnerabilities) return;
        
        // Validate answer
        const validationResult = this.feedbackSystem.validateAnswer(
            selectedLines, 
            currentQuestion.vulnerableLines
        );
        
        // Mark selection manager as answered
        this.selectionManager.markAsAnswered();
        
        // Show visual feedback on code lines (only if there are vulnerable lines)
        if (hasVulnerabilities) {
            this.showCodeLineFeedback(selectedLines, currentQuestion.vulnerableLines);
        }
        
        // Show detailed feedback
        if (validationResult.type === 'success') {
            this.feedbackSystem.showSuccessFeedback(
                currentQuestion.vulnerabilityType,
                currentQuestion.explanation
            );
        } else {
            this.feedbackSystem.showErrorFeedback(
                selectedLines,
                currentQuestion.vulnerableLines,
                currentQuestion.explanation
            );
        }
        
        // Save answer
        this.currentAnswer = {
            selectedLines,
            validationResult,
            timestamp: new Date().toISOString()
        };
        
        // Update progress
        this.updateUserProgress(currentQuestion, validationResult);
        
        // Disable verify button
        this.elements.verifyButton.disabled = true;
        this.elements.verifyButton.textContent = '✅ Respuesta Verificada';
    }

    /**
     * Show visual feedback on code lines
     * @param {number[]} selectedLines - User selected lines
     * @param {number[]} correctLines - Correct lines
     */
    showCodeLineFeedback(selectedLines, correctLines) {
        const correctSet = new Set(correctLines);
        const selectedSet = new Set(selectedLines);
        
        // Highlight correct lines (both selected and unselected)
        this.selectionManager.highlightCorrectLines(correctLines);
        
        // Highlight incorrectly selected lines
        const incorrectLines = selectedLines.filter(line => !correctSet.has(line));
        if (incorrectLines.length > 0) {
            this.selectionManager.highlightIncorrectLines(incorrectLines);
        }
    }

    /**
     * Update user progress
     * @param {Question} question - Current question
     * @param {FeedbackData} validationResult - Validation result
     */
    updateUserProgress(question, validationResult) {
        this.userProgress.completed.add(question.id);
        
        if (validationResult.type === 'success') {
            this.userProgress.correct.add(question.id);
            this.userProgress.incorrect.delete(question.id);
        } else {
            this.userProgress.incorrect.add(question.id);
            this.userProgress.correct.delete(question.id);
        }
        
        // Update category progress
        const category = question.category;
        if (!this.userProgress.categoryProgress.has(category)) {
            this.userProgress.categoryProgress.set(category, {
                total: 0,
                completed: 0,
                correct: 0
            });
        }
        
        const categoryProgress = this.userProgress.categoryProgress.get(category);
        categoryProgress.completed = Math.max(categoryProgress.completed, 1);
        if (validationResult.type === 'success') {
            categoryProgress.correct = Math.max(categoryProgress.correct, 1);
        }
        
        this.updateStats();
    }

    /**
     * Navigate to previous question
     */
    previousQuestion() {
        this.questionManager.previousQuestion();
    }

    /**
     * Navigate to next question
     */
    nextQuestion() {
        this.questionManager.nextQuestion();
    }

    /**
     * Apply current filters
     */
    applyFilters() {
        const filters = {
            difficulty: this.elements.difficultyFilter?.value || '',
            category: this.elements.categoryFilter?.value || '',
            language: this.elements.languageFilter?.value || ''
        };
        
        this.questionManager.filterQuestions(filters);
    }

    /**
     * Update navigation buttons
     */
    updateNavigation() {
        this.elements.prevButton.disabled = !this.questionManager.hasPrevious();
        this.elements.nextButton.disabled = !this.questionManager.hasNext();
    }

    /**
     * Update progress display
     */
    updateProgress() {
        const current = this.questionManager.getCurrentQuestionIndex() + 1;
        const total = this.questionManager.getTotalQuestions();
        
        this.elements.progressText.textContent = `Pregunta ${current} de ${total}`;
        
        const percentage = total > 0 ? (current / total) * 100 : 0;
        this.elements.progressFill.style.width = `${percentage}%`;
    }

    /**
     * Update statistics display
     */
    updateStats() {
        const stats = this.questionManager.getStatistics();
        const completed = this.userProgress.completed.size;
        const correct = this.userProgress.correct.size;
        const accuracy = completed > 0 ? Math.round((correct / completed) * 100) : 0;
        
        this.elements.totalQuestions.textContent = stats.filtered;
        this.elements.completedQuestions.textContent = completed;
        this.elements.correctAnswers.textContent = correct;
        this.elements.accuracyRate.textContent = `${accuracy}%`;
    }

    /**
     * Update entire UI
     */
    updateUI() {
        this.updateNavigation();
        this.updateProgress();
        this.updateStats();
    }

    /**
     * Handle keyboard shortcuts
     * @param {KeyboardEvent} event - Keyboard event
     */
    handleKeyboardShortcuts(event) {
        // Only handle shortcuts when not typing in input fields
        if (event.target.tagName === 'INPUT' || event.target.tagName === 'SELECT') {
            return;
        }
        
        switch (event.key) {
            case 'ArrowLeft':
                if (event.ctrlKey || event.metaKey) {
                    event.preventDefault();
                    this.previousQuestion();
                }
                break;
            case 'ArrowRight':
                if (event.ctrlKey || event.metaKey) {
                    event.preventDefault();
                    this.nextQuestion();
                }
                break;
            case 'Enter':
                if (event.ctrlKey || event.metaKey) {
                    event.preventDefault();
                    if (!this.elements.verifyButton.disabled) {
                        this.verifyAnswer();
                    }
                }
                break;
        }
    }

    /**
     * Save question progress
     * @param {Question} question - Question
     * @param {Object} answer - Answer data
     */
    saveQuestionProgress(question, answer) {
        // In a real application, this would save to localStorage or server
        console.log('Saving progress for question:', question.id, answer);
    }

    /**
     * Show error message
     * @param {string} message - Error message
     */
    showError(message) {
        // Create error notification
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-notification';
        errorDiv.textContent = message;
        errorDiv.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #ef4444;
            color: white;
            padding: 1rem;
            border-radius: 8px;
            z-index: 1000;
            max-width: 300px;
        `;
        
        document.body.appendChild(errorDiv);
        
        // Remove after 5 seconds
        setTimeout(() => {
            if (errorDiv.parentNode) {
                errorDiv.parentNode.removeChild(errorDiv);
            }
        }, 5000);
    }

    /**
     * Create sample questions for demonstration
     * @returns {Question[]} Array of sample questions
     */
    createSampleQuestions() {
        return [
            // Pregunta original 1: Buffer Overflow en C
            {
                id: 1,
                title: "Buffer Overflow en C",
                language: "c",
                difficulty: "intermediate",
                category: "buffer-overflow",
                context: "El siguiente código en C maneja entrada del usuario sin validación adecuada.",
                code: `#include <stdio.h>
#include <string.h>

void vulnerable_function(char *input) {
    char buffer[100];
    strcpy(buffer, input);  // Vulnerable line
    printf("Input: %s\\n", buffer);
}

int main() {
    char user_input[200];
    printf("Enter input: ");
    gets(user_input);  // Also vulnerable
    vulnerable_function(user_input);
    return 0;
}`,
                vulnerableLines: [6, 12],
                vulnerabilityType: "Buffer Overflow",
                cweid: "CWE-120",
                owaspCategory: "A03:2021 – Injection",
                question: "Identifica las líneas que contienen vulnerabilidades de buffer overflow.",
                explanation: {
                    vulnerability: "El código utiliza funciones inseguras como strcpy() y gets() que no verifican los límites del buffer, permitiendo que un atacante sobrescriba memoria adyacente.",
                    exploitation: "Un atacante puede enviar más de 100 caracteres, causando que strcpy() escriba más allá del buffer y potencialmente sobrescriba la dirección de retorno para ejecutar código malicioso.",
                    mitigation: "Usar funciones seguras como strncpy() o strlcpy(), validar la longitud de entrada, y usar fgets() en lugar de gets().",
                    secureCode: `strncpy(buffer, input, sizeof(buffer) - 1);
buffer[sizeof(buffer) - 1] = '\\0';
fgets(user_input, sizeof(user_input), stdin);`
                },
                references: [
                    "https://cwe.mitre.org/data/definitions/120.html",
                    "https://owasp.org/www-community/vulnerabilities/Buffer_Overflow"
                ],
                metadata: {
                    author: "Security Team",
                    dateCreated: "2024-01-01",
                    lastModified: "2024-01-01",
                    tags: ["buffer-overflow", "c", "memory-safety"]
                }
            },
            // Pregunta original 2: SQL Injection en PHP
            {
                id: 2,
                title: "SQL Injection en PHP",
                language: "php",
                difficulty: "basic",
                category: "sql-injection",
                context: "Una aplicación web PHP que maneja autenticación de usuarios.",
                code: `<?php
$username = $_POST['username'];
$password = $_POST['password'];

// Vulnerable SQL query
$query = "SELECT * FROM users WHERE username = '$username' AND password = '$password'";
$result = mysqli_query($connection, $query);

if (mysqli_num_rows($result) > 0) {
    echo "Login successful!";
} else {
    echo "Invalid credentials!";
}
?>`,
                vulnerableLines: [6],
                vulnerabilityType: "SQL Injection",
                cweid: "CWE-89",
                owaspCategory: "A03:2021 – Injection",
                question: "¿Qué línea permite inyección SQL?",
                explanation: {
                    vulnerability: "La consulta SQL concatena directamente la entrada del usuario sin sanitización, permitiendo que un atacante inyecte código SQL malicioso.",
                    exploitation: "Un atacante puede usar entrada como \"admin' OR '1'='1' --\" para bypassear la autenticación o \"'; DROP TABLE users; --\" para eliminar datos.",
                    mitigation: "Usar prepared statements, validar y sanitizar entrada, aplicar principio de menor privilegio en la base de datos.",
                    secureCode: `$stmt = $connection->prepare("SELECT * FROM users WHERE username = ? AND password = ?");
$stmt->bind_param("ss", $username, $password);
$stmt->execute();
$result = $stmt->get_result();`
                },
                references: [
                    "https://cwe.mitre.org/data/definitions/89.html",
                    "https://owasp.org/www-community/attacks/SQL_Injection"
                ],
                metadata: {
                    author: "Security Team",
                    dateCreated: "2024-01-01",
                    lastModified: "2024-01-01",
                    tags: ["sql-injection", "php", "web-security"]
                }
            },
            // Pregunta original 3: Cross-Site Scripting (XSS) en JavaScript
            {
                id: 3,
                title: "Cross-Site Scripting (XSS) en JavaScript",
                language: "javascript",
                difficulty: "basic",
                category: "xss",
                context: "Una aplicación web que muestra comentarios de usuarios.",
                code: `function displayComment(comment) {
    const commentDiv = document.createElement('div');
    commentDiv.className = 'comment';
    
    // Vulnerable: Direct HTML insertion
    commentDiv.innerHTML = '<p>' + comment + '</p>';
    
    document.getElementById('comments').appendChild(commentDiv);
}

// Usage
const userComment = getUrlParameter('comment');
displayComment(userComment);`,
                vulnerableLines: [5],
                vulnerabilityType: "Cross-Site Scripting (XSS)",
                cweid: "CWE-79",
                owaspCategory: "A03:2021 – Injection",
                question: "¿Dónde está la vulnerabilidad XSS?",
                explanation: {
                    vulnerability: "El código inserta directamente contenido del usuario en el DOM usando innerHTML sin sanitización, permitiendo la ejecución de scripts maliciosos.",
                    exploitation: "Un atacante puede inyectar código como '<script>alert(document.cookie)</script>' para robar cookies o redirigir usuarios a sitios maliciosos.",
                    mitigation: "Usar textContent en lugar de innerHTML, sanitizar HTML, implementar Content Security Policy (CSP).",
                    secureCode: `commentDiv.textContent = comment;
// O usar una librería de sanitización
commentDiv.innerHTML = DOMPurify.sanitize('<p>' + comment + '</p>');`
                },
                references: [
                    "https://cwe.mitre.org/data/definitions/79.html",
                    "https://owasp.org/www-community/attacks/xss/"
                ],
                metadata: {
                    author: "Security Team",
                    dateCreated: "2024-01-01",
                    lastModified: "2024-01-01",
                    tags: ["xss", "javascript", "web-security"]
                }
            },
            // Pregunta 20 del quiz: Uso de datos invalidados
            {
                id: 4,
                title: "Uso de Datos Invalidados en Java",
                language: "java",
                difficulty: "intermediate",
                category: "input-validation",
                context: "Una aplicación web Java que maneja sesiones de usuario sin validación adecuada.",
                code: `String user_state = "Unknown";
try {
  HttpSession user_session = Init.sessions.get(tmpUser.getUser());
  user_state = user_session == null ? "Unknown": (String)user_session.getAttribute("USER_STATUS");
  user_state = user_state == null ? "Available": user_state;
}
...
%>
<%-user_state %>`,
                vulnerableLines: [9],
                vulnerabilityType: "Uso de Datos Invalidados",
                cweid: "CWE-20",
                owaspCategory: "A03:2021 – Injection",
                question: "¿Qué línea contiene la vulnerabilidad de uso de datos invalidados?",
                explanation: {
                    vulnerability: "Sin unos límites de confianza bien establecidos los programadores inevitablemente perderán la pista de los datos que han sido validados y los que no, llevando al hecho de que se usarán datos en la aplicación sin haber sido validados.",
                    exploitation: "Un atacante puede manipular el atributo USER_STATUS en la sesión para inyectar contenido malicioso que se renderiza directamente en la página web.",
                    mitigation: "Validar y sanitizar todos los datos antes de usarlos, establecer límites de confianza claros, usar encoding apropiado para el contexto de salida.",
                    secureCode: `// Validar y sanitizar antes de usar
if (user_state != null) {
    user_state = StringEscapeUtils.escapeHtml4(user_state);
}
out.print(user_state);`
                },
                references: [
                    "https://cwe.mitre.org/data/definitions/20.html",
                    "https://owasp.org/www-community/vulnerabilities/Improper_Data_Validation"
                ],
                metadata: {
                    author: "Security Team",
                    dateCreated: "2024-01-01",
                    lastModified: "2024-01-01",
                    tags: ["input-validation", "java", "web-security"]
                }
            },
            // Pregunta 21 del quiz: Validación de entrada DNS
            {
                id: 5,
                title: "Validación de Entrada DNS en C",
                language: "c",
                difficulty: "advanced",
                category: "dns-validation",
                context: "Código que utiliza búsqueda DNS para determinar confianza de hosts.",
                code: `struct hostent *hp;
struct in_addr myaddr;
char* tHost = "trustme.com";
myaddr.s_addr = inet_addr(ip_addr_string);
hp = gethostbyaddr((char *) &myaddr, sizeof(struct in_addr), AF_INET);
if (hp && !strncmp(hp->h_name, tHost, sizeof(tHost))) {
  trusted = true;
} else {
  trusted = false;
}`,
                vulnerableLines: [5, 6],
                vulnerabilityType: "Validación de Entrada DNS",
                cweid: "CWE-350",
                owaspCategory: "A07:2021 – Identification and Authentication Failures",
                question: "¿Qué líneas contienen vulnerabilidades de validación DNS?",
                explanation: {
                    vulnerability: "El código utiliza una búsqueda de DNS para determinar si una petición de entrada es desde un host de confianza. Si los atacantes envenenan la caché de DNS, pueden obtener el estatus de confianza.",
                    exploitation: "Un atacante puede envenenar la caché DNS para hacer que gethostbyaddr() devuelva un nombre de host falso, o crear un subdominio como 'do_not_trustme.com' que también pasaría la validación.",
                    mitigation: "No confiar únicamente en DNS para autenticación, usar certificados digitales, implementar validación adicional de identidad, usar DNS seguro (DNSSEC).",
                    secureCode: `// Usar múltiples factores de autenticación
// Verificar certificados digitales
// Implementar whitelist de IPs específicas
if (verify_certificate(connection) && is_whitelisted_ip(ip_addr_string)) {
    trusted = true;
}`
                },
                references: [
                    "https://cwe.mitre.org/data/definitions/350.html",
                    "https://owasp.org/www-community/attacks/DNS_Spoofing"
                ],
                metadata: {
                    author: "Security Team",
                    dateCreated: "2024-01-01",
                    lastModified: "2024-01-01",
                    tags: ["dns-validation", "c", "network-security"]
                }
            },
            // Pregunta 23 del quiz: Validación de ruta (código correcto)
            {
                id: 6,
                title: "Validación de Ruta de Archivo",
                language: "java",
                difficulty: "basic",
                category: "path-validation",
                context: "Validación simple de longitud de ruta de archivo.",
                code: `if (path != null &&
path.length() > 0 && path.length() < MAXPATH) {
  fileOperation(path);
}`,
                vulnerableLines: [],
                vulnerabilityType: "Ninguna - Código Seguro",
                cweid: "N/A",
                owaspCategory: "N/A",
                question: "¿Este código contiene vulnerabilidades?",
                explanation: {
                    vulnerability: "Este código es correcto y no contiene vulnerabilidades evidentes. Realiza una validación básica pero efectiva de la longitud de la ruta.",
                    exploitation: "No hay vulnerabilidades evidentes en este fragmento de código.",
                    mitigation: "El código ya implementa buenas prácticas: verifica que el path no sea null, que tenga contenido, y que no exceda la longitud máxima permitida.",
                    secureCode: `// El código ya es seguro, pero se podría mejorar con:
if (path != null && 
    path.length() > 0 && 
    path.length() < MAXPATH &&
    isValidPath(path) &&
    !containsTraversalAttempt(path)) {
  fileOperation(path);
}`
                },
                references: [
                    "https://owasp.org/www-community/attacks/Path_Traversal"
                ],
                metadata: {
                    author: "Security Team",
                    dateCreated: "2024-01-01",
                    lastModified: "2024-01-01",
                    tags: ["path-validation", "java", "secure-code"]
                }
            },
            // Pregunta 24 del quiz: Integer Overflow
            {
                id: 7,
                title: "Integer Overflow en C",
                language: "c",
                difficulty: "advanced",
                category: "integer-overflow",
                context: "Extracto de OpenSSH 3.3 que muestra un caso clásico de integer overflow.",
                code: `u_int nresp;
nresp = packet_get_int();
if (nresp > 0) {
  response = xmalloc(nresp*sizeof(char*));
  for (i = 0; i < nresp; i++)
    response[i] = packet_get_string(NULL);
}`,
                vulnerableLines: [4],
                vulnerabilityType: "Integer Overflow",
                cweid: "CWE-190",
                owaspCategory: "A04:2021 – Insecure Design",
                question: "¿Qué línea contiene la vulnerabilidad de integer overflow?",
                explanation: {
                    vulnerability: "Si el valor de nresp es 1,073,741,824 y sizeof(char*) tiene un valor típico de 4, el resultado de la operación nresp * sizeof(char*) desborda, y el argumento a xmalloc() será 0.",
                    exploitation: "Debido a que el buffer asignado es muy insuficiente, las iteraciones del bucle posteriores desbordarán la pila, permitiendo potencialmente la ejecución de código arbitrario.",
                    mitigation: "Verificar el rango antes de la multiplicación, usar tipos de datos más grandes, implementar verificaciones de overflow, limitar la entrada del usuario.",
                    secureCode: `// Verificar overflow antes de la multiplicación
if (nresp > 0 && nresp <= MAX_RESPONSES) {
    size_t total_size = nresp * sizeof(char*);
    if (total_size / sizeof(char*) != nresp) {
        // Overflow detectado
        return ERROR;
    }
    response = xmalloc(total_size);
}`
                },
                references: [
                    "https://cwe.mitre.org/data/definitions/190.html",
                    "https://owasp.org/www-community/vulnerabilities/Integer_Overflow"
                ],
                metadata: {
                    author: "Security Team",
                    dateCreated: "2024-01-01",
                    lastModified: "2024-01-01",
                    tags: ["integer-overflow", "c", "memory-safety"]
                }
            },
            // Pregunta 37 del quiz: Manipulación de información privada
            {
                id: 8,
                title: "Manipulación de Información Privada en Java",
                language: "java",
                difficulty: "intermediate",
                category: "information-disclosure",
                context: "Método que ejecuta consultas SQL y puede exponer información sensible en logs.",
                code: `public ResultSet execSQL(Connection conn, String sql) {
  Statement stmt = null;
  ResultSet rs = null;
  try {
    stmt = conn.createStatement();
    rs = stmt.executeQuery(sql);
  } catch (SQLException sqe) {
    logger.log(Level.WARNING, "error executing: " + sql, sqe);
  } finally {
    close(stmt);
  }
  return rs;
}`,
                vulnerableLines: [8],
                vulnerabilityType: "Manipulación de Información Privada",
                cweid: "CWE-532",
                owaspCategory: "A09:2021 – Security Logging and Monitoring Failures",
                question: "¿Qué línea puede exponer información sensible?",
                explanation: {
                    vulnerability: "Si el método falla al ejecutar la consulta como está previsto (tal vez debido a que la base de datos no está disponible), el método registra la consulta en la excepción. Si la consulta contiene datos privados, los datos privados se registrarán.",
                    exploitation: "Un atacante con acceso a los logs puede obtener información sensible como contraseñas, números de tarjetas de crédito, o datos personales que estaban en las consultas SQL.",
                    mitigation: "No registrar consultas SQL completas, sanitizar logs, usar parámetros en lugar de concatenación, implementar niveles de logging apropiados.",
                    secureCode: `catch (SQLException sqe) {
    // No registrar la consulta completa, solo información general
    logger.log(Level.WARNING, "Database query execution failed", sqe);
    // O registrar solo un identificador de la consulta
    logger.log(Level.WARNING, "Query ID: " + queryId + " failed", sqe);
}`
                },
                references: [
                    "https://cwe.mitre.org/data/definitions/532.html",
                    "https://owasp.org/www-community/vulnerabilities/Information_exposure_through_log_files"
                ],
                metadata: {
                    author: "Security Team",
                    dateCreated: "2024-01-01",
                    lastModified: "2024-01-01",
                    tags: ["information-disclosure", "java", "logging"]
                }
            },
            // Pregunta 41 del quiz: Validación de entrada mediante lista negra
            {
                id: 9,
                title: "Validación de Entrada con Lista Negra en C",
                language: "c",
                difficulty: "intermediate",
                category: "input-validation",
                context: "Función que intenta filtrar caracteres peligrosos usando una lista negra.",
                code: `void aFunction(char *buf) {
  static char BANNED_CHARACTERS[] = {'>', '<', '!', '"'};
  int l = strlen(buf);
  int i;
  for(i = 0; i < l; i++) {
    int j;
    int k = sizeof(BANNED_CHARACTERS) / sizeof(char);
    for(j = 0; j < k; j++) {
      if(buf[i] == BANNED_CHARACTERS[j])
        buf[i] = '-';
    }
  }
}`,
                vulnerableLines: [2, 9],
                vulnerabilityType: "Validación de Entrada Inadecuada",
                cweid: "CWE-184",
                owaspCategory: "A03:2021 – Injection",
                question: "¿Qué líneas muestran problemas con la validación por lista negra?",
                explanation: {
                    vulnerability: "La función usa validación por lista negra, que es inherentemente insegura porque es imposible enumerar todos los caracteres peligrosos. Además, solo reemplaza caracteres en lugar de rechazar la entrada.",
                    exploitation: "Un atacante puede usar caracteres no incluidos en la lista negra (como &, %, #, etc.) para realizar ataques de inyección o usar combinaciones de caracteres permitidos para crear payloads maliciosos.",
                    mitigation: "Usar validación por lista blanca (permitir solo caracteres seguros conocidos), rechazar entrada inválida en lugar de modificarla, implementar validación contextual.",
                    secureCode: `bool isValidInput(char *buf) {
    // Lista blanca: solo permitir caracteres alfanuméricos y espacios
    for(int i = 0; i < strlen(buf); i++) {
        if(!isalnum(buf[i]) && buf[i] != ' ') {
            return false; // Rechazar entrada inválida
        }
    }
    return true;
}`
                },
                references: [
                    "https://cwe.mitre.org/data/definitions/184.html",
                    "https://owasp.org/www-community/vulnerabilities/Input_Validation"
                ],
                metadata: {
                    author: "Security Team",
                    dateCreated: "2024-01-01",
                    lastModified: "2024-01-01",
                    tags: ["input-validation", "c", "blacklist"]
                }
            },
            // Pregunta 43 del quiz: Condiciones de carrera (TOCTOU)
            {
                id: 10,
                title: "Condición de Carrera TOCTOU en C",
                language: "c",
                difficulty: "advanced",
                category: "race-condition",
                context: "Código que verifica la existencia de un archivo antes de crearlo, creando una ventana de vulnerabilidad.",
                code: `#include <stdio.h>
#include <stdlib.h>
#include <unistd.h>

#define MY_TMP_FILE "/tmp/file.tmp"

int main(int argc, char* argv[])
{
  FILE *f;
  if(!access(MY_TMP_FILE, F_OK)){
    printf("File exists\\n");
    return EXIT_FAILURE;
  }
  tmpFile = fopen(MY_TMP_FILE, "w");
  if(tmpFile == NULL){
    return EXIT_FAILURE;
  }
  fputs("Some text..\\n", tmpFile);
  fclose(tmpFile);
  return EXIT_SUCCESS;
}`,
                vulnerableLines: [9, 13],
                vulnerabilityType: "Condición de Carrera (TOCTOU)",
                cweid: "CWE-367",
                owaspCategory: "A04:2021 – Insecure Design",
                question: "¿Qué líneas crean la condición de carrera?",
                explanation: {
                    vulnerability: "Es una buena idea comprobar si un archivo existe o no antes de crearlo. Sin embargo, un usuario malicioso podría crear un archivo (o peor aún, un enlace simbólico a un archivo de sistema crítico) entre la comprobación y el momento en que realmente se utiliza el archivo.",
                    exploitation: "Un atacante puede crear un enlace simbólico a un archivo crítico del sistema (como /etc/passwd) entre la llamada a access() y fopen(), causando que el programa sobrescriba archivos importantes.",
                    mitigation: "Usar operaciones atómicas, abrir archivos con flags exclusivos (O_CREAT | O_EXCL), usar directorios temporales seguros, evitar archivos en /tmp.",
                    secureCode: `// Usar operación atómica con flags exclusivos
int fd = open(MY_TMP_FILE, O_CREAT | O_EXCL | O_WRONLY, 0600);
if (fd == -1) {
    perror("File creation failed");
    return EXIT_FAILURE;
}
FILE *tmpFile = fdopen(fd, "w");`
                },
                references: [
                    "https://cwe.mitre.org/data/definitions/367.html",
                    "https://owasp.org/www-community/vulnerabilities/Time_of_check_time_of_use"
                ],
                metadata: {
                    author: "Security Team",
                    dateCreated: "2024-01-01",
                    lastModified: "2024-01-01",
                    tags: ["race-condition", "c", "toctou"]
                }
            },
            // Pregunta 45 del quiz: Use After Free
            {
                id: 11,
                title: "Use After Free en C",
                language: "c",
                difficulty: "advanced",
                category: "use-after-free",
                context: "Código que utiliza memoria después de haberla liberado.",
                code: `#include <stdlib.h>
#include <string.h>
int main(int argc, char *argv[]) {
  char *return_val = 0;
  const size_t bufsize = strlen(argv[0]) + 1;
  char *buf = (char *)malloc(bufsize);
  if (!buf) {
    return EXIT_FAILURE;
  }
  /* ... */
  free(buf);
  /* ... */
  strcpy(buf, argv[0]);
  /* ... */
  return EXIT_SUCCESS;
}`,
                vulnerableLines: [13],
                vulnerabilityType: "Use After Free",
                cweid: "CWE-416",
                owaspCategory: "A06:2021 – Vulnerable and Outdated Components",
                question: "¿Qué línea contiene la vulnerabilidad use-after-free?",
                explanation: {
                    vulnerability: "El buffer se libera mediante free(buf) y luego se intenta usar con strcpy(buf, argv[0]). Esto es un clásico use-after-free vulnerability donde se utiliza memoria que ya ha sido liberada.",
                    exploitation: "Esto puede llevar a corrupción de memoria, crashes del programa, o en el peor caso, ejecución de código arbitrario si un atacante puede controlar el contenido de la memoria liberada.",
                    mitigation: "Establecer punteros a NULL después de free(), usar herramientas de detección de memoria, implementar gestión automática de memoria, revisar cuidadosamente el flujo de vida de los objetos.",
                    secureCode: `free(buf);
buf = NULL; // Prevenir use-after-free
// O mejor aún, reestructurar para evitar el uso después del free
strcpy(buf, argv[0]); // Mover antes del free
free(buf);
buf = NULL;`
                },
                references: [
                    "https://cwe.mitre.org/data/definitions/416.html",
                    "https://owasp.org/www-community/vulnerabilities/Using_freed_memory"
                ],
                metadata: {
                    author: "Security Team",
                    dateCreated: "2024-01-01",
                    lastModified: "2024-01-01",
                    tags: ["use-after-free", "c", "memory-safety"]
                }
            },
            // Pregunta 68 del quiz: Off by One
            {
                id: 12,
                title: "Off by One Error en C",
                language: "c",
                difficulty: "intermediate",
                category: "buffer-overflow",
                context: "Código con error off-by-one en el manejo de arrays.",
                code: `int main(int argc, char* argv[]) {
  char source[10];
  strcpy(source, "0123456789");
  char *dest = (char *)malloc(strlen(source));
  for (int i=1; i <= 11; i++) {
    dest[i] = source[i];
  }
  dest[i] = '\\0';
  printf("dest = %s", dest);
}`,
                vulnerableLines: [5, 6, 8],
                vulnerabilityType: "Off by One",
                cweid: "CWE-193",
                owaspCategory: "A06:2021 – Vulnerable and Outdated Components",
                question: "¿Qué líneas contienen errores off-by-one?",
                explanation: {
                    vulnerability: "El bucle comienza en i=1 en lugar de i=0, lo que causa un acceso fuera de los límites del buffer. Además, se accede a dest[11] cuando dest solo tiene tamaño strlen(source)=10, y la variable i está fuera de scope.",
                    exploitation: "Esto puede causar corrupción de memoria, crashes del programa, o permitir a un atacante sobrescribir memoria adyacente para ejecutar código malicioso.",
                    mitigation: "Comenzar bucles en 0 para arrays, verificar límites correctamente, usar herramientas de análisis estático, alocar memoria suficiente incluyendo el terminador null.",
                    secureCode: `int main(int argc, char* argv[]) {
  char source[11]; // +1 para null terminator
  strcpy(source, "0123456789");
  char *dest = (char *)malloc(strlen(source) + 1); // +1 para null terminator
  for (int i = 0; i < strlen(source); i++) { // Comenzar en 0, usar < en lugar de <=
    dest[i] = source[i];
  }
  dest[strlen(source)] = '\\0'; // Terminar correctamente
  printf("dest = %s", dest);
  free(dest);
}`
                },
                references: [
                    "https://cwe.mitre.org/data/definitions/193.html",
                    "https://owasp.org/www-community/vulnerabilities/Buffer_Overflow"
                ],
                metadata: {
                    author: "Security Team",
                    dateCreated: "2024-01-01",
                    lastModified: "2024-01-01",
                    tags: ["off-by-one", "c", "buffer-overflow"]
                }
            },
            // Pregunta 69 del quiz: SQL Injection (código seguro)
            {
                id: 13,
                title: "Consulta SQL Parametrizada Segura",
                language: "csharp",
                difficulty: "basic",
                category: "sql-injection",
                context: "Función que utiliza consultas parametrizadas para prevenir inyección SQL.",
                code: `public void InsertAccountNumber(String EmployeeNumber)
{
  // Create a dynamic SQL statement
  String sqlQuery = "SELECT * FROM HrTable WHERE Num = @pENum";
  SqlParameter pENum = new SqlParameter("@pENum",SqlDbType.NVarChar,150);
  pENum.Value = EmployeeNumber;
  SqlCommand sqlCmd = new SqlCommand(sqlQuery,
  new SqlConnection(connectionString));
  sqlCmd.Parameters.Add(pENum);
  // Execute the sql command
  …
}`,
                vulnerableLines: [],
                vulnerabilityType: "Ninguna - Código Seguro",
                cweid: "N/A",
                owaspCategory: "N/A",
                question: "¿Esta función contiene vulnerabilidades de inyección SQL?",
                explanation: {
                    vulnerability: "La función no contiene vulnerabilidad de inyección SQL porque utiliza consultas parametrizadas (SqlParameter). El parámetro se vincula de forma segura a la consulta, no se concatena directamente.",
                    exploitation: "No hay vulnerabilidades de inyección SQL en este código. Las consultas parametrizadas son la defensa estándar contra inyección SQL.",
                    mitigation: "El código ya implementa la mejor práctica: usar consultas parametrizadas. Esto previene automáticamente la inyección SQL al separar el código SQL de los datos.",
                    secureCode: `// El código ya es seguro, pero se podría mejorar con:
// 1. Validación adicional de entrada
if (string.IsNullOrEmpty(EmployeeNumber) || EmployeeNumber.Length > 150) {
    throw new ArgumentException("Invalid employee number");
}
// 2. Using statements para manejo de recursos
using (var connection = new SqlConnection(connectionString))
using (var sqlCmd = new SqlCommand(sqlQuery, connection)) {
    sqlCmd.Parameters.Add(pENum);
    // Execute command
}`
                },
                references: [
                    "https://owasp.org/www-community/attacks/SQL_Injection",
                    "https://docs.microsoft.com/en-us/sql/relational-databases/security/sql-injection"
                ],
                metadata: {
                    author: "Security Team",
                    dateCreated: "2024-01-01",
                    lastModified: "2024-01-01",
                    tags: ["sql-injection", "csharp", "secure-code", "parameterized-queries"]
                }
            }
        ];
    }
}

// Global functions for HTML onclick handlers
function previousQuestion() {
    if (window.vulnerabilityApp) {
        window.vulnerabilityApp.previousQuestion();
    }
}

function nextQuestion() {
    if (window.vulnerabilityApp) {
        window.vulnerabilityApp.nextQuestion();
    }
}

function verifyAnswer() {
    if (window.vulnerabilityApp) {
        window.vulnerabilityApp.verifyAnswer();
    }
}

// Initialize application when script loads
window.vulnerabilityApp = new VulnerabilityAnalyzerApp();

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = VulnerabilityAnalyzerApp;
}