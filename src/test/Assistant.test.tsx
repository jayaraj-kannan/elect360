import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import * as React from 'react';
import Assistant from '@/components/dashboard/Assistant';

vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  },
  AnimatePresence: ({ children }: any) => <>{children}</>,
}));

describe('Assistant', () => {
  it('should render the toggle button', () => {
    render(<Assistant />);
    // The chat is closed by default, only the toggle button is visible
    const buttons = screen.getAllByRole('button');
    expect(buttons.length).toBeGreaterThan(0);
  });

  it('should open the chat panel when toggle is clicked', () => {
    render(<Assistant />);
    // Click the first button (the toggle FAB)
    const toggleBtn = screen.getAllByRole('button')[0];
    fireEvent.click(toggleBtn);
    expect(screen.getByText(/ELEA AI/i)).toBeInTheDocument();
    expect(screen.getByText(/Vanakkam/i)).toBeInTheDocument();
  });

  it('should close the chat panel when X is clicked', () => {
    render(<Assistant />);
    fireEvent.click(screen.getAllByRole('button')[0]); // open
    expect(screen.getByText(/ELEA AI/i)).toBeInTheDocument();
    // Find the close button (the X button inside the header)
    const closeBtn = screen.getAllByRole('button').find(btn => {
      return btn.closest('.p-6');
    });
    if (closeBtn) fireEvent.click(closeBtn);
  });

  it('should send a message about ID documents and get a mock response', async () => {
    vi.useFakeTimers();
    render(<Assistant />);
    fireEvent.click(screen.getAllByRole('button')[0]); // open

    const input = screen.getByPlaceholderText(/Ask about/i);
    fireEvent.change(input, { target: { value: 'What ID do I need?' } });
    fireEvent.keyPress(input, { key: 'Enter', charCode: 13 });

    await React.act(async () => {
      vi.advanceTimersByTime(1000);
    });

    expect(screen.getByText(/EPIC card/i)).toBeInTheDocument();
    vi.useRealTimers();
  });

  it('should send a message about timing and get a mock response', async () => {
    vi.useFakeTimers();
    render(<Assistant />);
    fireEvent.click(screen.getAllByRole('button')[0]); // open

    const input = screen.getByPlaceholderText(/Ask about/i);
    fireEvent.change(input, { target: { value: 'What time do polls open?' } });

    // Click the send button
    const sendBtn = screen.getAllByRole('button').pop()!;
    fireEvent.click(sendBtn);

    await React.act(async () => {
      vi.advanceTimersByTime(1000);
    });

    expect(screen.getByText(/7:00 AM/i)).toBeInTheDocument();
    vi.useRealTimers();
  });

  it('should return a generic response for unknown questions', async () => {
    vi.useFakeTimers();
    render(<Assistant />);
    fireEvent.click(screen.getAllByRole('button')[0]); // open

    const input = screen.getByPlaceholderText(/Ask about/i);
    fireEvent.change(input, { target: { value: 'hello world' } });
    fireEvent.keyPress(input, { key: 'Enter', charCode: 13 });

    await React.act(async () => {
      vi.advanceTimersByTime(1000);
    });

    expect(screen.getByText(/great question/i)).toBeInTheDocument();
    vi.useRealTimers();
  });

  it('should not send empty messages', () => {
    render(<Assistant />);
    fireEvent.click(screen.getAllByRole('button')[0]); // open

    const input = screen.getByPlaceholderText(/Ask about/i);
    fireEvent.change(input, { target: { value: '   ' } });
    fireEvent.keyPress(input, { key: 'Enter', charCode: 13 });

    // Only the initial assistant message should exist
    const messages = screen.getAllByText(/Vanakkam/i);
    expect(messages.length).toBe(1);
  });
});
