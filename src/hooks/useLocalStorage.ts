import { ICity } from '@/interfaces/ICIty';
import { useState, useEffect } from 'react';

const initialValue = [
	{
		name: 'Kyiv',
		lat: 50.450001,
		lon: 30.523333,
	},
	{
		name: 'New York',
		lat: 40.7128,
		lon: -74.006,
	},
];

export function useLocalStorage() {
	const [cities, setCities] = useState<ICity[]>(() => {
		if (typeof window !== 'undefined') {
			const stored = localStorage.getItem('cities');
			return stored ? JSON.parse(stored) : initialValue;
		}
		return initialValue;
	});

	useEffect(() => {
		const stored = localStorage.getItem('cities');
		if (stored) setCities(JSON.parse(stored));
	}, []);

	useEffect(() => {
		localStorage.setItem('cities', JSON.stringify(cities));
	}, [cities]);

	return { cities, setCities };
}
