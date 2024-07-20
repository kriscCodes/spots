import { useEffect, useState, useRef } from "react";


const Home = () => {
	const [locations, setLocations] = useState([]);
	const [submitted, setSubmitted] = useState(false)
	const headerRef = useRef(null)
	const [headerHeight, setHeaderHeight] = useState(0)

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
		// getLocations()
	}, []);

	useEffect(() => {
		if (headerRef.current) {
			setHeaderHeight(headerRef.current.offsetHeight + 20);
		}
	}, []);


	const handleSubmit = (e) => {
		e.preventDefault();
		console.log(e.target)
		setHeaderHeight(headerRef.current.offsetHeight + 20)
		setSubmitted(true)
	}

	const handleTransitionEnd = () => {
		setHeaderHeight(headerRef.current.offsetHeight + 10);
	}

	return (
		<div className='relative w-full h-screen'>
			<div
				className={`transition-all duration-1000 ease-in-out max-w-[1000px] ${
					submitted ? 'top-0 left-0 w-full' : 'top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10/12'
				} absolute`}
				onTransitionEnd={handleTransitionEnd}
			>
				<div
					className='w-full h-full flex flex-col items-center p-5 pb-32 transition-transform duration-300'
				>
					<h1
						className={`absolute top-2  transition-all duration-1000 ease-in-out ${submitted ? 'text-3xl left-0 transform translate-x-0 px-5' : 'text-8xl left-1/2 transform -translate-x-1/2'}`}
						ref={headerRef}
					>
						SPOT
					</h1>
					<form
						className='w-full h-full flex gap-5 transition duration-100'
						style={{ marginTop: `${headerHeight}px` }}
						onSubmit={(e) => handleSubmit(e)}>
						<input
							className='w-[80%] px-3 py-2 bg-[#F8F8F8] transition rounded-md shadow-[#C9C9C9] shadow-md
							border focus:outline-none focus:shadow-blue-300 focus:border-blue-400'
							onChange={(e) => {}}
							placeholder='Enter a city, region ...'
							type="text"
						/>
						<input
							className='w-[20%] transition-all rounded-lg shadow-md shadow-[#C9C9C9] bg-[#E9E9E9]
							hover:bg-[#B8B8B8] hover:cursor-pointer'
							value='Find Events'
							type="submit"
						/>
					</form>
				</div>
			</div>
		</div>
	);
};

export default Home;
