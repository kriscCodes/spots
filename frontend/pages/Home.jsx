import EventsLayout from "./EventsLayout.jsx";
import {useEffect, useReducer, useRef} from "react";
import {debounce} from "lodash";

const initState = {
    query: '',
    suggestions: [],
    headerHeight: 0,
    showEvents: false,
    submitQuery: false,
    finished: false
}

const actionTypes = {
    SET_QUERY: 'SET_QUERY',
    QUERY_SUBMITTED: 'QUERY_SUBMITTED',
    SET_SUGGESTIONS: 'SET_SUGGESTIONS',
    SET_HEADER_HEIGHT: 'SET_HEADER_HEIGHT',
    SET_SHOW_EVENTS: 'SET_SHOW_EVENTS',
    SET_SUBMIT_QUERY: 'SET_SUBMIT_QUERY',
    SUGGESTION_CLICKED: 'SUGGESTION_CLICKED'
}

const reducer = (state, action) => {
    switch (action.type) {
        case actionTypes.SET_QUERY:
            return { ...state, query: action.payload };
        case actionTypes.SET_SUGGESTIONS:
            return { ...state, suggestions: action.payload };
        case actionTypes.SET_HEADER_HEIGHT:
            return { ...state, headerHeight: action.payload };
        case actionTypes.SET_SHOW_EVENTS:
            return { ...state, showEvents: true };
        case actionTypes.SET_SUBMIT_QUERY:
            return { ...state, submitQuery: true, headerHeight: action.payload };
        case actionTypes.QUERY_SUBMITTED:
            return { ...state, suggestions: [], headerHeight: action.payload, showEvents: true, finished: true};
        case actionTypes.SUGGESTION_CLICKED:
            return { ...state, suggestions: [], query: action.payload };
        default:
            return state;
    }
}


function Home () {
    const [state, dispatch] = useReducer(reducer, initState);
    const headerRef = useRef(null);

    useEffect(() => {
        if (headerRef.current) {
            dispatch({type: actionTypes.SET_HEADER_HEIGHT, payload: headerRef.current.offsetHeight + 10});
        }
    }, [])

    const getSuggestions = async (query) => {
        try {
            await fetch('https://spots.pythonanywhere.com/api/query', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({query: query})
            })
                .then(response => {
                    if (response.status === 200) {
                        return response.json();
                    }

                    dispatch({type: actionTypes.SET_SUGGESTIONS, payload: []});
                    throw new Error('could not fetch query');
                })
                .then(data => {
                    const suggestionsList = data.body;
                    const suggestions = Object.keys(suggestionsList).map(key => [
                        suggestionsList[key][0],
                        (key).split(' ').map(w => w[0].toUpperCase() + w.substring(1).toLowerCase()).join(' '),
                        suggestionsList[key][1]
                    ]);

                    dispatch({type: actionTypes.SET_SUGGESTIONS, payload: suggestions});
                })
        } catch (e) {
            console.error('Error in getting suggestions:', e);
        }
    }

    const debouncedSetQuery = debounce(query => {
        dispatch({type: actionTypes.SET_QUERY, payload: query});
        getSuggestions(query);
    }, 30);

    const handleSearchbarChange = (event) => {
        debouncedSetQuery(event.target.value);
    }

    const handleSubmitQuery = (event) => {
        event.preventDefault();

        if (state.query === "") {
            return
        }

        dispatch({type: actionTypes.SET_SUBMIT_QUERY, payload: headerRef.current.offsetHeight + 10});
    }

    const handleSuggestionClicked = (suggestionName) => {
        dispatch({type: actionTypes.SUGGESTION_CLICKED, payload: suggestionName});
    }

    const handleTransitionEnd = () => {
        // CHANGING
        if (state.submitQuery && !state.finished) {
            // dispatch({type: actionTypes.SET_HEADER_HEIGHT, payload: headerRef.current.offsetHeight + 10});
            dispatch({type: actionTypes.QUERY_SUBMITTED, payload: headerRef.current.offsetHeight + 10});
        }
    }

    return (
        <div
            className='relative w-full h-screen flex flex-col overflow-scroll'
        >
            <div
                className={`transition-all bg-white h-fit duration-1000 ease-in-out max-w-[1000px]
                ${state.submitQuery ? 'top-0 left-0 w-full full-width-before' :
                'top-1/2 left-1/2 pb-32 -translate-x-1/2 -translate-y-1/2 w-10/12 absolute'}`}
                onTransitionEnd={handleTransitionEnd}
            >
                <div
                    className='w-full h-full flex flex-col items-center p-5 transition-transform duration-300'
                >
                    <h1
                        className={`absolute top-2 transition-all duration-1000 ease-in-out
                        ${state.submitQuery ? 'text-3xl left-0 transform translate-x-0 px-5' :
                        'text-8xl left-1/2 transform -translate-x-1/2'}`}
                        ref={headerRef}
                    >
                        SPOTS
                    </h1>
                    <form
                        className='w-full h-full flex gap-5 transition duration-100'
                        style={{marginTop: `${state.headerHeight}px`}}
                        onSubmit={handleSubmitQuery}
                    >
                        <div
                            className='w-[80%]'
                        >
                            <input
                                className='w-full px-3 py-2 bg-[#F8F8F8] transition rounded-md shadow-[#C9C9C9]
                                shadow-md border focus:outline-none focus:shadow-blue-300 focus:border-blue-400'
                                placeholder='Enter a city, region...'
                                value={state.query}
                                type="text"
                                onChange={handleSearchbarChange}
                            />
                            {/* suggested locations */}
                            {
                                state.query && !state.submitQuery &&
                                <div
                                    className="absolute flex flex-col w-[75%] mt-1"
                                >
                                    {
                                        state.suggestions.map(location => {
                                            const locCommaSep = location.join(', ');
                                            const locString = location.join(' ');
                                            return (
                                                <div
                                                    key={location}
                                                    className='w-full py-1 px-2 transition duration-75 border border-neutral-300
                                                    hover:bg-[#B8B8B8] hover:cursor-pointer hover:scale-105'
                                                    onClick={() => handleSuggestionClicked(locString)}
                                                >
                                                    {/* bold chars that match query */}
                                                    {
                                                        locCommaSep.split('').map((char, index) => (
                                                            state.query.toLowerCase().includes(char.toLowerCase()) ?
                                                                <span key={char + index} className='font-bold'>{char}</span> :
                                                                <span key={char + index}>{char}</span>
                                                        ))
                                                    }
                                                </div>
                                            )
                                        })
                                    }
                                </div>
                            }
                        </div>
                        <input
                            className='w-[20%] transition-all rounded-lg shadow-md shadow-[#C9C9C9] bg-[#E9E9E9]
                            hover:bg-[#B8B8B8] hover:cursor-pointer'
                            value='Find Events'
                            type="submit"
                        />
                    </form>
                </div>
            </div>
            {
                state.showEvents &&
                <EventsLayout
                    query={state.query}
                />
            }
        </div>
    )
}

export default Home;