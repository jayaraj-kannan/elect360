import { describe, it, expect, vi, beforeEach } from 'vitest';
import { 
  getAllStates, 
  getDistrictsByState, 
  getConstituenciesByDistrict, 
  getWardsByConstituency, 
  searchBooths 
} from '../lib/boothService';
import { electionData } from '../data/electionData';
import * as firestore from 'firebase/firestore';

vi.mock('firebase/firestore');

describe('boothService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should fallback to mock data when firestore fails', async () => {
    (firestore.getDocs as any).mockRejectedValue(new Error('Firestore error'));
    
    const states = await getAllStates();
    expect(states).toHaveLength(electionData.length);
    
    const districts = await getDistrictsByState('TN');
    expect(districts.length).toBeGreaterThan(0);

    const constituencies = await getConstituenciesByDistrict('chennai');
    expect(constituencies.length).toBeGreaterThan(0);

    const wards = await getWardsByConstituency('mylapore');
    expect(wards.length).toBeGreaterThan(0);
  });

  it('should return empty arrays when fallback state/district not found', async () => {
    (firestore.getDocs as any).mockRejectedValue(new Error('Firestore error'));
    expect(await getDistrictsByState('NON_EXISTENT')).toHaveLength(0);
    expect(await getConstituenciesByDistrict('NON_EXISTENT')).toHaveLength(0);
  });

  it('should return data from firestore when successful', async () => {
    const mockData = [
      { 
        stateId: 'KA', stateName: 'Karnataka', 
        districtId: 'd1', districtName: 'District 1',
        constituencyId: 'c1', constituencyName: 'Const 1',
        wardId: 'w1', wardName: 'Ward 1',
        id: 'b1', name: 'Booth 1', address: 'Addr 1', coords: { lat: 0, lng: 0 }
      }
    ];
    
    (firestore.getDocs as any).mockResolvedValue({
      forEach: (callback: any) => mockData.forEach(item => callback({ data: () => item })),
      size: 1
    });
    
    expect((await getAllStates())[0].id).toBe('KA');
    expect((await getDistrictsByState('KA'))[0].name).toBe('District 1');
    expect((await getConstituenciesByDistrict('d1'))[0].name).toBe('Const 1');
    expect((await getWardsByConstituency('c1'))[0].wardName).toBe('Ward 1');
    expect((await searchBooths('Booth 1'))[0].name).toBe('Booth 1');
  });

  it('should handle empty firestore snapshots in all functions', async () => {
    (firestore.getDocs as any).mockResolvedValue({ forEach: vi.fn(), size: 0 });
    expect((await getAllStates()).length).toBeGreaterThan(0);
    expect((await getDistrictsByState('KA')).length).toBeGreaterThan(0);
    expect((await getConstituenciesByDistrict('bangalore')).length).toBeGreaterThan(0);
    expect((await getWardsByConstituency('shanti-nagar')).length).toBeGreaterThan(0);
    expect((await searchBooths('')).length).toBeGreaterThan(0);
    
    (firestore.getDocs as any).mockResolvedValue({
      forEach: (cb: any) => cb({ data: () => ({ name: 'Non Matching' }) }),
      size: 1
    });
    expect(await searchBooths('XYZ_NO_MATCH')).toHaveLength(0);
  });

  it('should match all search criteria in firestore search', async () => {
    (firestore.getDocs as any).mockResolvedValue({
      forEach: (cb: any) => {
        cb({ data: () => ({ name: 'N1', address: 'Matching Addr', wardName: 'W1' }) });
        cb({ data: () => ({ name: 'N2', address: 'A2', wardName: 'Matching Ward' }) });
      },
      size: 2
    });
    expect(await searchBooths('Matching Addr')).toHaveLength(1);
    expect(await searchBooths('Matching Ward')).toHaveLength(1);
  });

  it('should handle data missing stateId', async () => {
    (firestore.getDocs as any).mockResolvedValue({
      forEach: (cb: any) => cb({ data: () => ({ name: 'Incomplete' }) }),
      size: 1
    });
    expect((await getAllStates()).length).toBeGreaterThan(0);
  });

  it('should filter booths in fallback search', async () => {
    (firestore.getDocs as any).mockRejectedValue(new Error('Firestore error'));
    expect((await searchBooths('Govt Higher'))[0].name).toContain('Govt Higher');
    expect((await searchBooths('')).length).toBeGreaterThan(0);
    
    // Test fallback search filter branches
    const results = await searchBooths('Mylapore');
    expect(results.length).toBeGreaterThan(0);
  });
});
