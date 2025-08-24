import { render } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactNode } from 'react';

export const renderWithQueryClient = (ui: ReactNode) => {
	const queryClient = new QueryClient();
	return render(<QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>);
};
