import { describe, it, expect, vi } from 'vitest';
import * as firebaseApp from 'firebase/app';

describe('firebase branches', () => {
  it('should hit branches in firebase config', async () => {
    // We hit the length === 0 branch during normal app startup/tests
    // To hit the > 0 branch, we can mock it
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
