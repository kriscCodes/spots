import {useLocation} from "react-router-dom";
import Rating from '@mui/material/Rating';
import StarIcon from '@mui/icons-material/Star';
import BookmarkBorderOutlinedIcon from '@mui/icons-material/BookmarkBorderOutlined'
import BookmarkOutlinedIcon from '@mui/icons-material/BookmarkOutlined'
import {useEffect, useReducer} from "react";

// ! TODO: FIX SAVED FEATURE

const initState = {
    name: "",
    address: "",
    desc: "",
    imgUrl: "",
    isRestaurant: true,
    rating: 0,
    reviews: [],
    saved: false,
    user: null
}


const actionTypes = {
    SET_DATA: 'SET_DATA',
    SET_RATING_REVIEWS: 'SET_RATING_REVIEWS',
    SET_RATING: 'SET_RATING',
    SET_SAVED: 'SET_SAVED',
    SET_USER: 'SET_USER'
}

const reducer = (state, action) => {
    switch (action.type) {
        case actionTypes.SET_DATA:
            return {
                ...state,
                name: action.pl.name,
                address: action.pl.address,
                desc: action.pl.desc,
                imgUrl: action.pl.imgUrl,
                isRestaurant: action.pl.isRestaurant
            };
        case actionTypes.SET_RATING_REVIEWS:
            return { ...state, rating: action.pl.rating, reviews: action.pl.reviews };
        case actionTypes.SET_RATING:
            return { ...state, rating: action.pl };
        case actionTypes.SET_SAVED:
            return { ...state, saved: action.pl };
        case actionTypes.SET_USER:
            // let userSaved = action.pl.places[state.name]['status']
            // return { ...state, user: action.pl.username, saved: userSaved === 'saved' };
            let userSaved = false;
            console.log('user data2', action.pl);
            if (action.pl.places && action.pl.places[state.name] && action.pl.places[state.name]['status']) {
                userSaved = action.pl.places[state.name]['status'] === 'saved';
            }
            return { ...state, user: action.pl.username, saved: userSaved };
        default:
            return state;
    }
}


function EventPage () {

    const [state, dp] = useReducer(reducer, initState);
    const from = useLocation();

    useEffect(() => {

        const getUserInfo = async () => {
            try {
                const response = await fetch('/api/get-user', {
                    method: 'GET',
                    credentials: 'include'
                });

                if (response.ok) {
                    const data = await response.json();
                    dp({type: actionTypes.SET_USER, pl: data});
                } else {
                    console.error('Failed to fetch username status:', response.statusText);
                }
            } catch (error) {
                console.error('Error checking username status:', error);
            }
        };

        getUserInfo();
    }, [])

    useEffect(() => {
        const fetchPlaceInfo = async () => {
            try {
                await fetch(
                    'https://spots.pythonanywhere.com/api/place-rating-reviews',
                    {
                        method: 'POST',
										headers: { 'Content-Type': 'application/json' },
										body: JSON.stringify({ name: from.state.name }),
									}
								)
									.then((response) => {
										if (response.status === 200) {
											return response.json();
										}
										throw new Error('could not fetch query');
									})
									.then((data) => {
										dp({ type: actionTypes.SET_RATING_REVIEWS, pl: data });
									});
            } catch (e) {
                console.log('error in fetching place info', e);
            }
        }

        fetchPlaceInfo();
        dp({type: actionTypes.SET_DATA, pl: from.state});
    }, []);

    const updateRating = async (newValue) => {
        try {
            const response = await fetch(
                'https://spots.pythonanywhere.com/api/set-rating',
                {
                    method: 'POST',
								headers: { 'Content-Type': 'application/json' },
								body: JSON.stringify({
									name: from.state.name,
									rating: newValue,
								}),
							}
						);
            if (response.ok) {
                console.log('Rating updated successfully');
            } else {
                console.error('Failed to update rating');
            }
        } catch (error) {
            console.error('Error in updating rating:', error);
        }
    }

    const handleChangeReview = (newValue) => {
        dp({type: actionTypes.SET_RATING, pl: newValue});

        updateRating(newValue);
    }

    const updateUserPlaces = async () => {
        try {
            const response = await fetch('https://spots.pythonanywhere.com/api/update-locations', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({user: state.user, name: state.name, status: !state.saved ? 'saved' : 'unsaved'})
            })
            if (response.ok) {
                const data = await response.json()
                console.log(data);
                console.log('Saved updated successfully');
            } else {
                console.error('Failed to update Saved');
            }
        } catch (e) {
            console.error('Failed to update Saved', e);
        }
    }

    const handleSaved = () => {
        dp({type: actionTypes.SET_SAVED, pl: !state.saved});
        updateUserPlaces();
    }


    return (
        <div className='w-full h-full flex '>
            <div
                className='flex flex-col items-center gap-3'
            >
                <img className='h-1/3 object-contain' src={state.imgUrl} alt="" />
                <Rating
                  name="simple-controlled"
                  value={state.rating}
                  precision={0.5}
                  onChange={(event, newValue) => handleChangeReview(newValue)}
                  emptyIcon={<StarIcon style={{ opacity: 0.55 }} fontSize="inherit" />}
                  size="large"
                />
            </div>
            <div
                className='h-2/3 flex flex-col p-5'
            >
                <h1
                    className='text-5xl'
                >
                    {state.name}
                </h1>
                <h2
                    className='text-2xl'
                >
                    {state.address}
                </h2>
                <p
                    className='h-1/4'
                >
                    {state.desc}
                </p>
            </div>
            <div

            >
                {
                    state.user &&
                    <span
                        className='hover:cursor-pointer'
                        onClick={handleSaved}
                    >
                        {
                            state.saved ?
                            <BookmarkOutlinedIcon fontSize='large'/> :
                            <BookmarkBorderOutlinedIcon fontSize='large'/>
                        }
                    </span>
                }
            </div>
        </div>
    );
}

export default EventPage;