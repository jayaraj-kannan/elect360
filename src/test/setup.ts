import '@testing-library/jest-dom';
import { vi } from 'vitest';

// Mock Firebase
vi.mock('firebase/app', () => ({
  initializeApp: vi.fn(),
  getApps: vi.fn(() => []),
  getApp: vi.fn(),
}));

vi.mock('firebase/firestore', () => ({
  getFirestore: vi.fn(),
  collection: vi.fn(),
  query: vi.fn(),
  where: vi.fn(),
  getDocs: vi.fn(() => Promise.resolve({ forEach: vi.fn() })),
}));

vi.mock('firebase/auth', () => ({
  getAuth: vi.fn(),
  onAuthStateChanged: vi.fn((auth, callback) => {
    // Default to logged out for the firebase listener itself
    callback(null);
    return vi.fn();
  }),
  GoogleAuthProvider: vi.fn(),
  signInWithPopup: vi.fn(),
  signOut: vi.fn(),
}));

// Mock Auth Context
vi.mock('@/lib/authContext', () => ({
  useAuth: vi.fn(() => ({
    user: { 
      uid: 'test-uid', 
      displayName: 'Test User', 
      email: 'test@example.com',
      photoURL: 'https://example.com/photo.jpg'
    },
    loading: false,
    signInWithGoogle: vi.fn(),
    logout: vi.fn(),
  })),
  AuthProvider: ({ children }: any) => children,
}));

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};
global.localStorage = localStorageMock as any;
