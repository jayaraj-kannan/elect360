import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getFirebaseConfig } from '../lib/firebase';

describe('firebase configuration', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    vi.resetModules();
    process.env = { ...originalEnv };
  });

  it('should use NEXT_PUBLIC variables when present', () => {
    process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID = 'next-project';
    const config = getFirebaseConfig();
    expect(config.projectId).toBe('next-project');
  });

  it('should fallback to VITE variables when NEXT_PUBLIC is missing', () => {
    delete process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
    process.env.VITE_FIREBASE_PROJECT_ID = 'vite-project';
    const config = getFirebaseConfig();
    expect(config.projectId).toBe('vite-project');
  });

  it('should use hardcoded fallbacks when all env vars are missing', () => {
    delete process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
    delete process.env.VITE_FIREBASE_PROJECT_ID;
    delete process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
    delete process.env.VITE_FIREBASE_API_KEY;
    delete process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN;
    delete process.env.VITE_FIREBASE_AUTH_DOMAIN;
    delete process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET;
    delete process.env.VITE_FIREBASE_STORAGE_BUCKET;
    delete process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID;
    delete process.env.VITE_FIREBASE_MESSAGING_SENDER_ID;
    delete process.env.NEXT_PUBLIC_FIREBASE_APP_ID;
    delete process.env.VITE_FIREBASE_APP_ID;

    const config = getFirebaseConfig();
    expect(config.projectId).toBe('YOUR_PROJECT_ID');
    expect(config.apiKey).toBe('YOUR_API_KEY');
    expect(config.authDomain).toBe('YOUR_PROJECT.firebaseapp.com');
  });
});

import * as firebaseApp from 'firebase/app';

describe('firebase initialization', () => {
  it('should handle multiple initialization calls', async () => {
    const spy = vi.spyOn(firebaseApp, 'getApps').mockReturnValue([{} as any]);
    const spyApp = vi.spyOn(firebaseApp, 'getApp').mockReturnValue({} as any);
    
    vi.resetModules();
    await import('../lib/firebase');
    
    expect(spy).toHaveBeenCalled();
    expect(spyApp).toHaveBeenCalled();
    
    spy.mockRestore();
    spyApp.mockRestore();
  });
});
