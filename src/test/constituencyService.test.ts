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
      empty: false,
      docs: mockDocs.map(doc => ({
        id: doc.id,
        data: () => doc
      }))
    });

    const results = await getAllConstituencies();
    expect(results).toHaveLength(2);
    expect(results[0].id).toBe('001_g');
    expect(results[0].name).toBe('Gummidipoondi');
    expect(results[1].district).toBe('Thiruvallur');
  });

  it('should return cached data on second call', async () => {
    const mockDocs = [
      { id: '001_g', name: 'Gummidipoondi', district: 'Thiruvallur', constituency_no: 1 }
    ];

    (firestore.getDocs as any).mockResolvedValue({
      empty: false,
      docs: mockDocs.map(doc => ({
        id: doc.id,
        data: () => doc
      }))
    });

    const first = await getAllConstituencies();
    const second = await getAllConstituencies();
    expect(first).toBe(second); // Same reference — cached
    expect(firestore.getDocs).toHaveBeenCalledTimes(1); // Only one Firestore call
  });

  it('should warn when Firestore collection is empty', async () => {
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

    (firestore.getDocs as any).mockResolvedValue({
      empty: true,
      docs: []
    });

    const results = await getAllConstituencies();
    expect(results).toEqual([]);
    expect(warnSpy).toHaveBeenCalledWith('Firestore collection is empty at the specified path.');
    warnSpy.mockRestore();
  });

  it('should return unique districts sorted alphabetically', async () => {
    const mockDocs = [
      { id: '1', district: 'Chennai', constituency_no: 1 },
      { id: '2', district: 'Thiruvallur', constituency_no: 2 },
      { id: '3', district: 'Chennai', constituency_no: 3 }
    ];

    (firestore.getDocs as any).mockResolvedValue({
      empty: false,
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
      empty: false,
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

  it('should return empty array for unknown district', async () => {
    const mockDocs = [
      { id: '1', name: 'C1', district: 'D1', constituency_no: 1 }
    ];

    (firestore.getDocs as any).mockResolvedValue({
      empty: false,
      docs: mockDocs.map(doc => ({
        id: doc.id,
        data: () => doc
      }))
    });

    const results = await getConstituenciesByDistrictName('UNKNOWN');
    expect(results).toHaveLength(0);
  });

  it('should find a constituency by ID', async () => {
    const mockDocs = [
      { id: '001_g', name: 'Gummidipoondi' },
      { id: '002_p', name: 'Ponneri' }
    ];

    (firestore.getDocs as any).mockResolvedValue({
      empty: false,
      docs: mockDocs.map(doc => ({
        id: doc.id,
        data: () => doc
      }))
    });

    const byId = await findConstituency('001_g');
    expect(byId?.name).toBe('Gummidipoondi');
  });

  it('should find a constituency by name (case-insensitive)', async () => {
    const mockDocs = [
      { id: '001_g', name: 'Gummidipoondi' },
      { id: '002_p', name: 'Ponneri' }
    ];

    (firestore.getDocs as any).mockResolvedValue({
      empty: false,
      docs: mockDocs.map(doc => ({
        id: doc.id,
        data: () => doc
      }))
    });

    const byName = await findConstituency('ponneri');
    expect(byName?.id).toBe('002_p');
  });

  it('should return undefined for non-existent constituency', async () => {
    const mockDocs = [
      { id: '001_g', name: 'Gummidipoondi' }
    ];

    (firestore.getDocs as any).mockResolvedValue({
      empty: false,
      docs: mockDocs.map(doc => ({
        id: doc.id,
        data: () => doc
      }))
    });

    const notFound = await findConstituency('Non Existent');
    expect(notFound).toBeUndefined();
  });

  it('should handle Firestore errors gracefully', async () => {
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    (firestore.getDocs as any).mockRejectedValue(new Error('Firestore error'));
    
    const results = await getAllConstituencies();
    expect(results).toEqual([]);
    expect(errorSpy).toHaveBeenCalled();
    errorSpy.mockRestore();
  });
});
