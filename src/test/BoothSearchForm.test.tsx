import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import BoothSearchForm from '@/components/dashboard/BoothSearchForm';
import { 
  getAllStates, 
  getDistrictsByState, 
  getConstituenciesByDistrict, 
  getWardsByConstituency 
} from '@/lib/boothService';

vi.mock('@/lib/boothService', () => ({
  getAllStates: vi.fn(),
  getDistrictsByState: vi.fn(),
  getConstituenciesByDistrict: vi.fn(),
  getWardsByConstituency: vi.fn(),
  searchBooths: vi.fn(),
}));

describe('BoothSearchForm', () => {
  const mockOnSelect = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    // Default: TN is the initial state, so districts will load on mount
    vi.mocked(getAllStates).mockResolvedValue([{ id: 'TN', name: 'Tamil Nadu' }]);
    vi.mocked(getDistrictsByState).mockResolvedValue([]);
    vi.mocked(getConstituenciesByDistrict).mockResolvedValue([]);
    vi.mocked(getWardsByConstituency).mockResolvedValue([]);
  });

  it('should render loading state initially', async () => {
    vi.mocked(getAllStates).mockReturnValue(new Promise(() => {}));
    render(<BoothSearchForm onSelect={mockOnSelect} />);
    expect(screen.getByText(/Loading.../i)).toBeInTheDocument();
  });

  it('should complete full selection flow using button grids', async () => {
    vi.mocked(getDistrictsByState).mockResolvedValue([{ id: 'chennai', name: 'Chennai' }]);
    vi.mocked(getConstituenciesByDistrict).mockResolvedValue([{ id: 'c1', name: 'Mylapore' }]);
    vi.mocked(getWardsByConstituency).mockResolvedValue([{
      wardId: 'w1', wardName: 'Ward 1', stateId: 'TN',
      id: 'b1', name: 'Booth 1', address: 'Addr 1',
      coords: { lat: 0, lng: 0 },
      stateName: 'Tamil Nadu', districtId: 'chennai', districtName: 'Chennai',
      constituencyId: 'c1', constituencyName: 'Mylapore'
    }]);

    render(<BoothSearchForm onSelect={mockOnSelect} />);

    // Wait for states to load and TN to be default-selected
    await screen.findByText('Tamil Nadu');

    // Districts load automatically since TN is default
    // Click the district button
    const districtBtn = await screen.findByText('Chennai');
    fireEvent.click(districtBtn);

    // Click the constituency button
    const constituencyBtn = await screen.findByText('Mylapore');
    fireEvent.click(constituencyBtn);

    // Select ward from dropdown
    await screen.findByText('Ward 1');
    fireEvent.change(screen.getByLabelText(/polling station/i), { target: { value: 'w1' } });

    // Confirm
    const confirmBtn = screen.getByRole('button', { name: /confirm selection/i });
    await act(async () => {
      fireEvent.click(confirmBtn);
    });
    expect(mockOnSelect).toHaveBeenCalled();
  });

  it('should handle all error paths', async () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    // States error
    vi.mocked(getAllStates).mockRejectedValueOnce(new Error('fail'));
    vi.mocked(getDistrictsByState).mockResolvedValue([]);
    const { unmount } = render(<BoothSearchForm onSelect={mockOnSelect} />);
    await waitFor(() => expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('Failed to load states'), expect.any(Error)));
    consoleSpy.mockClear();
    unmount();

    // Districts error
    vi.mocked(getAllStates).mockResolvedValue([{ id: 'TN', name: 'Tamil Nadu' }]);
    vi.mocked(getDistrictsByState).mockRejectedValueOnce(new Error('fail'));
    const { unmount: u2 } = render(<BoothSearchForm onSelect={mockOnSelect} />);
    await waitFor(() => expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('Failed to load districts'), expect.any(Error)));
    consoleSpy.mockClear();
    u2();

    // Constituencies error — need districts to render, then click one
    vi.mocked(getDistrictsByState).mockResolvedValue([{ id: 'd1', name: 'Dist1' }]);
    vi.mocked(getConstituenciesByDistrict).mockRejectedValueOnce(new Error('fail'));
    const { unmount: u3 } = render(<BoothSearchForm onSelect={mockOnSelect} />);
    const distBtn = await screen.findByText('Dist1');
    fireEvent.click(distBtn);
    await waitFor(() => expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('Failed to load constituencies'), expect.any(Error)));
    consoleSpy.mockClear();
    u3();

    // Wards error — need districts + constituencies, then click constituency
    vi.mocked(getConstituenciesByDistrict).mockResolvedValue([{ id: 'c1', name: 'Const1' }]);
    vi.mocked(getWardsByConstituency).mockRejectedValueOnce(new Error('fail'));
    render(<BoothSearchForm onSelect={mockOnSelect} />);
    const distBtn2 = await screen.findByText('Dist1');
    fireEvent.click(distBtn2);
    const constBtn = await screen.findByText('Const1');
    fireEvent.click(constBtn);
    await waitFor(() => expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('Failed to load wards'), expect.any(Error)));

    consoleSpy.mockRestore();
  });

  it('should not call onSelect when ward is not found', async () => {
    render(<BoothSearchForm onSelect={mockOnSelect} />);

    // Manually inject an option into the ward select to trigger the else branch
    const wardSelect = screen.getByLabelText(/polling station/i);
    const option = document.createElement('option');
    option.value = 'nonexistent';
    option.text = 'Fake Ward';
    wardSelect.appendChild(option);

    fireEvent.change(wardSelect, { target: { value: 'nonexistent' } });

    const confirmBtn = screen.getByRole('button', { name: /confirm selection/i });
    await act(async () => {
      fireEvent.click(confirmBtn);
    });
    expect(mockOnSelect).not.toHaveBeenCalled();
  });

  it('should reset districts when state is cleared and reload on re-select', async () => {
    vi.mocked(getDistrictsByState).mockResolvedValue([{ id: 'd1', name: 'Dist1' }]);

    render(<BoothSearchForm onSelect={mockOnSelect} />);

    // Wait for initial load with TN default
    await screen.findByText('Tamil Nadu');
    await screen.findByText('Dist1');

    // Clear the state — triggers lines 58-59 (setDistricts([]), return)
    await act(async () => {
      fireEvent.change(screen.getByLabelText(/state/i), { target: { value: '' } });
    });

    // Re-select TN — triggers handleStateChange (lines 119-122)
    await act(async () => {
      fireEvent.change(screen.getByLabelText(/state/i), { target: { value: 'TN' } });
    });

    // Districts should reload
    await screen.findByText('Dist1');
  });
});
