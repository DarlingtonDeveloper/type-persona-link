// Application Constants

export const APP_CONFIG = {
    NAME: 'E3 Circle',
    VERSION: '1.0.0',
    DESCRIPTION: 'Personal profile and social link management system',
    SUPPORT_EMAIL: 'support@e3circle.com',
    CONTACT_EMAIL: 'contact@e3circle.com'
} as const;

export const USER_CODE = {
    LENGTH: 6,
    PATTERN: /^[A-Z0-9]{6}$/,
    PLACEHOLDER: 'EAVO53'
} as const;

export const ONBOARDING_STEPS = [
    'E3 Circle Registration',
    'Personal Details',
    'Additional Information',
    'Profile Display',
    'Terms & Privacy'
] as const;

export const VALIDATION_RULES = {
    PASSWORD: {
        MIN_LENGTH: 8,
        MAX_LENGTH: 128,
        REQUIRE_UPPERCASE: true,
        REQUIRE_LOWERCASE: true,
        REQUIRE_NUMBERS: true,
        REQUIRE_SPECIAL_CHARS: false
    },
    NAME: {
        MIN_LENGTH: 2,
        MAX_LENGTH: 100
    },
    EMAIL: {
        MAX_LENGTH: 320
    },
    MOBILE: {
        MIN_LENGTH: 10,
        MAX_LENGTH: 15
    },
    URL: {
        MAX_LENGTH: 2000
    },
    LABEL: {
        MAX_LENGTH: 50
    }
} as const;

export const FILE_UPLOAD = {
    MAX_SIZE: 5 * 1024 * 1024, // 5MB
    ALLOWED_TYPES: ['image/jpeg', 'image/png', 'image/webp'],
    ALLOWED_EXTENSIONS: ['.jpg', '.jpeg', '.png', '.webp']
} as const;

export const RATE_LIMITS = {
    LOGIN_ATTEMPTS: 5,
    FORM_SUBMISSIONS: 10,
    API_REQUESTS: 100,
    WINDOW_MS: 60000 // 1 minute
} as const;

export const TIMEOUTS = {
    API_REQUEST: 30000, // 30 seconds
    FILE_UPLOAD: 120000, // 2 minutes
    SESSION_REFRESH: 300000 // 5 minutes
} as const;

export const GENDER_OPTIONS = [
    { value: 'male', label: 'Male' },
    { value: 'female', label: 'Female' },
    { value: 'non-binary', label: 'Non-binary' },
    { value: 'prefer-not-to-say', label: 'Prefer not to say' }
] as const;

export const EYE_COLOR_OPTIONS = [
    { value: 'brown', label: 'Brown' },
    { value: 'blue', label: 'Blue' },
    { value: 'green', label: 'Green' },
    { value: 'hazel', label: 'Hazel' },
    { value: 'gray', label: 'Gray' },
    { value: 'amber', label: 'Amber' }
] as const;

export const RELATIONSHIP_STATUS_OPTIONS = [
    { value: 'single', label: 'Single' },
    { value: 'in-relationship', label: 'In a relationship' },
    { value: 'married', label: 'Married' },
    { value: 'divorced', label: 'Divorced' },
    { value: 'widowed', label: 'Widowed' },
    { value: 'prefer-not-to-say', label: 'Prefer not to say' }
] as const;

export const JOB_CATEGORY_OPTIONS = [
    { value: 'fitness', label: 'Fitness' },
    { value: 'clothing', label: 'Clothing' },
    { value: 'beauty', label: 'Beauty' },
    { value: 'business', label: 'Business' },
    { value: 'technology', label: 'Technology' },
    { value: 'creative-art', label: 'Creative & Art' },
    { value: 'academic', label: 'Academic' },
    { value: 'other', label: 'Other' }
] as const;

export const SOCIAL_PLATFORMS = {
    INSTAGRAM: 'instagram.com',
    TIKTOK: 'tiktok.com',
    LINKEDIN: 'linkedin.com',
    TWITTER: 'twitter.com',
    FACEBOOK: 'facebook.com',
    YOUTUBE: 'youtube.com',
    GITHUB: 'github.com',
    BEHANCE: 'behance.net',
    DRIBBBLE: 'dribbble.com'
} as const;

export const ERROR_MESSAGES = {
    NETWORK_ERROR: 'Unable to connect to the server. Please check your internet connection.',
    USER_NOT_FOUND: 'User code not found. Please check and try again.',
    VALIDATION_ERROR: 'Please check your input and try again.',
    UNAUTHORIZED: 'You are not authorized to perform this action.',
    RATE_LIMITED: 'Too many requests. Please wait before trying again.',
    FILE_TOO_LARGE: 'File size is too large. Maximum size is 5MB.',
    INVALID_FILE_TYPE: 'Invalid file type. Only JPEG, PNG, and WebP images are allowed.',
    SESSION_EXPIRED: 'Your session has expired. Please log in again.',
    GENERIC_ERROR: 'An unexpected error occurred. Please try again.'
} as const;

export const SUCCESS_MESSAGES = {
    PROFILE_UPDATED: 'Profile updated successfully!',
    LINK_ADDED: 'Link added successfully!',
    LINK_UPDATED: 'Link updated successfully!',
    LINK_DELETED: 'Link deleted successfully!',
    PHOTO_UPLOADED: 'Photo uploaded successfully!',
    ONBOARDING_COMPLETE: 'Welcome! Your profile has been set up successfully.',
    PROGRESS_SAVED: 'Progress saved successfully!'
} as const;

export const LOCAL_STORAGE_KEYS = {
    USER_SESSION: 'e3_session',
    THEME_PREFERENCE: 'e3_theme',
    LANGUAGE_PREFERENCE: 'e3_language',
    ONBOARDING_PROGRESS: 'e3_onboarding_progress'
} as const;

export const API_ENDPOINTS = {
    USERS: '/users',
    LINKS: '/user-links',
    CATEGORIES: '/link-categories',
    UPLOAD: '/upload',
    AUTH: '/auth'
} as const;

export const EXTERNAL_LINKS = {
    TERMS_OF_SERVICE: '/terms',
    PRIVACY_POLICY: '/privacy',
    SUPPORT: '/support',
    CONTACT: '/contact',
    DOCUMENTATION: '/docs'
} as const;

export const BREAKPOINTS = {
    SM: 640,
    MD: 768,
    LG: 1024,
    XL: 1280,
    '2XL': 1536
} as const;

export const ANIMATION_DURATIONS = {
    FAST: 150,
    NORMAL: 300,
    SLOW: 500,
    VERY_SLOW: 1000
} as const;