const API_KEY = process.env.NEXT_PUBLIC_WEATHER_KEY;

export async function geocodeCity(city: string) {
	const res = await fetch(`https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${API_KEY}`);
	return res.json();
}

export async function getWeather(lat: number, lon: number) {
	const res = await fetch(
		`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
	);
	return res.json();
}

export async function getHourly(lat: number, lon: number) {
	const res = await fetch(
		`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
	);
	return res.json();
}
