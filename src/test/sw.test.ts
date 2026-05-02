import { describe, it, expect, vi } from 'vitest';
import { Serwist } from 'serwist';

// Mock serwist
vi.mock('serwist', () => ({
  Serwist: vi.fn().mockImplementation(function(this: any) {
    this.addEventListeners = vi.fn();
  }),
}));

vi.mock('@serwist/next/worker', () => ({
  defaultCache: [],
}));

describe('Service Worker', () => {
  it('should initialize Serwist and add event listeners', async () => {
    // We need to set up the global self before importing
    Object.defineProperty(global, 'self', {
      value: {
        __SW_MANIFEST: [{ url: '/test', revision: '1' }],
      },
      configurable: true,
    });

    // Dynamically import the service worker to trigger execution
    await import('@/app/sw');

    // Verify Serwist was instantiated with correct arguments
    expect(Serwist).toHaveBeenCalled();
    const constructorCalls = (Serwist as any).mock.calls;
    expect(constructorCalls.length).toBeGreaterThan(0);
    
    const config = constructorCalls[0][0];
    expect(config.precacheEntries).toEqual([{ url: '/test', revision: '1' }]);
    expect(config.skipWaiting).toBe(true);
    expect(config.clientsClaim).toBe(true);
    expect(config.navigationPreload).toBe(true);
    expect(config.runtimeCaching).toBeDefined();
  });
});
