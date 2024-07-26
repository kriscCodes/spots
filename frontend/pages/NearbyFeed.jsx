import NearbyCard from "./NearbyCard.jsx";
import { useEffect, useState } from "react";

function NearbyFeed (props) {

    const [locations, setLocations] = useState([]);
    const [sortedLocations, setSortedLocations] = useState([]);
    const [clickedId, setClickedId] = useState('')

    useEffect(() => {
        const fetchNearbyAreas = async () => {
            try {
                const response = await fetch('http://127.0.0.1:2700/api/get-nearby-places', {
                    method: 'GET',
                    credentials: 'include'
                });

                if (response.ok) {
                    const data = await response.json();
                    setLocations(data['places']);
                    // setSortedLocations(data['places']); // Initial render in the order returned
                } else {
                    throw new Error('Failed to get places');
                }
            } catch (e) {
                console.log(e);
            }
        }

        fetchNearbyAreas();
    }, []);

    useEffect(() => {
        // if (locations.length > 0) {
            const highRating = locations.filter(obj => obj.rating >= props.filter);
            const lowRating = locations.filter(obj => obj.rating < props.filter);

            highRating.sort((a, b) => b.rating - a.rating);
            lowRating.sort((a, b) => b.rating - a.rating);

            setSortedLocations([...highRating, ...lowRating]);
        // }
    }, [locations]);

    const handleEventClick = (newId) => {
        setClickedId(newId);
    }

    return (
        <div className='w-full h-full p-5 overflow-scroll'>
            <div className='grid grid-cols-2 gap-5 px-4 w-full overflow-scroll'>
                {
                    sortedLocations.length > 0 && sortedLocations.map((data, index) => (
                        <NearbyCard
                            key={index + ' card'}
                            delay={index}
                            data={data}
                            clickedId={clickedId}
                            handleEventClick={handleEventClick}
                            rating={parseInt(data.rating)}
                        />
                    ))
                }
            </div>
        </div>
    )
}

export default NearbyFeed;
