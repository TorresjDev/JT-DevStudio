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
