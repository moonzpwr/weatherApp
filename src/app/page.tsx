'use client';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import styles from './page.module.scss';
import { geocodeCity } from '@/api/api';
import CityCard from '@/components/CityCard/CityCard';
import AddCityForm from '@/components/AddCityForm/AddCityForm';

export default function Home() {
	const { cities, setCities } = useLocalStorage();

	const addCity = async (nameToAdd: string) => {
		const geo = await geocodeCity(nameToAdd);
		if (!geo.length) return alert('City not found');
		const { lat, lon, name } = geo[0];
		if (cities.find((c) => c.name === name)) return alert('City already added');
		setCities([...cities, { name, lat, lon }]);
	};

	const removeCity = (name: string) => setCities(cities.filter((c) => c.name !== name));

	return (
		<div>
			<h1 className={styles.title}>Weather App</h1>
			<div className={styles.cardsList}>
				<AddCityForm onAdd={addCity} />
				{cities.map((c) => (
					<CityCard city={c} key={c.name} onRemove={removeCity} />
				))}
			</div>
		</div>
	);
}
