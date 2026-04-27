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
    vi.mocked(getAllStates).mockResolvedValue([{ id: 'KA', name: 'Karnataka' }]);
    vi.mocked(getDistrictsByState).mockResolvedValue([]);
    vi.mocked(getConstituenciesByDistrict).mockResolvedValue([]);
    vi.mocked(getWardsByConstituency).mockResolvedValue([]);
  });

  it('should render loading states', async () => {
    vi.mocked(getAllStates).mockReturnValue(new Promise(() => {}));
    render(<BoothSearchForm onSelect={mockOnSelect} />);
    expect(screen.getByText(/Loading.../i)).toBeInTheDocument();
  });

  it('should hit all selection branches', async () => {
    vi.mocked(getDistrictsByState).mockResolvedValue([{ id: 'd1', name: 'D1' }]);
    vi.mocked(getConstituenciesByDistrict).mockResolvedValue([{ id: 'c1', name: 'C1' }]);
    vi.mocked(getWardsByConstituency).mockResolvedValue([{ wardId: 'w1', wardName: 'W1', stateId: 'KA' }]);

    render(<BoothSearchForm onSelect={mockOnSelect} />);
    
    await screen.findByText('Karnataka');
    fireEvent.change(screen.getByLabelText(/state/i), { target: { value: 'KA' } });
    
    await screen.findByText('D1');
    fireEvent.change(screen.getByLabelText(/district/i), { target: { value: 'd1' } });
    
    await screen.findByText('C1');
    fireEvent.change(screen.getByLabelText(/constituency/i), { target: { value: 'c1' } });
    
    await screen.findByText('W1');
    fireEvent.change(screen.getByLabelText(/ward/i), { target: { value: 'w1' } });
    
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
    const { unmount } = render(<BoothSearchForm onSelect={mockOnSelect} />);
    await waitFor(() => expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('Failed to load states'), expect.any(Error)));
    consoleSpy.mockClear();
    unmount();
    
    // Districts error
    vi.mocked(getAllStates).mockResolvedValue([{ id: 'KA', name: 'K' }]);
    vi.mocked(getDistrictsByState).mockRejectedValueOnce(new Error('fail'));
    const { unmount: u2 } = render(<BoothSearchForm onSelect={mockOnSelect} />);
    await screen.findByText('K');
    fireEvent.change(screen.getByLabelText(/state/i), { target: { value: 'KA' } });
    await waitFor(() => expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('Failed to load districts'), expect.any(Error)));
    consoleSpy.mockClear();
    u2();

    // Const error
    vi.mocked(getDistrictsByState).mockResolvedValue([{ id: 'd1', name: 'D' }]);
    vi.mocked(getConstituenciesByDistrict).mockRejectedValueOnce(new Error('fail'));
    const { unmount: u3 } = render(<BoothSearchForm onSelect={mockOnSelect} />);
    await screen.findByText('K');
    fireEvent.change(screen.getByLabelText(/state/i), { target: { value: 'KA' } });
    await screen.findByText('D');
    fireEvent.change(screen.getByLabelText(/district/i), { target: { value: 'd1' } });
    await waitFor(() => expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('Failed to load constituencies'), expect.any(Error)));
    consoleSpy.mockClear();
    u3();

    // Wards error
    vi.mocked(getConstituenciesByDistrict).mockResolvedValue([{ id: 'c1', name: 'C' }]);
    vi.mocked(getWardsByConstituency).mockRejectedValueOnce(new Error('fail'));
    render(<BoothSearchForm onSelect={mockOnSelect} />);
    await screen.findByText('K');
    fireEvent.change(screen.getByLabelText(/state/i), { target: { value: 'KA' } });
    await screen.findByText('D');
    fireEvent.change(screen.getByLabelText(/district/i), { target: { value: 'd1' } });
    await screen.findByText('C');
    fireEvent.change(screen.getByLabelText(/constituency/i), { target: { value: 'c1' } });
    await waitFor(() => expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('Failed to load wards'), expect.any(Error)));
    
    consoleSpy.mockRestore();
  });

  it('should hit handleSelect else branch', async () => {
    render(<BoothSearchForm onSelect={mockOnSelect} />);
    
    // Manually add an option to the select to allow selecting a value not in the 'wards' state
    const wardSelect = screen.getByLabelText(/ward/i);
    const option = document.createElement('option');
    option.value = 'trigger-else';
    option.text = 'Trigger Else';
    wardSelect.appendChild(option);
    
    fireEvent.change(wardSelect, { target: { value: 'trigger-else' } });
    
    const confirmBtn = screen.getByRole('button', { name: /confirm selection/i });
    await act(async () => {
      fireEvent.click(confirmBtn);
    });
    expect(mockOnSelect).not.toHaveBeenCalled();
  });
});
