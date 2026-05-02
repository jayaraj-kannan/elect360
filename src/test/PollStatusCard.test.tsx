import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import * as React from 'react';
import PollStatusCard, { getBarColor, getTooltipLabel } from '@/components/dashboard/PollStatusCard';

vi.mock('react-chartjs-2', () => ({
  Bar: () => <div data-testid="mock-bar-chart" />,
}));

vi.mock('chart.js', () => ({
  Chart: { register: vi.fn() },
  CategoryScale: vi.fn(),
  LinearScale: vi.fn(),
  BarElement: vi.fn(),
  Title: vi.fn(),
  Tooltip: vi.fn(),
}));

vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  },
  AnimatePresence: ({ children }: any) => <>{children}</>,
}));

describe('PollStatusCard', () => {
  it('should render the live crowd header', () => {
    render(<PollStatusCard />);
    expect(screen.getByText('LIVE CROWD')).toBeInTheDocument();
    expect(screen.getByText(/Real-time status/i)).toBeInTheDocument();
  });

  it('should render the current state as MODERATE', () => {
    render(<PollStatusCard />);
    expect(screen.getByText('MODERATE')).toBeInTheDocument();
    expect(screen.getByText(/~15 MINS/i)).toBeInTheDocument();
  });

  it('should render the bar chart', () => {
    render(<PollStatusCard />);
    expect(screen.getByTestId('mock-bar-chart')).toBeInTheDocument();
  });

  it('should show the best time to vote', () => {
    render(<PollStatusCard />);
    expect(screen.getByText(/BEST TIME TO VOTE/i)).toBeInTheDocument();
    expect(screen.getByText(/2PM – 4PM/i)).toBeInTheDocument();
  });

  it('should show last updated info', () => {
    render(<PollStatusCard />);
    expect(screen.getByText(/Last updated/i)).toBeInTheDocument();
  });

  it('should open the crowd report modal when button is clicked', () => {
    render(<PollStatusCard />);
    const button = screen.getByText(/REPORT CROWD STATUS/i);
    fireEvent.click(button);
    expect(screen.getByText(/Report Crowd Level/i)).toBeInTheDocument();
    expect(screen.getByText('LOW')).toBeInTheDocument();
    expect(screen.getByText('MEDIUM')).toBeInTheDocument();
    expect(screen.getByText('HIGH')).toBeInTheDocument();
  });

  it('should close the modal', () => {
    render(<PollStatusCard />);
    fireEvent.click(screen.getByText(/REPORT CROWD STATUS/i));
    expect(screen.getByText(/Report Crowd Level/i)).toBeInTheDocument();

    // Click backdrop to close
    const backdrop = document.querySelector('[class*="bg-black/80"]');
    if (backdrop) fireEvent.click(backdrop);
  });

  it('should submit a crowd report from within PollStatusCard', async () => {
    vi.useFakeTimers();
    render(<PollStatusCard />);

    // Open modal
    fireEvent.click(screen.getByText(/REPORT CROWD STATUS/i));

    // Select a level
    fireEvent.click(screen.getByText('HIGH'));

    // Submit
    fireEvent.click(screen.getByText(/SUBMIT REPORT/i));

    // Wait for simulated write
    await React.act(async () => {
      vi.advanceTimersByTime(1500);
    });

    expect(screen.getByText(/Thank You, Citizen!/i)).toBeInTheDocument();

    // Auto-close
    await React.act(async () => {
      vi.advanceTimersByTime(2000);
    });

    vi.useRealTimers();
  });
  it('should return correct chart colors based on density', () => {
    expect(getBarColor({ raw: 80 })).toBe('#D2042D');
    expect(getBarColor({ raw: 50 })).toBe('#FFB800');
    expect(getBarColor({ raw: 30 })).toBe('#4ade80');
  });

  it('should return correct chart tooltips based on density', () => {
    expect(getTooltipLabel({ raw: 80 })).toBe('High');
    expect(getTooltipLabel({ raw: 50 })).toBe('Moderate');
    expect(getTooltipLabel({ raw: 30 })).toBe('Low');
  });
});
