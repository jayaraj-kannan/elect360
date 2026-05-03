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

  it('should fetch candidates and map all fields correctly', async () => {
    (constituencyService.findConstituency as any).mockResolvedValue({ id: '001_g', name: 'Gummidipoondi' });

    const mockCandidates = [
      { name: 'Candidate 1', party: 'DMK', education: 'PG', total_assets: '10Cr', criminal_cases: 2, is_winner: true, age: 50 },
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

    // First candidate — winner with full data
    expect(results[0].name).toBe('Candidate 1');
    expect(results[0].party).toBe('DMK');
    expect(results[0].education).toBe('PG');
    expect(results[0].wealth).toBe('10Cr');
    expect(results[0].criminalCases).toBe(2);
    expect(results[0].tags).toContain('Winner');
    expect(results[0].tags).toContain('Age 50');
    expect(results[0].tags).toContain('DMK');

    // Second candidate — partial data
    expect(results[1].party).toBe('AIADMK');
    expect(results[1].tags).toContain('Age 45');
    expect(results[1].tags).toContain('AIADMK');
  });

  it('should return empty array if constituency not found', async () => {
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    (constituencyService.findConstituency as any).mockResolvedValue(undefined);

    const results = await getCandidatesByConstituencyName('Unknown');
    expect(results).toEqual([]);
    expect(warnSpy).toHaveBeenCalledWith("Constituency 'Unknown' not found in Firestore.");
    warnSpy.mockRestore();
  });

  it('should handle Firestore errors gracefully', async () => {
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    (constituencyService.findConstituency as any).mockResolvedValue({ id: '001_g', name: 'G' });
    (firestore.getDocs as any).mockRejectedValue(new Error('Firestore error'));
    
    const results = await getCandidatesByConstituencyName('G');
    expect(results).toEqual([]);
    expect(errorSpy).toHaveBeenCalled();
    errorSpy.mockRestore();
  });

  it('should map IND party to Independent', async () => {
    (constituencyService.findConstituency as any).mockResolvedValue({ id: '001_g', name: 'G' });

    (firestore.getDocs as any).mockResolvedValue({
      forEach: (cb: any) => cb({ 
        id: 'c1',
        data: () => ({ party: 'IND' })
      })
    });

    const results = await getCandidatesByConstituencyName('G');
    expect(results[0].party).toBe('Independent');
    // IND should NOT appear as a tag
    expect(results[0].tags).not.toContain('IND');
  });

  it('should use fallback values for all missing candidate fields', async () => {
    (constituencyService.findConstituency as any).mockResolvedValue({ id: '001_g', name: 'G' });

    (firestore.getDocs as any).mockResolvedValue({
      forEach: (cb: any) => cb({ 
        id: 'some_candidate',
        data: () => ({}) // Completely empty data
      })
    });

    const results = await getCandidatesByConstituencyName('G');
    expect(results[0].name).toBe('some_candidate'); // Falls back to doc.id
    expect(results[0].party).toBe('Independent');    // No party → Independent
    expect(results[0].education).toBe('N/A');
    expect(results[0].wealth).toBe('N/A');
    expect(results[0].criminalCases).toBe(0);
    expect(results[0].image).toBe('');
  });

  it('should use existing tags when no computed tags available', async () => {
    (constituencyService.findConstituency as any).mockResolvedValue({ id: '001_g', name: 'G' });

    (firestore.getDocs as any).mockResolvedValue({
      forEach: (cb: any) => cb({ 
        id: 'c1',
        data: () => ({ name: 'Test', party: 'IND', tags: ['Custom Tag'] })
      })
    });

    const results = await getCandidatesByConstituencyName('G');
    // IND is filtered from tags, no age, no winner → tags array is empty → falls back to data.tags
    expect(results[0].tags).toEqual(['Custom Tag']);
  });
});
