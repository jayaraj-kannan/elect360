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
import * as constituencyService from '../lib/constituencyService';

vi.mock('firebase/firestore');
vi.mock('../lib/constituencyService');

describe('boothService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // ── getAllStates ──────────────────────────────────────────────
  it('should return TN when Firestore has constituencies', async () => {
    (constituencyService.getAllConstituencies as any).mockResolvedValue([
      { id: 'c1', name: 'Const 1', district: 'D1' }
    ]);

    const states = await getAllStates();
    expect(states).toEqual([{ id: 'TN', name: 'Tamil Nadu' }]);
  });

  it('should fallback to mock data when Firestore returns empty constituencies', async () => {
    (constituencyService.getAllConstituencies as any).mockResolvedValue([]);

    const states = await getAllStates();
    expect(states).toHaveLength(electionData.length);
  });

  it('should fallback to mock data when Firestore throws', async () => {
    (constituencyService.getAllConstituencies as any).mockRejectedValue(new Error('Firestore error'));

    const states = await getAllStates();
    expect(states).toHaveLength(electionData.length);
  });

  // ── getDistrictsByState ──────────────────────────────────────
  it('should return Firestore districts for TN', async () => {
    (constituencyService.getUniqueDistricts as any).mockResolvedValue(['Chennai', 'Coimbatore']);

    const districts = await getDistrictsByState('TN');
    expect(districts).toEqual([
      { id: 'Chennai', name: 'Chennai' },
      { id: 'Coimbatore', name: 'Coimbatore' }
    ]);
  });

  it('should fallback to mock districts when Firestore returns empty for TN', async () => {
    (constituencyService.getUniqueDistricts as any).mockResolvedValue([]);

    const districts = await getDistrictsByState('TN');
    // Falls through to mock data for TN
    expect(districts.length).toBeGreaterThan(0);
  });

  it('should fallback to mock districts when Firestore throws for TN', async () => {
    (constituencyService.getUniqueDistricts as any).mockRejectedValue(new Error('Firestore error'));

    const districts = await getDistrictsByState('TN');
    expect(districts.length).toBeGreaterThan(0);
  });

  it('should return mock districts for non-TN states', async () => {
    const districts = await getDistrictsByState('KA');
    // Uses mock data directly — no Firestore call
    expect(constituencyService.getUniqueDistricts).not.toHaveBeenCalled();
  });

  it('should return empty for unknown state', async () => {
    const districts = await getDistrictsByState('NON_EXISTENT');
    expect(districts).toHaveLength(0);
  });

  // ── getConstituenciesByDistrict ──────────────────────────────
  it('should return Firestore constituencies when available', async () => {
    (constituencyService.getConstituenciesByDistrictName as any).mockResolvedValue([
      { id: 'c1', name: 'Const 1' },
      { id: 'c2', name: 'Const 2' }
    ]);

    const constituencies = await getConstituenciesByDistrict('Chennai');
    expect(constituencies).toEqual([
      { id: 'c1', name: 'Const 1' },
      { id: 'c2', name: 'Const 2' }
    ]);
  });

  it('should fallback to mock when Firestore returns empty constituencies', async () => {
    (constituencyService.getConstituenciesByDistrictName as any).mockResolvedValue([]);

    const constituencies = await getConstituenciesByDistrict('chennai');
    expect(constituencies.length).toBeGreaterThan(0);
  });

  it('should fallback to mock when Firestore throws for constituencies', async () => {
    (constituencyService.getConstituenciesByDistrictName as any).mockRejectedValue(new Error('Firestore error'));

    const constituencies = await getConstituenciesByDistrict('chennai');
    expect(constituencies.length).toBeGreaterThan(0);
  });

  it('should return empty for unknown district in fallback', async () => {
    (constituencyService.getConstituenciesByDistrictName as any).mockResolvedValue([]);

    const constituencies = await getConstituenciesByDistrict('NON_EXISTENT');
    expect(constituencies).toHaveLength(0);
  });

  // ── getWardsByConstituency ───────────────────────────────────
  it('should return wards from Firestore when booths exist', async () => {
    const mockBoothData = {
      wardId: 'w1', wardName: 'Ward 1',
      id: 'b1', name: 'Booth 1', address: 'Addr', coords: { lat: 0, lng: 0 },
      stateId: 'TN', stateName: 'Tamil Nadu',
      districtId: 'd1', districtName: 'D1',
      constituencyId: 'c1', constituencyName: 'C1'
    };

    (firestore.getDocs as any).mockResolvedValue({
      forEach: (cb: any) => cb({ data: () => mockBoothData }),
      size: 1
    });

    const wards = await getWardsByConstituency('c1');
    expect(wards).toHaveLength(1);
    expect(wards[0].wardName).toBe('Ward 1');
  });

  it('should fallback to mock when no booths in Firestore', async () => {
    (firestore.getDocs as any).mockResolvedValue({
      forEach: vi.fn(),
      size: 0
    });

    const wards = await getWardsByConstituency('mylapore');
    expect(wards.length).toBeGreaterThan(0);
  });

  it('should fallback to mock when Firestore throws for wards', async () => {
    (firestore.getDocs as any).mockRejectedValue(new Error('Firestore error'));

    const wards = await getWardsByConstituency('mylapore');
    expect(wards.length).toBeGreaterThan(0);
  });

  // ── searchBooths ─────────────────────────────────────────────
  it('should search booths in Firestore by name', async () => {
    (firestore.getDocs as any).mockResolvedValue({
      forEach: (cb: any) => {
        cb({ data: () => ({ name: 'Matching Booth', address: 'A1', wardName: 'W1' }) });
        cb({ data: () => ({ name: 'Other Booth', address: 'A2', wardName: 'W2' }) });
      },
      size: 2
    });

    const results = await searchBooths('Matching');
    expect(results).toHaveLength(1);
    expect(results[0].name).toBe('Matching Booth');
  });

  it('should search booths in Firestore by address', async () => {
    (firestore.getDocs as any).mockResolvedValue({
      forEach: (cb: any) => {
        cb({ data: () => ({ name: 'N1', address: 'Matching Address', wardName: 'W1' }) });
      },
      size: 1
    });

    const results = await searchBooths('Matching Address');
    expect(results).toHaveLength(1);
  });

  it('should search booths in Firestore by wardName', async () => {
    (firestore.getDocs as any).mockResolvedValue({
      forEach: (cb: any) => {
        cb({ data: () => ({ name: 'N1', address: 'A1', wardName: 'Matching Ward' }) });
      },
      size: 1
    });

    const results = await searchBooths('Matching Ward');
    expect(results).toHaveLength(1);
  });

  it('should return non-matching Firestore results without fallback', async () => {
    (firestore.getDocs as any).mockResolvedValue({
      forEach: (cb: any) => {
        cb({ data: () => ({ name: 'Booth A', address: 'Addr A', wardName: 'Ward A' }) });
      },
      size: 1
    });

    const results = await searchBooths('XYZ_NO_MATCH');
    expect(results).toHaveLength(0);
  });

  it('should fallback to mock when Firestore empty and search is empty string', async () => {
    (firestore.getDocs as any).mockResolvedValue({
      forEach: vi.fn(),
      size: 0
    });

    const results = await searchBooths('');
    expect(results.length).toBeGreaterThan(0); // Falls back to all mock booths
  });

  it('should fallback to mock search when Firestore throws', async () => {
    (firestore.getDocs as any).mockRejectedValue(new Error('Firestore error'));

    // Empty search returns all mock booths
    expect((await searchBooths('')).length).toBeGreaterThan(0);

    // Name match in mock data
    expect((await searchBooths('Govt Higher'))[0].name).toContain('Govt Higher');

    // Address match in mock data
    expect((await searchBooths('West Mada'))[0].address).toContain('West Mada');

    // No match returns empty
    expect(await searchBooths('XYZ_NO_MATCH')).toHaveLength(0);
  });

  it('should handle Firestore data with missing fields gracefully', async () => {
    (firestore.getDocs as any).mockResolvedValue({
      forEach: (cb: any) => cb({ data: () => ({ name: 'Incomplete' }) }),
      size: 1
    });

    // searchBooths with empty string — data exists but no match for empty throws fallback
    // The data has name but will match empty string (includes empty)
    const results = await searchBooths('Incomplete');
    expect(results).toHaveLength(1);
  });
});
