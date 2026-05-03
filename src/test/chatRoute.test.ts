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
    SchemaType: {
      STRING: "STRING",
      NUMBER: "NUMBER",
      INTEGER: "INTEGER",
      BOOLEAN: "BOOLEAN",
      ARRAY: "ARRAY",
      OBJECT: "OBJECT",
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

vi.mock('@/lib/constituencyService', () => ({
  getConstituenciesByDistrictName: vi.fn(),
}));

vi.mock('@/lib/candidateService', () => ({
  getCandidatesByConstituencyName: vi.fn(),
}));

describe('Chat API Route', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return a response from the Gemini model', async () => {
    mockSendMessage.mockResolvedValue({
      response: {
        text: () => 'Vanakkam! How can I help?',
        functionCalls: () => null,
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
    expect((response as any).error).toContain('Failed to fetch response');
  });

  it('should return error if no messages provided', async () => {
    const { POST } = await import('@/app/api/chat/route');

    const request = new Request('http://localhost:3000/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        messages: [],
      }),
    });

    const response = await POST(request);
    expect(response.status).toBe(400);
    expect((response as any).error).toBe('No messages provided');
  });

  it('should handle getConstituenciesByDistrictName function call', async () => {
    const { getConstituenciesByDistrictName } = await import('@/lib/constituencyService');
    vi.mocked(getConstituenciesByDistrictName).mockResolvedValueOnce([{ id: '1', name: 'Mylapore' }] as any);

    mockSendMessage.mockResolvedValueOnce({
      response: {
        functionCalls: () => [{
          name: 'getConstituenciesByDistrictName',
          args: { districtName: 'Chennai' }
        }],
        text: () => '',
      },
    }).mockResolvedValueOnce({
      response: {
        functionCalls: () => null,
        text: () => 'Here are the constituencies: Mylapore.',
      },
    });

    const { POST } = await import('@/app/api/chat/route');

    const request = new Request('http://localhost:3000/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        messages: [{ role: 'user', content: 'What are the constituencies in Chennai?' }],
      }),
    });

    const response = await POST(request);
    expect(response.text).toBe('Here are the constituencies: Mylapore.');
    expect(getConstituenciesByDistrictName).toHaveBeenCalledWith('Chennai');
  });

  it('should handle getCandidatesByConstituencyName function call', async () => {
    const { getCandidatesByConstituencyName } = await import('@/lib/candidateService');
    vi.mocked(getCandidatesByConstituencyName).mockResolvedValueOnce([{ name: 'John', party: 'ABC' }] as any);

    mockSendMessage.mockResolvedValueOnce({
      response: {
        functionCalls: () => [{
          name: 'getCandidatesByConstituencyName',
          args: { constituencyName: 'Mylapore' }
        }],
        text: () => '',
      },
    }).mockResolvedValueOnce({
      response: {
        functionCalls: () => null,
        text: () => 'The candidate is John from ABC.',
      },
    });

    const { POST } = await import('@/app/api/chat/route');

    const request = new Request('http://localhost:3000/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        messages: [{ role: 'user', content: 'Who is contesting in Mylapore?' }],
      }),
    });

    const response = await POST(request);
    expect(response.text).toBe('The candidate is John from ABC.');
    expect(getCandidatesByConstituencyName).toHaveBeenCalledWith('Mylapore');
  });

  it('should handle function call error gracefully', async () => {
    const { getConstituenciesByDistrictName } = await import('@/lib/constituencyService');
    vi.mocked(getConstituenciesByDistrictName).mockRejectedValueOnce(new Error('DB Error'));

    mockSendMessage.mockResolvedValueOnce({
      response: {
        functionCalls: () => [{
          name: 'getConstituenciesByDistrictName',
          args: { districtName: 'Invalid' }
        }],
        text: () => '',
      },
    }).mockResolvedValueOnce({
      response: {
        functionCalls: () => null,
        text: () => 'Sorry, I encountered an error.',
      },
    });

    const { POST } = await import('@/app/api/chat/route');

    const request = new Request('http://localhost:3000/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        messages: [{ role: 'user', content: 'Constituencies in Invalid?' }],
      }),
    });

    const response = await POST(request);
    expect(response.text).toBe('Sorry, I encountered an error.');
  });

  it('should handle unknown function call gracefully', async () => {
    mockSendMessage.mockResolvedValueOnce({
      response: {
        functionCalls: () => [{
          name: 'unknownFunction',
          args: {}
        }],
        text: () => '',
      },
    }).mockResolvedValueOnce({
      response: {
        functionCalls: () => null,
        text: () => 'I cannot do that.',
      },
    });

    const { POST } = await import('@/app/api/chat/route');

    const request = new Request('http://localhost:3000/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        messages: [{ role: 'user', content: 'Do something unknown' }],
      }),
    });

    const response = await POST(request);
    expect(response.text).toBe('I cannot do that.');
  });

  it('should break loop if calls is falsely', async () => {
    mockSendMessage.mockResolvedValueOnce({
      response: {
        // Return truthy for first check, but falsely for the actual variable
        functionCalls: () => null,
        text: () => 'Breaking loop',
      },
    });

    const { POST } = await import('@/app/api/chat/route');

    const request = new Request('http://localhost:3000/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        messages: [{ role: 'user', content: 'Test break' }],
      }),
    });

    const response = await POST(request);
    expect(response.text).toBe('Breaking loop');
  });
});
