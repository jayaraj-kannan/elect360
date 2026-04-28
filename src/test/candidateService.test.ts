import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getCandidatesByConstituencyName } from '../lib/candidateService';
import * as firestore from 'firebase/firestore';
import * as constituencyService from '../lib/constituencyService';

vi.mock('firebase/firestore');
vi.mock('../lib/constituencyService');

describe('candidateService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should fetch candidates for a given constituency name', async () => {
    (constituencyService.findConstituency as any).mockResolvedValue({ id: '001_g', name: 'Gummidipoondi' });

    const mockCandidates = [
      { name: 'Candidate 1', party: 'DMK', education: 'PG', total_assets: '10Cr', criminal_cases: 0, is_winner: true },
      { name: 'Candidate 2', party: 'AIADMK', age: 45 }
    ];

    (firestore.getDocs as any).mockResolvedValue({
      forEach: (cb: any) => mockCandidates.forEach(c => cb({ 
        id: c.name.toLowerCase().replace(' ', '_'),
        data: () => c 
      }))
    });

    const results = await getCandidatesByConstituencyName('Gummidipoondi');
    expect(results).toHaveLength(2);
    expect(results[0].name).toBe('Candidate 1');
    expect(results[0].tags).toContain('Winner');
    expect(results[1].tags).toContain('Age 45');
    expect(results[1].party).toBe('AIADMK');
  });

  it('should return empty array if constituency not found', async () => {
    (constituencyService.findConstituency as any).mockResolvedValue(undefined);
    const results = await getCandidatesByConstituencyName('Unknown');
    expect(results).toEqual([]);
  });

  it('should handle Firestore errors gracefully', async () => {
    (constituencyService.findConstituency as any).mockResolvedValue({ id: '001_g', name: 'G' });
    (firestore.getDocs as any).mockRejectedValue(new Error('Firestore error'));
    
    const results = await getCandidatesByConstituencyName('G');
    expect(results).toEqual([]);
  });

  it('should use fallback values for missing candidate fields', async () => {
    (constituencyService.findConstituency as any).mockResolvedValue({ id: '001_g', name: 'G' });

    (firestore.getDocs as any).mockResolvedValue({
      forEach: (cb: any) => cb({ 
        id: 'c1',
        data: () => ({ party: 'IND' }) // Only party provided
      })
    });

    const results = await getCandidatesByConstituencyName('G');
    expect(results[0].name).toBe('c1');
    expect(results[0].party).toBe('Independent');
    expect(results[0].education).toBe('N/A');
  });
});
