import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import * as React from 'react';
import OnboardingLocator from '@/components/onboarding/OnboardingLocator';

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
    <div>
      <button onClick={() => onSelect({ id: 'w1', booth: { id: 'b1', name: 'Test' } })}>
        Select Ward
      </button>
    </div>
  )
}));

// Mock boothService
const mockSearchBooths = vi.fn();
vi.mock('@/lib/boothService', () => ({
  searchBooths: (...args: any[]) => mockSearchBooths(...args),
}));

describe('OnboardingLocator', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockSearchBooths.mockResolvedValue([
      {
        id: 'b1',
        name: 'Test Booth',
        address: '123 Test St',
        coords: { lat: 13.0, lng: 80.0 },
        wardId: 'w1',
        wardName: 'Test Ward',
        stateId: 'TN'
      }
    ]);

    const mockGeolocation = {
      getCurrentPosition: vi.fn(),
    };
    Object.defineProperty(global.navigator, 'geolocation', {
      value: mockGeolocation,
      configurable: true,
    });
  });

  afterEach(() => {
    Object.defineProperty(global.navigator, 'geolocation', {
      value: undefined,
      configurable: true,
    });
    vi.useRealTimers();
  });

  it('should render initial options', () => {
    render(<OnboardingLocator onComplete={vi.fn()} />);
    expect(screen.getByText(/Detect Location/i)).toBeInTheDocument();
    expect(screen.getByText(/Manual Selection/i)).toBeInTheDocument();
    expect(screen.getByText(/Privacy Protected/i)).toBeInTheDocument();
  });

  it('should handle GPS location success', async () => {
    const onComplete = vi.fn();
    const mockPos = { coords: { latitude: 13.0, longitude: 80.0 } };
    
    (global.navigator.geolocation.getCurrentPosition as any).mockImplementation((success: any) => {
      success(mockPos);
    });

    render(<OnboardingLocator onComplete={onComplete} />);
    fireEvent.click(screen.getByText(/Detect Location/i));

    // The component has a 1000ms setTimeout before calling onComplete
    await waitFor(() => {
      expect(onComplete).toHaveBeenCalled();
    }, { timeout: 2000 });
  });

  it('should handle GPS location error (permission denied)', async () => {
    (global.navigator.geolocation.getCurrentPosition as any).mockImplementation((_success: any, error: any) => {
      error({ code: 1 });
    });

    render(<OnboardingLocator onComplete={vi.fn()} />);
    fireEvent.click(screen.getByText(/Detect Location/i));

    await waitFor(() => {
      expect(screen.getByText(/Permission denied/i)).toBeInTheDocument();
    });
  });

  it('should handle GPS not supported', () => {
    Object.defineProperty(global.navigator, 'geolocation', {
      value: undefined,
      configurable: true,
    });
    
    render(<OnboardingLocator onComplete={vi.fn()} />);
    fireEvent.click(screen.getByText(/Detect Location/i));
    
    expect(screen.getByText(/GPS not supported/i)).toBeInTheDocument();
  });

  it('should switch to manual mode when clicked', () => {
    render(<OnboardingLocator onComplete={vi.fn()} />);
    fireEvent.click(screen.getByText(/Manual Selection/i));
    
    expect(screen.getByText(/Go Back/i)).toBeInTheDocument();
    expect(screen.getByText(/Select Ward/i)).toBeInTheDocument();
  });

  it('should go back from manual to options', () => {
    render(<OnboardingLocator onComplete={vi.fn()} />);
    fireEvent.click(screen.getByText(/Manual Selection/i));
    fireEvent.click(screen.getByText(/Go Back/i));
    expect(screen.getByText(/Detect Location/i)).toBeInTheDocument();
  });

  it('should call onComplete when a ward is selected manually', () => {
    const onComplete = vi.fn();
    render(<OnboardingLocator onComplete={onComplete} />);
    fireEvent.click(screen.getByText(/Manual Selection/i));
    fireEvent.click(screen.getByText(/Select Ward/i));
    expect(onComplete).toHaveBeenCalledWith({ id: 'w1', booth: { id: 'b1', name: 'Test' } });
  });

  it('should show locating state while GPS is working', () => {
    (global.navigator.geolocation.getCurrentPosition as any).mockImplementation(() => {});

    render(<OnboardingLocator onComplete={vi.fn()} />);
    fireEvent.click(screen.getByText(/Detect Location/i));

    expect(screen.getByText(/Synchronizing GPS/i)).toBeInTheDocument();
  });

  it('should handle no booths found scenario', async () => {
    mockSearchBooths.mockResolvedValueOnce([]);

    (global.navigator.geolocation.getCurrentPosition as any).mockImplementation((success: any) => {
      Promise.resolve().then(() => success({ coords: { latitude: 13.0, longitude: 80.0 } }));
    });

    render(<OnboardingLocator onComplete={vi.fn()} />);
    fireEvent.click(screen.getByText(/Detect Location/i));

    await waitFor(() => {
      expect(screen.getByText(/No booths found/i)).toBeInTheDocument();
    });
  });

  it('should handle boothService error', async () => {
    mockSearchBooths.mockRejectedValueOnce(new Error('Network error'));

    (global.navigator.geolocation.getCurrentPosition as any).mockImplementation((success: any) => {
      Promise.resolve().then(() => success({ coords: { latitude: 13.0, longitude: 80.0 } }));
    });

    render(<OnboardingLocator onComplete={vi.fn()} />);
    fireEvent.click(screen.getByText(/Detect Location/i));

    await waitFor(() => {
      expect(screen.getByText(/Failed to locate booth/i)).toBeInTheDocument();
    });
  });

  it('should find the nearest booth among multiple booths', async () => {
    // Return multiple booths to trigger distance comparison
    mockSearchBooths.mockResolvedValueOnce([
      {
        id: 'b1',
        name: 'Far Booth',
        coords: { lat: 14.0, lng: 81.0 }, // Far away
        wardId: 'w1',
        wardName: 'Ward 1',
        stateId: 'TN'
      },
      {
        id: 'b2',
        name: 'Near Booth',
        coords: { lat: 13.001, lng: 80.001 }, // Very close
        wardId: 'w2',
        wardName: 'Ward 2',
        stateId: 'TN'
      },
      {
        id: 'b3',
        name: 'Another Far Booth',
        coords: { lat: 15.0, lng: 82.0 }, // Far away to hit dist < minDistance = false
        wardId: 'w3',
        wardName: 'Ward 3',
        stateId: 'TN'
      }
    ]);

    const onComplete = vi.fn();
    (global.navigator.geolocation.getCurrentPosition as any).mockImplementation((success: any) => {
      // User is at 13.0, 80.0
      success({ coords: { latitude: 13.0, longitude: 80.0 } });
    });

    render(<OnboardingLocator onComplete={onComplete} />);
    fireEvent.click(screen.getByText(/Detect Location/i));

    await waitFor(() => {
      expect(onComplete).toHaveBeenCalledWith(expect.objectContaining({
        id: 'w2',
        name: 'Ward 2',
        booth: expect.objectContaining({
          id: 'b2',
          name: 'Near Booth'
        })
      }));
    }, { timeout: 2000 });
  });
});
