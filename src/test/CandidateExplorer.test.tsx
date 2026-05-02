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
      expect(screen.getByText('None')).toBeInTheDocument();
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
});
