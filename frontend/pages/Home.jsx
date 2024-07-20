import { useEffect, useState, useRef } from "react";
import EventCard from "./EventCard.jsx";


const Home = () => {
	const [locations, setLocations] = useState([]);
	const [query, setQuery] = useState("")
	const [submitted, setSubmitted] = useState(false)
	const [isLoading, setIsLoading] = useState(true)
	const [headerHeight, setHeaderHeight] = useState(0)

	const headerRef = useRef(null)

	const getLocations = () => {
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

	useEffect(() => {
		if (headerRef.current) {
			setHeaderHeight(headerRef.current.offsetHeight + 10);
		}
	}, []);


	const handleSubmit = (e) => {
		e.preventDefault();

		if (query === "") {
			return
		}

		setHeaderHeight(headerRef.current.offsetHeight + 10)
		setSubmitted(true)

	}

	const handleTransitionEnd = () => {
		setHeaderHeight(headerRef.current.offsetHeight + 10);

		if (submitted) {
			getLocations();
			setTimeout(()=> {
				setIsLoading(false)
			}, 700)
		}
	}

	return (
		<div className='relative w-full h-screen flex flex-col overflow-scroll'>
			<div
				className={`transition-all bg-white h-fit duration-1000 ease-in-out max-w-[1000px] ${
					submitted ? 'top-0 left-0 w-full full-width-before' : 'top-1/2 left-1/2 pb-32 -translate-x-1/2 -translate-y-1/2 w-10/12 absolute'
				} `}
				onTransitionEnd={handleTransitionEnd}
			>
				<div
					className='w-full h-full flex flex-col items-center p-5  transition-transform duration-300'
				>
					<h1
						className={`absolute top-2  transition-all duration-1000 ease-in-out
						${submitted ? 'text-3xl left-0 transform translate-x-0 px-5' : 
						'text-8xl left-1/2 transform -translate-x-1/2'}`}
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
							onChange={(e) => {setQuery(e.target.value)}}
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

			{!isLoading &&
				<div className='overflow-scroll flex gap-2'>
					<div className='grid grid-cols-3 gap-5 px-4 w-3/4 overflow-scroll'>
						{
							locations.map((name, idx) => <EventCard key={name} delay={idx} name={name} />)
						}
					</div>
					<div className='w-1/4 z-0'>
						Account
					</div>
				</div>
			}
		</div>
	);
};

export default Home;
