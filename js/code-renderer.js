/**
 * Code Renderer Component
 * Handles rendering of source code with syntax highlighting and line numbering
 */

class CodeRenderer extends ICodeRenderer {
    /**
     * Initialize the code renderer
     * @param {string} containerId - ID of the container element
     * @param {Object} options - Configuration options
     */
    constructor(containerId, options = {}) {
        super();
        this.container = document.getElementById(containerId);
        if (!this.container) {
            throw new Error(`Container element with ID '${containerId}' not found`);
        }
        
        this.options = {
            showLineNumbers: true,
            theme: 'atom-one-dark',
            tabSize: 4,
            ...options
        };
        
        // Supported languages mapping
        this.languageMap = {
            'c': 'c',
            'cpp': 'cpp',
            'c++': 'cpp',
            'java': 'java',
            'javascript': 'javascript',
            'js': 'javascript',
            'python': 'python',
            'py': 'python',
            'php': 'php',
            'sql': 'sql'
        };
        
        this.currentCode = '';
        this.currentLanguage = '';
    }

    /**
     * Render code with syntax highlighting
     * @param {string} code - Source code to render
     * @param {string} language - Programming language
     * @param {boolean} lineNumbers - Whether to show line numbers
     */
    renderCode(code, language, lineNumbers = true) {
        if (!code || typeof code !== 'string') {
            throw new Error('Code must be a non-empty string');
        }
        
        if (!language || typeof language !== 'string') {
            throw new Error('Language must be a non-empty string');
        }
        
        this.currentCode = code;
        this.currentLanguage = this.normalizeLanguage(language);
        
        // Clear container
        this.container.innerHTML = '';
        
        // Split code into lines
        const lines = code.split('\n');
        
        // Create code lines
        lines.forEach((line, index) => {
            const lineNumber = index + 1;
            const lineElement = this.createCodeLine(line, lineNumber, lineNumbers);
            this.container.appendChild(lineElement);
        });
        
        // Apply syntax highlighting to the entire container
        this.applySyntaxHighlighting(this.container, this.currentLanguage);
        
        // Set up accessibility attributes
        this.setupAccessibility();
    }

    /**
     * Create a single code line element
     * @param {string} lineContent - Content of the line
     * @param {number} lineNumber - Line number (1-indexed)
     * @param {boolean} showLineNumbers - Whether to show line numbers
     * @returns {HTMLElement} Line element
     */
    createCodeLine(lineContent, lineNumber, showLineNumbers) {
        const lineElement = document.createElement('div');
        lineElement.className = 'code-line';
        lineElement.setAttribute('data-line-number', lineNumber);
        lineElement.setAttribute('tabindex', '0');
        lineElement.setAttribute('role', 'button');
        lineElement.setAttribute('aria-label', `Línea ${lineNumber}: ${lineContent || 'línea vacía'}`);
        
        if (showLineNumbers) {
            const lineNumberElement = document.createElement('span');
            lineNumberElement.className = 'line-number';
            lineNumberElement.textContent = lineNumber;
            lineNumberElement.setAttribute('aria-hidden', 'true');
            lineElement.appendChild(lineNumberElement);
        }
        
        const contentElement = document.createElement('span');
        contentElement.className = 'line-content';
        
        // Escape HTML and preserve whitespace
        const escapedContent = this.escapeHtml(lineContent);
        contentElement.innerHTML = escapedContent || '&nbsp;'; // Non-breaking space for empty lines
        
        lineElement.appendChild(contentElement);
        
        return lineElement;
    }

    /**
     * Escape HTML characters for security
     * @param {string} code - Code to escape
     * @returns {string} Escaped code
     */
    escapeHtml(code) {
        if (typeof code !== 'string') return '';
        
        const htmlEscapeMap = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#x27;',
            '/': '&#x2F;',
            '`': '&#x60;',
            '=': '&#x3D;'
        };
        
        return code.replace(/[&<>"'`=\/]/g, (match) => htmlEscapeMap[match]);
    }

    /**
     * Apply syntax highlighting using highlight.js
     * @param {HTMLElement} element - Element to highlight
     * @param {string} language - Programming language
     */
    applySyntaxHighlighting(element, language) {
        try {
            // Check if highlight.js is available
            if (typeof hljs === 'undefined') {
                console.warn('highlight.js not available, skipping syntax highlighting');
                return;
            }
            
            // Get all line content elements
            const contentElements = element.querySelectorAll('.line-content');
            
            contentElements.forEach(contentElement => {
                const code = contentElement.textContent || '';
                
                try {
                    // Apply highlighting
                    const result = hljs.highlight(code, { language });
                    contentElement.innerHTML = result.value;
                } catch (highlightError) {
                    // Fallback to auto-detection
                    try {
                        const autoResult = hljs.highlightAuto(code);
                        contentElement.innerHTML = autoResult.value;
                    } catch (autoError) {
                        // Keep original escaped content
                        console.warn('Syntax highlighting failed:', autoError);
                    }
                }
            });
            
        } catch (error) {
            console.error('Error applying syntax highlighting:', error);
        }
    }

    /**
     * Normalize language identifier
     * @param {string} language - Language identifier
     * @returns {string} Normalized language
     */
    normalizeLanguage(language) {
        const normalized = language.toLowerCase().trim();
        return this.languageMap[normalized] || normalized;
    }

    /**
     * Set up accessibility attributes
     */
    setupAccessibility() {
        this.container.setAttribute('role', 'region');
        this.container.setAttribute('aria-label', `Código fuente en ${this.currentLanguage}`);
        
        // Add keyboard navigation support
        this.setupKeyboardNavigation();
    }

    /**
     * Set up keyboard navigation for code lines
     */
    setupKeyboardNavigation() {
        this.container.addEventListener('keydown', (event) => {
            const currentLine = event.target;
            if (!currentLine.classList.contains('code-line')) return;
            
            const lines = Array.from(this.container.querySelectorAll('.code-line'));
            const currentIndex = lines.indexOf(currentLine);
            
            let targetIndex = -1;
            
            switch (event.key) {
                case 'ArrowUp':
                    targetIndex = Math.max(0, currentIndex - 1);
                    event.preventDefault();
                    break;
                case 'ArrowDown':
                    targetIndex = Math.min(lines.length - 1, currentIndex + 1);
                    event.preventDefault();
                    break;
                case 'Home':
                    targetIndex = 0;
                    event.preventDefault();
                    break;
                case 'End':
                    targetIndex = lines.length - 1;
                    event.preventDefault();
                    break;
                case 'Enter':
                case ' ':
                    // Trigger click event for selection
                    currentLine.click();
                    event.preventDefault();
                    break;
            }
            
            if (targetIndex >= 0 && targetIndex < lines.length) {
                lines[targetIndex].focus();
            }
        });
    }

    /**
     * Get the current rendered code
     * @returns {string} Current code
     */
    getCurrentCode() {
        return this.currentCode;
    }

    /**
     * Get the current language
     * @returns {string} Current language
     */
    getCurrentLanguage() {
        return this.currentLanguage;
    }

    /**
     * Get line count
     * @returns {number} Number of lines
     */
    getLineCount() {
        return this.currentCode ? this.currentCode.split('\n').length : 0;
    }

    /**
     * Get line content by number
     * @param {number} lineNumber - Line number (1-indexed)
     * @returns {string|null} Line content or null if not found
     */
    getLineContent(lineNumber) {
        if (!this.currentCode) return null;
        
        const lines = this.currentCode.split('\n');
        const index = lineNumber - 1;
        
        return index >= 0 && index < lines.length ? lines[index] : null;
    }

    /**
     * Validate that line numbers exist in the current code
     * @param {number[]} lineNumbers - Array of line numbers to validate
     * @returns {boolean} True if all line numbers are valid
     */
    validateLineNumbers(lineNumbers) {
        if (!Array.isArray(lineNumbers)) return false;
        
        const maxLine = this.getLineCount();
        return lineNumbers.every(lineNum => 
            typeof lineNum === 'number' && 
            lineNum >= 1 && 
            lineNum <= maxLine
        );
    }

    /**
     * Clear the rendered code
     */
    clear() {
        this.container.innerHTML = '';
        this.currentCode = '';
        this.currentLanguage = '';
    }

    /**
     * Update theme
     * @param {string} theme - Theme name
     */
    updateTheme(theme) {
        this.options.theme = theme;
        // Re-render if code is present
        if (this.currentCode) {
            this.renderCode(this.currentCode, this.currentLanguage, this.options.showLineNumbers);
        }
    }

    /**
     * Toggle line numbers visibility
     * @param {boolean} show - Whether to show line numbers
     */
    toggleLineNumbers(show) {
        this.options.showLineNumbers = show;
        // Re-render if code is present
        if (this.currentCode) {
            this.renderCode(this.currentCode, this.currentLanguage, show);
        }
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CodeRenderer;
}