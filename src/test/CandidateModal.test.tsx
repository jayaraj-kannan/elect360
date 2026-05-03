import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import CandidateModal from '@/components/dashboard/CandidateModal';

vi.mock('framer-motion', async () => {
  const actual = await vi.importActual('framer-motion') as any;
  return {
    ...actual,
    motion: {
      ...actual.motion,
      div: ({ children, onClick, className }: any) => (
        <div onClick={onClick} className={className} data-testid="motion-div">{children}</div>
      ),
    },
    AnimatePresence: ({ children }: any) => <>{children}</>,
  };
});

describe('CandidateModal', () => {
  const mockCandidate = {
    id: '1',
    name: 'Jane Doe',
    party: 'Party X',
    constituencyId: 'C01',
    education: 'Ph.D',
    wealth: '50 Cr',
    criminalCases: 0,
    tags: ['Incumbent'],
    image: '/jane.jpg',
    liabilities: '5 Cr',
    profession: 'Doctor',
    age: 45
  };

  it('should not render if candidate is null', () => {
    const { container } = render(<CandidateModal isOpen={true} onClose={vi.fn()} candidate={null} />);
    expect(container.firstChild).toBeNull();
  });

  it('should not render if isOpen is false', () => {
    // AnimatePresence mock will still render children if we don't mock it completely to handle condition, 
    // but in our component we have {isOpen && ...} so it should return nothing.
    const { container } = render(<CandidateModal isOpen={false} onClose={vi.fn()} candidate={mockCandidate as any} />);
    expect(screen.queryByText('Jane Doe')).not.toBeInTheDocument();
  });

  it('should render candidate details when open', () => {
    render(<CandidateModal isOpen={true} onClose={vi.fn()} candidate={mockCandidate as any} />);
    expect(screen.getByText('Jane Doe')).toBeInTheDocument();
    expect(screen.getByText('Party X')).toBeInTheDocument();
    expect(screen.getByText('50 Cr')).toBeInTheDocument();
    expect(screen.getByText('5 Cr')).toBeInTheDocument(); // Liabilities
    expect(screen.getByText('Doctor')).toBeInTheDocument(); // Profession
    expect(screen.getByText('45 Years')).toBeInTheDocument(); // Age
    expect(screen.getByText('Clean Record')).toBeInTheDocument();
  });

  it('should render correct text for candidate with criminal cases', () => {
    const criminalCandidate = { ...mockCandidate, criminalCases: 3 };
    render(<CandidateModal isOpen={true} onClose={vi.fn()} candidate={criminalCandidate as any} />);
    expect(screen.getByText('3 Pending Cases')).toBeInTheDocument();
    expect(screen.getByText('Details on cases are available in the official affidavit.')).toBeInTheDocument();
  });

  it('should render candidate initial if no image provided', () => {
    const noImageCandidate = { ...mockCandidate, image: '' };
    render(<CandidateModal isOpen={true} onClose={vi.fn()} candidate={noImageCandidate as any} />);
    // Check if the initial letter 'J' is rendered for "Jane Doe"
    expect(screen.getByText('J')).toBeInTheDocument();
  });

  it('should display "Candidate" if no tags', () => {
    const noTagsCandidate = { ...mockCandidate, tags: [] };
    render(<CandidateModal isOpen={true} onClose={vi.fn()} candidate={noTagsCandidate as any} />);
    expect(screen.getByText('Candidate')).toBeInTheDocument();
  });

  it('should call onClose when close button or backdrop is clicked', () => {
    const onCloseMock = vi.fn();
    render(<CandidateModal isOpen={true} onClose={onCloseMock} candidate={mockCandidate as any} />);
    
    // The backdrop is the first motion.div rendered
    const motionDivs = screen.getAllByTestId('motion-div');
    fireEvent.click(motionDivs[0]);
    expect(onCloseMock).toHaveBeenCalledTimes(1);

    // Find the close button and click it
    // Note: Since we use lucide-react X icon inside a button, we can find by role or nearest element
    const buttons = screen.getAllByRole('button');
    // Assuming first button is the close button, second is Download Manifesto
    fireEvent.click(buttons[0]);
    expect(onCloseMock).toHaveBeenCalledTimes(2);
  });
});
