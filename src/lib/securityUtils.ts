
/**
 * Security utility functions for the application
 */

// Sanitize user input to prevent XSS attacks
export const sanitizeInput = (input: string): string => {
  if (!input) return '';
  
  return String(input)
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
    .trim();
};

// Validate email format
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Validate phone number format
export const validatePhone = (phone: string): boolean => {
  // Basic phone validation - can be adjusted based on your needs
  const phoneRegex = /^\+?[0-9\s\-()]{8,20}$/;
  return phoneRegex.test(phone);
};

// Password strength checker
export const checkPasswordStrength = (password: string): {
  isStrong: boolean;
  score: number;
  feedback: string;
} => {
  let score = 0;
  const feedback = [];
  
  if (password.length < 8) {
    feedback.push("Password should be at least 8 characters long");
  } else {
    score += 1;
  }
  
  if (/[A-Z]/.test(password)) {
    score += 1;
  } else {
    feedback.push("Add uppercase letters");
  }
  
  if (/[a-z]/.test(password)) {
    score += 1;
  } else {
    feedback.push("Add lowercase letters");
  }
  
  if (/[0-9]/.test(password)) {
    score += 1;
  } else {
    feedback.push("Add numbers");
  }
  
  if (/[^A-Za-z0-9]/.test(password)) {
    score += 1;
  } else {
    feedback.push("Add special characters");
  }
  
  return {
    isStrong: score >= 4,
    score,
    feedback: feedback.join(", ")
  };
};

// Rate limiter for API requests
export class RateLimiter {
  private timestamps: { [ip: string]: number[] } = {};
  private readonly limit: number;
  private readonly windowMs: number;
  
  constructor(limit = 10, windowMs = 60000) {
    this.limit = limit;
    this.windowMs = windowMs;
  }
  
  check(identifier: string): boolean {
    const now = Date.now();
    
    // Initialize array for this identifier if it doesn't exist
    if (!this.timestamps[identifier]) {
      this.timestamps[identifier] = [];
    }
    
    // Filter out timestamps outside the current window
    this.timestamps[identifier] = this.timestamps[identifier].filter(
      timestamp => now - timestamp < this.windowMs
    );
    
    // Check if limit is reached
    if (this.timestamps[identifier].length >= this.limit) {
      return false; // Rate limit exceeded
    }
    
    // Add current timestamp
    this.timestamps[identifier].push(now);
    return true; // Within rate limit
  }
  
  // Get remaining requests for an identifier
  getRemainingRequests(identifier: string): number {
    const now = Date.now();
    
    if (!this.timestamps[identifier]) {
      return this.limit;
    }
    
    // Filter out timestamps outside the current window
    this.timestamps[identifier] = this.timestamps[identifier].filter(
      timestamp => now - timestamp < this.windowMs
    );
    
    return Math.max(0, this.limit - this.timestamps[identifier].length);
  }
  
  // Reset rate limit for an identifier
  reset(identifier: string): void {
    delete this.timestamps[identifier];
  }
}

// Secure storage for sensitive data (uses browser's sessionStorage with encryption)
export class SecureStorage {
  private readonly storage: Storage;
  private readonly prefix: string;
  
  constructor(prefix = 'secure_', storage: Storage = sessionStorage) {
    this.storage = storage;
    this.prefix = prefix;
  }
  
  // Simple XOR encryption (for demo purposes - use a real crypto library in production)
  private encrypt(data: string, key: string): string {
    let result = '';
    for (let i = 0; i < data.length; i++) {
      result += String.fromCharCode(data.charCodeAt(i) ^ key.charCodeAt(i % key.length));
    }
    return btoa(result); // Base64 encode
  }
  
  // Simple XOR decryption
  private decrypt(data: string, key: string): string {
    const decoded = atob(data); // Base64 decode
    let result = '';
    for (let i = 0; i < decoded.length; i++) {
      result += String.fromCharCode(decoded.charCodeAt(i) ^ key.charCodeAt(i % key.length));
    }
    return result;
  }
  
  // Set item with encryption
  setItem(key: string, value: string): void {
    // In a real app, use a strong encryption key, potentially derived from user password
    const encryptionKey = 'teacher-lead-nexus-app-key';
    const encryptedValue = this.encrypt(value, encryptionKey);
    this.storage.setItem(this.prefix + key, encryptedValue);
  }
  
  // Get item with decryption
  getItem(key: string): string | null {
    const encryptedValue = this.storage.getItem(this.prefix + key);
    if (!encryptedValue) return null;
    
    try {
      const encryptionKey = 'teacher-lead-nexus-app-key';
      return this.decrypt(encryptedValue, encryptionKey);
    } catch (e) {
      console.error('Failed to decrypt value:', e);
      return null;
    }
  }
  
  // Remove item
  removeItem(key: string): void {
    this.storage.removeItem(this.prefix + key);
  }
  
  // Clear all items with this prefix
  clear(): void {
    for (let i = 0; i < this.storage.length; i++) {
      const key = this.storage.key(i);
      if (key && key.startsWith(this.prefix)) {
        this.storage.removeItem(key);
      }
    }
  }
}
