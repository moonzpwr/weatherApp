import { Button, Card, CardActions, CardContent, TextField, Typography } from '@mui/material';
import { useState } from 'react';
import styles from './AddCityForm.module.scss';
import SendIcon from '@mui/icons-material/Send';

interface Props {
	onAdd: (name: string) => void;
}

export default function AddCityForm({ onAdd }: Props) {
	const [city, setCity] = useState('');
	return (
		<Card variant='outlined' className={styles.card}>
			<form
				onSubmit={(e) => {
					e.preventDefault();
					onAdd(city);
					setCity('');
				}}
			>
				<CardContent>
					<Typography variant='h5' gutterBottom>
						Add City
					</Typography>
					<TextField
						size='small'
						label='City name'
						variant='filled'
						value={city}
						onChange={(e) => setCity(e.target.value)}
					/>
				</CardContent>
				<CardActions className={styles.actions}>
					<Button variant='contained' endIcon={<SendIcon />} type='submit'>
						Submit
					</Button>
				</CardActions>
			</form>
		</Card>
	);
}
