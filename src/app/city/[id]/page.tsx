'use client';
import { getHourly } from '@/api/api';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import Chart from 'chart.js/auto';
import { Bar } from 'react-chartjs-2';
import { CategoryScale } from 'chart.js';
import { useEffect, useState } from 'react';
Chart.register(CategoryScale);

interface ChartDataItem {
	temp: number;
	label: string;
}

export default function CityDetail() {
	const { id } = useParams();
	const { cities } = useLocalStorage();
	const city = cities.find((c) => c.name === decodeURIComponent(id as string));
	const [chartData, setChartData] = useState<ChartDataItem[]>([]);

	const { data, isLoading } = useQuery({
		queryKey: ['hourly', city?.name],
		queryFn: () => getHourly(city!.lat, city!.lon),
		enabled: !!city,
	});

	useEffect(() => {
		if (!data) return;
		const newChartData = data.list.reduce((item: { dt_txt: string; main: { temp: number } }, acc: ChartDataItem[]) => {
			acc.push({ temp: Math.floor(item.main.temp), label: item.dt_txt.slice(5, 16) });
		}, []);
		setChartData(newChartData);
	}, [data]);

	if (!city) return <p>City not found!</p>;

	if (isLoading) return <p>Loading...</p>;

	return (
		<div>
			<h1>Details: {city.name}</h1>
			<Link href='/'>Back</Link>
			<ul>
				<li>Temperature: {Math.floor(data.list[0].main.temp)}°C </li>
				<li>Feels like: {Math.floor(data.list[0].main.feels_like)}°C</li>
				<li>Temperature min: {Math.floor(data.list[0].main.temp_min)}°C</li>
				<li>Temperature max: {Math.floor(data.list[0].main.temp_max)}°C</li>
				<li>Pressure: {data.list[0].main.pressure}</li>
				<li>Humidity: {data.list[0].main.humidity}</li>
				<li>Description: {data.list[0].weather[0].description}</li>
				<li>Wind speed: {data.list[0].wind.speed}</li>
			</ul>
			<Bar
				data={{
					labels: chartData.map((item) => item.label),
					datasets: [{ label: 'Temperature', data: chartData.map((item) => item.temp) }],
				}}
			/>
		</div>
	);
}
