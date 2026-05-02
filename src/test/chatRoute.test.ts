import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock the Google Generative AI module with a proper class constructor
const mockSendMessage = vi.fn();
const mockStartChat = vi.fn(() => ({
  sendMessage: mockSendMessage,
}));

vi.mock('@google/generative-ai', () => {
  return {
    GoogleGenerativeAI: class {
      constructor() {}
      getGenerativeModel() {
        return {
          startChat: mockStartChat,
        };
      }
    },
  };
});

vi.mock('next/server', () => ({
  NextResponse: {
    json: (data: any, init?: any) => ({
      json: async () => data,
      status: init?.status || 200,
      ...data,
    }),
  },
}));

describe('Chat API Route', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return a response from the Gemini model', async () => {
    mockSendMessage.mockResolvedValue({
      response: {
        text: () => 'Vanakkam! How can I help?',
      },
    });

    const { POST } = await import('@/app/api/chat/route');

    const request = new Request('http://localhost:3000/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        messages: [{ role: 'user', content: 'Hello' }],
      }),
    });

    const response = await POST(request);
    expect(response).toBeDefined();
    expect(response.text).toBe('Vanakkam! How can I help?');
  });

  it('should return error when Gemini fails', async () => {
    mockSendMessage.mockRejectedValue(new Error('API Error'));

    const { POST } = await import('@/app/api/chat/route');

    const request = new Request('http://localhost:3000/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        messages: [{ role: 'user', content: 'Hello' }],
      }),
    });

    const response = await POST(request);
    expect(response).toBeDefined();
    expect(response.error).toBe('Failed to fetch response');
  });
});
