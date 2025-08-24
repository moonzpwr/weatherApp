import { screen, fireEvent } from '@testing-library/react';
import Home from '@/app/page';
import { getWeather } from '@/api/api';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { renderWithQueryClient } from '@/test-utils/renderWithQueryClient';

jest.mock('@/api/api', () => ({
	getWeather: jest.fn(),
}));

jest.mock('@/hooks/useLocalStorage', () => ({
	useLocalStorage: jest.fn(),
}));

describe('City Card', () => {
	const mockSetCities = jest.fn();

	beforeEach(() => {
		jest.clearAllMocks();
		(useLocalStorage as jest.Mock).mockReturnValue({
			cities: [],
			setCities: mockSetCities,
			hydrated: true,
		});
	});

	it('renders a list of cities', async () => {
		(useLocalStorage as jest.Mock).mockReturnValue({
			cities: [{ name: 'Kyiv', lat: 50.45, lon: 30.52 }],
			setCities: mockSetCities,
			hydrated: true,
		});

		(getWeather as jest.Mock).mockResolvedValue({
			main: { temp: 20 },
			weather: [{ description: 'clear sky' }],
		});

		renderWithQueryClient(<Home />);

		expect(await screen.findByText(/Kyiv/i)).toBeInTheDocument();
		expect(screen.getByText(/20°C/i)).toBeInTheDocument();
		expect(screen.getByText(/clear sky/i)).toBeInTheDocument();
	});

	it('deletes city', async () => {
		(useLocalStorage as jest.Mock).mockReturnValue({
			cities: [{ name: 'Kyiv', lat: 50.45, lon: 30.52 }],
			setCities: mockSetCities,
			hydrated: true,
		});

		renderWithQueryClient(<Home />);

		fireEvent.click(await screen.findByRole('button', { name: 'delete' }));
		expect(mockSetCities).toHaveBeenCalledWith([]);
	});

	it('calls refetch when Refresh button is clicked', async () => {
		(useLocalStorage as jest.Mock).mockReturnValue({
			cities: [{ name: 'Kyiv', lat: 50.45, lon: 30.52 }],
			setCities: mockSetCities,
			hydrated: true,
		});

		renderWithQueryClient(<Home />);

		fireEvent.click(await screen.findByRole('button', { name: 'refresh' }));

		expect(getWeather).toHaveBeenCalledWith(50.45, 30.52);
		expect(getWeather).toHaveBeenCalledTimes(2);
	});
});
