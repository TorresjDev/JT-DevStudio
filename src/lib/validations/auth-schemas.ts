import { z } from 'zod';

/**
 * Password validation regex - Enterprise standard requirements:
 * - Minimum 8 characters
 * - At least one uppercase letter
 * - At least one lowercase letter
 * - At least one number
 * - At least one special character (@$!%*?&)
 */
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

/**
 * Username validation regex:
 * - 3-20 characters
 * - Alphanumeric and underscores only
 * - Must start with a letter
 */
const usernameRegex = /^[a-zA-Z][a-zA-Z0-9_]{2,19}$/;

/**
 * Full name validation regex:
 * - Letters, spaces, hyphens, apostrophes only
 * - Handles international names like O'Brien, Mary-Jane, etc.
 */
const fullNameRegex = /^[a-zA-Z\s'-]+$/;

export const signupSchema = z.object({
    fullName: z.string()
        .min(2, 'Full name must be at least 2 characters')
        .max(100, 'Full name must be less than 100 characters')
        .regex(fullNameRegex, 'Full name can only contain letters, spaces, hyphens, and apostrophes'),

    username: z.string()
        .min(3, 'Username must be at least 3 characters')
        .max(20, 'Username must be less than 20 characters')
        .regex(usernameRegex, 'Username must start with a letter and contain only letters, numbers, and underscores'),

    email: z.string()
        .email('Please enter a valid email address')
        .max(254, 'Email must be less than 254 characters')
        .toLowerCase(),

    password: z.string()
        .min(8, 'Password must be at least 8 characters')
        .regex(passwordRegex, 'Password must include uppercase, lowercase, number, and special character (@$!%*?&)'),
});

export const loginSchema = z.object({
    email: z.string()
        .email('Please enter a valid email address')
        .toLowerCase(),
    password: z.string().min(1, 'Password is required'),
});

export type SignupInput = z.infer<typeof signupSchema>;
export type LoginInput = z.infer<typeof loginSchema>;

/**
 * Validate password strength for UI feedback
 * Returns an object with strength score and requirements met
 */
export function validatePasswordStrength(password: string) {
    const requirements = {
        minLength: password.length >= 8,
        hasUppercase: /[A-Z]/.test(password),
        hasLowercase: /[a-z]/.test(password),
        hasNumber: /\d/.test(password),
        hasSpecial: /[@$!%*?&]/.test(password),
    };

    const metCount = Object.values(requirements).filter(Boolean).length;

    return {
        requirements,
        score: metCount,
        isValid: metCount === 5,
    };
}

// =============================================================================
// SETTINGS VALIDATION SCHEMAS
// =============================================================================

/**
 * Change password schema - requires current password verification
 */
export const changePasswordSchema = z.object({
    currentPassword: z.string().min(1, 'Current password is required'),
    newPassword: z.string()
        .min(8, 'Password must be at least 8 characters')
        .regex(passwordRegex, 'Password must include uppercase, lowercase, number, and special character (@$!%*?&)'),
    confirmNewPassword: z.string().min(1, 'Please confirm your new password'),
}).refine((data) => data.newPassword === data.confirmNewPassword, {
    message: 'Passwords do not match',
    path: ['confirmNewPassword'],
}).refine((data) => data.currentPassword !== data.newPassword, {
    message: 'New password must be different from current password',
    path: ['newPassword'],
});

/**
 * Change username schema - reuses existing username validation
 */
export const changeUsernameSchema = z.object({
    username: z.string()
        .min(3, 'Username must be at least 3 characters')
        .max(20, 'Username must be less than 20 characters')
        .regex(usernameRegex, 'Username must start with a letter and contain only letters, numbers, and underscores')
        .transform(val => val.toLowerCase()),
});

/**
 * Update profile schema - display name and bio
 */
export const updateProfileSchema = z.object({
    displayName: z.string()
        .min(2, 'Display name must be at least 2 characters')
        .max(100, 'Display name must be less than 100 characters')
        .regex(fullNameRegex, 'Display name can only contain letters, spaces, hyphens, and apostrophes')
        .optional()
        .or(z.literal('')),
    bio: z.string()
        .max(500, 'Bio must be less than 500 characters')
        .optional()
        .or(z.literal('')),
});

/**
 * Delete account schema - password confirmation for password-based accounts
 */
export const deleteAccountSchema = z.object({
    password: z.string().min(1, 'Password is required to delete your account'),
    confirmText: z.string().refine(val => val === 'DELETE', {
        message: 'Please type DELETE to confirm',
    }),
});

/**
 * Notification preferences schema
 */
export const notificationPreferencesSchema = z.object({
    securityAlerts: z.boolean().default(true),
    emailUpdates: z.boolean().default(true),
});

// Type exports for settings schemas
export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;
export type ChangeUsernameInput = z.infer<typeof changeUsernameSchema>;
export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
export type DeleteAccountInput = z.infer<typeof deleteAccountSchema>;
export type NotificationPreferencesInput = z.infer<typeof notificationPreferencesSchema>;
