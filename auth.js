// Generated for WorkShala — Vanilla HTML/CSS/JS. Open index.html to run.

(function() {
    'use strict';

    // Simple hash function for password (not cryptographically secure, for demo only)
    function simpleHash(str) {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            const char = str.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash; // Convert to 32-bit integer
        }
        return hash.toString();
    }

    // Initialize with test user if no users exist
    function initializeTestUser() {
        const users = JSON.parse(localStorage.getItem('workshala_users') || '[]');
        if (users.length === 0) {
            const testUser = {
                id: 'user_test_001',
                name: 'Test User',
                email: 'test@example.com',
                hashedPassword: simpleHash('password123'),
                createdAt: new Date().toISOString(),
                displayName: 'Test User'
            };
            localStorage.setItem('workshala_users', JSON.stringify([testUser]));
        }
    }

    // User management functions
    const AuthManager = {
        // Get all users from localStorage
        getUsers: function() {
            const users = JSON.parse(localStorage.getItem('workshala_users') || '[]');
            return users;
        },

        // Save users to localStorage
        saveUsers: function(users) {
            localStorage.setItem('workshala_users', JSON.stringify(users, null, 2));
        },

        // Generate unique user ID
        generateUserId: function() {
            return 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
        },

        // Register new user
        register: function(userData) {
            const users = this.getUsers();
            
            // Check if email already exists
            if (users.find(user => user.email === userData.email)) {
                return { success: false, message: 'Email already registered' };
            }

            const newUser = {
                id: this.generateUserId(),
                name: userData.name,
                email: userData.email,
                hashedPassword: simpleHash(userData.password),
                createdAt: new Date().toISOString(),
                displayName: userData.name
            };

            users.push(newUser);
            this.saveUsers(users);

            return { success: true, message: 'Registration successful', user: newUser };
        },

        // Login user
        login: function(email, password) {
            const users = this.getUsers();
            const user = users.find(u => u.email === email && u.hashedPassword === simpleHash(password));

            if (user) {
                const session = {
                    id: user.id,
                    name: user.displayName || user.name,
                    email: user.email,
                    loginTime: new Date().toISOString()
                };
                localStorage.setItem('workshala_session', JSON.stringify(session));
                return { success: true, message: 'Login successful', user: session };
            }

            return { success: false, message: 'Invalid email or password' };
        },

        // Get current session
        getCurrentSession: function() {
            return JSON.parse(localStorage.getItem('workshala_session') || 'null');
        },

        // Logout
        logout: function() {
            localStorage.removeItem('workshala_session');
            return { success: true, message: 'Logged out successfully' };
        },

        // Update user profile
        updateProfile: function(updates) {
            const session = this.getCurrentSession();
            if (!session) {
                return { success: false, message: 'Not logged in' };
            }

            const users = this.getUsers();
            const userIndex = users.findIndex(u => u.id === session.id);
            
            if (userIndex === -1) {
                return { success: false, message: 'User not found' };
            }

            // Update user data
            if (updates.displayName) {
                users[userIndex].displayName = updates.displayName;
            }

            this.saveUsers(users);

            // Update session
            session.name = users[userIndex].displayName || users[userIndex].name;
            localStorage.setItem('workshala_session', JSON.stringify(session));

            return { success: true, message: 'Profile updated successfully' };
        },

        // Export users to JSON file
        exportUsers: function() {
            const users = this.getUsers();
            const exportData = {
                exportDate: new Date().toISOString(),
                totalUsers: users.length,
                users: users
            };
            const dataStr = JSON.stringify(exportData, null, 2);
            const dataBlob = new Blob([dataStr], { type: 'application/json' });
            
            const link = document.createElement('a');
            link.href = URL.createObjectURL(dataBlob);
            link.download = `workshala_users_${new Date().toISOString().split('T')[0]}.json`;
            link.click();
        },

        // Import users from JSON file
        importUsers: function(file) {
            return new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.onload = function(e) {
                    try {
                        const importData = JSON.parse(e.target.result);
                        let importedUsers = [];
                        
                        // Handle both direct array and wrapped format
                        if (Array.isArray(importData)) {
                            importedUsers = importData;
                        } else if (importData.users && Array.isArray(importData.users)) {
                            importedUsers = importData.users;
                        } else {
                            reject({ success: false, message: 'Invalid file format' });
                            return;
                        }
                        
                        // Merge with existing users, avoiding duplicates
                        const existingUsers = AuthManager.getUsers();
                        const existingEmails = existingUsers.map(u => u.email);
                        
                        const newUsers = importedUsers.filter(u => u.email && !existingEmails.includes(u.email));
                        const mergedUsers = [...existingUsers, ...newUsers];
                        
                        AuthManager.saveUsers(mergedUsers);
                        resolve({ 
                            success: true, 
                            message: `Imported ${newUsers.length} new users. ${importedUsers.length - newUsers.length} duplicates skipped.` 
                        });
                    } catch (error) {
                        reject({ success: false, message: 'Error parsing JSON file' });
                    }
                };
                reader.readAsText(file);
            });
        }
    };

    // Form validation functions
    const FormValidator = {
        validateEmail: function(email) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return emailRegex.test(email);
        },

        validatePassword: function(password) {
            return password.length >= 6;
        },

        validateName: function(name) {
            return name.trim().length >= 2;
        },

        showError: function(fieldId, message) {
            const field = document.getElementById(fieldId);
            if (!field) return;

            // Remove existing error
            const existingError = field.parentNode.querySelector('.form-error');
            if (existingError) {
                existingError.remove();
            }

            // Add new error
            const errorDiv = document.createElement('div');
            errorDiv.className = 'form-error';
            errorDiv.textContent = message;
            field.parentNode.appendChild(errorDiv);
            
            field.style.borderColor = 'var(--error)';
        },

        clearError: function(fieldId) {
            const field = document.getElementById(fieldId);
            if (!field) return;

            const existingError = field.parentNode.querySelector('.form-error');
            if (existingError) {
                existingError.remove();
            }
            field.style.borderColor = 'var(--border)';
        },

        clearAllErrors: function() {
            const errors = document.querySelectorAll('.form-error');
            errors.forEach(error => error.remove());
            
            const fields = document.querySelectorAll('input, select, textarea');
            fields.forEach(field => {
                field.style.borderColor = 'var(--border)';
            });
        }
    };

    // Initialize auth forms when DOM is loaded
    document.addEventListener('DOMContentLoaded', function() {
        initializeTestUser();
        initializeAuthForms();
    });

    function initializeAuthForms() {
        // Login form
        const loginForm = document.getElementById('loginForm');
        if (loginForm) {
            loginForm.addEventListener('submit', handleLogin);
        }

        // Signup form
        const signupForm = document.getElementById('signupForm');
        if (signupForm) {
            signupForm.addEventListener('submit', handleSignup);
        }

        // Profile form
        const profileForm = document.getElementById('profileForm');
        if (profileForm) {
            profileForm.addEventListener('submit', handleProfileUpdate);
            loadProfileData();
        }

        // Export/Import buttons
        const exportBtn = document.getElementById('exportUsersBtn');
        if (exportBtn) {
            exportBtn.addEventListener('click', function() {
                AuthManager.exportUsers();
            });
        }

        const importBtn = document.getElementById('importUsersBtn');
        const importFile = document.getElementById('importUsersFile');
        if (importBtn && importFile) {
            importBtn.addEventListener('click', () => importFile.click());
            importFile.addEventListener('change', handleImportUsers);
        }

        // Real-time validation
        setupRealTimeValidation();
    }

    function handleLogin(e) {
        e.preventDefault();
        FormValidator.clearAllErrors();

        const email = document.getElementById('email').value.trim();
        const password = document.getElementById('password').value;

        let isValid = true;

        if (!FormValidator.validateEmail(email)) {
            FormValidator.showError('email', 'Please enter a valid email address');
            isValid = false;
        }

        if (!FormValidator.validatePassword(password)) {
            FormValidator.showError('password', 'Password must be at least 6 characters');
            isValid = false;
        }

        if (!isValid) return;

        const result = AuthManager.login(email, password);
        
        if (result.success) {
            showMessage(result.message, 'success');
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 1000);
        } else {
            showMessage(result.message, 'error');
        }
    }

    function handleSignup(e) {
        e.preventDefault();
        FormValidator.clearAllErrors();

        const name = document.getElementById('name').value.trim();
        const email = document.getElementById('email').value.trim();
        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirmPassword').value;

        let isValid = true;

        if (!FormValidator.validateName(name)) {
            FormValidator.showError('name', 'Name must be at least 2 characters');
            isValid = false;
        }

        if (!FormValidator.validateEmail(email)) {
            FormValidator.showError('email', 'Please enter a valid email address');
            isValid = false;
        }

        if (!FormValidator.validatePassword(password)) {
            FormValidator.showError('password', 'Password must be at least 6 characters');
            isValid = false;
        }

        if (password !== confirmPassword) {
            FormValidator.showError('confirmPassword', 'Passwords do not match');
            isValid = false;
        }

        if (!isValid) return;

        const result = AuthManager.register({ name, email, password });
        
        if (result.success) {
            showMessage(result.message, 'success');
            setTimeout(() => {
                window.location.href = 'login.html';
            }, 1000);
        } else {
            showMessage(result.message, 'error');
        }
    }

    function handleProfileUpdate(e) {
        e.preventDefault();
        FormValidator.clearAllErrors();

        const displayName = document.getElementById('displayName').value.trim();

        if (!FormValidator.validateName(displayName)) {
            FormValidator.showError('displayName', 'Display name must be at least 2 characters');
            return;
        }

        const result = AuthManager.updateProfile({ displayName });
        
        if (result.success) {
            showMessage(result.message, 'success');
            // Update UI if MainApp is available
            if (typeof window.MainApp !== 'undefined') {
                window.MainApp.updateAuthUI();
            }
        } else {
            showMessage(result.message, 'error');
        }
    }

    function loadProfileData() {
        const session = AuthManager.getCurrentSession();
        if (session) {
            const displayNameField = document.getElementById('displayName');
            const emailField = document.getElementById('profileEmail');
            
            if (displayNameField) displayNameField.value = session.name;
            if (emailField) emailField.value = session.email;
        }
    }

    function handleImportUsers(e) {
        const file = e.target.files[0];
        if (!file) return;

        AuthManager.importUsers(file)
            .then(result => {
                showMessage(result.message, 'success');
            })
            .catch(error => {
                showMessage(error.message, 'error');
            });
    }

    function setupRealTimeValidation() {
        // Email validation
        const emailFields = document.querySelectorAll('input[type="email"]');
        emailFields.forEach(field => {
            field.addEventListener('blur', function() {
                if (this.value && !FormValidator.validateEmail(this.value)) {
                    FormValidator.showError(this.id, 'Please enter a valid email address');
                } else {
                    FormValidator.clearError(this.id);
                }
            });
        });

        // Password validation
        const passwordFields = document.querySelectorAll('input[type="password"]');
        passwordFields.forEach(field => {
            field.addEventListener('blur', function() {
                if (this.value && !FormValidator.validatePassword(this.value)) {
                    FormValidator.showError(this.id, 'Password must be at least 6 characters');
                } else {
                    FormValidator.clearError(this.id);
                }
            });
        });

        // Confirm password validation
        const confirmPasswordField = document.getElementById('confirmPassword');
        const passwordField = document.getElementById('password');
        if (confirmPasswordField && passwordField) {
            confirmPasswordField.addEventListener('blur', function() {
                if (this.value && this.value !== passwordField.value) {
                    FormValidator.showError(this.id, 'Passwords do not match');
                } else {
                    FormValidator.clearError(this.id);
                }
            });
        }
    }

    function showMessage(text, type = 'info') {
        const message = document.createElement('div');
        message.className = `message ${type}`;
        message.textContent = text;
        
        document.body.insertBefore(message, document.body.firstChild);
        
        setTimeout(() => {
            message.remove();
        }, 3000);
    }

    // Export AuthManager for use in other files
    window.AuthManager = AuthManager;
    window.FormValidator = FormValidator;

})();