import { geocodeCity, getWeather, getHourly } from './api';

describe('Weather API', () => {
	beforeEach(() => {
		fetchMock.resetMocks();
	});

	it('should correctly call geocodeCity and return data', async () => {
		const mockResponse = [{ name: 'Kyiv', lat: 50.45, lon: 30.52 }];
		fetchMock.mockResponseOnce(JSON.stringify(mockResponse));

		const result = await geocodeCity('Kyiv');

		expect(fetch).toHaveBeenCalledWith('https://api.openweathermap.org/geo/1.0/direct?q=Kyiv&limit=1&appid=TEST_KEY');
		expect(result).toEqual(mockResponse);
	});

	it('should correctly call getWeather and return data', async () => {
		const mockResponse = { main: { temp: 22 }, weather: [{ description: 'clear sky' }] };
		fetchMock.mockResponseOnce(JSON.stringify(mockResponse));

		const result = await getWeather(50.45, 30.52);

		expect(fetch).toHaveBeenCalledWith(
			'https://api.openweathermap.org/data/2.5/weather?lat=50.45&lon=30.52&appid=TEST_KEY&units=metric'
		);
		expect(result).toEqual(mockResponse);
	});

	it('should correctly call getHourly and return data', async () => {
		const mockResponse = { list: [{ dt: 123456, main: { temp: 18 } }] };
		fetchMock.mockResponseOnce(JSON.stringify(mockResponse));

		const result = await getHourly(50.45, 30.52);

		expect(fetch).toHaveBeenCalledWith(
			'https://api.openweathermap.org/data/2.5/forecast?lat=50.45&lon=30.52&appid=TEST_KEY&units=metric'
		);
		expect(result).toEqual(mockResponse);
	});

	it('should throw an error on unsuccessful request', async () => {
		fetchMock.mockRejectOnce(new Error('Network error'));

		await expect(geocodeCity('Kyiv')).rejects.toThrow('Network error');
	});
});
