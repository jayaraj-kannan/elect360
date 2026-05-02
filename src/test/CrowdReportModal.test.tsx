import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import * as React from 'react';
import CrowdReportModal from '@/components/dashboard/CrowdReportModal';

vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  },
  AnimatePresence: ({ children }: any) => <>{children}</>,
}));

describe('CrowdReportModal', () => {
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
    const submitBtn = screen.getByText(/SUBMIT REPORT/i);
    expect(submitBtn).toBeDisabled();
  });

  it('should enable the submit button after selecting a level', () => {
    render(<CrowdReportModal isOpen={true} onClose={vi.fn()} />);
    fireEvent.click(screen.getByText('LOW'));
    const submitBtn = screen.getByText(/SUBMIT REPORT/i);
    expect(submitBtn).not.toBeDisabled();
  });

  it('should show success message after submitting', async () => {
    vi.useFakeTimers();
    const onClose = vi.fn();
    render(<CrowdReportModal isOpen={true} onClose={onClose} />);

    fireEvent.click(screen.getByText('MEDIUM'));
    fireEvent.click(screen.getByText(/SUBMIT REPORT/i));

    // Show SUBMITTING state
    expect(screen.getByText(/SUBMITTING/i)).toBeInTheDocument();

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
    // Find close button
    const buttons = screen.getAllByRole('button');
    // The X button is in the header
    const xButton = buttons.find(b => b.closest('.border-b'));
    if (xButton) fireEvent.click(xButton);
    expect(onClose).toHaveBeenCalled();
  });

  it('should call onClose when backdrop is clicked', () => {
    const onClose = vi.fn();
    render(<CrowdReportModal isOpen={true} onClose={onClose} />);
    // Click the backdrop
    const backdrop = document.querySelector('[class*="bg-black/80"]');
    if (backdrop) fireEvent.click(backdrop);
    expect(onClose).toHaveBeenCalled();
  });

  it('should show privacy notice', () => {
    render(<CrowdReportModal isOpen={true} onClose={vi.fn()} />);
    expect(screen.getByText(/anonymous and aggregated/i)).toBeInTheDocument();
  });

  it('should not submit when level is null', () => {
    render(<CrowdReportModal isOpen={true} onClose={vi.fn()} />);
    const submitBtn = screen.getByText(/SUBMIT REPORT/i);
    // The button is disabled, but let's try clicking anyway
    fireEvent.click(submitBtn);
    // It should still show the form, not submitting
    expect(screen.getByText('LOW')).toBeInTheDocument();
  });
});
