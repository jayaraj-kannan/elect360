import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import Footer from '@/components/layout/Footer';

describe('Footer', () => {
  it('should render the footer content', () => {
    render(<Footer />);
    expect(screen.getByText('VOTE')).toBeInTheDocument();
    expect(screen.getByText('GUIDE')).toBeInTheDocument();
    expect(screen.getByText(/2026 enVote/i)).toBeInTheDocument();
    expect(screen.getByText(/stronger democracy/i)).toBeInTheDocument();
  });

  it('should render Resources links', () => {
    render(<Footer />);
    expect(screen.getByText('Resources')).toBeInTheDocument();
    expect(screen.getByText('Find My Booth')).toBeInTheDocument();
    expect(screen.getByText('Candidate Affidavits')).toBeInTheDocument();
    expect(screen.getByText('Voter ID Guide')).toBeInTheDocument();
  });

  it('should render State Portals links', () => {
    render(<Footer />);
    expect(screen.getByText('State Portals')).toBeInTheDocument();
    expect(screen.getByText('CEO Tamil Nadu')).toBeInTheDocument();
    expect(screen.getByText('CEO Kerala')).toBeInTheDocument();
    expect(screen.getByText('CEO Karnataka')).toBeInTheDocument();
  });

  it('should render Official links', () => {
    render(<Footer />);
    expect(screen.getByText('Official')).toBeInTheDocument();
    expect(screen.getByText('ECI Helpline')).toBeInTheDocument();
    expect(screen.getByText('National Voter Portal')).toBeInTheDocument();
  });
});
