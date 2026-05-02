import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import * as React from 'react';
import CountdownHero from '@/components/dashboard/CountdownHero';

// Mock framer-motion
vi.mock('framer-motion', async () => {
  const actual = await vi.importActual('framer-motion') as any;
  return {
    ...actual,
    motion: {
      ...actual.motion,
      div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
      section: ({ children, ...props }: any) => <section {...props}>{children}</section>,
    },
    AnimatePresence: ({ children }: any) => <>{children}</>,
  };
});

describe('CountdownHero', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  const mockProps = {
    stateName: 'Tamil Nadu',
    onGetReady: vi.fn(),
    onSeeCandidates: vi.fn(),
  };

  it('should render the state name', () => {
    render(<CountdownHero {...mockProps} />);
    expect(screen.getByTestId('state-name')).toHaveTextContent('Tamil Nadu');
  });

  it('should render the countdown labels', () => {
    render(<CountdownHero {...mockProps} />);
    expect(screen.getByText('Days')).toBeInTheDocument();
    expect(screen.getByText('Hrs')).toBeInTheDocument();
    expect(screen.getByText('Min')).toBeInTheDocument();
    expect(screen.getByText('Sec')).toBeInTheDocument();
  });

  it('should call onGetReady when the GET READY button is clicked', () => {
    render(<CountdownHero {...mockProps} />);
    const button = screen.getByText(/GET READY/i);
    fireEvent.click(button);
    expect(mockProps.onGetReady).toHaveBeenCalled();
  });

  it('should call onSeeCandidates when the SEE CANDIDATES button is clicked', () => {
    render(<CountdownHero {...mockProps} />);
    const button = screen.getByText(/SEE CANDIDATES/i);
    fireEvent.click(button);
    expect(mockProps.onSeeCandidates).toHaveBeenCalled();
  });

  it('should update the countdown timer every second', async () => {
    render(<CountdownHero {...mockProps} />);
    
    // Initial value for seconds is 54
    expect(screen.getByText('54')).toBeInTheDocument();
    
    // Advance time by 1 second
    await React.act(async () => {
      vi.advanceTimersByTime(1000);
    });
    
    expect(screen.getByText('53')).toBeInTheDocument();
  });

  it('should decrement minutes when seconds reach zero', async () => {
    render(<CountdownHero {...mockProps} />);
    
    // Advance by 55 seconds (Initial 54s -> 0s -> 59s and 1m decrement)
    // Initial: 2d 14h 22m 54s
    await React.act(async () => {
      vi.advanceTimersByTime(55000);
    });
    
    // Should be 2d 14h 21m 59s
    expect(screen.getByText('21')).toBeInTheDocument();
    expect(screen.getByText('59')).toBeInTheDocument();
  });

  it('should decrement hours when minutes reach zero', async () => {
    render(<CountdownHero {...mockProps} />);
    
    // Initial: 2d 14h 22m 54s
    // Need to advance by 22m 55s to roll over the hour = 1375 seconds
    await React.act(async () => {
      vi.advanceTimersByTime(1375000);
    });
    
    // Should be 2d 13h 59m 59s
    expect(screen.getByText('13')).toBeInTheDocument();
    // Minutes and seconds should also be 59
    expect(screen.getAllByText('59').length).toBeGreaterThanOrEqual(2);
  });
});
