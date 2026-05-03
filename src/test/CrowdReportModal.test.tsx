import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import * as React from 'react';
import CrowdReportModal from '@/components/dashboard/CrowdReportModal';
import { useAuth } from '@/lib/authContext';

vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  },
  AnimatePresence: ({ children }: any) => <>{children}</>,
}));

vi.mock('@/lib/authContext', () => ({
  useAuth: vi.fn(),
}));

describe('CrowdReportModal', () => {
  const mockSignInWithGoogle = vi.fn();
  const mockLogout = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    // Default: authenticated user
    (useAuth as any).mockReturnValue({
      user: { uid: 'u1', displayName: 'Test User' },
      loading: false,
      signInWithGoogle: mockSignInWithGoogle,
      logout: mockLogout,
    });
  });

  it('should not render when closed', () => {
    render(<CrowdReportModal isOpen={false} onClose={vi.fn()} />);
    expect(screen.queryByText(/Report Crowd Level/i)).not.toBeInTheDocument();
  });

  it('should render the header and crowd level options when open', () => {
    render(<CrowdReportModal isOpen={true} onClose={vi.fn()} />);
    expect(screen.getByText(/Report Crowd Level/i)).toBeInTheDocument();
    expect(screen.getByText('LOW')).toBeInTheDocument();
    expect(screen.getByText('MEDIUM')).toBeInTheDocument();
    expect(screen.getByText('HIGH')).toBeInTheDocument();
  });

  it('should show the submit button as disabled when no level is selected', () => {
    render(<CrowdReportModal isOpen={true} onClose={vi.fn()} />);
    const submitBtn = screen.getByText(/CONFIRM REPORT/i);
    expect(submitBtn).toBeDisabled();
  });

  it('should enable the submit button after selecting a level', () => {
    render(<CrowdReportModal isOpen={true} onClose={vi.fn()} />);
    fireEvent.click(screen.getByText('LOW'));
    const submitBtn = screen.getByText(/CONFIRM REPORT/i);
    expect(submitBtn).not.toBeDisabled();
  });

  it('should show success message after submitting', async () => {
    vi.useFakeTimers();
    const onClose = vi.fn();
    render(<CrowdReportModal isOpen={true} onClose={onClose} />);

    fireEvent.click(screen.getByText('MEDIUM'));
    fireEvent.click(screen.getByText(/CONFIRM REPORT/i));

    // Wait for the simulated write (1500ms)
    await React.act(async () => {
      vi.advanceTimersByTime(1500);
    });

    // Now it should show success
    expect(screen.getByText(/Thank You, Citizen!/i)).toBeInTheDocument();

    // After 2000ms more, onClose should be called
    await React.act(async () => {
      vi.advanceTimersByTime(2000);
    });

    expect(onClose).toHaveBeenCalled();
    vi.useRealTimers();
  });

  it('should call onClose when X button is clicked', () => {
    const onClose = vi.fn();
    render(<CrowdReportModal isOpen={true} onClose={onClose} />);
    // Find close button — the X button is in the header
    const buttons = screen.getAllByRole('button');
    const xButton = buttons.find(b => b.closest('.border-b'));
    if (xButton) fireEvent.click(xButton);
    expect(onClose).toHaveBeenCalled();
  });

  it('should call onClose when backdrop is clicked', () => {
    const onClose = vi.fn();
    render(<CrowdReportModal isOpen={true} onClose={onClose} />);
    const backdrop = document.querySelector('[class*="bg-black/80"]');
    if (backdrop) fireEvent.click(backdrop);
    expect(onClose).toHaveBeenCalled();
  });

  it('should show reporting notice', () => {
    render(<CrowdReportModal isOpen={true} onClose={vi.fn()} />);
    expect(screen.getByText(/False reporting leads to/i)).toBeInTheDocument();
  });

  it('should not submit when level is null', () => {
    render(<CrowdReportModal isOpen={true} onClose={vi.fn()} />);
    const submitBtn = screen.getByText(/CONFIRM REPORT/i);
    // The button is disabled, but let's try clicking anyway
    fireEvent.click(submitBtn);
    // It should still show the form, not submitting
    expect(screen.getByText('LOW')).toBeInTheDocument();
  });

  it('should call signInWithGoogle when sign in button is clicked', () => {
    // Override useAuth to return unauthenticated user
    (useAuth as any).mockReturnValue({
      user: null,
      loading: false,
      signInWithGoogle: mockSignInWithGoogle,
      logout: mockLogout,
    });

    render(<CrowdReportModal isOpen={true} onClose={vi.fn()} />);

    const signInBtn = screen.getByText(/SIGN IN TO REPORT/i);
    fireEvent.click(signInBtn);

    expect(mockSignInWithGoogle).toHaveBeenCalled();
  });

  it('should not submit when user is not authenticated', () => {
    // Override useAuth to return unauthenticated user
    (useAuth as any).mockReturnValue({
      user: null,
      loading: false,
      signInWithGoogle: mockSignInWithGoogle,
      logout: mockLogout,
    });

    render(<CrowdReportModal isOpen={true} onClose={vi.fn()} />);

    // The SIGN IN button should show instead of CONFIRM REPORT
    expect(screen.getByText(/SIGN IN TO REPORT/i)).toBeInTheDocument();
    expect(screen.queryByText(/CONFIRM REPORT/i)).not.toBeInTheDocument();

    // Trigger form submit directly to hit the !user guard
    const form = document.querySelector('form');
    if (form) fireEvent.submit(form);
  });
});
