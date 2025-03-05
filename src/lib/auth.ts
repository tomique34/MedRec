// This file contains authentication utilities and credential verification
// In a production app, this would use a secure authentication system with hashed passwords

// Simple hash function for demo purposes
// In a real app, use a proper password hashing library like bcrypt
function simpleHash(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return hash.toString(16);
}

// Credentials store
// In a real app, these would be stored in a database with properly hashed passwords
interface UserCredentials {
  username: string;
  passwordHash: string;
  role: 'admin' | 'doctor';
}

// Get credentials from environment variables
// This ensures sensitive data is not committed to the repository
const adminUsername = import.meta.env.VITE_ADMIN_USERNAME || '';
const adminPassword = import.meta.env.VITE_ADMIN_PASSWORD || '';
const doctorUsername = import.meta.env.VITE_DOCTOR_USERNAME || '';
const doctorPassword = import.meta.env.VITE_DOCTOR_PASSWORD || '';

// Store hashed passwords instead of plain text
const userCredentials: UserCredentials[] = [
  {
    username: adminUsername,
    passwordHash: simpleHash(adminPassword),
    role: 'admin'
  },
  {
    username: doctorUsername,
    passwordHash: simpleHash(doctorPassword),
    role: 'doctor'
  }
];

// Authentication function
export function authenticateUser(username: string, password: string): { authenticated: boolean; role?: 'admin' | 'doctor' } {
  const user = userCredentials.find(u => u.username === username);
  
  if (!user) {
    return { authenticated: false };
  }
  
  // Check if password hash matches
  if (simpleHash(password) === user.passwordHash) {
    return { 
      authenticated: true,
      role: user.role
    };
  }
  
  return { authenticated: false };
}
