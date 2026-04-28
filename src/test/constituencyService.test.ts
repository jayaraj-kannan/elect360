import { describe, it, expect, vi, beforeEach } from 'vitest';
import { 
  getAllConstituencies, 
  getUniqueDistricts, 
  getConstituenciesByDistrictName,
  findConstituency,
  resetCache
} from '../lib/constituencyService';
import * as firestore from 'firebase/firestore';

vi.mock('firebase/firestore');

describe('constituencyService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    resetCache();
  });

  it('should fetch all constituencies and map them correctly', async () => {
    const mockDocs = [
      { id: '001_g', name: 'Gummidipoondi', district: 'Thiruvallur', constituency_no: 1 },
      { id: '002_p', name: 'Ponneri', district: 'Thiruvallur', constituency_no: 2 }
    ];

    (firestore.getDocs as any).mockResolvedValue({
      docs: mockDocs.map(doc => ({
        id: doc.id,
        data: () => doc
      }))
    });

    const results = await getAllConstituencies();
    expect(results).toHaveLength(2);
    expect(results[0].id).toBe('001_g');
    expect(results[0].name).toBe('Gummidipoondi');
  });

  it('should return unique districts sorted alphabetically', async () => {
    const mockDocs = [
      { id: '1', district: 'Chennai' },
      { id: '2', district: 'Thiruvallur' },
      { id: '3', district: 'Chennai' }
    ];

    (firestore.getDocs as any).mockResolvedValue({
      docs: mockDocs.map(doc => ({
        id: doc.id,
        data: () => doc
      }))
    });

    const districts = await getUniqueDistricts();
    expect(districts).toEqual(['Chennai', 'Thiruvallur']);
  });

  it('should filter constituencies by district and sort by constituency_no', async () => {
    const mockDocs = [
      { id: '1', name: 'C1', district: 'D1', constituency_no: 2 },
      { id: '2', name: 'C2', district: 'D1', constituency_no: 1 },
      { id: '3', name: 'C3', district: 'D2', constituency_no: 3 }
    ];

    (firestore.getDocs as any).mockResolvedValue({
      docs: mockDocs.map(doc => ({
        id: doc.id,
        data: () => doc
      }))
    });

    const results = await getConstituenciesByDistrictName('D1');
    expect(results).toHaveLength(2);
    expect(results[0].constituency_no).toBe(1);
    expect(results[1].constituency_no).toBe(2);
  });

  it('should find a constituency by ID or name', async () => {
    const mockDocs = [
      { id: '001_g', name: 'Gummidipoondi' },
      { id: '002_p', name: 'Ponneri' }
    ];

    (firestore.getDocs as any).mockResolvedValue({
      docs: mockDocs.map(doc => ({
        id: doc.id,
        data: () => doc
      }))
    });

    const byId = await findConstituency('001_g');
    expect(byId?.name).toBe('Gummidipoondi');

    const byName = await findConstituency('Ponneri');
    expect(byName?.id).toBe('002_p');

    const notFound = await findConstituency('Non Existent');
    expect(notFound).toBeUndefined();
  });

  it('should handle Firestore errors gracefully', async () => {
    (firestore.getDocs as any).mockRejectedValue(new Error('Firestore error'));
    
    // We need to bypass the cache for this test
    // Since the cache is a module-level variable, we can't easily reset it without modifying the service
    // But if we run this test first or after a failure, it should work.
    
    const results = await getAllConstituencies();
    expect(results).toEqual([]);
  });
});
