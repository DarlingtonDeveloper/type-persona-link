import { supabase } from '@/integrations/supabase/client';
import {
    VALIDATION_RULES,
    RATE_LIMITS,
    FILE_UPLOAD,
    ERROR_MESSAGES,
    LOCAL_STORAGE_KEYS
} from '@/constants';
import {
    PasswordStrength,
    UserSession,
    ValidationResult,
    ApiResponse
} from '@/types';

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
    if (!email || email.length > VALIDATION_RULES.EMAIL.MAX_LENGTH) {
        return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

// Validate phone number (basic)
export const isValidPhone = (phone: string): boolean => {
    if (!phone) return false;

    const cleanPhone = phone.replace(/[\s\-\(\)]/g, '');
    if (cleanPhone.length < VALIDATION_RULES.MOBILE.MIN_LENGTH ||
        cleanPhone.length > VALIDATION_RULES.MOBILE.MAX_LENGTH) {
        return false;
    }

    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
    return phoneRegex.test(cleanPhone);
};

// Validate URL format
export const isValidUrl = (url: string): boolean => {
    if (!url || url.length > VALIDATION_RULES.URL.MAX_LENGTH) {
        return false;
    }

    try {
        new URL(url);
        return true;
    } catch {
        return false;
    }
};

// Validate name
export const isValidName = (name: string): ValidationResult => {
    const errors: string[] = [];

    if (!name || name.trim().length === 0) {
        errors.push('Name is required');
    } else if (name.length < VALIDATION_RULES.NAME.MIN_LENGTH) {
        errors.push(`Name must be at least ${VALIDATION_RULES.NAME.MIN_LENGTH} characters long`);
    } else if (name.length > VALIDATION_RULES.NAME.MAX_LENGTH) {
        errors.push(`Name must be no more than ${VALIDATION_RULES.NAME.MAX_LENGTH} characters long`);
    }

    // Check for potentially dangerous characters
    if (/<script|javascript:|data:|vbscript:/i.test(name)) {
        errors.push('Name contains invalid characters');
    }

    return {
        isValid: errors.length === 0,
        errors
    };
};

// Sanitize input to prevent XSS
export const sanitizeInput = (input: string): string => {
    if (!input) return '';

    return input
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#x27;')
        .replace(/\//g, '&#x2F;')
        .trim();
};

// Rate limiting helper (simple client-side approach)
class RateLimiter {
    private attempts: Map<string, number[]> = new Map();

    isAllowed(
        key: string,
        maxAttempts: number = RATE_LIMITS.FORM_SUBMISSIONS,
        windowMs: number = RATE_LIMITS.WINDOW_MS
    ): boolean {
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

    getTimeUntilReset(key: string, windowMs: number = RATE_LIMITS.WINDOW_MS): number {
        const attempts = this.attempts.get(key) || [];
        if (attempts.length === 0) return 0;

        const oldestAttempt = Math.min(...attempts);
        const resetTime = oldestAttempt + windowMs;
        return Math.max(0, resetTime - Date.now());
    }

    reset(key: string): void {
        this.attempts.delete(key);
    }
}

export const rateLimiter = new RateLimiter();

// Password strength checker
export const checkPasswordStrength = (password: string): PasswordStrength => {
    const feedback: string[] = [];
    let score = 0;

    if (!password) {
        return {
            score: 0,
            feedback: ['Password is required'],
            isValid: false
        };
    }

    // Length check
    if (password.length >= VALIDATION_RULES.PASSWORD.MIN_LENGTH) {
        score += 1;
    } else {
        feedback.push(`Password should be at least ${VALIDATION_RULES.PASSWORD.MIN_LENGTH} characters long`);
    }

    // Uppercase check
    if (VALIDATION_RULES.PASSWORD.REQUIRE_UPPERCASE) {
        if (/[A-Z]/.test(password)) {
            score += 1;
        } else {
            feedback.push('Include at least one uppercase letter');
        }
    }

    // Lowercase check  
    if (VALIDATION_RULES.PASSWORD.REQUIRE_LOWERCASE) {
        if (/[a-z]/.test(password)) {
            score += 1;
        } else {
            feedback.push('Include at least one lowercase letter');
        }
    }

    // Numbers check
    if (VALIDATION_RULES.PASSWORD.REQUIRE_NUMBERS) {
        if (/\d/.test(password)) {
            score += 1;
        } else {
            feedback.push('Include at least one number');
        }
    }

    // Special characters check
    if (VALIDATION_RULES.PASSWORD.REQUIRE_SPECIAL_CHARS) {
        if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
            score += 1;
        } else {
            feedback.push('Include at least one special character');
        }
    }

    // Additional security checks
    if (password.length > VALIDATION_RULES.PASSWORD.MAX_LENGTH) {
        feedback.push(`Password should be no more than ${VALIDATION_RULES.PASSWORD.MAX_LENGTH} characters long`);
        score = Math.max(0, score - 1);
    }

    // Check for common weak patterns
    const weakPatterns = [
        /^123456/,
        /^password/i,
        /^qwerty/i,
        /(.)\1{3,}/, // repeated characters
    ];

    for (const pattern of weakPatterns) {
        if (pattern.test(password)) {
            feedback.push('Avoid common password patterns');
            score = Math.max(0, score - 1);
            break;
        }
    }

    const requiredScore = VALIDATION_RULES.PASSWORD.REQUIRE_SPECIAL_CHARS ? 5 : 4;

    return {
        score,
        feedback,
        isValid: score >= requiredScore && feedback.length === 0
    };
};

// Secure API call wrapper
export const secureApiCall = async <T = any>(
    operation: () => Promise<T>,
    rateLimitKey?: string,
    customRateLimit?: { maxAttempts: number; windowMs: number }
): Promise<ApiResponse<T>> => {
    try {
        // Rate limiting check
        if (rateLimitKey) {
            const { maxAttempts, windowMs } = customRateLimit || {
                maxAttempts: RATE_LIMITS.API_REQUESTS,
                windowMs: RATE_LIMITS.WINDOW_MS
            };

            if (!rateLimiter.isAllowed(rateLimitKey, maxAttempts, windowMs)) {
                const timeUntilReset = rateLimiter.getTimeUntilReset(rateLimitKey, windowMs);
                return {
                    success: false,
                    error: `${ERROR_MESSAGES.RATE_LIMITED} Try again in ${Math.ceil(timeUntilReset / 1000)} seconds.`
                };
            }
        }

        const result = await operation();
        return { success: true, data: result };
    } catch (error: any) {
        console.error('API call failed:', error);
        return {
            success: false,
            error: error.message || ERROR_MESSAGES.GENERIC_ERROR
        };
    }
};

// File upload validation
export const validateFileUpload = (file: File): ValidationResult => {
    const errors: string[] = [];

    if (file.size > FILE_UPLOAD.MAX_SIZE) {
        errors.push(`File size must be less than ${FILE_UPLOAD.MAX_SIZE / (1024 * 1024)}MB`);
    }

    if (!FILE_UPLOAD.ALLOWED_TYPES.includes(file.type)) {
        errors.push(`Only ${FILE_UPLOAD.ALLOWED_TYPES.join(', ')} files are allowed`);
    }

    // Check file extension as additional security
    const extension = file.name.toLowerCase().split('.').pop();
    const allowedExtensions = FILE_UPLOAD.ALLOWED_EXTENSIONS.map(ext => ext.slice(1)); // remove dot
    if (extension && !allowedExtensions.includes(extension)) {
        errors.push(`File extension .${extension} is not allowed`);
    }

    return {
        isValid: errors.length === 0,
        errors
    };
};

// Secure user session management
export const createUserSession = (userId: string, userCode: string): UserSession => {
    const sessionData: UserSession = {
        userId,
        userCode,
        timestamp: Date.now(),
        expiresAt: Date.now() + (24 * 60 * 60 * 1000) // 24 hours
    };

    // Store in secure httpOnly cookie in production
    // For demo, using sessionStorage (not secure for production)
    try {
        sessionStorage.setItem(LOCAL_STORAGE_KEYS.USER_SESSION, JSON.stringify(sessionData));
    } catch (error) {
        console.warn('Failed to store session data:', error);
    }

    return sessionData;
};

export const getUserSession = (): UserSession | null => {
    try {
        const session = sessionStorage.getItem(LOCAL_STORAGE_KEYS.USER_SESSION);
        if (!session) return null;

        const data = JSON.parse(session);
        if (Date.now() > data.expiresAt) {
            clearUserSession();
            return null;
        }

        return data;
    } catch (error) {
        console.warn('Failed to retrieve session data:', error);
        clearUserSession();
        return null;
    }
};

export const clearUserSession = (): void => {
    try {
        sessionStorage.removeItem(LOCAL_STORAGE_KEYS.USER_SESSION);
    } catch (error) {
        console.warn('Failed to clear session data:', error);
    }
};

export const isSessionValid = (): boolean => {
    const session = getUserSession();
    return session !== null;
};

// CSRF protection helper
export const generateCSRFToken = (): string => {
    return Array.from(crypto.getRandomValues(new Uint8Array(32)))
        .map(b => b.toString(16).padStart(2, '0'))
        .join('');
};

// Input validation helper
export const validateInput = (
    value: string,
    type: 'email' | 'phone' | 'url' | 'name' | 'password',
    options?: { required?: boolean; customValidation?: (value: string) => ValidationResult }
): ValidationResult => {
    const errors: string[] = [];

    // Required check
    if (options?.required && (!value || value.trim().length === 0)) {
        errors.push(`${type.charAt(0).toUpperCase() + type.slice(1)} is required`);
        return { isValid: false, errors };
    }

    // Skip validation if not required and empty
    if (!value || value.trim().length === 0) {
        return { isValid: true, errors: [] };
    }

    // Type-specific validation
    switch (type) {
        case 'email':
            if (!isValidEmail(value)) {
                errors.push('Please enter a valid email address');
            }
            break;
        case 'phone':
            if (!isValidPhone(value)) {
                errors.push('Please enter a valid phone number');
            }
            break;
        case 'url':
            if (!isValidUrl(value)) {
                errors.push('Please enter a valid URL');
            }
            break;
        case 'name':
            const nameValidation = isValidName(value);
            errors.push(...nameValidation.errors);
            break;
        case 'password':
            const passwordValidation = checkPasswordStrength(value);
            if (!passwordValidation.isValid) {
                errors.push(...passwordValidation.feedback);
            }
            break;
    }

    // Custom validation
    if (options?.customValidation) {
        const customResult = options.customValidation(value);
        errors.push(...customResult.errors);
    }

    return {
        isValid: errors.length === 0,
        errors
    };
};

// Security headers helper (for development)
export const getSecurityHeaders = (): Record<string, string> => {
    return {
        'Content-Security-Policy': "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:;",
        'X-Frame-Options': 'DENY',
        'X-Content-Type-Options': 'nosniff',
        'Referrer-Policy': 'strict-origin-when-cross-origin',
        'Permissions-Policy': 'camera=(), microphone=(), geolocation=()'
    };
};