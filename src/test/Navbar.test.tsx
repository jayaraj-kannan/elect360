import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import Navbar from '@/components/layout/Navbar';

// Mock next-themes for ThemeToggle
vi.mock('next-themes', () => ({
  useTheme: vi.fn(() => ({ theme: 'light', setTheme: vi.fn() })),
}));

// Mock ThemeToggle to simplify Navbar tests
vi.mock('@/components/layout/ThemeToggle', () => ({
  ThemeToggle: () => <button aria-label="Toggle theme" />,
}));

describe('Navbar', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render the logo and brand name', () => {
    render(<Navbar />);
    expect(screen.getByAltText('enVote Logo')).toBeInTheDocument();
  });

  it('should render state selector buttons on desktop', () => {
    render(<Navbar />);
    expect(screen.getByText('TN')).toBeInTheDocument();
  });

  it('should update selected state when a state button is clicked', () => {
    render(<Navbar />);
    const klButton = screen.getByText('KL');
    fireEvent.click(klButton);
    expect(klButton).toHaveClass('bg-white');
  });

  it('should toggle mobile menu when menu button is clicked', () => {
    render(<Navbar />);
    
    // Desktop has "TN", "KL" etc. Mobile menu has "Tamil Nadu", "Kerala" etc.
    expect(screen.queryByText('Kerala')).not.toBeInTheDocument();
    
    // Mobile toggle is the button with the Menu icon. 
    const menuButton = screen.getByTestId('mobile-menu-toggle');
    fireEvent.click(menuButton);
    
    expect(screen.getByText('Kerala')).toBeInTheDocument();
  });

  it('should update state and close menu when state is clicked in mobile menu', () => {
    render(<Navbar />);
    
    // Open menu
    fireEvent.click(screen.getByTestId('mobile-menu-toggle'));
    
    // Click Kerala in mobile menu
    const keralaButton = screen.getByText('Kerala').closest('button');
    if (keralaButton) {
      fireEvent.click(keralaButton);
    }
    
    // Menu should be closed
    expect(screen.queryByText('Kerala')).not.toBeInTheDocument();
  });

  it('should apply scrolled styles when page is scrolled', () => {
    render(<Navbar />);
    // Simulate scrolling past 10px
    Object.defineProperty(window, 'scrollY', { value: 50, writable: true });
    fireEvent.scroll(window);

    const nav = document.querySelector('nav');
    expect(nav?.className).toContain('backdrop-blur-md');
  });
});
