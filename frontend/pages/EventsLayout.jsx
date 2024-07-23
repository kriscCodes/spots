/* eslint-disable react/prop-types */
import EventCard from "./EventCard.jsx";
import {useEffect, useReducer} from "react";
import {PropagateLoader} from "react-spinners";

const initState = {
    clickedId: '',
    locations: [],
    loading: true,
    hasLocations: false
}

const actionTypes = {
    EVENT_CLICKED: 'EVENT_CLICKED',
    SET_LOCATIONS: 'SET_LOCATIONS',
    SET_HAS_LOCATIONS: 'SET_HAS_LOCATIONS'
}

const reducer = (state, action) => {
    switch (action.type) {
        case actionTypes.EVENT_CLICKED:
            return { ...state, clickedId: action.payload };
        case actionTypes.SET_LOCATIONS:
            return { ...state, locations: action.payload, loading: false, hasLocations: action.payload.length !== 0 };
        case actionTypes.SET_HAS_LOCATIONS:
            return { ...state, hasLocations: action.payload, loading: false }
        default:
            return { ...state };
    }
}

function EventsLayout (props) {

    const [state, dispatch] = useReducer(reducer, initState);

    const handleEventClick = (id) => {
        dispatch({type: actionTypes.EVENT_CLICKED, payload: id});
    }

    useEffect(() => {
        const getLocations = async (query) => {
            try {
                await fetch('http://127.0.0.1:2700/api/locations', {
                    method: 'POST',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify({location: query})
                })
                    .then(response => {
                        if (response.ok) {
                            return response.json();
                        }
                        dispatch({type: actionTypes.SET_HAS_LOCATIONS, payload: false})
                        throw new Error('could not fetch locations via api');
                    })
                    .then(data => {
                        if (!data) {
                            dispatch({type: actionTypes.SET_HAS_LOCATIONS, payload: false})
                            throw new Error('no data found');
                        }
                        console.log(data['places']);
                        dispatch({type: actionTypes.SET_LOCATIONS, payload: data['places']});
                    })
            } catch (e) {
                console.error('Error could not get locations:', e);
            }
        }

        getLocations(props.query);
    }, []);

    return (
        <div
            className='overflow-scroll flex gap-2'
        >
            <div
                className={`w-3/4 ${state.loading || state.locations.length <= 0 ? 'flex items-center justify-center h-full p-2' : ''}`}
            >
                {
                    state.loading ?
                        <PropagateLoader loading={state.loading}/> :
                        state.locations.length > 0 ?
                            <div
                                className='grid grid-cols-3 gap-5 px-4 w-full overflow-scroll'
                            >
                                {
                                    state.locations.map((data, index) => {
                                        return < EventCard
                                            key={index + ' card'}
                                            clickedId={state.clickedId}
                                            delay={index}
                                            data={data}
                                            handleEventClick={handleEventClick}
                                        />
                                    })
                                }
                            </div> :
                            <div>
                                No locations found
                            </div>
                }
            </div>
            <div
                className='w-1/4 z-0'
            >
                Account
            </div>
        </div>
    )
}

export default EventsLayout;