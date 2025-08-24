'use client';
import { getHourly } from '@/api/api';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { useQuery } from '@tanstack/react-query';
import { useParams } from 'next/navigation';
import { Chart, defaults } from 'chart.js/auto';
import { Bar } from 'react-chartjs-2';
import { CategoryScale } from 'chart.js';
import { useEffect, useState } from 'react';
import styles from './page.module.scss';
import { Button, Skeleton } from '@mui/material';

Chart.register(CategoryScale);

defaults.maintainAspectRatio = false;
defaults.responsive = true;

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
		const newChartData = data.list.reduce((acc: ChartDataItem[], item: { dt_txt: string; main: { temp: number } }) => {
			acc.push({ temp: Math.floor(item.main.temp), label: item.dt_txt.slice(5, 16) });
			return acc;
		}, []);
		setChartData(newChartData);
	}, [data]);

	if (!city) return <p>Oops, city not found, try another one!</p>;

	if (isLoading)
		return (
			<div className={styles.skeletonContainer}>
				<h1 className={styles.skeletonTitle}>
					<Skeleton variant='rounded' width={200} height={34} data-testid='skeleton' />
				</h1>
				<ul className={styles.skeletonList}>
					<li>
						<Skeleton variant='rounded' width={200} height={20} data-testid='skeleton' />
					</li>
					<li>
						<Skeleton variant='rounded' width={200} height={20} data-testid='skeleton' />
					</li>
					<li>
						<Skeleton variant='rounded' width={200} height={20} data-testid='skeleton' />
					</li>
					<li>
						<Skeleton variant='rounded' width={200} height={20} data-testid='skeleton' />
					</li>
					<li>
						<Skeleton variant='rounded' width={200} height={20} data-testid='skeleton' />
					</li>
					<li>
						<Skeleton variant='rounded' width={200} height={20} data-testid='skeleton' />
					</li>
					<li>
						<Skeleton variant='rounded' width={200} height={20} data-testid='skeleton' />
					</li>
					<li>
						<Skeleton variant='rounded' width={200} height={20} data-testid='skeleton' />
					</li>
				</ul>
				<div className={styles.skeletonButton}>
					<Skeleton variant='rounded' width={150} height={40} data-testid='skeleton' />
				</div>
			</div>
		);

	return (
		<div>
			<h1 className={styles.title}>{city.name}</h1>
			<ul className={styles.list}>
				<li>
					Temperature: <b>{Math.floor(data.list[0].main.temp)}°C</b>
				</li>
				<li>
					Feels like: <b>{Math.floor(data.list[0].main.feels_like)}°C</b>
				</li>
				<li>
					Temperature min: <b>{Math.floor(data.list[0].main.temp_min)}°C</b>
				</li>
				<li>
					Temperature max: <b>{Math.floor(data.list[0].main.temp_max)}°C</b>
				</li>
				<li>
					Pressure: <b>{data.list[0].main.pressure}</b>
				</li>
				<li>
					Humidity: <b>{data.list[0].main.humidity}</b>
				</li>
				<li>
					Description: <b>{data.list[0].weather[0].description}</b>
				</li>
				<li>
					Wind speed: <b>{data.list[0].wind.speed}</b>
				</li>
			</ul>
			<Button href='/' variant='contained'>
				Back to home
			</Button>
			<div className={styles.chart}>
				<div className={styles.chartInnerContainer}>
					<Bar
						data={{
							labels: chartData.map((item) => item.label),
							datasets: [{ label: 'Temperature', data: chartData.map((item) => item.temp) }],
						}}
					/>
				</div>
			</div>
		</div>
	);
}
