import { render, screen } from '@testing-library/react';
import CityDetail from './page';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { useQuery } from '@tanstack/react-query';
import { useParams } from 'next/navigation';

jest.mock('@/hooks/useLocalStorage');
jest.mock('@tanstack/react-query');
jest.mock('next/navigation', () => ({
	useParams: jest.fn(),
}));
jest.mock('react-chartjs-2', () => ({
	Bar: () => <div data-testid='bar-chart' />,
}));

describe('CityDetail', () => {
	const mockCity = { name: 'Kyiv', lat: 50.45, lon: 30.52 };
	const hourlyData = {
		list: [
			{
				dt_txt: '2025-08-24 12:00:00',
				main: { temp: 20.3, feels_like: 19, temp_min: 18, temp_max: 21, pressure: 1000, humidity: 50 },
				weather: [{ description: 'clear sky' }],
				wind: { speed: 5 },
			},
		],
	};

	beforeEach(() => {
		jest.clearAllMocks();
	});

	it('renders Skeleton while loading', () => {
		(useLocalStorage as jest.Mock).mockReturnValue({ cities: [mockCity] });
		(useParams as jest.Mock).mockReturnValue({ id: 'Kyiv' });
		(useQuery as jest.Mock).mockReturnValue({ data: null, isLoading: true });

		render(<CityDetail />);

		expect(screen.getAllByTestId('skeleton').length).toBeGreaterThan(0);
	});

	it('shows error message if city is not found', () => {
		(useLocalStorage as jest.Mock).mockReturnValue({ cities: [mockCity] });
		(useParams as jest.Mock).mockReturnValue({ id: 'London' });

		render(<CityDetail />);

		expect(screen.getByText(/Oops, city not found/i)).toBeInTheDocument();
	});

	it('renders city weather data when loaded', async () => {
		(useLocalStorage as jest.Mock).mockReturnValue({ cities: [mockCity] });
		(useParams as jest.Mock).mockReturnValue({ id: 'Kyiv' });
		(useQuery as jest.Mock).mockReturnValue({ data: hourlyData, isLoading: false });

		render(<CityDetail />);

		const items = screen.getAllByRole('listitem');

		expect(items[0]).toHaveTextContent('Temperature: 20°C');
		expect(items[1]).toHaveTextContent('Feels like: 19°C');
		expect(items[2]).toHaveTextContent('Temperature min: 18°C');
		expect(items[3]).toHaveTextContent('Temperature max: 21°C');
		expect(items[4]).toHaveTextContent('Pressure: 1000');
		expect(items[5]).toHaveTextContent('Humidity: 50');
		expect(items[6]).toHaveTextContent('Description: clear sky');
		expect(items[7]).toHaveTextContent('Wind speed: 5');
	});

	it('renders chart placeholder', () => {
		(useLocalStorage as jest.Mock).mockReturnValue({ cities: [mockCity] });
		(useParams as jest.Mock).mockReturnValue({ id: 'Kyiv' });
		(useQuery as jest.Mock).mockReturnValue({ data: hourlyData, isLoading: false });

		render(<CityDetail />);

		expect(screen.getByTestId('bar-chart')).toBeInTheDocument();
	});
});
