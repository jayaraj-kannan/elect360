import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import IntroCard from '@/components/onboarding/IntroCard';

// Mock framer-motion
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    h1: ({ children, ...props }: any) => <h1 {...props}>{children}</h1>,
    h2: ({ children, ...props }: any) => <h2 {...props}>{children}</h2>,
    p: ({ children, ...props }: any) => <p {...props}>{children}</p>,
    button: ({ children, ...props }: any) => <button {...props}>{children}</button>,
  },
  AnimatePresence: ({ children }: any) => <>{children}</>,
}));

describe('IntroCard', () => {
  it('should render correctly', () => {
    render(<IntroCard onComplete={vi.fn()} />);
    expect(screen.getByText(/ENVOTE 2026/i)).toBeInTheDocument();
    expect(screen.getByText(/Digitally Empowered/i)).toBeInTheDocument();
  });

  it('should call onComplete when GET STARTED is clicked', () => {
    const onComplete = vi.fn();
    render(<IntroCard onComplete={onComplete} />);
    const button = screen.getByText(/GET STARTED/i);
    fireEvent.click(button);
    expect(onComplete).toHaveBeenCalled();
  });
});
