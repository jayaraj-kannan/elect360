import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import * as React from 'react';
import { AuthProvider, useAuth } from '@/lib/authContext';
import { onAuthStateChanged, signInWithPopup, signOut } from 'firebase/auth';

// We need to unmock it because setup.ts mocks it globally
vi.unmock('@/lib/authContext');

const TestComponent = () => {
  const { user, loading, signInWithGoogle, logout } = useAuth();
  if (loading) return <div>Loading...</div>;
  if (!user) return <button onClick={signInWithGoogle}>Sign In</button>;
  return (
    <div>
      <span>{user.displayName}</span>
      <button onClick={logout}>Logout</button>
    </div>
  );
};

describe('AuthProvider', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should show loading state initially', () => {
    // mock onAuthStateChanged to do nothing immediately
    (onAuthStateChanged as any).mockImplementationOnce(() => vi.fn());
    
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );
    
    expect(screen.getByText(/Loading.../i)).toBeInTheDocument();
  });

  it('should show user when authenticated', async () => {
    const mockUser = { displayName: 'John Doe', email: 'john@example.com' };
    (onAuthStateChanged as any).mockImplementationOnce((auth: any, callback: any) => {
      callback(mockUser);
      return vi.fn();
    });

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument();
    });
  });

  it('should call signInWithPopup on login', async () => {
    (onAuthStateChanged as any).mockImplementationOnce((auth: any, callback: any) => {
      callback(null);
      return vi.fn();
    });

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    const btn = screen.getByText(/Sign In/i);
    btn.click();

    expect(signInWithPopup).toHaveBeenCalled();
  });

  it('should call signOut on logout', async () => {
    const mockUser = { displayName: 'John Doe' };
    (onAuthStateChanged as any).mockImplementationOnce((auth: any, callback: any) => {
      callback(mockUser);
      return vi.fn();
    });

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    const btn = await screen.findByText(/Logout/i);
    btn.click();

    expect(signOut).toHaveBeenCalled();
  });

  it('should handle signInWithGoogle error gracefully', async () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    (onAuthStateChanged as any).mockImplementationOnce((auth: any, callback: any) => {
      callback(null);
      return vi.fn();
    });
    (signInWithPopup as any).mockRejectedValueOnce(new Error('Auth error'));

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    const btn = screen.getByText(/Sign In/i);
    btn.click();

    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith('Error signing in with Google', expect.any(Error));
    });
    consoleSpy.mockRestore();
  });

  it('should handle logout error gracefully', async () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    const mockUser = { displayName: 'John Doe' };
    (onAuthStateChanged as any).mockImplementationOnce((auth: any, callback: any) => {
      callback(mockUser);
      return vi.fn();
    });
    (signOut as any).mockRejectedValueOnce(new Error('Logout error'));

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    const btn = await screen.findByText(/Logout/i);
    btn.click();

    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith('Error signing out', expect.any(Error));
    });
    consoleSpy.mockRestore();
  });

  it('should have default context values when used outside provider', async () => {
    // To cover the default values in createContext
    const DefaultContextTest = () => {
      const { user, loading, signInWithGoogle, logout } = useAuth();
      return (
        <div>
          <span data-testid="loading">{loading.toString()}</span>
          <button data-testid="signin" onClick={signInWithGoogle}>Sign In</button>
          <button data-testid="logout" onClick={logout}>Logout</button>
        </div>
      );
    };

    render(<DefaultContextTest />);
    
    expect(screen.getByTestId('loading')).toHaveTextContent('true');
    
    // Call the default empty functions
    const signInBtn = screen.getByTestId('signin');
    const logoutBtn = screen.getByTestId('logout');
    
    fireEvent.click(signInBtn);
    fireEvent.click(logoutBtn);
    
    // Nothing should crash, defaults are async () => {}
  });
});
