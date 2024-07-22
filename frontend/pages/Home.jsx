import { useEffect, useState } from 'react';

const Home = () => {
	const [locations, setLocations] = useState([]);
	const [filter, setFilter] = useState('');

	useEffect(() => {
		const getLocations = async () => {
			try {
				const data = [
					'La Bocca',
					'Fogo de Chão Brazilian Steakhouse',
					'Serafina Italian Restaurant White Plains',
					'Turkish Cuisine White Plains',
					"Mulino's of Westchester",
					"Morton's The Steakhouse",
					'Inca & Gaucho Restaurant',
					'Chazz Palminteri Italian Restaurant White Plains',
					'Colombian House Restaurant',
					'Bonchon White Plains - Main St',
					'Asopao Cuisine Restaurant',
					'Via Garibaldi',
					'Greca Estiatorio',
					'Little Drunken Chef',
					'Thai Den Restaurant',
					'The Melting Pot',
					'Shiraz Kitchen & Wine Bar',
					'Kanopi',
					'Gaucho Burger Company',
					'Holy Crab Cajun Seafood',
				];
				setLocations(data);
				// uncomment to get real locations; otherwise mock data above will be used
				// const response = await fetch('http://127.0.0.1:2700/api/locations')
				// console.log((response.json()
				// 	.then((data) => {
				// 		console.log('data', data)
				// 		setLocations(data['names'])
				// 	})))
			} catch (e) {
				console.error('Error in getting locations', e);
			}
		};

		getLocations();
	}, []);

	let filteredLocations = locations.filter((location) =>
		location.toLowerCase().includes(filter.toLowerCase())
	);

	return (
		<div className="w-full h-full flex flex-col gap-10 items-center justify-center">
			<h1 className="text-5xl">SPOT</h1>
			<div className="w-full flex justify-center gap-5">
				<div className="w-[50%]">
					<input
						type="text"
						placeholder="enter in a city or region"
						className="w-[100%] p-1 bg-[#F8F8F8] rounded-sm shadow-md shadow-[#C9C9C9]"
						value={filter}
						onChange={(e) => setFilter(e.target.value)}
					></input>
				</div>
				<button className="w-fit px-10 py-1 bg-[#F8F8F8] shadow-md shadow-[#C9C9C9] rounded-md transition-all hover:bg-[#B8B8B8]">
					Find Events
				</button>
			</div>
			<ul className="list-disc list-inside">
				{filteredLocations.map((location, index) => (
					<li key={index}>{location}</li>
				))}
			</ul>
		</div>
	);
};

export default Home;
