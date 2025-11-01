// IdeaCheck JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Initialize tooltips
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    const tooltipList = tooltipTriggerList.map(function(tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    });

    // Initialize popovers
    const popoverTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="popover"]'));
    const popoverList = popoverTriggerList.map(function(popoverTriggerEl) {
        return new bootstrap.Popover(popoverTriggerEl);
    });

    // Auto-dismiss alerts after 5 seconds
    const alerts = document.querySelectorAll('.alert:not(.alert-permanent)');
    alerts.forEach(function(alert) {
        setTimeout(function() {
            const bsAlert = new bootstrap.Alert(alert);
            bsAlert.close();
        }, 5000);
    });

    // Smooth scrolling for anchor links
    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    anchorLinks.forEach(function(link) {
        link.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                e.preventDefault();
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Add fade-in animation to main content
    const mainContent = document.querySelector('main');
    if (mainContent) {
        mainContent.classList.add('fade-in');
    }

    // Form validation enhancement
    const forms = document.querySelectorAll('.needs-validation');
    forms.forEach(function(form) {
        form.addEventListener('submit', function(event) {
            if (!form.checkValidity()) {
                event.preventDefault();
                event.stopPropagation();
                
                // Focus on first invalid field
                const firstInvalid = form.querySelector(':invalid');
                if (firstInvalid) {
                    firstInvalid.focus();
                }
            }
            form.classList.add('was-validated');
        });
    });

    // Auto-resize textareas
    const textareas = document.querySelectorAll('textarea[data-auto-resize]');
    textareas.forEach(function(textarea) {
        textarea.addEventListener('input', function() {
            this.style.height = 'auto';
            this.style.height = this.scrollHeight + 'px';
        });
        
        // Initial resize
        textarea.style.height = textarea.scrollHeight + 'px';
    });

    // Copy to clipboard utility
    window.copyToClipboard = async function(text, showToast = true) {
        try {
            await navigator.clipboard.writeText(text);
            
            if (showToast) {
                showSuccessToast('Copied to clipboard!');
            }
            return true;
        } catch (err) {
            console.error('Failed to copy: ', err);
            if (showToast) {
                showErrorToast('Failed to copy to clipboard');
            }
            return false;
        }
    };

    // Toast notification utility
    window.showToast = function(message, type = 'info', duration = 3000) {
        const toastContainer = getOrCreateToastContainer();
        
        const toastId = 'toast_' + Date.now();
        const iconMap = {
            'success': 'bi-check-circle-fill text-success',
            'error': 'bi-exclamation-triangle-fill text-danger',
            'warning': 'bi-exclamation-triangle-fill text-warning',
            'info': 'bi-info-circle-fill text-info'
        };
        
        const toastHtml = `
            <div class="toast" role="alert" aria-live="assertive" aria-atomic="true" id="${toastId}">
                <div class="toast-header">
                    <i class="bi ${iconMap[type] || iconMap.info} me-2"></i>
                    <strong class="me-auto">IdeaCheck</strong>
                    <button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
                </div>
                <div class="toast-body">
                    ${message}
                </div>
            </div>
        `;
        
        toastContainer.insertAdjacentHTML('beforeend', toastHtml);
        
        const toastElement = document.getElementById(toastId);
        const bsToast = new bootstrap.Toast(toastElement, {
            delay: duration
        });
        
        bsToast.show();
        
        // Clean up after toast is hidden
        toastElement.addEventListener('hidden.bs.toast', function() {
            toastElement.remove();
        });
        
        return bsToast;
    };

    // Specific toast types
    window.showSuccessToast = function(message, duration = 3000) {
        return showToast(message, 'success', duration);
    };

    window.showErrorToast = function(message, duration = 5000) {
        return showToast(message, 'error', duration);
    };

    window.showWarningToast = function(message, duration = 4000) {
        return showToast(message, 'warning', duration);
    };

    window.showInfoToast = function(message, duration = 3000) {
        return showToast(message, 'info', duration);
    };

    function getOrCreateToastContainer() {
        let container = document.getElementById('toast-container');
        if (!container) {
            container = document.createElement('div');
            container.id = 'toast-container';
            container.className = 'toast-container position-fixed top-0 end-0 p-3';
            container.style.zIndex = '1060';
            document.body.appendChild(container);
        }
        return container;
    }

    // Loading button utility
    window.setButtonLoading = function(button, isLoading, loadingText = 'Loading...') {
        if (isLoading) {
            button.dataset.originalText = button.innerHTML;
            button.disabled = true;
            button.innerHTML = `<span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>${loadingText}`;
        } else {
            button.disabled = false;
            button.innerHTML = button.dataset.originalText || button.innerHTML;
        }
    };

    // Confirm dialog utility
    window.confirmDialog = function(message, title = 'Confirm') {
        return new Promise(function(resolve) {
            const modalId = 'confirm-modal-' + Date.now();
            const modalHtml = `
                <div class="modal fade" id="${modalId}" tabindex="-1">
                    <div class="modal-dialog">
                        <div class="modal-content">
                            <div class="modal-header">
                                <h5 class="modal-title">${title}</h5>
                                <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                            </div>
                            <div class="modal-body">
                                <p>${message}</p>
                            </div>
                            <div class="modal-footer">
                                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                                <button type="button" class="btn btn-primary" id="confirm-btn">Confirm</button>
                            </div>
                        </div>
                    </div>
                </div>
            `;
            
            document.body.insertAdjacentHTML('beforeend', modalHtml);
            const modalElement = document.getElementById(modalId);
            const modal = new bootstrap.Modal(modalElement);
            
            document.getElementById('confirm-btn').addEventListener('click', function() {
                resolve(true);
                modal.hide();
            });
            
            modalElement.addEventListener('hidden.bs.modal', function() {
                resolve(false);
                modalElement.remove();
            });
            
            modal.show();
        });
    };

    // Image lazy loading
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver(function(entries, observer) {
            entries.forEach(function(entry) {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.remove('lazy');
                    observer.unobserve(img);
                }
            });
        });

        const lazyImages = document.querySelectorAll('img[data-src]');
        lazyImages.forEach(function(img) {
            imageObserver.observe(img);
        });
    }

    // Keyboard navigation enhancement
    document.addEventListener('keydown', function(e) {
        // ESC key closes modals
        if (e.key === 'Escape') {
            const activeModal = document.querySelector('.modal.show');
            if (activeModal) {
                const modal = bootstrap.Modal.getInstance(activeModal);
                if (modal) {
                    modal.hide();
                }
            }
        }
    });

    // Progress indication for form submissions
    const submitForms = document.querySelectorAll('form[method="POST"]');
    submitForms.forEach(function(form) {
        form.addEventListener('submit', function() {
            const submitBtn = form.querySelector('button[type="submit"]');
            if (submitBtn && !submitBtn.disabled) {
                setButtonLoading(submitBtn, true, 'Processing...');
            }
        });
    });

    // Auto-save for textareas (optional enhancement)
    const autoSaveTextareas = document.querySelectorAll('textarea[data-auto-save]');
    autoSaveTextareas.forEach(function(textarea) {
        let saveTimeout;
        textarea.addEventListener('input', function() {
            clearTimeout(saveTimeout);
            saveTimeout = setTimeout(function() {
                const key = textarea.dataset.autoSave || 'autosave_' + textarea.id;
                localStorage.setItem(key, textarea.value);
            }, 1000);
        });
        
        // Load saved content
        const key = textarea.dataset.autoSave || 'autosave_' + textarea.id;
        const saved = localStorage.getItem(key);
        if (saved && !textarea.value) {
            textarea.value = saved;
        }
    });
});

// Analytics helper (for future integration)
window.trackEvent = function(action, category = 'General', label = '') {
    // This can be extended to integrate with Google Analytics, etc.
    console.log('Event:', { action, category, label });
    
    // Example: gtag('event', action, { event_category: category, event_label: label });
};

// Error reporting helper
window.reportError = function(error, context = '') {
    console.error('Error reported:', error, context);
    
    // This can be extended to send errors to a logging service
    // Example: Send to Sentry, LogRocket, etc.
};