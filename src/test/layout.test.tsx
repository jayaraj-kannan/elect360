import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';

// Mock next/font/google
vi.mock('next/font/google', () => ({
  Inter: () => ({ variable: '--font-inter' }),
  Outfit: () => ({ variable: '--font-outfit' }),
}));

// Mock child components
vi.mock('@/components/layout/Navbar', () => ({
  default: () => <nav data-testid="navbar">Navbar</nav>,
}));

vi.mock('@/components/layout/Footer', () => ({
  default: () => <footer data-testid="footer">Footer</footer>,
}));

vi.mock('@/components/dashboard/Assistant', () => ({
  default: () => <div data-testid="assistant">Assistant</div>,
}));

vi.mock('@/components/providers/ThemeProvider', () => ({
  ThemeProvider: ({ children }: any) => <div data-testid="theme-provider">{children}</div>,
}));

describe('RootLayout', () => {
  it('should export metadata and viewport config', async () => {
    const layoutModule = await import('@/app/layout');
    expect(layoutModule.metadata).toBeDefined();
    expect(layoutModule.metadata.title).toContain('enVote');
    expect(layoutModule.viewport).toBeDefined();
    expect(layoutModule.viewport.themeColor).toBe('#D2042D');
  });

  it('should render the layout with children', async () => {
    const layoutModule = await import('@/app/layout');
    const RootLayout = layoutModule.default;
    
    // We can render RootLayout even though it returns <html>
    const { container } = render(
      <RootLayout>
        <div data-testid="test-child">Child</div>
      </RootLayout>
    );

    // Assert children and mocked components are rendered
    expect(screen.getByTestId('test-child')).toBeInTheDocument();
    expect(screen.getByTestId('navbar')).toBeInTheDocument();
    expect(screen.getByTestId('footer')).toBeInTheDocument();
    expect(screen.getByTestId('assistant')).toBeInTheDocument();
    expect(screen.getByTestId('theme-provider')).toBeInTheDocument();
  });
});
