// Clinical Drug Trials Application
// Additional JavaScript functionality

// API Configuration
const API_URL = 'http://localhost:3039/api';

// Utility functions
const utils = {
    // Show loading state
    showLoading: (element) => {
        element.innerHTML = '<div class="loading">Loading...</div>';
    },
    
    // Show error message
    showError: (element, message) => {
        element.innerHTML = `<div class="error">${message}</div>`;
    },
    
    // Format date
    formatDate: (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    },
    
    // Validate email
    isValidEmail: (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    },
    
    // Validate URL
    isValidUrl: (url) => {
        try {
            new URL(url);
            return true;
        } catch {
            return false;
        }
    }
};

// Authentication helpers
const auth = {
    // Check if user is authenticated
    isAuthenticated: () => {
        return localStorage.getItem('token') !== null;
    },
    
    // Get current user
    getCurrentUser: () => {
        const user = localStorage.getItem('user');
        return user ? JSON.parse(user) : null;
    },
    
    // Logout user
    logout: () => {
        localStorage.clear();
        window.location.href = 'login.html';
    },
    
    // Get auth headers
    getAuthHeaders: () => {
        const token = localStorage.getItem('token');
        return {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        };
    }
};

// API helpers
const api = {
    // Make authenticated request
    request: async (endpoint, options = {}) => {
        const url = `${API_URL}${endpoint}`;
        const headers = auth.getAuthHeaders();
        
        const config = {
            ...options,
            headers: {
                ...headers,
                ...options.headers
            }
        };
        
        try {
            const response = await fetch(url, config);
            
            if (response.status === 401) {
                auth.logout();
                return null;
            }
            
            return response;
        } catch (error) {
            console.error('API request failed:', error);
            throw error;
        }
    },
    
    // Get trials
    getTrials: async () => {
        const response = await api.request('/trials');
        if (response) {
            return await response.json();
        }
        return [];
    },
    
    // Create trial
    createTrial: async (trialData) => {
        const response = await api.request('/trials', {
            method: 'POST',
            body: JSON.stringify(trialData)
        });
        
        if (response) {
            return await response.json();
        }
        return null;
    },
    
    // Update trial
    updateTrial: async (trialId, trialData) => {
        const response = await api.request(`/trials/${trialId}`, {
            method: 'PUT',
            body: JSON.stringify(trialData)
        });
        
        if (response) {
            return await response.json();
        }
        return null;
    },
    
    // Delete trial
    deleteTrial: async (trialId) => {
        const response = await api.request(`/trials/${trialId}`, {
            method: 'DELETE'
        });
        
        return response ? response.ok : false;
    }
};

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { utils, auth, api };
}

