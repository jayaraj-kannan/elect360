import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
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
      div: ({ children, onClick, className, ...props }: any) => (
        <div onClick={onClick} className={className} data-testid="motion-div" {...props}>{children}</div>
      ),
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
  it('should render candidate with criminal cases and custom tags', async () => {
    const mockCandidates = [
      {
        id: '1',
        name: 'Bad Candidate',
        party: 'XYZ',
        wealth: '100 Cr',
        criminalCases: 5,
        tags: [],
        image: '/test.jpg'
      }
    ];
    vi.mocked(getCandidatesByConstituencyName).mockResolvedValueOnce(mockCandidates as any);

    render(<CandidateShowcase constituencyName="Mylapore" />);
    
    await waitFor(() => {
      expect(screen.getByText('Bad Candidate')).toBeInTheDocument();
      expect(screen.getByText('5 Filed')).toHaveClass('text-red-400');
      // Should show fallback tag
      expect(screen.getByText('Candidate')).toBeInTheDocument();
    });
  });

  it('should render initial letter fallback when candidate has no image', async () => {
    const mockCandidates = [
      {
        id: '1',
        name: 'No Photo Candidate',
        party: 'IND',
        wealth: '5 Cr',
        criminalCases: 0,
        image: '',
        tags: ['New']
      }
    ];
    vi.mocked(getCandidatesByConstituencyName).mockResolvedValueOnce(mockCandidates as any);

    render(<CandidateShowcase constituencyName="Mylapore" />);

    await waitFor(() => {
      expect(screen.getByText('No Photo Candidate')).toBeInTheDocument();
      // Should render the first letter 'N' as fallback
      expect(screen.getByText('N')).toBeInTheDocument();
    });
  });

  it('should open modal when candidate card is clicked', async () => {
    const mockCandidates = [
      {
        id: '1',
        name: 'Modal Candidate',
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
      expect(screen.getByText('Modal Candidate')).toBeInTheDocument();
    });

    const card = screen.getByText('Modal Candidate').closest('div.glass');
    if (card) fireEvent.click(card);

    // The CandidateModal text should now be visible
    await waitFor(() => {
      expect(screen.getAllByText('Modal Candidate').length).toBeGreaterThan(1); // One in card, one in modal
    });

    // Close the modal
    const buttons = screen.getAllByRole('button');
    // The close button is usually the second to last button (before 'Download Manifesto' button)
    fireEvent.click(buttons[buttons.length - 2]);

    await waitFor(() => {
      expect(screen.queryAllByText('Modal Candidate').length).toBe(1); // Only the card should remain
    });
  });

});
