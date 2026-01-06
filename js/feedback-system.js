/**
 * Feedback System Component
 * Provides educational feedback and answer validation
 */

class FeedbackSystem extends IFeedbackSystem {
    /**
     * Initialize the feedback system
     * @param {HTMLElement|string} feedbackContainer - Feedback container element or ID
     */
    constructor(feedbackContainer) {
        super();
        
        if (typeof feedbackContainer === 'string') {
            this.container = document.getElementById(feedbackContainer);
            if (!this.container) {
                throw new Error(`Feedback container with ID '${feedbackContainer}' not found`);
            }
        } else if (feedbackContainer instanceof HTMLElement) {
            this.container = feedbackContainer;
        } else {
            throw new Error('Container must be an HTMLElement or element ID string');
        }
        
        this.placeholderElement = document.getElementById('answer-placeholder');
        this.isVisible = false;
    }

    /**
     * Validate user answer against correct answer
     * @param {number[]} selectedLines - User selected lines
     * @param {number[]} correctLines - Correct vulnerable lines
     * @returns {FeedbackData} Validation result
     */
    validateAnswer(selectedLines, correctLines) {
        if (!Array.isArray(selectedLines) || !Array.isArray(correctLines)) {
            throw new Error('Selected lines and correct lines must be arrays');
        }
        
        // Normalize arrays (remove duplicates and sort)
        const userSet = new Set(selectedLines);
        const correctSet = new Set(correctLines);
        
        const userArray = Array.from(userSet).sort((a, b) => a - b);
        const correctArray = Array.from(correctSet).sort((a, b) => a - b);
        
        // Calculate intersection and differences
        const intersection = userArray.filter(line => correctSet.has(line));
        const missedLines = correctArray.filter(line => !userSet.has(line));
        const extraLines = userArray.filter(line => !correctSet.has(line));
        
        // Determine feedback type
        let feedbackType;
        let message;
        
        if (intersection.length === correctArray.length && extraLines.length === 0) {
            // Perfect match
            feedbackType = 'success';
            message = '¡Excelente! Has identificado correctamente todas las vulnerabilidades.';
        } else if (intersection.length > 0 && intersection.length === userArray.length) {
            // Partial correct (user found some but missed others)
            feedbackType = 'partial';
            message = `Bien, has identificado ${intersection.length} de ${correctArray.length} vulnerabilidades, pero te faltan algunas.`;
        } else if (intersection.length > 0) {
            // Mixed (some correct, some incorrect)
            feedbackType = 'partial';
            message = `Has identificado ${intersection.length} vulnerabilidades correctas, pero también seleccionaste ${extraLines.length} líneas incorrectas.`;
        } else {
            // Completely wrong
            feedbackType = 'error';
            message = 'No has identificado las vulnerabilidades correctas. Revisa el código cuidadosamente.';
        }
        
        return {
            type: feedbackType,
            message: message,
            explanation: '',
            stats: {
                correct: intersection.length,
                missed: missedLines.length,
                extra: extraLines.length,
                total: correctArray.length,
                accuracy: correctArray.length > 0 ? (intersection.length / correctArray.length) * 100 : 0
            },
            details: {
                correctLines: intersection,
                missedLines: missedLines,
                extraLines: extraLines
            }
        };
    }

    /**
     * Show success feedback
     * @param {string} vulnerability - Vulnerability type
     * @param {QuestionExplanation} explanation - Detailed explanation
     */
    showSuccessFeedback(vulnerability, explanation) {
        this.hidePlaceholder();
        this.container.innerHTML = this.createSuccessFeedbackHTML(vulnerability, explanation);
        this.showContainer();
        this.announceToScreenReader('Respuesta correcta');
    }

    /**
     * Show error feedback
     * @param {number[]} selectedLines - User selected lines
     * @param {number[]} correctLines - Correct lines
     * @param {QuestionExplanation} explanation - Detailed explanation
     */
    showErrorFeedback(selectedLines, correctLines, explanation) {
        this.hidePlaceholder();
        
        const validationResult = this.validateAnswer(selectedLines, correctLines);
        this.container.innerHTML = this.createErrorFeedbackHTML(validationResult, explanation);
        this.showContainer();
        
        const announcement = validationResult.type === 'partial' ? 'Respuesta parcialmente correcta' : 'Respuesta incorrecta';
        this.announceToScreenReader(announcement);
    }

    /**
     * Render detailed explanation for a question
     * @param {Question} question - Question data
     */
    renderExplanation(question) {
        if (!question || !question.explanation) {
            console.error('Question or explanation data missing');
            return;
        }
        
        const validationResult = this.validateAnswer([], question.vulnerableLines);
        
        this.hidePlaceholder();
        this.container.innerHTML = this.createExplanationHTML(question, validationResult);
        this.showContainer();
    }

    /**
     * Create success feedback HTML
     * @param {string} vulnerability - Vulnerability type
     * @param {QuestionExplanation} explanation - Explanation data
     * @returns {string} HTML content
     */
    createSuccessFeedbackHTML(vulnerability, explanation) {
        return `
            <div class="feedback-header">
                <svg class="feedback-icon feedback-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                <h3 class="feedback-title feedback-success">¡Correcto!</h3>
            </div>
            
            <div class="vulnerability-info">
                <div class="vulnerability-type">${this.escapeHtml(vulnerability)}</div>
                <div class="explanation">
                    <p><strong>Descripción:</strong> ${this.escapeHtml(explanation.vulnerability)}</p>
                </div>
            </div>
            
            ${this.createDetailedExplanationHTML(explanation)}
        `;
    }

    /**
     * Create error feedback HTML
     * @param {FeedbackData} validationResult - Validation result
     * @param {QuestionExplanation} explanation - Explanation data
     * @returns {string} HTML content
     */
    createErrorFeedbackHTML(validationResult, explanation) {
        const isPartial = validationResult.type === 'partial';
        const iconPath = isPartial 
            ? "M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"
            : "M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z";
        
        const titleClass = isPartial ? 'feedback-warning' : 'feedback-error';
        const title = isPartial ? 'Parcialmente Correcto' : 'Incorrecto';
        
        return `
            <div class="feedback-header">
                <svg class="feedback-icon ${titleClass}" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="${iconPath}"></path>
                </svg>
                <h3 class="feedback-title ${titleClass}">${title}</h3>
            </div>
            
            <div class="feedback-message">
                <p>${this.escapeHtml(validationResult.message)}</p>
            </div>
            
            ${this.createValidationStatsHTML(validationResult)}
            ${this.createDetailedExplanationHTML(explanation)}
        `;
    }

    /**
     * Create explanation HTML for a question
     * @param {Question} question - Question data
     * @param {FeedbackData} validationResult - Validation result
     * @returns {string} HTML content
     */
    createExplanationHTML(question, validationResult) {
        return `
            <div class="feedback-header">
                <svg class="feedback-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                <h3 class="feedback-title">Explicación</h3>
            </div>
            
            <div class="vulnerability-info">
                <div class="vulnerability-type">${this.escapeHtml(question.vulnerabilityType)}</div>
                <div class="explanation">
                    <p><strong>CWE ID:</strong> ${this.escapeHtml(question.cweid || 'N/A')}</p>
                    <p><strong>Categoría OWASP:</strong> ${this.escapeHtml(question.owaspCategory || 'N/A')}</p>
                    <p><strong>Líneas vulnerables:</strong> ${question.vulnerableLines.join(', ')}</p>
                </div>
            </div>
            
            ${this.createDetailedExplanationHTML(question.explanation)}
            
            ${question.references && question.references.length > 0 ? this.createReferencesHTML(question.references) : ''}
        `;
    }

    /**
     * Create detailed explanation HTML
     * @param {QuestionExplanation} explanation - Explanation data
     * @returns {string} HTML content
     */
    createDetailedExplanationHTML(explanation) {
        return `
            <div class="explanation-sections">
                <div class="explanation-section">
                    <h4>🔍 Descripción de la Vulnerabilidad</h4>
                    <p>${this.escapeHtml(explanation.vulnerability)}</p>
                </div>
                
                <div class="explanation-section">
                    <h4>⚠️ Cómo se Explota</h4>
                    <p>${this.escapeHtml(explanation.exploitation)}</p>
                </div>
                
                <div class="explanation-section">
                    <h4>🛡️ Cómo Mitigarlo</h4>
                    <p>${this.escapeHtml(explanation.mitigation)}</p>
                </div>
                
                ${explanation.secureCode ? `
                <div class="explanation-section">
                    <h4>✅ Código Seguro</h4>
                    <pre class="secure-code"><code>${this.escapeHtml(explanation.secureCode)}</code></pre>
                </div>
                ` : ''}
            </div>
        `;
    }

    /**
     * Create validation statistics HTML
     * @param {FeedbackData} validationResult - Validation result
     * @returns {string} HTML content
     */
    createValidationStatsHTML(validationResult) {
        const stats = validationResult.stats;
        const details = validationResult.details;
        
        return `
            <div class="validation-stats">
                <div class="stats-grid">
                    <div class="stat-item">
                        <span class="stat-label">Correctas:</span>
                        <span class="stat-value success">${stats.correct}</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-label">Perdidas:</span>
                        <span class="stat-value error">${stats.missed}</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-label">Incorrectas:</span>
                        <span class="stat-value error">${stats.extra}</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-label">Precisión:</span>
                        <span class="stat-value">${Math.round(stats.accuracy)}%</span>
                    </div>
                </div>
                
                ${details.missedLines.length > 0 ? `
                <div class="missed-lines">
                    <p><strong>Líneas vulnerables no identificadas:</strong> ${details.missedLines.join(', ')}</p>
                </div>
                ` : ''}
                
                ${details.extraLines.length > 0 ? `
                <div class="extra-lines">
                    <p><strong>Líneas incorrectamente seleccionadas:</strong> ${details.extraLines.join(', ')}</p>
                </div>
                ` : ''}
            </div>
        `;
    }

    /**
     * Create references HTML
     * @param {string[]} references - Array of reference URLs or texts
     * @returns {string} HTML content
     */
    createReferencesHTML(references) {
        const referenceItems = references.map(ref => {
            if (ref.startsWith('http')) {
                return `<li><a href="${this.escapeHtml(ref)}" target="_blank" rel="noopener noreferrer">${this.escapeHtml(ref)}</a></li>`;
            } else {
                return `<li>${this.escapeHtml(ref)}</li>`;
            }
        }).join('');
        
        return `
            <div class="references-section">
                <h4>📚 Referencias</h4>
                <ul class="references-list">
                    ${referenceItems}
                </ul>
            </div>
        `;
    }

    /**
     * Hide the placeholder and show feedback container
     */
    showContainer() {
        this.container.style.display = 'block';
        this.isVisible = true;
        
        // Scroll to feedback if needed
        this.container.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }

    /**
     * Hide the feedback container and show placeholder
     */
    hideContainer() {
        this.container.style.display = 'none';
        this.isVisible = false;
        
        if (this.placeholderElement) {
            this.placeholderElement.style.display = 'flex';
        }
    }

    /**
     * Hide the placeholder element
     */
    hidePlaceholder() {
        if (this.placeholderElement) {
            this.placeholderElement.style.display = 'none';
        }
    }

    /**
     * Show the placeholder element
     */
    showPlaceholder() {
        if (this.placeholderElement) {
            this.placeholderElement.style.display = 'flex';
        }
        this.hideContainer();
    }

    /**
     * Clear all feedback content
     */
    clear() {
        this.container.innerHTML = '';
        this.hideContainer();
        this.showPlaceholder();
    }

    /**
     * Escape HTML characters for security
     * @param {string} text - Text to escape
     * @returns {string} Escaped text
     */
    escapeHtml(text) {
        if (typeof text !== 'string') return '';
        
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    /**
     * Announce feedback to screen readers
     * @param {string} message - Message to announce
     */
    announceToScreenReader(message) {
        const announcement = document.createElement('div');
        announcement.className = 'sr-only';
        announcement.setAttribute('aria-live', 'assertive');
        announcement.textContent = message;
        
        document.body.appendChild(announcement);
        
        // Remove announcement after screen reader has time to read it
        setTimeout(() => {
            if (announcement.parentNode) {
                announcement.parentNode.removeChild(announcement);
            }
        }, 2000);
    }

    /**
     * Check if feedback is currently visible
     * @returns {boolean} True if feedback is visible
     */
    isVisible() {
        return this.isVisible;
    }

    /**
     * Get current feedback container element
     * @returns {HTMLElement} Feedback container
     */
    getContainer() {
        return this.container;
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = FeedbackSystem;
}