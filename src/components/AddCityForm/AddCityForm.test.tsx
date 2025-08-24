import { screen, fireEvent, waitFor } from '@testing-library/react';
import Home from '@/app/page';
import { geocodeCity } from '@/api/api';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { renderWithQueryClient } from '@/test-utils/renderWithQueryClient';

jest.mock('@/api/api', () => ({
	geocodeCity: jest.fn(),
}));

jest.mock('@/hooks/useLocalStorage', () => ({
	useLocalStorage: jest.fn(),
}));

describe('AddCityForm', () => {
	const mockSetCities = jest.fn();

	beforeEach(() => {
		jest.clearAllMocks();
		(useLocalStorage as jest.Mock).mockReturnValue({
			cities: [],
			setCities: mockSetCities,
			hydrated: true,
		});
	});

	it('successfully adds a new city', async () => {
		(geocodeCity as jest.Mock).mockResolvedValueOnce([{ name: 'London', lat: 51.5, lon: -0.12 }]);

		renderWithQueryClient(<Home />);

		const inputWrapper = screen.getByTestId('city-add-input');
		const input = inputWrapper.querySelector('input') as HTMLInputElement;
		fireEvent.change(input, { target: { value: 'London' } });
		fireEvent.submit(input.closest('form') as HTMLFormElement);

		await waitFor(() => {
			expect(geocodeCity).toHaveBeenCalledWith('London');
			expect(mockSetCities).toHaveBeenCalledWith([{ name: 'London', lat: 51.5, lon: -0.12 }]);
		});
	});

	it('shows alert if city not found', async () => {
		window.alert = jest.fn();
		(geocodeCity as jest.Mock).mockResolvedValueOnce([]);

		renderWithQueryClient(<Home />);

		const inputWrapper = screen.getByTestId('city-add-input');
		const input = inputWrapper.querySelector('input') as HTMLInputElement;
		fireEvent.change(input, { target: { value: 'Unknown' } });
		fireEvent.submit(input.closest('form') as HTMLFormElement);

		await waitFor(() => {
			expect(window.alert).toHaveBeenCalledWith('City not found');
		});
	});

	it('shows alert if city is already added', async () => {
		window.alert = jest.fn();
		(useLocalStorage as jest.Mock).mockReturnValue({
			cities: [{ name: 'Kyiv', lat: 50.45, lon: 30.52 }],
			setCities: mockSetCities,
			hydrated: true,
		});
		(geocodeCity as jest.Mock).mockResolvedValueOnce([{ name: 'Kyiv', lat: 50.45, lon: 30.52 }]);

		renderWithQueryClient(<Home />);

		const inputWrapper = screen.getByTestId('city-add-input');
		const input = inputWrapper.querySelector('input') as HTMLInputElement;
		fireEvent.change(input, { target: { value: 'Kyiv' } });
		fireEvent.submit(input.closest('form') as HTMLFormElement);

		await waitFor(() => {
			expect(window.alert).toHaveBeenCalledWith('City already added');
		});
	});
});
