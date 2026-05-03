import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import * as React from 'react';
import Home from '@/app/page';

// Mock all child components
vi.mock('@/components/dashboard/CountdownHero', () => ({
  default: ({ onGetReady, onSeeCandidates }: any) => (
    <div data-testid="countdown-hero">
      <button onClick={onGetReady}>GET READY</button>
      <button onClick={onSeeCandidates}>SEE CANDIDATES</button>
    </div>
  ),
}));

vi.mock('@/components/dashboard/PollLocationCard', () => ({
  default: () => <div data-testid="poll-location-card">PollLocationCard</div>,
}));

vi.mock('@/components/dashboard/CandidateExplorer', () => ({
  default: () => <div data-testid="candidate-explorer">CandidateExplorer</div>,
}));

vi.mock('@/components/dashboard/ValidDocumentsModal', () => ({
  default: ({ isOpen, onClose }: any) => (
    isOpen ? <div data-testid="docs-modal"><button onClick={onClose}>Close Modal</button>Valid Documents</div> : null
  ),
}));

vi.mock('@/components/dashboard/VotingProcess', () => ({
  default: () => <div data-testid="voting-process">VotingProcess</div>,
}));

vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    button: ({ children, ...props }: any) => <button {...props}>{children}</button>,
  },
  AnimatePresence: ({ children }: any) => <>{children}</>,
}));

describe('Home Page', () => {
  it('should show loading spinner initially then the home view', async () => {
    vi.useFakeTimers();
    render(<Home />);

    // Advance past the 300ms loading timer
    await React.act(async () => {
      vi.advanceTimersByTime(300);
    });

    expect(screen.getByTestId('countdown-hero')).toBeInTheDocument();
    expect(screen.getByText(/Find Your Booth/i)).toBeInTheDocument();
    vi.useRealTimers();
  });

  it('should navigate to find-booth view', async () => {
    vi.useFakeTimers();
    render(<Home />);
    await React.act(async () => { vi.advanceTimersByTime(300); });

    fireEvent.click(screen.getByText('GET READY'));

    expect(screen.getByTestId('poll-location-card')).toBeInTheDocument();
    expect(screen.getByText(/Back to Home/i)).toBeInTheDocument();
    vi.useRealTimers();
  });

  it('should navigate back from find-booth to home', async () => {
    vi.useFakeTimers();
    render(<Home />);
    await React.act(async () => { vi.advanceTimersByTime(300); });

    fireEvent.click(screen.getByText('GET READY'));
    expect(screen.getByTestId('poll-location-card')).toBeInTheDocument();

    fireEvent.click(screen.getByText(/Back to Home/i));
    expect(screen.getByTestId('countdown-hero')).toBeInTheDocument();
    vi.useRealTimers();
  });

  it('should navigate to candidates view', async () => {
    vi.useFakeTimers();
    render(<Home />);
    await React.act(async () => { vi.advanceTimersByTime(300); });

    fireEvent.click(screen.getByText('SEE CANDIDATES'));
    expect(screen.getByTestId('candidate-explorer')).toBeInTheDocument();
    vi.useRealTimers();
  });

  it('should navigate back from candidates to home', async () => {
    vi.useFakeTimers();
    render(<Home />);
    await React.act(async () => { vi.advanceTimersByTime(300); });

    fireEvent.click(screen.getByText('SEE CANDIDATES'));
    fireEvent.click(screen.getByText(/Back to Home/i));
    expect(screen.getByTestId('countdown-hero')).toBeInTheDocument();
    vi.useRealTimers();
  });

  it('should open the valid documents modal', async () => {
    vi.useFakeTimers();
    render(<Home />);
    await React.act(async () => { vi.advanceTimersByTime(300); });

    fireEvent.click(screen.getByText(/SEE VALID DOCUMENTS/i));
    expect(screen.getByTestId('docs-modal')).toBeInTheDocument();
    vi.useRealTimers();
  });

  it('should close the valid documents modal', async () => {
    vi.useFakeTimers();
    render(<Home />);
    await React.act(async () => { vi.advanceTimersByTime(300); });

    fireEvent.click(screen.getByText(/SEE VALID DOCUMENTS/i));
    expect(screen.getByTestId('docs-modal')).toBeInTheDocument();

    fireEvent.click(screen.getByText('Close Modal'));
    expect(screen.queryByTestId('docs-modal')).not.toBeInTheDocument();
    vi.useRealTimers();
  });

  it('should show voter rights banner', async () => {
    vi.useFakeTimers();
    render(<Home />);
    await React.act(async () => { vi.advanceTimersByTime(300); });

    expect(screen.getByText(/Lost your Voter ID/i)).toBeInTheDocument();
    expect(screen.getByText(/11 alternative/i)).toBeInTheDocument();
    vi.useRealTimers();
  });

  it('should navigate to find-booth from quick action card', async () => {
    vi.useFakeTimers();
    render(<Home />);
    await React.act(async () => { vi.advanceTimersByTime(300); });

    // Click the "Find Your Booth" quick action button
    const boothCard = screen.getByText(/Find Your Booth/i).closest('button');
    if (boothCard) fireEvent.click(boothCard);
    expect(screen.getByTestId('poll-location-card')).toBeInTheDocument();
    vi.useRealTimers();
  });

  it('should navigate to candidates from quick action card', async () => {
    vi.useFakeTimers();
    render(<Home />);
    await React.act(async () => { vi.advanceTimersByTime(300); });

    // Click the "See Candidates" quick action card (which has an h3 containing 'See Candidates')
    const candidatesHeading = screen.getByText('See Candidates', { selector: 'h3' });
    const candidatesCard = candidatesHeading.closest('button');
    if (candidatesCard) fireEvent.click(candidatesCard);
    
    expect(screen.getByTestId('candidate-explorer')).toBeInTheDocument();
    vi.useRealTimers();
  });

  it('should navigate to voting-process from quick action card', async () => {
    vi.useFakeTimers();
    render(<Home />);
    await React.act(async () => { vi.advanceTimersByTime(300); });

    const votingHeading = screen.getByText('How to Vote', { selector: 'h3' });
    const votingCard = votingHeading.closest('button');
    if (votingCard) fireEvent.click(votingCard);
    
    expect(screen.getByTestId('voting-process')).toBeInTheDocument();
    vi.useRealTimers();
  });

  it('should navigate back from voting-process to home', async () => {
    vi.useFakeTimers();
    render(<Home />);
    await React.act(async () => { vi.advanceTimersByTime(300); });

    const votingHeading = screen.getByText('How to Vote', { selector: 'h3' });
    const votingCard = votingHeading.closest('button');
    if (votingCard) fireEvent.click(votingCard);
    
    expect(screen.getByTestId('voting-process')).toBeInTheDocument();

    fireEvent.click(screen.getByText(/Back to Home/i));
    expect(screen.getByTestId('countdown-hero')).toBeInTheDocument();
    vi.useRealTimers();
  });
});
