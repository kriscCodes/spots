import { useEffect, useState } from "react";


const Home = () => {
	const [locations, setLocations] = useState([])

	useEffect(() => {
		const getLocations = async () => {
			try {
				const data = ['La Bocca', 'Fogo de Chão Brazilian Steakhouse', 'Serafina Italian Restaurant White Plains', 'Turkish Cuisine White Plains', "Mulino's of Westchester", "Morton's The Steakhouse", 'Inca & Gaucho Restaurant', 'Chazz Palminteri Italian Restaurant White Plains', 'Colombian House Restaurant', 'Bonchon White Plains - Main St', 'Asopao Cuisine Restaurant', 'Via Garibaldi', 'Greca Estiatorio', 'Little Drunken Chef', 'Thai Den Restaurant', 'The Melting Pot', 'Shiraz Kitchen & Wine Bar', 'Kanopi', 'Gaucho Burger Company', 'Holy Crab Cajun Seafood']
				setLocations(data)
				// uncomment to get real locations; otherwise mock data above will be used
				// const response = await fetch('http://127.0.0.1:2700/api/locations')
				// console.log((response.json()
				// 	.then((data) => {
				// 		console.log('data', data)
				// 		setLocations(data['names'])
				// 	})))
			} catch (e) {
				console.error('Error in getting locations', e)
			}
		}

		getLocations()
	}, []);

	return (
		<div>
			<h1>weccdfdfffdee</h1>
			<p>This is the home page of your React application.</p>
			{locations.map((location) => (
				<p key={location}>{location}</p>
			))}
		</div>
	);
};

export default Home;
