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
    SET_LOCATIONS: 'SET_LOCATIONS',
    SET_HAS_LOCATIONS: 'SET_HAS_LOCATIONS',
    SET_EVENTS: 'SET_EVENTS',
    ADD_ITEMS: 'ADD_ITEMS',
    SET_ALL: 'SET_ALL'
}

const reducer = (state, action) => {
    switch (action.type) {
        case actionTypes.EVENT_CLICKED:
            return { ...state, clickedId: action.payload };
        case actionTypes.SET_LOADING:
            return { ...state, loading: false };
        // case actionTypes.SET_LOCATIONS:
        //     return { ...state, allEventsLocations: action.payload, loading: false, hasLocations: action.payload.length !== 0 };
        // case actionTypes.SET_EVENTS:
        //     return { ...state, allEventsLocations: state.locations.append()};
        // case actionTypes.ADD_ITEMS:
        //     return { ...state, allEventsLocations: [ ...state.allEventsLocations, ...action.payload], loading: false }
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
                            // dispatch({type: actionTypes.SET_HAS_LOCATIONS, payload: false})
                            throw new Error('could not fetch locations via api');
                        })
                    .then(data => {
                        if (!data) {
                            // dispatch({type: actionTypes.SET_HAS_LOCATIONS, payload: false})
                            throw new Error('no data found');
                        }
                        console.log(data['places']);
                        dispatch({type: actionTypes.SET_ALL, payload: data['places']});
                        // dispatch({type: actionTypes.SET_LOCATIONS, payload: data['places']});
                        // dispatch({type: actionTypes.ADD_ITEMS, payload: data['places']});
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

    // useEffect(() => {
    //     const getLocations = async (query) => {
    //         try {
    //             await fetch('http://127.0.0.1:2700/api/locations', {
    //                 method: 'POST',
    //                 headers: {'Content-Type': 'application/json'},
    //                 body: JSON.stringify({location: query})
    //             })
    //                 .then(response => {
    //                     if (response.ok) {
    //                         return response.json();
    //                     }
    //                     // dispatch({type: actionTypes.SET_HAS_LOCATIONS, payload: false})
    //                     throw new Error('could not fetch locations via api');
    //                 })
    //                 .then(data => {
    //                     if (!data) {
    //                         // dispatch({type: actionTypes.SET_HAS_LOCATIONS, payload: false})
    //                         throw new Error('no data found');
    //                     }
    //                     console.log(data['places']);
    //                     // dispatch({type: actionTypes.SET_LOCATIONS, payload: data['places']});
    //                     dispatch({type: actionTypes.ADD_ITEMS, payload: data['places']});
    //
    //                 })
    //         } catch (e) {
    //             console.error('Error could not get locations:', e);
    //         }
    //     }
    //
    //     getLocations(props.query);
    // }, []);

    // useEffect(() => {
    //     const getGoogleEvents = async (query) => {
    //         try {
    //             await fetch('http://127.0.0.1:2700/api/search', {
    //                 method: 'POST',
    //                 headers: {'Content-Type': 'application/json'},
    //                 body: JSON.stringify({location: query})
    //             })
    //                 .then(response => {
    //                     if (response.status === 200) {
    //                         return response.json();
    //                     }
    //                     throw new Error('Failed to fetch events from search api');
    //                 })
    //                 .then(data => {
    //                     if(!data) {
    //                         throw new Error('no events found');
    //                     }
    //                     console.log('events', data['events']);
    //                     dispatch({type: actionTypes.ADD_ITEMS, payload: data['events']});
    //                 })
    //         } catch (e) {
    //             console.error('Error in getting events');
    //         }
    //     };
    //
    //     getGoogleEvents(props.query);
    // }, []);

    // useEffect(() => {
    //     if (state.loadLocations && state.loadEvents) {
    //         dispatch({type: actionTypes.SET_LOADING, payload: true});
    //     }
    // }, [state.loadLocations, state.loadEvents]);

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