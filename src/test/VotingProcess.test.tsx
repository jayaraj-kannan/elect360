import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import * as React from 'react';
import VotingProcess from '@/components/dashboard/VotingProcess';

vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  },
  AnimatePresence: ({ children }: any) => <>{children}</>,
}));

describe('VotingProcess', () => {
  it('should render the first step correctly', () => {
    render(<VotingProcess />);
    expect(screen.getByText(/The Voting Process/i)).toBeInTheDocument();
    expect(screen.getByText('Identity Verification')).toBeInTheDocument();
  });

  it('should navigate to the next step and previous step', () => {
    render(<VotingProcess />);
    
    // Initial step is 1
    expect(screen.getByText('Identity Verification')).toBeInTheDocument();
    
    // Click Next Step
    const nextBtn = screen.getByRole('button', { name: /Next Step/i });
    fireEvent.click(nextBtn);
    
    // Should be on Step 2
    expect(screen.getByText('Sign the Register')).toBeInTheDocument();
    
    // Click Previous Step
    const buttons = screen.getAllByRole('button');
    // The previous button is the one before "Next Step"
    const prevBtn = buttons[buttons.length - 2];
    fireEvent.click(prevBtn);
    
    // Should be back on Step 1
    expect(screen.getByText('Identity Verification')).toBeInTheDocument();
  });

  it('should not navigate past the last step', () => {
    render(<VotingProcess />);
    
    // Click next 6 times to reach the 7th step
    for (let i = 0; i < 6; i++) {
      const nextBtn = screen.getByRole('button', { name: /Next Step/i });
      fireEvent.click(nextBtn);
    }
    
    // Should be on Step 7
    expect(screen.getByText('Exit Booth')).toBeInTheDocument();
    
    // Button should change to "Done"
    const doneBtn = screen.getByRole('button', { name: /Done/i });
    expect(doneBtn).toBeDisabled();
    
    // Clicking done shouldn't go further
    fireEvent.click(doneBtn);
    expect(screen.getByText('Exit Booth')).toBeInTheDocument();
  });

  it('should navigate directly to a step when clicking the progress dot', () => {
    render(<VotingProcess />);
    
    // Click the 5th step dot
    const step5Dot = screen.getByText('5');
    fireEvent.click(step5Dot);
    
    expect(screen.getByText('Cast Your Vote')).toBeInTheDocument();
  });

  it('should prevent prev navigation on the first step', () => {
    render(<VotingProcess />);
    
    const buttons = screen.getAllByRole('button');
    const prevBtn = buttons[buttons.length - 2];
    
    expect(prevBtn).toBeDisabled();
    fireEvent.click(prevBtn);
    
    expect(screen.getByText('Identity Verification')).toBeInTheDocument();
  });

  it('should not throw if nextStep is called on the last step', () => {
    // This is to hit the branch coverage for currentStep < steps.length - 1
    // Since the button is disabled, we'll just check that clicking it at the end does nothing
    render(<VotingProcess />);
    
    // Go to end
    for (let i = 0; i < 6; i++) {
      fireEvent.click(screen.getByRole('button', { name: /Next Step/i }));
    }
    
    const doneBtn = screen.getByRole('button', { name: /Done/i });
    expect(doneBtn).toBeDisabled();
    
    // Try to trigger click even if disabled (to hit function boundary)
    fireEvent.click(doneBtn);
    
    expect(screen.getByText('Exit Booth')).toBeInTheDocument();
  });
});
