import { render, screen } from '@testing-library/react';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import Home from '@/app/page';

jest.mock('@/hooks/useLocalStorage', () => ({
	useLocalStorage: jest.fn(),
}));

describe('Loading Spinner', () => {
	const mockSetCities = jest.fn();

	beforeEach(() => {
		jest.clearAllMocks();
		(useLocalStorage as jest.Mock).mockReturnValue({
			cities: [],
			setCities: mockSetCities,
			hydrated: true,
		});
	});

	it('renders spinner if data is not loaded', () => {
		(useLocalStorage as jest.Mock).mockReturnValue({
			cities: [],
			setCities: mockSetCities,
			hydrated: false,
		});

		render(<Home />);
		expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
	});
});
