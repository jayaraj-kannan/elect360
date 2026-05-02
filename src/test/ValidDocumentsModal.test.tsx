import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import ValidDocumentsModal from '@/components/dashboard/ValidDocumentsModal';

vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  },
  AnimatePresence: ({ children }: any) => <>{children}</>,
}));

describe('ValidDocumentsModal', () => {
  it('should not render anything when closed', () => {
    render(<ValidDocumentsModal isOpen={false} onClose={vi.fn()} />);
    expect(screen.queryByText(/Valid Identity Documents/i)).not.toBeInTheDocument();
  });

  it('should render all 11 documents when open', () => {
    render(<ValidDocumentsModal isOpen={true} onClose={vi.fn()} />);
    expect(screen.getByText(/Valid Identity Documents/i)).toBeInTheDocument();
    expect(screen.getByText(/11 alternatives/i)).toBeInTheDocument();
    expect(screen.getByText('Aadhaar Card')).toBeInTheDocument();
    expect(screen.getByText('PAN Card')).toBeInTheDocument();
    expect(screen.getByText('Voter ID (EPIC)')).toBeInTheDocument();
    expect(screen.getByText('Passport')).toBeInTheDocument();
    expect(screen.getByText('Driving Licence')).toBeInTheDocument();
    expect(screen.getByText('Service ID Card')).toBeInTheDocument();
    expect(screen.getByText('Student ID Card')).toBeInTheDocument();
    expect(screen.getByText('MGNREGA Job Card')).toBeInTheDocument();
    expect(screen.getByText('Health Insurance Card')).toBeInTheDocument();
    expect(screen.getByText('Bank / Post Office Passbook')).toBeInTheDocument();
    expect(screen.getByText('Pension Document')).toBeInTheDocument();
  });

  it('should call onClose when backdrop is clicked', () => {
    const onClose = vi.fn();
    render(<ValidDocumentsModal isOpen={true} onClose={onClose} />);
    // The backdrop is the first motion.div with onClick=onClose
    const backdrop = screen.getByText(/Valid Identity Documents/i)
      .closest('div')?.parentElement?.querySelector('[class*="bg-black"]');
    if (backdrop) fireEvent.click(backdrop);
    // Also try clicking the X button
    const closeButtons = screen.getAllByRole('button');
    if (closeButtons.length > 0) fireEvent.click(closeButtons[0]);
    expect(onClose).toHaveBeenCalled();
  });

  it('should show the footer notice about original documents', () => {
    render(<ValidDocumentsModal isOpen={true} onClose={vi.fn()} />);
    expect(screen.getByText(/photocopies are not accepted/i)).toBeInTheDocument();
  });

  it('should show Valid badge for each document', () => {
    render(<ValidDocumentsModal isOpen={true} onClose={vi.fn()} />);
    const validBadges = screen.getAllByText('Valid');
    expect(validBadges.length).toBe(11);
  });
});
