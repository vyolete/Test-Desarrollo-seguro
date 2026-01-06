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
        // Enable/disable verify button based on selection
        this.elements.verifyButton.disabled = selectedLines.length === 0;
        
        // Update button text
        const count = selectedLines.length;
        this.elements.verifyButton.textContent = count > 0 
            ? `🔍 Verificar Respuesta (${count} línea${count !== 1 ? 's' : ''} seleccionada${count !== 1 ? 's' : ''})`
            : '🔍 Verificar Respuesta';
    }

    /**
     * Handle question loading
     * @param {Question} question - Loaded question
     * @param {number} index - Question index
     */
    onQuestionLoad(question, index) {
        if (!question) return;
        
        // Reset components for new question
        this.resetForNewQuestion();
        
        // Update question display
        this.displayQuestion(question);
        
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
        
        // Enable selection
        this.selectionManager.enableSelection();
        
        // Clear feedback
        this.feedbackSystem.clear();
    }

    /**
     * Reset components for new question
     */
    resetForNewQuestion() {
        this.selectionManager.reset();
        this.feedbackSystem.clear();
        this.elements.verifyButton.disabled = true;
        this.elements.verifyButton.textContent = '🔍 Verificar Respuesta';
    }

    /**
     * Verify the user's answer
     */
    verifyAnswer() {
        const currentQuestion = this.questionManager.getCurrentQuestion();
        if (!currentQuestion) return;
        
        const selectedLines = this.selectionManager.getSelectedLines();
        if (selectedLines.length === 0) return;
        
        // Validate answer
        const validationResult = this.feedbackSystem.validateAnswer(
            selectedLines, 
            currentQuestion.vulnerableLines
        );
        
        // Mark selection manager as answered
        this.selectionManager.markAsAnswered();
        
        // Show visual feedback on code lines
        this.showCodeLineFeedback(selectedLines, currentQuestion.vulnerableLines);
        
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