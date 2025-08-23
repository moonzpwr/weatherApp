import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { getWeather } from '@/api/api';
import { ICity } from '@/interfaces/ICIty';
import styles from './CityCard.module.scss';
import { Card, CardActions, CardContent, IconButton, Skeleton, Typography } from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import DeleteIcon from '@mui/icons-material/Delete';

interface Props {
	city: ICity;
	onRemove: (name: string) => void;
}

export default function CityCard({ city, onRemove }: Props) {
	const { data, refetch, isLoading } = useQuery({
		queryKey: ['weather', city.name],
		queryFn: () => getWeather(city.lat, city.lon),
	});

	if (isLoading) {
		return <Skeleton variant='rounded' width={200} height={200} />;
	}

	return (
		<Card variant='outlined' className={styles.card}>
			<Link href={`/city/${city.name}`}>
				<CardContent>
					<Typography variant='h5' gutterBottom>
						{city.name}
					</Typography>
					<Typography className={styles.description}>
						{data?.main.temp}°C, {data?.weather[0].description}
					</Typography>
				</CardContent>
				<CardActions className={styles.actions}>
					<IconButton
						size='small'
						aria-label='refresh'
						color='primary'
						onClick={(e) => {
							e.preventDefault();
							refetch();
						}}
					>
						<RefreshIcon />
					</IconButton>
					<IconButton
						size='small'
						aria-label='delete'
						color='primary'
						onClick={(e) => {
							e.preventDefault();
							onRemove(city.name);
						}}
					>
						<DeleteIcon />
					</IconButton>
				</CardActions>
			</Link>
		</Card>
	);
}
