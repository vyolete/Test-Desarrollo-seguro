/**
 * Question Manager Component
 * Manages question loading, navigation, and filtering
 */

class QuestionManager {
    /**
     * Initialize the question manager
     * @param {Question[]} questions - Array of questions
     */
    constructor(questions = []) {
        
        this.allQuestions = [];
        this.filteredQuestions = [];
        this.currentQuestionIndex = 0;
        this.currentQuestion = null;
        
        // Filter criteria
        this.filters = {
            difficulty: '',
            category: '',
            language: ''
        };
        
        // Callbacks
        this.onQuestionLoad = null;
        this.onQuestionChange = null;
        this.onFilterChange = null;
        
        // Load initial questions
        if (questions.length > 0) {
            this.loadQuestions(questions);
        }
    }

    /**
     * Load questions into the manager
     * @param {Question[]} questions - Array of questions
     */
    loadQuestions(questions) {
        if (!Array.isArray(questions)) {
            throw new Error('Questions must be an array');
        }
        
        // Validate all questions
        const validQuestions = questions.filter(question => {
            const isValid = this.validateQuestion(question);
            if (!isValid) {
                console.warn('Invalid question found:', question);
            }
            return isValid;
        });
        
        this.allQuestions = validQuestions;
        this.filteredQuestions = [...validQuestions];
        this.currentQuestionIndex = 0;
        
        // Load first question if available
        if (this.filteredQuestions.length > 0) {
            this.loadQuestion(0);
        }
        
        console.log(`Loaded ${validQuestions.length} valid questions`);
    }

    /**
     * Load question by index
     * @param {number} index - Question index
     * @returns {Question|null} Question data or null if not found
     */
    loadQuestion(index) {
        if (index < 0 || index >= this.filteredQuestions.length) {
            console.warn(`Question index ${index} out of bounds`);
            return null;
        }
        
        this.currentQuestionIndex = index;
        this.currentQuestion = this.filteredQuestions[index];
        
        // Trigger callback
        if (this.onQuestionLoad) {
            this.onQuestionLoad(this.currentQuestion, index);
        }
        
        return this.currentQuestion;
    }

    /**
     * Navigate to next question
     * @returns {boolean} True if navigation successful
     */
    nextQuestion() {
        const nextIndex = this.currentQuestionIndex + 1;
        
        if (nextIndex >= this.filteredQuestions.length) {
            return false; // Already at last question
        }
        
        const previousQuestion = this.currentQuestion;
        const success = this.loadQuestion(nextIndex) !== null;
        
        if (success && this.onQuestionChange) {
            this.onQuestionChange(this.currentQuestion, previousQuestion, 'next');
        }
        
        return success;
    }

    /**
     * Navigate to previous question
     * @returns {boolean} True if navigation successful
     */
    previousQuestion() {
        const prevIndex = this.currentQuestionIndex - 1;
        
        if (prevIndex < 0) {
            return false; // Already at first question
        }
        
        const previousQuestion = this.currentQuestion;
        const success = this.loadQuestion(prevIndex) !== null;
        
        if (success && this.onQuestionChange) {
            this.onQuestionChange(this.currentQuestion, previousQuestion, 'previous');
        }
        
        return success;
    }

    /**
     * Jump to specific question by index
     * @param {number} index - Target question index
     * @returns {boolean} True if navigation successful
     */
    goToQuestion(index) {
        if (index === this.currentQuestionIndex) {
            return true; // Already at target question
        }
        
        const previousQuestion = this.currentQuestion;
        const success = this.loadQuestion(index) !== null;
        
        if (success && this.onQuestionChange) {
            const direction = index > this.currentQuestionIndex ? 'next' : 'previous';
            this.onQuestionChange(this.currentQuestion, previousQuestion, direction);
        }
        
        return success;
    }

    /**
     * Filter questions by criteria
     * @param {Object} criteria - Filter criteria
     * @returns {Question[]} Filtered questions
     */
    filterQuestions(criteria = {}) {
        // Update filter criteria
        this.filters = { ...this.filters, ...criteria };
        
        // Apply filters
        this.filteredQuestions = this.allQuestions.filter(question => {
            // Difficulty filter
            if (this.filters.difficulty && question.difficulty !== this.filters.difficulty) {
                return false;
            }
            
            // Category filter
            if (this.filters.category && question.category !== this.filters.category) {
                return false;
            }
            
            // Language filter
            if (this.filters.language && question.language !== this.filters.language) {
                return false;
            }
            
            return true;
        });
        
        // Reset to first question after filtering
        this.currentQuestionIndex = 0;
        
        // Load first filtered question
        if (this.filteredQuestions.length > 0) {
            this.loadQuestion(0);
        } else {
            this.currentQuestion = null;
        }
        
        // Trigger callback
        if (this.onFilterChange) {
            this.onFilterChange(this.filteredQuestions, this.filters);
        }
        
        return this.filteredQuestions;
    }

    /**
     * Clear all filters
     */
    clearFilters() {
        this.filterQuestions({
            difficulty: '',
            category: '',
            language: ''
        });
    }

    /**
     * Validate question structure
     * @param {Question} question - Question to validate
     * @returns {boolean} True if valid
     */
    validateQuestion(question) {
        if (!question || typeof question !== 'object') {
            return false;
        }
        
        // Required fields
        const requiredFields = [
            'id', 'title', 'language', 'difficulty', 'category',
            'code', 'vulnerableLines', 'vulnerabilityType', 'question', 'explanation'
        ];
        
        for (const field of requiredFields) {
            if (!(field in question)) {
                console.warn(`Missing required field: ${field}`);
                return false;
            }
        }
        
        // Type validations
        if (typeof question.id !== 'number') return false;
        if (typeof question.title !== 'string') return false;
        if (typeof question.language !== 'string') return false;
        if (typeof question.difficulty !== 'string') return false;
        if (typeof question.category !== 'string') return false;
        if (typeof question.code !== 'string') return false;
        if (typeof question.vulnerabilityType !== 'string') return false;
        if (typeof question.question !== 'string') return false;
        
        // Array validations
        if (!Array.isArray(question.vulnerableLines)) return false;
        // Allow empty arrays for questions with no vulnerabilities (secure code examples)
        // if (question.vulnerableLines.length === 0) return false;
        
        // Explanation validation
        if (!question.explanation || typeof question.explanation !== 'object') return false;
        const explanationFields = ['vulnerability', 'exploitation', 'mitigation'];
        for (const field of explanationFields) {
            if (typeof question.explanation[field] !== 'string') return false;
        }
        
        // Validate vulnerable lines are within code bounds (only if there are vulnerable lines)
        const codeLines = question.code.split('\n').length;
        for (const lineNum of question.vulnerableLines) {
            if (typeof lineNum !== 'number' || lineNum < 1 || lineNum > codeLines) {
                console.warn(`Invalid line number: ${lineNum} (code has ${codeLines} lines)`);
                return false;
            }
        }
        
        // Validate supported language
        const supportedLanguages = ['c', 'cpp', 'java', 'javascript', 'python', 'php', 'sql', 'csharp'];
        if (!supportedLanguages.includes(question.language.toLowerCase())) {
            console.warn(`Unsupported language: ${question.language}`);
            return false;
        }
        
        // Validate difficulty level
        const supportedDifficulties = ['basic', 'intermediate', 'advanced'];
        if (!supportedDifficulties.includes(question.difficulty.toLowerCase())) {
            console.warn(`Unsupported difficulty: ${question.difficulty}`);
            return false;
        }
        
        return true;
    }

    /**
     * Get current question
     * @returns {Question|null} Current question or null
     */
    getCurrentQuestion() {
        return this.currentQuestion;
    }

    /**
     * Get current question index
     * @returns {number} Current question index
     */
    getCurrentQuestionIndex() {
        return this.currentQuestionIndex;
    }

    /**
     * Get total number of filtered questions
     * @returns {number} Total filtered questions
     */
    getTotalQuestions() {
        return this.filteredQuestions.length;
    }

    /**
     * Get total number of all questions
     * @returns {number} Total questions
     */
    getTotalAllQuestions() {
        return this.allQuestions.length;
    }

    /**
     * Check if there is a next question
     * @returns {boolean} True if next question exists
     */
    hasNext() {
        return this.currentQuestionIndex < this.filteredQuestions.length - 1;
    }

    /**
     * Check if there is a previous question
     * @returns {boolean} True if previous question exists
     */
    hasPrevious() {
        return this.currentQuestionIndex > 0;
    }

    /**
     * Get current filters
     * @returns {Object} Current filter criteria
     */
    getCurrentFilters() {
        return { ...this.filters };
    }

    /**
     * Get filtered questions
     * @returns {Question[]} Array of filtered questions
     */
    getFilteredQuestions() {
        return [...this.filteredQuestions];
    }

    /**
     * Get all questions
     * @returns {Question[]} Array of all questions
     */
    getAllQuestions() {
        return [...this.allQuestions];
    }

    /**
     * Get question statistics
     * @returns {Object} Question statistics
     */
    getStatistics() {
        const stats = {
            total: this.allQuestions.length,
            filtered: this.filteredQuestions.length,
            current: this.currentQuestionIndex + 1,
            byDifficulty: {},
            byCategory: {},
            byLanguage: {}
        };
        
        // Count by difficulty
        this.allQuestions.forEach(q => {
            stats.byDifficulty[q.difficulty] = (stats.byDifficulty[q.difficulty] || 0) + 1;
        });
        
        // Count by category
        this.allQuestions.forEach(q => {
            stats.byCategory[q.category] = (stats.byCategory[q.category] || 0) + 1;
        });
        
        // Count by language
        this.allQuestions.forEach(q => {
            stats.byLanguage[q.language] = (stats.byLanguage[q.language] || 0) + 1;
        });
        
        return stats;
    }

    /**
     * Search questions by text
     * @param {string} searchText - Text to search for
     * @returns {Question[]} Matching questions
     */
    searchQuestions(searchText) {
        if (!searchText || typeof searchText !== 'string') {
            return this.filteredQuestions;
        }
        
        const searchLower = searchText.toLowerCase();
        
        return this.filteredQuestions.filter(question => {
            return (
                question.title.toLowerCase().includes(searchLower) ||
                question.vulnerabilityType.toLowerCase().includes(searchLower) ||
                question.category.toLowerCase().includes(searchLower) ||
                question.question.toLowerCase().includes(searchLower) ||
                question.code.toLowerCase().includes(searchLower)
            );
        });
    }

    /**
     * Get random question
     * @returns {Question|null} Random question or null
     */
    getRandomQuestion() {
        if (this.filteredQuestions.length === 0) return null;
        
        const randomIndex = Math.floor(Math.random() * this.filteredQuestions.length);
        return this.loadQuestion(randomIndex);
    }

    /**
     * Set callback for question loading
     * @param {Function} callback - Callback function
     */
    setOnQuestionLoad(callback) {
        this.onQuestionLoad = callback;
    }

    /**
     * Set callback for question changes
     * @param {Function} callback - Callback function
     */
    setOnQuestionChange(callback) {
        this.onQuestionChange = callback;
    }

    /**
     * Set callback for filter changes
     * @param {Function} callback - Callback function
     */
    setOnFilterChange(callback) {
        this.onFilterChange = callback;
    }

    /**
     * Reset to first question
     */
    reset() {
        this.currentQuestionIndex = 0;
        if (this.filteredQuestions.length > 0) {
            this.loadQuestion(0);
        }
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = QuestionManager;
}