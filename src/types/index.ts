export interface User {
    id: string;
    user_code: string;
    email?: string;
    password_hash?: string;
    name?: string;
    date_of_birth?: string;
    gender?: string;
    eye_color?: string;
    relationship_status?: string;
    job_title?: string;
    job_category?: string;
    mobile?: string;
    profile_photo_url?: string;
    onboarding_step: number;
    is_onboarding_complete: boolean;
    terms_accepted: boolean;
    privacy_accepted: boolean;
    created_at: string;
    updated_at: string;
    postcode?: string;
    bio_description?: string;
    interests?: string; // JSON array or comma-separated
    communication_preferences?: boolean;
}

export interface UserLink {
    id: string;
    user_id: string;
    category_id: string;
    label: string;
    url: string;
    is_primary: boolean;
    display_order: number;
    created_at: string;
    updated_at: string;
    category?: LinkCategory;
    description?: string;
}

export interface LinkCategory {
    id: string;
    name: string;
    icon_name: string;
    created_at: string;
}

export interface OnboardingFormData {
    // Step 1: Personal Details (consolidated)
    email: string;
    password: string;
    confirmPassword: string;
    name: string;
    date_of_birth: string;
    gender: string;
    eye_color: string;
    relationship_status: string;
    job_category: string;
    job_title?: string;
    mobile: string;
    postcode: string; // New

    // Step 2: Links (expanded to 3)
    links: LinkFormData[];

    // Step 3: Photo & Bio (new bio fields)
    profile_photo_url?: string;
    bio_description: string; // New
    interests: string[]; // New - array of 3 interests

    // Step 4: Terms (updated)
    terms_accepted: boolean;
    privacy_accepted: boolean;
    communication_preferences: boolean; // New
}

export interface LinkFormData {
    label: string;
    url: string;
    categoryId: string;
    description?: string; // New
}

// New: Position-specific link category type
export interface PositionLinkCategory {
    value: string;
    label: string;
    icon: string;
}

export interface LinkCategoriesByPosition {
    0: PositionLinkCategory[];
    1: PositionLinkCategory[];
    2: PositionLinkCategory[];
}

// New: Welcome GIF state
export interface WelcomeGifState {
    timeLeft: number;
    canSkip: boolean;
    isPlaying: boolean;
    hasViewed: boolean;
}

// New: Completion page state
export interface CompletionState {
    isVisible: boolean;
    timeLeft: number;
    autoRedirect: boolean;
}

export interface ValidationResult {
    isValid: boolean;
    errors: string[];
    warnings?: string[];
}

export interface ApiResponse<T = any> {
    data?: T;
    error?: string;
    message?: string;
    success: boolean;
}

export interface UserSession {
    userId: string;
    userCode: string;
    timestamp: number;
    expiresAt: number;
}

export interface DashboardStats {
    totalUsers: number;
    completedProfiles: number;
    pendingOnboarding: number;
    totalLinks: number;
    dailySignups: number;
    completionRate: number;
    // New stats
    averageLinksPerUser: number;
    averageCompletionTime: number;
    mostPopularLinkCategories: string[];
}

export interface UserWithStats extends User {
    link_count: number;
    last_activity: string | null;
    completion_time?: number; // New - time taken to complete onboarding
}

export interface PasswordStrength {
    score: number;
    feedback: string[];
    isValid: boolean;
}

export interface FileUploadResult {
    success: boolean;
    url?: string;
    error?: string;
}

export interface SecurityConfig {
    maxLoginAttempts: number;
    passwordMinLength: number;
    sessionTimeout: number;
    rateLimitWindow: number;
    maxFileSize: number;
    allowedFileTypes: string[];
}

export interface TimeOfDayConfig {
    timeOfDay: 'dawn' | 'morning' | 'afternoon' | 'evening' | 'night';
    overlayClass: string;
    backgroundImage: string;
}

export interface ErrorBoundaryState {
    hasError: boolean;
    error?: Error;
    errorInfo?: React.ErrorInfo;
}

export interface LoadingState {
    isLoading: boolean;
    message?: string;
    progress?: number;
}

export interface NotificationConfig {
    type: 'success' | 'error' | 'warning' | 'info';
    title: string;
    message: string;
    duration?: number;
    action?: {
        label: string;
        onClick: () => void;
    };
}

export interface SearchResult {
    user: User;
    links: UserLink[];
    score: number; // relevance score
}

export interface AdminAction {
    id: string;
    type: 'view_profile' | 'reset_onboarding' | 'suspend_user' | 'delete_user';
    userId: string;
    performedBy: string;
    timestamp: string;
    details?: Record<string, any>;
}

export interface AnalyticsEvent {
    event: string;
    category: string;
    label?: string;
    value?: number;
    userId?: string;
    timestamp: string;
    metadata?: Record<string, any>;
}

// New: Onboarding analytics
export interface OnboardingAnalytics {
    stepStartTime: number;
    stepCompletionTimes: number[];
    abandonmentPoints: number[];
    validationErrors: string[];
    totalTime: number;
}

export interface FeatureFlag {
    name: string;
    enabled: boolean;
    description: string;
    rolloutPercentage?: number;
    conditions?: Record<string, any>;
}

export interface ThemeConfig {
    mode: 'light' | 'dark' | 'system';
    primaryColor: string;
    accentColor: string;
    borderRadius: number;
    fontFamily: string;
    // New: Brand-specific colors
    brandColors: {
        blackGrey: string;
        whiteEggshell: string;
    };
    fontSizes: {
        gif: number;
        heading: number;
        body: number;
    };
}

export interface LocalStorageData {
    session?: UserSession;
    theme?: ThemeConfig;
    preferences?: UserPreferences;
    cache?: Record<string, any>;
    welcomeViewed?: boolean; // New
}

export interface UserPreferences {
    language: string;
    timezone: string;
    notifications: {
        email: boolean;
        push: boolean;
        marketing: boolean;
    };
    privacy: {
        showEmail: boolean;
        showMobile: boolean;
        publicProfile: boolean;
    };
    accessibility: {
        reducedMotion: boolean;
        highContrast: boolean;
        fontSize: 'small' | 'medium' | 'large';
    };
    // New: Onboarding preferences
    onboarding: {
        skipWelcomeGif: boolean;
        autoSaveProgress: boolean;
        showHelpTips: boolean;
    };
}

export interface CacheEntry<T = any> {
    data: T;
    timestamp: number;
    expiresAt: number;
    key: string;
}

export interface RateLimitConfig {
    windowMs: number;
    maxRequests: number;
    message: string;
    skipSuccessfulRequests?: boolean;
    skipFailedRequests?: boolean;
}

export interface DatabaseRow {
    id: string;
    created_at: string;
    updated_at: string;
}

export interface SelectOption {
    value: string;
    label: string;
    disabled?: boolean;
    icon?: string;
}

export interface FormField {
    name: string;
    label: string;
    type: 'text' | 'email' | 'password' | 'tel' | 'url' | 'select' | 'textarea' | 'file' | 'date';
    required: boolean;
    placeholder?: string;
    options?: SelectOption[];
    validation?: {
        pattern?: RegExp;
        minLength?: number;
        maxLength?: number;
        custom?: (value: any) => ValidationResult;
    };
}

export interface ComponentProps {
    className?: string;
    children?: React.ReactNode;
}

export interface ModalProps extends ComponentProps {
    isOpen: boolean;
    onClose: () => void;
    title?: string;
    size?: 'sm' | 'md' | 'lg' | 'xl';
}

export interface TableColumn<T = any> {
    key: keyof T;
    label: string;
    sortable?: boolean;
    render?: (value: any, row: T) => React.ReactNode;
    width?: string;
}

export interface PaginationConfig {
    page: number;
    pageSize: number;
    total: number;
    showSizeChanger?: boolean;
    showQuickJumper?: boolean;
}

export interface SortConfig {
    key: string;
    direction: 'asc' | 'desc';
}

export interface FilterConfig {
    key: string;
    value: any;
    operator: 'eq' | 'ne' | 'gt' | 'gte' | 'lt' | 'lte' | 'like' | 'in';
}

// Utility Types
export type DeepPartial<T> = {
    [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

export type RequiredFields<T, K extends keyof T> = T & Required<Pick<T, K>>;

export type OptionalFields<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

export type CreateUserInput = Omit<User, 'id' | 'created_at' | 'updated_at'>;

export type UpdateUserInput = Partial<Omit<User, 'id' | 'user_code' | 'created_at'>>;

export type CreateLinkInput = Omit<UserLink, 'id' | 'created_at' | 'updated_at' | 'category'>;

export type UpdateLinkInput = Partial<Omit<UserLink, 'id' | 'user_id' | 'created_at' | 'category'>>;

// Event Types
export type OnboardingStepChangeEvent = {
    currentStep: number;
    previousStep: number;
    totalSteps: number;
    isComplete: boolean;
    stepName: string;
    timeSpent: number; // New
};

export type LinkActionEvent = {
    action: 'add' | 'update' | 'delete' | 'reorder';
    linkId?: string;
    linkData?: UserLink;
    position?: number;
    category?: string; // New
};

export type UserActionEvent = {
    action: 'register' | 'login' | 'logout' | 'update_profile' | 'complete_onboarding' | 'view_welcome'; // New action
    userId: string;
    timestamp: string;
    metadata?: Record<string, any>;
};

// New: Welcome GIF events
export type WelcomeGifEvent = {
    action: 'play' | 'pause' | 'skip' | 'complete' | 'error';
    timeWatched: number;
    totalDuration: number;
    timestamp: string;
};

// New: Bio and interests types
export interface BioData {
    description: string;
    interests: string[];
    wordCount: number;
    characterCount: number;
}

// New: Enhanced link data
export interface EnhancedLinkData extends LinkFormData {
    position: number;
    categoryIcon: string;
    categoryLabel: string;
    isValid: boolean;
    validationErrors: string[];
}