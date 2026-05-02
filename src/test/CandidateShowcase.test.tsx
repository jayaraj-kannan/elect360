import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import CandidateShowcase from '@/components/dashboard/CandidateShowcase';
import { getCandidatesByConstituencyName } from '@/lib/candidateService';

// Mock candidateService
vi.mock('@/lib/candidateService', () => ({
  getCandidatesByConstituencyName: vi.fn(),
}));

// Mock framer-motion
vi.mock('framer-motion', async () => {
  const actual = await vi.importActual('framer-motion') as any;
  return {
    ...actual,
    motion: {
      ...actual.motion,
      div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    },
    AnimatePresence: ({ children }: any) => <>{children}</>,
  };
});

describe('CandidateShowcase', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return null if no constituencyName is provided', () => {
    const { container } = render(<CandidateShowcase />);
    expect(container.firstChild).toBeNull();
  });

  it('should render loading state initially', async () => {
    vi.mocked(getCandidatesByConstituencyName).mockReturnValue(new Promise(() => {}));
    render(<CandidateShowcase constituencyName="Mylapore" />);
    expect(screen.getByText(/Fetching candidate profiles/i)).toBeInTheDocument();
  });

  it('should render candidate cards when data is loaded', async () => {
    const mockCandidates = [
      {
        id: '1',
        name: 'John Doe',
        party: 'Party A',
        wealth: '10 Cr',
        criminalCases: 0,
        image: '/img1.jpg',
        tags: ['Experienced']
      }
    ];
    vi.mocked(getCandidatesByConstituencyName).mockResolvedValue(mockCandidates as any);
    
    render(<CandidateShowcase constituencyName="Mylapore" />);
    
    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument();
      expect(screen.getByText('Party A')).toBeInTheDocument();
      expect(screen.getByText('10 Cr')).toBeInTheDocument();
    });
  });

  it('should render empty state when no candidates are found', async () => {
    vi.mocked(getCandidatesByConstituencyName).mockResolvedValue([]);
    
    render(<CandidateShowcase constituencyName="Mylapore" />);
    
    await waitFor(() => {
      expect(screen.getByText(/No candidate data found/i)).toBeInTheDocument();
    });
  });

  it('should handle service error gracefully', async () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    vi.mocked(getCandidatesByConstituencyName).mockRejectedValue(new Error('Fetch failed'));
    
    render(<CandidateShowcase constituencyName="Mylapore" />);
    
    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith("Error loading candidates", expect.any(Error));
    });
    
    consoleSpy.mockRestore();
  });
});
