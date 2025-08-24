import { screen } from '@testing-library/react';
import Home from './page';
import { renderWithQueryClient } from '@/test-utils/renderWithQueryClient';

describe('Home Page', () => {
	it('renders the title', () => {
		renderWithQueryClient(<Home />);
		expect(screen.getByText(/Weather App/i)).toBeInTheDocument();
	});
});
