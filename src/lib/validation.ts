/**
 * SMART FORM VALIDATION UTILITIES
 * Reusable field-level and form-level validators with Indian context,
 * friendly error messages, and non-destructive recoverable validation.
 */

export interface ValidationResult {
  isValid: boolean;
  error?: string;
}

export function validateEmail(email: string): ValidationResult {
  if (!email || !email.trim()) {
    return { isValid: false, error: "Email address is required." };
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email.trim())) {
    return { isValid: false, error: "Please enter a valid email address (e.g., name@example.com)." };
  }
  return { isValid: true };
}

export function validatePhone(phone: string): ValidationResult {
  if (!phone || !phone.trim()) {
    return { isValid: false, error: "Phone number is required." };
  }
  // Strip spaces, dashes, +91 or 0 prefix
  const cleaned = phone.trim().replace(/[\s-]/g, "").replace(/^(\+91|91|0)/, "");
  if (!/^\d{10}$/.test(cleaned)) {
    return { isValid: false, error: "Please enter a valid 10-digit Indian mobile number." };
  }
  return { isValid: true };
}

export function validatePassword(password: string): ValidationResult {
  if (!password) {
    return { isValid: false, error: "Password is required." };
  }
  if (password.length < 8) {
    return { isValid: false, error: "Password must be at least 8 characters long." };
  }
  if (!/[A-Z]/.test(password)) {
    return { isValid: false, error: "Password must contain at least one uppercase letter." };
  }
  if (!/[a-z]/.test(password)) {
    return { isValid: false, error: "Password must contain at least one lowercase letter." };
  }
  if (!/[0-9]/.test(password)) {
    return { isValid: false, error: "Password must contain at least one number." };
  }
  return { isValid: true };
}

export function validateSalonName(name: string): ValidationResult {
  if (!name || !name.trim()) {
    return { isValid: false, error: "Salon business name is required." };
  }
  if (name.trim().length < 3) {
    return { isValid: false, error: "Salon name must be at least 3 characters." };
  }
  return { isValid: true };
}

export function validateBusinessHours(openTime: string, closeTime: string): ValidationResult {
  if (!openTime || !closeTime) {
    return { isValid: false, error: "Both opening and closing hours are required." };
  }
  if (openTime >= closeTime) {
    return { isValid: false, error: "Closing time must be after opening time." };
  }
  return { isValid: true };
}

export function validateServicePrice(price: number | string): ValidationResult {
  const num = typeof price === "string" ? parseFloat(price) : price;
  if (isNaN(num) || num <= 0) {
    return { isValid: false, error: "Price must be a valid positive amount in ₹." };
  }
  if (num > 25000) {
    return { isValid: false, error: "Price exceeds maximum allowable salon service amount (₹25,000)." };
  }
  return { isValid: true };
}

export function validateServiceDuration(durationMins: number | string): ValidationResult {
  const num = typeof durationMins === "string" ? parseInt(durationMins, 10) : durationMins;
  if (isNaN(num) || num < 5) {
    return { isValid: false, error: "Minimum service duration is 5 minutes." };
  }
  if (num > 300) {
    return { isValid: false, error: "Maximum service duration is 5 hours (300 minutes)." };
  }
  return { isValid: true };
}

export function validateImageUpload(file: File): ValidationResult {
  const validTypes = ["image/jpeg", "image/png", "image/webp"];
  if (!validTypes.includes(file.type)) {
    return { isValid: false, error: "Supported image formats are JPEG, PNG, or WebP." };
  }
  const maxBytes = 5 * 1024 * 1024; // 5MB
  if (file.size > maxBytes) {
    return { isValid: false, error: "Image file size must be under 5MB." };
  }
  return { isValid: true };
}

