import { useState } from 'react';

interface Props {
	onAdd: (name: string) => void;
}

export default function AddCityForm({ onAdd }: Props) {
	const [city, setCity] = useState('');
	return (
		<form
			onSubmit={(e) => {
				e.preventDefault();
				onAdd(city);
			}}
		>
			AddCityForm
			<input type='text' name='city' placeholder='City name' value={city} onChange={(e) => setCity(e.target.value)} />
			<button type='submit'>Submit</button>
		</form>
	);
}
