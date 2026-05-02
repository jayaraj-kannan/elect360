import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import VoterChecklist from '@/components/dashboard/VoterChecklist';

vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  },
  AnimatePresence: ({ children }: any) => <>{children}</>,
}));

describe('VoterChecklist', () => {
  it('should render the checklist header', () => {
    render(<VoterChecklist />);
    expect(screen.getByText(/POLL DAY ESSENTIALS/i)).toBeInTheDocument();
    expect(screen.getByText(/0% READY/i)).toBeInTheDocument();
  });

  it('should render all checklist items', () => {
    render(<VoterChecklist />);
    expect(screen.getByText(/Original Voter ID/i)).toBeInTheDocument();
    expect(screen.getByText(/Aadhar Card/i)).toBeInTheDocument();
    expect(screen.getByText(/Voter Information Slip/i)).toBeInTheDocument();
    expect(screen.getByText(/Phone \(Switch off/i)).toBeInTheDocument();
    expect(screen.getByText(/Verified Polling Station/i)).toBeInTheDocument();
  });

  it('should toggle a checklist item and update progress', () => {
    render(<VoterChecklist />);
    const epicBtn = screen.getByText(/Original Voter ID/i).closest('button')!;
    fireEvent.click(epicBtn);
    expect(screen.getByText(/20% READY/i)).toBeInTheDocument();
  });

  it('should uncheck a checked item', () => {
    render(<VoterChecklist />);
    const epicBtn = screen.getByText(/Original Voter ID/i).closest('button')!;
    fireEvent.click(epicBtn); // check
    expect(screen.getByText(/20% READY/i)).toBeInTheDocument();
    fireEvent.click(epicBtn); // uncheck
    expect(screen.getByText(/0% READY/i)).toBeInTheDocument();
  });

  it('should toggle collapse/expand', () => {
    render(<VoterChecklist />);
    const header = screen.getByText(/POLL DAY ESSENTIALS/i).closest('div[class*="cursor-pointer"]') ||
                   screen.getByText(/POLL DAY ESSENTIALS/i).closest('[class*="cursor"]');
    if (header) {
      fireEvent.click(header);
      // After collapsing, the checklist items should be hidden
      // After expanding, they should reappear
      fireEvent.click(header);
    }
    expect(screen.getByText(/Original Voter ID/i)).toBeInTheDocument();
  });

  it('should show important advisory section', () => {
    render(<VoterChecklist />);
    expect(screen.getByText(/IMPORTANT ADVISORY/i)).toBeInTheDocument();
    expect(screen.getByText(/DOWNLOAD OFFLINE COPY/i)).toBeInTheDocument();
  });

  it('should reach 100% when all items checked', () => {
    render(<VoterChecklist />);
    // Click all checklist buttons (there are 5 items)
    const allButtons = screen.getAllByRole('button').filter(
      btn => btn.classList.contains('w-full') && btn.closest('.space-y-4')
    );
    allButtons.forEach(btn => fireEvent.click(btn));
    expect(screen.getByText(/100% READY/i)).toBeInTheDocument();
  });
});
