import { useEffect, useReducer, useRef } from 'react';
import { debounce } from 'lodash';
import EventCard from "./EventCard.jsx";

// Initial state for the reducer
const initialState = {
  locations: [],
  query: '',
  isLoading: true,
  headerHeight: 0,
  results: [],
};

// Action types for the reducer
const actionTypes = {
  SET_QUERY: 'SET_QUERY',
  SET_LOCATIONS: 'SET_LOCATIONS',
  SET_LOADING: 'SET_LOADING',
  SET_HEADER_HEIGHT: 'SET_HEADER_HEIGHT',
  SET_RESULTS: 'SET_RESULTS',
};

// Reducer function to manage state
const reducer = (state, action) => {
  switch (action.type) {
    case actionTypes.SET_QUERY:
      return { ...state, query: action.payload };
    case actionTypes.SET_LOCATIONS:
      return { ...state, locations: action.payload, isLoading: false };
    case actionTypes.SET_LOADING:
      return { ...state, isLoading: action.payload };
    case actionTypes.SET_HEADER_HEIGHT:
      return { ...state, headerHeight: action.payload };
    case actionTypes.SET_RESULTS:
      return { ...state, results: action.payload };
    default:
      return state;
  }
};

const Test = () => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const headerRef = useRef(null);

  // Debounced function to set query state
  const debouncedSetQuery = debounce((query) => {
    dispatch({ type: actionTypes.SET_QUERY, payload: query });
  }, 50);

  const fetchLocations = async (query) => {
    dispatch({ type: actionTypes.SET_LOADING, payload: true });
    try {
      const response = await fetch('http://127.0.0.1:2700/api/locations', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({ location: query })
      });
      if (response.ok) {
        const data = await response.json();
        dispatch({ type: actionTypes.SET_LOCATIONS, payload: data.places });
      } else {
        throw new Error('Error receiving locations');
      }
    } catch (error) {
      console.error('Problem fetching locations', error);
      dispatch({ type: actionTypes.SET_LOADING, payload: false });
    }
  };

  // Effect for fetching locations based on query
  useEffect(() => {
    if (state.query) {
      fetchLocations(state.query);
    }
  }, [state.query]);

  // Effect for handling header height adjustment
  useEffect(() => {
    if (headerRef.current) {
      dispatch({ type: actionTypes.SET_HEADER_HEIGHT, payload: headerRef.current.offsetHeight + 10 });
    }
  }, []);

  const handleInputChange = (event) => {
    debouncedSetQuery(event.target.value);
  };

  return (
    <div>
      <input
        type="text"
        value={state.query}
        onChange={handleInputChange}
        placeholder="Search for locations"
      />
      {!state.isLoading && (
        <div className="results">
          {state.locations.map((loc, idx) => (
            <EventCard key={idx} info={loc} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Test;
