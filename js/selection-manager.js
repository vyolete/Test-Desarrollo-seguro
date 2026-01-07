/**
 * Selection Manager Component
 * Handles interactive line selection in code blocks
 */

class SelectionManager {
    /**
     * Initialize the selection manager
     * @param {HTMLElement|string} codeContainer - Code container element or ID
     */
    constructor(codeContainer) {
        
        if (typeof codeContainer === 'string') {
            this.container = document.getElementById(codeContainer);
            if (!this.container) {
                throw new Error(`Container element with ID '${codeContainer}' not found`);
            }
        } else if (codeContainer instanceof HTMLElement) {
            this.container = codeContainer;
        } else {
            throw new Error('Container must be an HTMLElement or element ID string');
        }
        
        this.selectedLines = new Set();
        this.isEnabled = false;
        this.isAnswered = false;
        this.correctLines = new Set();
        this.incorrectLines = new Set();
        
        // Event handlers
        this.clickHandler = this.handleLineClick.bind(this);
        this.keyHandler = this.handleKeyPress.bind(this);
        
        // Callbacks
        this.onSelectionChange = null;
        this.onLineSelect = null;
        this.onLineDeselect = null;
    }

    /**
     * Enable line selection functionality
     */
    enableSelection() {
        // Always disable first to clean up any existing state
        this.disableSelection();
        
        this.isEnabled = true;
        this.isAnswered = false;
        this.clearFeedbackHighlights();
        
        // Add event listeners to all code lines
        const codeLines = this.container.querySelectorAll('.code-line');
        
        codeLines.forEach(line => {
            line.addEventListener('click', this.clickHandler);
            line.addEventListener('keydown', this.keyHandler);
            line.classList.add('selectable');
            
            // Update ARIA attributes
            line.setAttribute('aria-pressed', 'false');
            line.setAttribute('aria-describedby', 'selection-instructions');
        });
        
        // Add selection instructions for screen readers
        this.addSelectionInstructions();
    }

    /**
     * Disable line selection functionality
     */
    disableSelection() {
        if (!this.isEnabled) return;
        
        this.isEnabled = false;
        
        // Remove event listeners from all code lines
        const codeLines = this.container.querySelectorAll('.code-line');
        codeLines.forEach(line => {
            line.removeEventListener('click', this.clickHandler);
            line.removeEventListener('keydown', this.keyHandler);
            line.classList.remove('selectable');
            
            // Update ARIA attributes
            line.removeAttribute('aria-pressed');
            line.removeAttribute('aria-describedby');
        });
        
        // Remove selection instructions
        this.removeSelectionInstructions();
    }

    /**
     * Handle line click events
     * @param {Event} event - Click event
     */
    handleLineClick(event) {
        if (!this.isEnabled || this.isAnswered) return;
        
        const lineElement = event.currentTarget;
        const lineNumber = parseInt(lineElement.getAttribute('data-line-number'));
        
        if (isNaN(lineNumber)) return;
        
        this.toggleLineSelection(lineNumber);
    }

    /**
     * Handle keyboard events for line selection
     * @param {KeyboardEvent} event - Keyboard event
     */
    handleKeyPress(event) {
        if (!this.isEnabled || this.isAnswered) return;
        
        if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            const lineElement = event.currentTarget;
            const lineNumber = parseInt(lineElement.getAttribute('data-line-number'));
            
            if (!isNaN(lineNumber)) {
                this.toggleLineSelection(lineNumber);
            }
        }
    }

    /**
     * Toggle selection state of a line
     * @param {number} lineNumber - Line number to toggle
     */
    toggleLineSelection(lineNumber) {
        if (this.selectedLines.has(lineNumber)) {
            this.deselectLine(lineNumber);
        } else {
            this.selectLine(lineNumber);
        }
        
        // Trigger selection change callback
        if (this.onSelectionChange) {
            this.onSelectionChange(Array.from(this.selectedLines));
        }
    }

    /**
     * Select a specific line
     * @param {number} lineNumber - Line number to select
     */
    selectLine(lineNumber) {
        if (this.selectedLines.has(lineNumber)) return;
        
        const lineElement = this.getLineElement(lineNumber);
        if (!lineElement) return;
        
        this.selectedLines.add(lineNumber);
        lineElement.classList.add('selected');
        lineElement.setAttribute('aria-pressed', 'true');
        
        // Announce selection to screen readers
        this.announceSelection(lineNumber, true);
        
        // Trigger callback
        if (this.onLineSelect) {
            this.onLineSelect(lineNumber);
        }
    }

    /**
     * Deselect a specific line
     * @param {number} lineNumber - Line number to deselect
     */
    deselectLine(lineNumber) {
        if (!this.selectedLines.has(lineNumber)) return;
        
        const lineElement = this.getLineElement(lineNumber);
        if (!lineElement) return;
        
        this.selectedLines.delete(lineNumber);
        lineElement.classList.remove('selected');
        lineElement.setAttribute('aria-pressed', 'false');
        
        // Announce deselection to screen readers
        this.announceSelection(lineNumber, false);
        
        // Trigger callback
        if (this.onLineDeselect) {
            this.onLineDeselect(lineNumber);
        }
    }

    /**
     * Get currently selected lines
     * @returns {number[]} Array of selected line numbers
     */
    getSelectedLines() {
        return Array.from(this.selectedLines).sort((a, b) => a - b);
    }

    /**
     * Clear all selections
     */
    clearSelection() {
        const selectedLines = Array.from(this.selectedLines);
        selectedLines.forEach(lineNumber => {
            this.deselectLine(lineNumber);
        });
        
        this.selectedLines.clear();
    }

    /**
     * Set selected lines programmatically
     * @param {number[]} lineNumbers - Array of line numbers to select
     */
    setSelectedLines(lineNumbers) {
        if (!Array.isArray(lineNumbers)) return;
        
        // Clear current selection
        this.clearSelection();
        
        // Select new lines
        lineNumbers.forEach(lineNumber => {
            if (typeof lineNumber === 'number' && lineNumber > 0) {
                this.selectLine(lineNumber);
            }
        });
    }

    /**
     * Highlight correct lines (after answer verification)
     * @param {number[]} lines - Line numbers to highlight as correct
     */
    highlightCorrectLines(lines) {
        if (!Array.isArray(lines)) return;
        
        this.correctLines = new Set(lines);
        
        lines.forEach(lineNumber => {
            const lineElement = this.getLineElement(lineNumber);
            if (lineElement) {
                lineElement.classList.add('correct');
                lineElement.classList.remove('selected', 'incorrect');
                lineElement.setAttribute('aria-label', 
                    `Línea ${lineNumber}: Correcta - contiene vulnerabilidad`);
            }
        });
    }

    /**
     * Highlight incorrect lines (after answer verification)
     * @param {number[]} lines - Line numbers to highlight as incorrect
     */
    highlightIncorrectLines(lines) {
        if (!Array.isArray(lines)) return;
        
        this.incorrectLines = new Set(lines);
        
        lines.forEach(lineNumber => {
            const lineElement = this.getLineElement(lineNumber);
            if (lineElement) {
                lineElement.classList.add('incorrect');
                lineElement.classList.remove('selected', 'correct');
                lineElement.setAttribute('aria-label', 
                    `Línea ${lineNumber}: Incorrecta - no contiene vulnerabilidad`);
            }
        });
    }

    /**
     * Clear feedback highlights
     */
    clearFeedbackHighlights() {
        const allLines = this.container.querySelectorAll('.code-line');
        allLines.forEach(line => {
            line.classList.remove('correct', 'incorrect');
            const lineNumber = parseInt(line.getAttribute('data-line-number'));
            if (!isNaN(lineNumber)) {
                line.setAttribute('aria-label', `Línea ${lineNumber}`);
            }
        });
        
        this.correctLines.clear();
        this.incorrectLines.clear();
    }

    /**
     * Mark question as answered (disables further selection)
     */
    markAsAnswered() {
        this.isAnswered = true;
        
        // Update visual state
        const codeLines = this.container.querySelectorAll('.code-line');
        codeLines.forEach(line => {
            line.classList.add('answered');
        });
    }

    /**
     * Reset for new question
     */
    reset() {
        this.clearSelection();
        this.clearFeedbackHighlights();
        this.isAnswered = false;
        
        // Remove answered state from all lines
        const codeLines = this.container.querySelectorAll('.code-line');
        codeLines.forEach(line => {
            line.classList.remove('answered', 'selected', 'correct', 'incorrect');
        });
    }

    /**
     * Get line element by number
     * @param {number} lineNumber - Line number
     * @returns {HTMLElement|null} Line element or null if not found
     */
    getLineElement(lineNumber) {
        return this.container.querySelector(`[data-line-number="${lineNumber}"]`);
    }

    /**
     * Check if a line is selected
     * @param {number} lineNumber - Line number to check
     * @returns {boolean} True if line is selected
     */
    isLineSelected(lineNumber) {
        return this.selectedLines.has(lineNumber);
    }

    /**
     * Get selection statistics
     * @returns {Object} Selection statistics
     */
    getSelectionStats() {
        return {
            totalSelected: this.selectedLines.size,
            selectedLines: this.getSelectedLines(),
            correctCount: this.correctLines.size,
            incorrectCount: this.incorrectLines.size,
            isAnswered: this.isAnswered
        };
    }

    /**
     * Add selection instructions for accessibility
     */
    addSelectionInstructions() {
        if (document.getElementById('selection-instructions')) return;
        
        const instructions = document.createElement('div');
        instructions.id = 'selection-instructions';
        instructions.className = 'sr-only';
        instructions.textContent = 'Haz clic o presiona Enter/Espacio para seleccionar líneas de código que contengan vulnerabilidades';
        
        this.container.parentNode.insertBefore(instructions, this.container);
    }

    /**
     * Remove selection instructions
     */
    removeSelectionInstructions() {
        const instructions = document.getElementById('selection-instructions');
        if (instructions) {
            instructions.remove();
        }
    }

    /**
     * Announce selection changes to screen readers
     * @param {number} lineNumber - Line number
     * @param {boolean} selected - Whether line was selected or deselected
     */
    announceSelection(lineNumber, selected) {
        const announcement = document.createElement('div');
        announcement.className = 'sr-only';
        announcement.setAttribute('aria-live', 'polite');
        announcement.textContent = selected 
            ? `Línea ${lineNumber} seleccionada`
            : `Línea ${lineNumber} deseleccionada`;
        
        document.body.appendChild(announcement);
        
        // Remove announcement after screen reader has time to read it
        setTimeout(() => {
            if (announcement.parentNode) {
                announcement.parentNode.removeChild(announcement);
            }
        }, 1000);
    }

    /**
     * Set callback for selection changes
     * @param {Function} callback - Callback function
     */
    setOnSelectionChange(callback) {
        this.onSelectionChange = callback;
    }

    /**
     * Set callback for line selection
     * @param {Function} callback - Callback function
     */
    setOnLineSelect(callback) {
        this.onLineSelect = callback;
    }

    /**
     * Set callback for line deselection
     * @param {Function} callback - Callback function
     */
    setOnLineDeselect(callback) {
        this.onLineDeselect = callback;
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = SelectionManager;
}