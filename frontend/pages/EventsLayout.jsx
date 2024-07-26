/* eslint-disable react/prop-types */
import EventCard from "./EventCard.jsx";
import {useEffect, useReducer} from "react";
import {PropagateLoader} from "react-spinners";

const initState = {
    clickedId: '',
    allEventsLocations: [],
    loading: true,
}

const actionTypes = {
    EVENT_CLICKED: 'EVENT_CLICKED',
    SET_LOADING: 'SET_LOADING',
    SET_ALL: 'SET_ALL'
}

const reducer = (state, action) => {
    switch (action.type) {
        case actionTypes.EVENT_CLICKED:
            return { ...state, clickedId: action.payload };
        case actionTypes.SET_LOADING:
            return { ...state, loading: false };
        case actionTypes.SET_ALL:
            return { ...state, allEventsLocations: action.payload };
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
        const fetchEventsLocations = async (query) => {
            try {
                await fetch ('http://127.0.0.1:2700/api/locations-events', {
                    method: 'POST',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify({location: query})
                })
                    .then(response => {
                            if (response.ok) {
                                return response.json();
                            }
                            throw new Error('could not fetch locations via api');
                        })
                    .then(data => {
                        if (!data) {
                            throw new Error('no data found');
                        }
                        dispatch({type: actionTypes.SET_ALL, payload: data['places']});
                    })
            } catch (e) {
                console.log('Error fetching events or locations', e);
            }
        };

        fetchEventsLocations(props.query);
        const timer = setTimeout( () => {
            dispatch({type: actionTypes.SET_LOADING, payload: false});
        }, 3500);

        return () => clearTimeout(timer);
    }, [])


    return (
        <div
            className='overflow-scroll h-full flex gap-2'
        >
            <div
                // className={`w-3/4 ${state.loading || state.allEventsLocations.length <= 0 ? 'flex items-center justify-center h-full p-2' : ''}`}
                className={`w-3/4 h-full p-2`}
            >
                {
                    state.loading ?
                        <div
                            className='w-full h-full flex items-center justify-center'
                        >
                            <PropagateLoader loading={state.loading} />
                        </div> :
                        state.allEventsLocations.length > 0 ?
                            <div
                                className='grid grid-cols-3 gap-5 px-4 w-full overflow-scroll'
                            >
                                {
                                    state.allEventsLocations.map((data, index) => {
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