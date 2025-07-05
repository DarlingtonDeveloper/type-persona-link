// Core user interface
export interface User {
    id: string;
    user_code: string;
    email?: string;
    name?: string;
    date_of_birth?: string;
    gender?: string;
    eye_color?: string;
    relationship_status?: string;
    job_title?: string;
    mobile?: string;
    profile_photo_url?: string;
    onboarding_step: number;
    is_onboarding_complete: boolean;
    terms_accepted: boolean;
    privacy_accepted: boolean;
    created_at?: string;
    updated_at?: string;
    location?: string;
    bio_description?: string;
}

// User links interface (stored in DB)
export interface UserLink {
    id: string;
    user_id: string;
    label: string;
    url: string;
    category_id: string;
    description?: string;
    display_order: number;
    is_primary: boolean;
    created_at?: string;
    updated_at?: string;
    category?: {
        name: string;
        icon_name: string;
    };
}

// Onboarding link structure (temporary, used in form)
export type LinkType = 'social-media' | 'email' | 'mobile' | 'website' | 'business' | 'affiliate';

export interface UserLinkInput {
    type: LinkType;
    platform?: string;     // for social media
    username?: string;     // for social media
    email?: string;
    phone?: string;
    url?: string;
}

// Link categories interface
export interface LinkCategory {
    id: string;
    name: string;
    icon_name: string;
    created_at?: string;
    updated_at?: string;
}

// Onboarding form data interface
export interface OnboardingFormData {
    // Basic info
    email: string;
    name: string;
    date_of_birth: string;
    gender: string;
    eye_color: string;
    relationship_status?: string;
    mobile: string;
    location?: string;

    // Professional info
    job_title: string;

    // Profile content
    profile_photo_url?: string;
    bio_description?: string;

    // Links (new dynamic format)
    links: UserLinkInput[];

    // Legal
    terms_accepted: boolean;
    privacy_accepted: boolean;
}

// Form validation interface
export interface ValidationResult {
    isValid: boolean;
    errors: string[];
}

// API response interfaces
export interface ApiResponse<T = any> {
    data?: T;
    error?: string;
    message?: string;
}

// Component prop interfaces
export interface StepComponentProps {
    formData: Partial<OnboardingFormData>;
    onFormDataChange: (field: string, value: any) => void;
    onNext: () => void;
    onBack: () => void;
    loading: boolean;
}

// File upload interface
export interface FileUploadResult {
    url?: string;
    error?: string;
    file?: File;
}

// Theme and styling
export type ThemeMode = 'light' | 'dark' | 'auto';
export type TimeOfDay = 'dawn' | 'morning' | 'afternoon' | 'evening' | 'night';

// Status types
export type StatusType = 'success' | 'error' | 'warning' | 'pending' | 'info';

// Navigation
export interface NavigationItem {
    label: string;
    href: string;
    icon?: string;
    active?: boolean;
}

// Form field options
export interface SelectOption {
    value: string;
    label: string;
}

// Error handling
export interface AppError extends Error {
    code?: string;
    statusCode?: number;
    details?: any;
}

// Local storage keys type safety
export type LocalStorageKey =
    | 'e3_session'
    | 'e3_theme'
    | 'e3_language'
    | 'e3_onboarding_progress'
    | 'e3_welcome_viewed';

// Event handlers
export type FormChangeHandler = (field: string, value: any) => void;
export type StepNavigationHandler = () => void;
export type FileUploadHandler = (file: File) => Promise<FileUploadResult>;

// Utility types
export type DeepPartial<T> = {
    [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

export type RequiredFields<T, K extends keyof T>
