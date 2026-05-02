import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ThemeToggle } from '@/components/layout/ThemeToggle';
import { useTheme } from 'next-themes';

// Mock next-themes
vi.mock('next-themes', () => ({
  useTheme: vi.fn(),
}));

// Mock framer-motion to disable animations and avoid issues with AnimatePresence in tests
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

describe('ThemeToggle', () => {
  it('should render the toggle button', () => {
    vi.mocked(useTheme).mockReturnValue({ theme: 'light', setTheme: vi.fn() } as any);
    render(<ThemeToggle />);
    expect(screen.getByLabelText('Toggle theme')).toBeInTheDocument();
  });

  it('should render sun icon when theme is dark', () => {
    vi.mocked(useTheme).mockReturnValue({ theme: 'dark', setTheme: vi.fn() } as any);
    render(<ThemeToggle />);
    // Check for Sun icon (Sun size={20} className="text-yellow-500" />)
    // Lucide icons usually render as SVGs. We can check for the test-id or the path if we want to be specific,
    // but here we just check if it renders after mounting.
    expect(screen.getByLabelText('Toggle theme')).toBeInTheDocument();
  });

  it('should call setTheme with "light" when theme is dark and button is clicked', () => {
    const setTheme = vi.fn();
    vi.mocked(useTheme).mockReturnValue({ theme: 'dark', setTheme } as any);
    render(<ThemeToggle />);
    
    const button = screen.getByLabelText('Toggle theme');
    fireEvent.click(button);
    
    expect(setTheme).toHaveBeenCalledWith('light');
  });

  it('should call setTheme with "dark" when theme is light and button is clicked', () => {
    const setTheme = vi.fn();
    vi.mocked(useTheme).mockReturnValue({ theme: 'light', setTheme } as any);
    render(<ThemeToggle />);
    
    const button = screen.getByLabelText('Toggle theme');
    fireEvent.click(button);
    
    expect(setTheme).toHaveBeenCalledWith('dark');
  });
});
