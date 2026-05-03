import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import * as React from 'react';
import UserMenu from '@/components/layout/UserMenu';
import { useAuth } from '@/lib/authContext';

vi.mock('@/lib/authContext', () => ({
  useAuth: vi.fn(),
}));

describe('UserMenu', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should show loading state', () => {
    (useAuth as any).mockReturnValue({
      user: null,
      loading: true,
      signInWithGoogle: vi.fn(),
      logout: vi.fn(),
    });

    const { container } = render(<UserMenu />);
    expect(container.firstChild).toHaveClass('animate-pulse');
  });

  it('should show sign in button when not logged in', () => {
    const signInWithGoogle = vi.fn();
    (useAuth as any).mockReturnValue({
      user: null,
      loading: false,
      signInWithGoogle,
      logout: vi.fn(),
    });

    render(<UserMenu />);
    const btn = screen.getByText(/Sign In/i);
    expect(btn).toBeInTheDocument();
    
    fireEvent.click(btn);
    expect(signInWithGoogle).toHaveBeenCalled();
  });

  it('should show user avatar and dropdown when logged in', () => {
    const logout = vi.fn();
    (useAuth as any).mockReturnValue({
      user: {
        displayName: 'Jane Doe',
        email: 'jane@example.com',
        photoURL: 'https://example.com/avatar.jpg'
      },
      loading: false,
      signInWithGoogle: vi.fn(),
      logout,
    });

    render(<UserMenu />);
    
    // Check avatar
    const avatar = screen.getByAltText('Jane Doe');
    expect(avatar).toBeInTheDocument();
    expect(avatar).toHaveAttribute('src', 'https://example.com/avatar.jpg');

    // Click to open dropdown
    fireEvent.click(screen.getByRole('button', { name: /User menu/i }));
    
    // Check dropdown content
    expect(screen.getByText('jane@example.com')).toBeInTheDocument();
    expect(screen.getByText(/Voter Dashboard/i)).toBeInTheDocument();
    
    // Test logout
    const logoutBtn = screen.getByText(/Sign Out/i);
    fireEvent.click(logoutBtn);
    expect(logout).toHaveBeenCalled();
  });

  it('should close dropdown when backdrop is clicked', async () => {
    const logout = vi.fn();
    (useAuth as any).mockReturnValue({
      user: {
        displayName: 'Jane Doe',
        email: 'jane@example.com',
        photoURL: 'https://example.com/avatar.jpg'
      },
      loading: false,
      signInWithGoogle: vi.fn(),
      logout,
    });

    render(<UserMenu />);

    // Open dropdown
    fireEvent.click(screen.getByRole('button', { name: /User menu/i }));
    expect(screen.getByText('jane@example.com')).toBeInTheDocument();

    // Click the backdrop (the fixed inset-0 div)
    const backdrop = document.querySelector('.fixed.inset-0');
    if (backdrop) fireEvent.click(backdrop);

    // Dropdown should be closed (wait for exit animation)
    await waitFor(() => {
      expect(screen.queryByText('jane@example.com')).not.toBeInTheDocument();
    });
  });

  it('should show user icon when no photoURL', () => {
    (useAuth as any).mockReturnValue({
      user: {
        displayName: 'No Photo User',
        email: 'nophoto@example.com',
        photoURL: null
      },
      loading: false,
      signInWithGoogle: vi.fn(),
      logout: vi.fn(),
    });

    render(<UserMenu />);
    // The avatar area should not have an img tag
    expect(screen.queryByAltText('No Photo User')).not.toBeInTheDocument();
  });

  it('should use fallbacks when displayName is missing', () => {
    (useAuth as any).mockReturnValue({
      user: {
        displayName: null,
        email: 'nodisplayname@example.com',
        photoURL: 'https://example.com/photo.jpg'
      },
      loading: false,
      signInWithGoogle: vi.fn(),
      logout: vi.fn(),
    });

    render(<UserMenu />);
    
    // Line 38 fallback (alt="User")
    const img = screen.getByRole('img');
    expect(img).toHaveAttribute('alt', 'User');

    // Line 63 fallback (user.displayName || user.email)
    fireEvent.click(screen.getByRole('button'));
    
    // The name area should show the email since displayName is missing
    const elements = screen.getAllByText('nodisplayname@example.com');
    // It should appear twice: once as the main name, once as the email subtitle
    expect(elements.length).toBeGreaterThan(1);
  });
});
