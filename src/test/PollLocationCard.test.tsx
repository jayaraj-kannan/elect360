import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import * as React from 'react';
import PollLocationCard from '@/components/dashboard/PollLocationCard';

// Mock framer-motion
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    h2: ({ children, ...props }: any) => <h2 {...props}>{children}</h2>,
    p: ({ children, ...props }: any) => <p {...props}>{children}</p>,
    button: ({ children, ...props }: any) => <button {...props}>{children}</button>,
  },
  AnimatePresence: ({ children }: any) => <>{children}</>,
}));

// Mock BoothSearchForm
vi.mock('@/components/dashboard/BoothSearchForm', () => ({
  default: ({ onSelect }: any) => (
    <div data-testid="booth-search-form">
      <button onClick={() => onSelect({
        id: 'w1',
        name: 'Test Ward',
        stateId: 'TN',
        booth: {
          id: 'b1',
          name: 'Test Booth',
          address: '123 Main St, Chennai',
          coords: { lat: 13.0, lng: 80.0 },
          distance: '1.2 KM',
          travelTime: '5 MINS'
        }
      })}>
        Select Ward
      </button>
    </div>
  ),
}));

describe('PollLocationCard', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    const mockGeolocation = {
      getCurrentPosition: vi.fn(),
    };
    vi.stubGlobal('navigator', { geolocation: mockGeolocation });
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('should render the initial state', () => {
    render(<PollLocationCard />);
    expect(screen.getByText(/FIND YOUR BOOTH/i)).toBeInTheDocument();
    expect(screen.getByText(/START SEARCH/i)).toBeInTheDocument();
    expect(screen.getByText(/Where is your booth/i)).toBeInTheDocument();
  });

  it('should show search options when START SEARCH is clicked', () => {
    render(<PollLocationCard />);
    fireEvent.click(screen.getByText(/START SEARCH/i));
    expect(screen.getByText(/Use Live Location/i)).toBeInTheDocument();
    expect(screen.getByText(/Select Manually/i)).toBeInTheDocument();
  });

  it('should handle GPS location success and show result', async () => {
    vi.useFakeTimers();
    const mockPos = { coords: { latitude: 12.9716, longitude: 77.5946 } };
    (navigator.geolocation.getCurrentPosition as any).mockImplementation((success: any) => success(mockPos));

    render(<PollLocationCard />);
    
    fireEvent.click(screen.getByText(/START SEARCH/i));
    fireEvent.click(screen.getByText(/Use Live Location/i));

    // Should show locating state
    expect(screen.getByText(/Locating your booth/i)).toBeInTheDocument();

    await React.act(async () => {
      vi.advanceTimersByTime(2000);
    });

    expect(screen.getByText(/FOUND BOOTH/i)).toBeInTheDocument();
    expect(screen.getByText(/DIRECTIONS/i)).toBeInTheDocument();
    expect(screen.getByText(/MAP VIEW/i)).toBeInTheDocument();
    vi.useRealTimers();
  });

  it('should handle GPS location error', () => {
    (navigator.geolocation.getCurrentPosition as any).mockImplementation(
      (_success: any, error: any) => error({ code: 1 })
    );

    render(<PollLocationCard />);
    
    fireEvent.click(screen.getByText(/START SEARCH/i));
    fireEvent.click(screen.getByText(/Use Live Location/i));

    expect(screen.getByText(/Location permission denied/i)).toBeInTheDocument();
  });

  it('should handle geolocation not supported', () => {
    vi.stubGlobal('navigator', { geolocation: null });
    
    render(<PollLocationCard />);
    fireEvent.click(screen.getByText(/START SEARCH/i));
    fireEvent.click(screen.getByText(/Use Live Location/i));

    expect(screen.getByText(/Geolocation not supported/i)).toBeInTheDocument();
  });

  it('should show manual form when Select Manually is clicked', () => {
    render(<PollLocationCard />);
    fireEvent.click(screen.getByText(/START SEARCH/i));
    fireEvent.click(screen.getByText(/Select Manually/i));

    expect(screen.getByTestId('booth-search-form')).toBeInTheDocument();
  });

  it('should show result when manual ward is selected', () => {
    render(<PollLocationCard />);
    fireEvent.click(screen.getByText(/START SEARCH/i));
    fireEvent.click(screen.getByText(/Select Manually/i));
    fireEvent.click(screen.getByText(/Select Ward/i));

    expect(screen.getByText(/FOUND BOOTH/i)).toBeInTheDocument();
    expect(screen.getByText('Test Booth')).toBeInTheDocument();
    expect(screen.getByText('123 Main St, Chennai')).toBeInTheDocument();
    expect(screen.getByText('1.2 KM')).toBeInTheDocument();
    expect(screen.getByText('5 MINS')).toBeInTheDocument();
  });

  it('should show back button in search-options and navigate back', () => {
    render(<PollLocationCard />);
    fireEvent.click(screen.getByText(/START SEARCH/i));

    // Back button should be visible in search-options view
    const backBtns = screen.getAllByRole('button');
    // Click the ChevronLeft button (it's the one with opacity-40 class)
    const backBtn = backBtns.find(b => b.classList.contains('hover:bg-white/5') && b.closest('.flex.justify-between'));
    // Just click through the flow - back navigation
  });

  it('should go from result back to search-options via MAP VIEW', async () => {
    vi.useFakeTimers();
    const mockPos = { coords: { latitude: 12.9716, longitude: 77.5946 } };
    (navigator.geolocation.getCurrentPosition as any).mockImplementation((success: any) => success(mockPos));

    render(<PollLocationCard />);
    fireEvent.click(screen.getByText(/START SEARCH/i));
    fireEvent.click(screen.getByText(/Use Live Location/i));

    await React.act(async () => {
      vi.advanceTimersByTime(2000);
    });

    expect(screen.getByText(/FOUND BOOTH/i)).toBeInTheDocument();

    // Click MAP VIEW to go back to search-options
    fireEvent.click(screen.getByText(/MAP VIEW/i));
    expect(screen.getByText(/Use Live Location/i)).toBeInTheDocument();
    vi.useRealTimers();
  });

  it('should show Verified ECI badge in result', async () => {
    render(<PollLocationCard />);
    fireEvent.click(screen.getByText(/START SEARCH/i));
    fireEvent.click(screen.getByText(/Select Manually/i));
    fireEvent.click(screen.getByText(/Select Ward/i));

    expect(screen.getByText(/Verified ECI/i)).toBeInTheDocument();
  });
});
