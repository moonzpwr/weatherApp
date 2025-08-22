'use client';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { getWeather } from '@/api/api';
import { ICity } from '@/interfaces/ICIty';

interface Props {
	city: ICity;
	onRemove: (name: string) => void;
}

export default function CityCard({ city, onRemove }: Props) {
	const { data, refetch, isLoading } = useQuery({
		queryKey: ['weather', city.name],
		queryFn: () => getWeather(city.lat, city.lon),
	});

	if (isLoading) return <div>Loading...</div>;

	return (
		<Link href={`/city/${city.name}`}>
			<div style={{ border: '1px solid gray', padding: '1rem' }}>
				<h2>{city.name}</h2>
				<p>
					{data?.main.temp}°C, {data?.weather[0].description}
				</p>
				<button
					onClick={(e) => {
						e.preventDefault();
						refetch();
					}}
				>
					Refresh
				</button>
				<button
					onClick={(e) => {
						e.preventDefault();
						onRemove(city.name);
					}}
				>
					Delete
				</button>
			</div>
		</Link>
	);
}
