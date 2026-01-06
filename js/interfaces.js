/**
 * Core interfaces and data structures for the Vulnerability Code Analyzer
 * Defines the contracts for all components and data models
 */

/**
 * Question data structure interface
 * @typedef {Object} Question
 * @property {number} id - Unique identifier for the question
 * @property {string} title - Question title
 * @property {string} language - Programming language (c, cpp, java, javascript, python, php, sql)
 * @property {string} difficulty - Difficulty level (basic, intermediate, advanced)
 * @property {string} category - Vulnerability category (sql-injection, buffer-overflow, xss, etc.)
 * @property {string} context - Context or background information
 * @property {string} code - Source code with vulnerability
 * @property {number[]} vulnerableLines - Array of vulnerable line numbers (1-indexed)
 * @property {string} vulnerabilityType - Type of vulnerability
 * @property {string} cweid - CWE identifier
 * @property {string} owaspCategory - OWASP Top 10 category
 * @property {string} question - Question text for the user
 * @property {QuestionExplanation} explanation - Detailed explanation
 * @property {string[]} references - Educational references
 * @property {QuestionMetadata} metadata - Question metadata
 */

/**
 * Question explanation structure
 * @typedef {Object} QuestionExplanation
 * @property {string} vulnerability - Description of the vulnerability
 * @property {string} exploitation - How the vulnerability can be exploited
 * @property {string} mitigation - How to mitigate the vulnerability
 * @property {string} secureCode - Example of secure code
 */

/**
 * Question metadata structure
 * @typedef {Object} QuestionMetadata
 * @property {string} author - Question author
 * @property {string} dateCreated - Creation date
 * @property {string} lastModified - Last modification date
 * @property {string[]} tags - Question tags
 */

/**
 * Selection state interface
 * @typedef {Object} SelectionState
 * @property {Set<number>} selectedLines - Currently selected line numbers
 * @property {boolean} isAnswered - Whether the question has been answered
 * @property {boolean} isCorrect - Whether the answer is correct
 * @property {number[]} userAnswer - User's selected lines
 * @property {number[]} correctAnswer - Correct vulnerable lines
 * @property {FeedbackData} feedback - Feedback information
 */

/**
 * Feedback data structure
 * @typedef {Object} FeedbackData
 * @property {'success'|'error'|'partial'} type - Type of feedback
 * @property {string} message - Feedback message
 * @property {string} explanation - Detailed explanation
 */

/**
 * Application state interface
 * @typedef {Object} ApplicationState
 * @property {number} currentQuestionIndex - Current question index
 * @property {Question[]} questions - All questions
 * @property {Question[]} filteredQuestions - Filtered questions
 * @property {UserProgress} userProgress - User progress data
 * @property {AppSettings} settings - Application settings
 */

/**
 * User progress tracking
 * @typedef {Object} UserProgress
 * @property {number[]} completed - Completed question IDs
 * @property {number[]} correct - Correctly answered question IDs
 * @property {number[]} incorrect - Incorrectly answered question IDs
 * @property {Map<string, ProgressData>} categoryProgress - Progress by category
 */

/**
 * Progress data for categories
 * @typedef {Object} ProgressData
 * @property {number} total - Total questions in category
 * @property {number} completed - Completed questions in category
 * @property {number} correct - Correct answers in category
 */

/**
 * Application settings
 * @typedef {Object} AppSettings
 * @property {'light'|'dark'} theme - UI theme
 * @property {'small'|'medium'|'large'} fontSize - Font size preference
 * @property {boolean} showLineNumbers - Whether to show line numbers
 * @property {boolean} autoAdvance - Auto advance to next question
 */

/**
 * Code renderer interface
 * @interface ICodeRenderer
 */
class ICodeRenderer {
    /**
     * Render code with syntax highlighting
     * @param {string} code - Source code to render
     * @param {string} language - Programming language
     * @param {boolean} lineNumbers - Whether to show line numbers
     * @returns {void}
     */
    renderCode(code, language, lineNumbers = true) {
        throw new Error('Method must be implemented');
    }

    /**
     * Escape HTML characters for security
     * @param {string} code - Code to escape
     * @returns {string} Escaped code
     */
    escapeHtml(code) {
        throw new Error('Method must be implemented');
    }

    /**
     * Apply syntax highlighting
     * @param {HTMLElement} element - Element to highlight
     * @param {string} language - Programming language
     * @returns {void}
     */
    applySyntaxHighlighting(element, language) {
        throw new Error('Method must be implemented');
    }
}

/**
 * Selection manager interface
 * @interface ISelectionManager
 */
class ISelectionManager {
    /**
     * Enable line selection functionality
     * @returns {void}
     */
    enableSelection() {
        throw new Error('Method must be implemented');
    }

    /**
     * Handle line click events
     * @param {number} lineNumber - Line number clicked
     * @returns {void}
     */
    handleLineClick(lineNumber) {
        throw new Error('Method must be implemented');
    }

    /**
     * Get currently selected lines
     * @returns {number[]} Selected line numbers
     */
    getSelectedLines() {
        throw new Error('Method must be implemented');
    }

    /**
     * Clear all selections
     * @returns {void}
     */
    clearSelection() {
        throw new Error('Method must be implemented');
    }

    /**
     * Highlight correct lines
     * @param {number[]} lines - Line numbers to highlight as correct
     * @returns {void}
     */
    highlightCorrectLines(lines) {
        throw new Error('Method must be implemented');
    }

    /**
     * Highlight incorrect lines
     * @param {number[]} lines - Line numbers to highlight as incorrect
     * @returns {void}
     */
    highlightIncorrectLines(lines) {
        throw new Error('Method must be implemented');
    }
}

/**
 * Feedback system interface
 * @interface IFeedbackSystem
 */
class IFeedbackSystem {
    /**
     * Validate user answer
     * @param {number[]} selectedLines - User selected lines
     * @param {number[]} correctLines - Correct vulnerable lines
     * @returns {FeedbackData} Validation result
     */
    validateAnswer(selectedLines, correctLines) {
        throw new Error('Method must be implemented');
    }

    /**
     * Show success feedback
     * @param {string} vulnerability - Vulnerability type
     * @param {QuestionExplanation} explanation - Detailed explanation
     * @returns {void}
     */
    showSuccessFeedback(vulnerability, explanation) {
        throw new Error('Method must be implemented');
    }

    /**
     * Show error feedback
     * @param {number[]} selectedLines - User selected lines
     * @param {number[]} correctLines - Correct lines
     * @param {QuestionExplanation} explanation - Detailed explanation
     * @returns {void}
     */
    showErrorFeedback(selectedLines, correctLines, explanation) {
        throw new Error('Method must be implemented');
    }

    /**
     * Render detailed explanation
     * @param {Question} question - Question data
     * @returns {void}
     */
    renderExplanation(question) {
        throw new Error('Method must be implemented');
    }
}

/**
 * Question manager interface
 * @interface IQuestionManager
 */
class IQuestionManager {
    /**
     * Load question by index
     * @param {number} index - Question index
     * @returns {Question|null} Question data or null if not found
     */
    loadQuestion(index) {
        throw new Error('Method must be implemented');
    }

    /**
     * Navigate to next question
     * @returns {boolean} True if navigation successful
     */
    nextQuestion() {
        throw new Error('Method must be implemented');
    }

    /**
     * Navigate to previous question
     * @returns {boolean} True if navigation successful
     */
    previousQuestion() {
        throw new Error('Method must be implemented');
    }

    /**
     * Filter questions by criteria
     * @param {Object} criteria - Filter criteria
     * @returns {Question[]} Filtered questions
     */
    filterQuestions(criteria) {
        throw new Error('Method must be implemented');
    }

    /**
     * Validate question structure
     * @param {Question} question - Question to validate
     * @returns {boolean} True if valid
     */
    validateQuestion(question) {
        throw new Error('Method must be implemented');
    }
}

/**
 * Utility functions for data validation and manipulation
 */
class ValidationUtils {
    /**
     * Validate question data structure
     * @param {Question} question - Question to validate
     * @returns {boolean} True if valid
     */
    static validateQuestion(question) {
        if (!question || typeof question !== 'object') return false;
        
        const requiredFields = ['id', 'title', 'language', 'code', 'vulnerableLines', 'question'];
        for (const field of requiredFields) {
            if (!(field in question)) return false;
        }
        
        // Validate types
        if (typeof question.id !== 'number') return false;
        if (typeof question.title !== 'string') return false;
        if (typeof question.language !== 'string') return false;
        if (typeof question.code !== 'string') return false;
        if (!Array.isArray(question.vulnerableLines)) return false;
        if (typeof question.question !== 'string') return false;
        
        // Validate vulnerable lines are within code bounds
        const codeLines = question.code.split('\n').length;
        for (const lineNum of question.vulnerableLines) {
            if (typeof lineNum !== 'number' || lineNum < 1 || lineNum > codeLines) {
                return false;
            }
        }
        
        return true;
    }

    /**
     * Sanitize HTML content
     * @param {string} html - HTML content to sanitize
     * @returns {string} Sanitized HTML
     */
    static sanitizeHtml(html) {
        const div = document.createElement('div');
        div.textContent = html;
        return div.innerHTML;
    }

    /**
     * Escape HTML special characters
     * @param {string} text - Text to escape
     * @returns {string} Escaped text
     */
    static escapeHtml(text) {
        const map = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#039;'
        };
        return text.replace(/[&<>"']/g, (m) => map[m]);
    }

    /**
     * Check if arrays are equal
     * @param {Array} arr1 - First array
     * @param {Array} arr2 - Second array
     * @returns {boolean} True if arrays are equal
     */
    static arraysEqual(arr1, arr2) {
        if (arr1.length !== arr2.length) return false;
        const sorted1 = [...arr1].sort();
        const sorted2 = [...arr2].sort();
        return sorted1.every((val, index) => val === sorted2[index]);
    }

    /**
     * Calculate array intersection
     * @param {Array} arr1 - First array
     * @param {Array} arr2 - Second array
     * @returns {Array} Intersection of arrays
     */
    static arrayIntersection(arr1, arr2) {
        return arr1.filter(value => arr2.includes(value));
    }

    /**
     * Calculate array difference
     * @param {Array} arr1 - First array
     * @param {Array} arr2 - Second array
     * @returns {Array} Elements in arr1 but not in arr2
     */
    static arrayDifference(arr1, arr2) {
        return arr1.filter(value => !arr2.includes(value));
    }
}

// Export interfaces and utilities for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        ICodeRenderer,
        ISelectionManager,
        IFeedbackSystem,
        IQuestionManager,
        ValidationUtils
    };
}