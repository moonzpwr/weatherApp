import '@testing-library/jest-dom';
import '@testing-library/jest-dom';
import fetchMock from 'jest-fetch-mock';

fetchMock.enableMocks();
process.env.NEXT_PUBLIC_WEATHER_KEY = 'TEST_KEY';
