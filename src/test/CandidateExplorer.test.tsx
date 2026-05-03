import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import * as React from 'react';
import CandidateExplorer from '@/components/dashboard/CandidateExplorer';

vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    button: ({ children, ...props }: any) => <button {...props}>{children}</button>,
  },
  AnimatePresence: ({ children }: any) => <>{children}</>,
}));

const mockDistricts = [
  { id: 'chennai', name: 'Chennai' },
  { id: 'madurai', name: 'Madurai' },
];

const mockConstituencies = [
  { id: 'mylapore', name: 'Mylapore' },
  { id: 't-nagar', name: 'T. Nagar' },
];

const mockCandidates = [
  {
    id: 'c1',
    name: 'Test Candidate',
    party: 'DMK',
    image: '/test.jpg',
    tags: ['Incumbent'],
    wealth: '₹1.2 Cr',
    education: 'Graduate',
    criminalCases: 0,
  },
  {
    id: 'c2',
    name: 'Another Candidate',
    party: 'ADMK',
    image: '/test2.jpg',
    tags: ['New'],
    wealth: '₹50 L',
    education: 'Post Graduate',
    criminalCases: 2,
  },
  {
    id: 'c3',
    name: 'No Image Candidate',
    party: 'IND',
    image: '', // Missing image to cover line 211
    tags: [],
    wealth: '₹1 L',
    education: '10th Pass',
    criminalCases: 0,
  },
];

vi.mock('@/lib/boothService', () => ({
  getDistrictsByState: vi.fn(() => Promise.resolve(mockDistricts)),
  getConstituenciesByDistrict: vi.fn(() => Promise.resolve(mockConstituencies)),
}));

vi.mock('@/lib/candidateService', () => ({
  getCandidatesByConstituencyName: vi.fn(() => Promise.resolve(mockCandidates)),
}));

describe('CandidateExplorer', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render the header and district dropdown', async () => {
    render(<CandidateExplorer />);
    expect(screen.getByText(/Candidate Explorer/i)).toBeInTheDocument();
    expect(screen.getByText(/Know Your/i)).toBeInTheDocument();

    // Wait for districts to load
    await waitFor(() => {
      expect(screen.getByText('Chennai')).toBeInTheDocument();
    });
  });

  it('should load constituencies when a district is selected', async () => {
    render(<CandidateExplorer />);

    await waitFor(() => {
      expect(screen.getByText('Chennai')).toBeInTheDocument();
    });

    const districtSelect = screen.getByLabelText(/District/i) as HTMLSelectElement;
    fireEvent.change(districtSelect, { target: { value: 'chennai' } });

    await waitFor(() => {
      expect(screen.getByText('Mylapore')).toBeInTheDocument();
    });
  });

  it('should load candidates when a constituency is selected', async () => {
    render(<CandidateExplorer />);

    await waitFor(() => {
      expect(screen.getByText('Chennai')).toBeInTheDocument();
    });

    const districtSelect = screen.getByLabelText(/District/i) as HTMLSelectElement;
    fireEvent.change(districtSelect, { target: { value: 'chennai' } });

    await waitFor(() => {
      expect(screen.getByText('Mylapore')).toBeInTheDocument();
    });

    const constSelect = screen.getByLabelText(/Constituency/i) as HTMLSelectElement;
    fireEvent.change(constSelect, { target: { value: 'mylapore' } });

    await waitFor(() => {
      expect(screen.getByText('Test Candidate')).toBeInTheDocument();
      expect(screen.getByText('Another Candidate')).toBeInTheDocument();
    });
  });

  it('should show criminal cases in red for candidates with cases', async () => {
    render(<CandidateExplorer />);

    await waitFor(() => expect(screen.getByText('Chennai')).toBeInTheDocument());

    fireEvent.change(screen.getByLabelText(/District/i), { target: { value: 'chennai' } });
    await waitFor(() => expect(screen.getByText('Mylapore')).toBeInTheDocument());

    fireEvent.change(screen.getByLabelText(/Constituency/i), { target: { value: 'mylapore' } });
    await waitFor(() => {
      expect(screen.getAllByText('None').length).toBeGreaterThan(0);
      expect(screen.getByText('2 Filed')).toBeInTheDocument();
    });
  });

  it('should clear candidates when district changes', async () => {
    render(<CandidateExplorer />);

    await waitFor(() => expect(screen.getByText('Chennai')).toBeInTheDocument());

    const districtSelect = screen.getByLabelText(/District/i);
    fireEvent.change(districtSelect, { target: { value: 'chennai' } });
    await waitFor(() => expect(screen.getByText('Mylapore')).toBeInTheDocument());

    fireEvent.change(screen.getByLabelText(/Constituency/i), { target: { value: 'mylapore' } });
    await waitFor(() => expect(screen.getByText('Test Candidate')).toBeInTheDocument());

    // Change district back to empty
    fireEvent.change(districtSelect, { target: { value: '' } });
    await waitFor(() => {
      expect(screen.queryByText('Test Candidate')).not.toBeInTheDocument();
    });
  });

  it('should handle unknown constituency selection gracefully', async () => {
    render(<CandidateExplorer />);
    
    await waitFor(() => expect(screen.getByText('Chennai')).toBeInTheDocument());

    fireEvent.change(screen.getByLabelText(/District/i), { target: { value: 'chennai' } });
    await waitFor(() => expect(screen.getByText('Mylapore')).toBeInTheDocument());

    // Select an unknown constituency to cover found?.name || ''
    fireEvent.change(screen.getByLabelText(/Constituency/i), { target: { value: 'unknown-id' } });
    
    // Test Candidate should not be there anymore
    await waitFor(() => {
      expect(screen.queryByText('Test Candidate')).not.toBeInTheDocument();
    });
  });

  it('should show "No candidate data found" for empty results', async () => {
    const { getCandidatesByConstituencyName } = await import('@/lib/candidateService');
    (getCandidatesByConstituencyName as any).mockResolvedValueOnce([]);

    render(<CandidateExplorer />);

    await waitFor(() => expect(screen.getByText('Chennai')).toBeInTheDocument());

    fireEvent.change(screen.getByLabelText(/District/i), { target: { value: 'chennai' } });
    await waitFor(() => expect(screen.getByText('Mylapore')).toBeInTheDocument());

    fireEvent.change(screen.getByLabelText(/Constituency/i), { target: { value: 'mylapore' } });
    await waitFor(() => {
      expect(screen.getByText(/No candidate data found/i)).toBeInTheDocument();
    });
  });
  it('should handle service failures gracefully', async () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    const { getDistrictsByState } = await import('@/lib/boothService');
    (getDistrictsByState as any).mockRejectedValueOnce(new Error('Network error'));

    render(<CandidateExplorer />);
    
    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith('Failed to load districts', expect.any(Error));
    });
    consoleSpy.mockRestore();
  });

  it('should handle constituency loading error gracefully', async () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    const { getConstituenciesByDistrict } = await import('@/lib/boothService');
    (getConstituenciesByDistrict as any).mockRejectedValueOnce(new Error('Constituency error'));

    render(<CandidateExplorer />);

    await waitFor(() => expect(screen.getByText('Chennai')).toBeInTheDocument());

    fireEvent.change(screen.getByLabelText(/District/i), { target: { value: 'chennai' } });

    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith('Failed to load constituencies', expect.any(Error));
    });
    consoleSpy.mockRestore();
  });

  it('should handle candidate loading error gracefully', async () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    const { getCandidatesByConstituencyName } = await import('@/lib/candidateService');
    (getCandidatesByConstituencyName as any).mockRejectedValueOnce(new Error('Candidate error'));

    render(<CandidateExplorer />);

    await waitFor(() => expect(screen.getByText('Chennai')).toBeInTheDocument());
    fireEvent.change(screen.getByLabelText(/District/i), { target: { value: 'chennai' } });
    await waitFor(() => expect(screen.getByText('Mylapore')).toBeInTheDocument());
    fireEvent.change(screen.getByLabelText(/Constituency/i), { target: { value: 'mylapore' } });

    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith('Failed to load candidates', expect.any(Error));
    });
    consoleSpy.mockRestore();
  });

  it('should open modal when candidate card is clicked', async () => {
    render(<CandidateExplorer />);

    await waitFor(() => expect(screen.getByText('Chennai')).toBeInTheDocument());
    fireEvent.change(screen.getByLabelText(/District/i), { target: { value: 'chennai' } });
    await waitFor(() => expect(screen.getByText('Mylapore')).toBeInTheDocument());
    fireEvent.change(screen.getByLabelText(/Constituency/i), { target: { value: 'mylapore' } });

    await waitFor(() => {
      expect(screen.getByText('Test Candidate')).toBeInTheDocument();
    });

    const card = screen.getByText('Test Candidate').closest('div.glass');
    if (card) fireEvent.click(card);

    // Modal text should be visible along with the card text (so length > 1)
    await waitFor(() => {
      expect(screen.getAllByText('Test Candidate').length).toBeGreaterThan(1);
    });

    // Close the modal
    // In our test environment, the CandidateModal's motion backdrop is rendered as a div with data-testid="motion-div" (if we mocked it, but wait CandidateExplorer has its own mock)
    // Actually CandidateExplorer's framer motion mock is different.
    // Let's just find the close button. It's the first button in the document likely, or we can look for the button containing the X icon or we can use the closest button to the name.
    // However CandidateExplorer mock has `<button {...props}>{children}</button>`. So we can use screen.getAllByRole('button')
    // and click the first one assuming it's the close button.
    const buttons = screen.getAllByRole('button');
    // Assuming the modal close button is rendered when selectedCandidate is true
    // the last couple of buttons should be close and download manifesto.
    fireEvent.click(buttons[buttons.length - 2]); // Usually the close button is before the manifesto button. Or just loop through them. Wait, if it is closed, length becomes 1.

    await waitFor(() => {
      expect(screen.queryAllByText('Test Candidate').length).toBe(1);
    });
  });
});
