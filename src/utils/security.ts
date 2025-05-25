import { supabase } from '@/integrations/supabase/client';

// Simple hash function for demo - USE PROPER SERVER-SIDE HASHING IN PRODUCTION
export const hashPassword = async (password: string): Promise<string> => {
    // This is NOT secure for production - just for demo
    const encoder = new TextEncoder();
    const data = encoder.encode(password + 'e3circle_salt');
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
};

// Verify password against hash
export const verifyPassword = async (password: string, hash: string): Promise<boolean> => {
    const inputHash = await hashPassword(password);
    return inputHash === hash;
};

// Validate email format
export const isValidEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

// Validate phone number (basic)
export const isValidPhone = (phone: string): boolean => {
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
    return phoneRegex.test(phone.replace(/[\s\-\(\)]/g, ''));
};

// Validate URL format
export const isValidUrl = (url: string): boolean => {
    try {
        new URL(url);
        return true;
    } catch {
        return false;
    }
};

// Sanitize input to prevent XSS
export const sanitizeInput = (input: string): string => {
    return input
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#x27;')
        .replace(/\//g, '&#x2F;');
};

// Rate limiting helper (simple client-side approach)
class RateLimiter {
    private attempts: Map<string, number[]> = new Map();

    isAllowed(key: string, maxAttempts: number = 5, windowMs: number = 60000): boolean {
        const now = Date.now();
        const attempts = this.attempts.get(key) || [];

        // Remove old attempts outside the window
        const validAttempts = attempts.filter(time => now - time < windowMs);

        if (validAttempts.length >= maxAttempts) {
            return false;
        }

        validAttempts.push(now);
        this.attempts.set(key, validAttempts);
        return true;
    }
}

export const rateLimiter = new RateLimiter();

// Production security recommendations
export const SECURITY_RECOMMENDATIONS = {
    PASSWORD: {
        minLength: 8,
        requireUppercase: true,
        requireLowercase: true,
        requireNumbers: true,
        requireSpecialChars: false
    },
    RATE_LIMITING: {
        loginAttempts: 5,
        formSubmissions: 10,
        windowMs: 60000 // 1 minute
    },
    FILE_UPLOAD: {
        maxSize: 5 * 1024 * 1024, // 5MB
        allowedTypes: ['image/jpeg', 'image/png', 'image/webp'],
        virusScanning: true
    }
};

// Password strength checker
export const checkPasswordStrength = (password: string): {
    score: number;
    feedback: string[];
    isValid: boolean;
} => {
    const feedback: string[] = [];
    let score = 0;

    if (password.length >= 8) score += 1;
    else feedback.push('Password should be at least 8 characters long');

    if (/[A-Z]/.test(password)) score += 1;
    else feedback.push('Include at least one uppercase letter');

    if (/[a-z]/.test(password)) score += 1;
    else feedback.push('Include at least one lowercase letter');

    if (/\d/.test(password)) score += 1;
    else feedback.push('Include at least one number');

    if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) score += 1;
    else feedback.push('Consider adding special characters for extra security');

    return {
        score,
        feedback,
        isValid: score >= 4
    };
};

// Secure API call wrapper
export const secureApiCall = async (
    operation: () => Promise<any>,
    rateLimitKey?: string
): Promise<{ data?: any; error?: string }> => {
    try {
        // Rate limiting check
        if (rateLimitKey && !rateLimiter.isAllowed(rateLimitKey)) {
            return { error: 'Too many requests. Please wait before trying again.' };
        }

        const result = await operation();
        return { data: result };
    } catch (error: any) {
        console.error('API call failed:', error);
        return {
            error: error.message || 'An unexpected error occurred. Please try again.'
        };
    }
};

// File upload validation
export const validateFileUpload = (file: File): { isValid: boolean; error?: string } => {
    const { maxSize, allowedTypes } = SECURITY_RECOMMENDATIONS.FILE_UPLOAD;

    if (file.size > maxSize) {
        return {
            isValid: false,
            error: `File size must be less than ${maxSize / (1024 * 1024)}MB`
        };
    }

    if (!allowedTypes.includes(file.type)) {
        return {
            isValid: false,
            error: 'Only JPEG, PNG, and WebP images are allowed'
        };
    }

    return { isValid: true };
};

// Secure user session management
export const createUserSession = async (userId: string, userCode: string) => {
    const sessionData = {
        userId,
        userCode,
        timestamp: Date.now(),
        expiresAt: Date.now() + (24 * 60 * 60 * 1000) // 24 hours
    };

    // Store in secure httpOnly cookie in production
    // For demo, using sessionStorage (not secure for production)
    sessionStorage.setItem('e3_session', JSON.stringify(sessionData));

    return sessionData;
};

export const getUserSession = (): any | null => {
    try {
        const session = sessionStorage.getItem('e3_session');
        if (!session) return null;

        const data = JSON.parse(session);
        if (Date.now() > data.expiresAt) {
            sessionStorage.removeItem('e3_session');
            return null;
        }

        return data;
    } catch {
        return null;
    }
};

export const clearUserSession = () => {
    sessionStorage.removeItem('e3_session');
};

// CSRF protection helper
export const generateCSRFToken = (): string => {
    return Array.from(crypto.getRandomValues(new Uint8Array(32)))
        .map(b => b.toString(16).padStart(2, '0'))
        .join('');
};