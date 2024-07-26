import {useEffect, useReducer, useState} from "react";
import Rating from "@mui/material/Rating";
import { useLocation } from "react-router-dom";
import StarIcon from "@mui/icons-material/Star";
import BookmarkOutlinedIcon from "@mui/icons-material/BookmarkOutlined";
import BookmarkBorderOutlinedIcon from "@mui/icons-material/BookmarkBorderOutlined";

const initState = {
    name: "",
    address: "",
    description: "",
    imgUrl: "",
    isRestaurant: false,
    rating: 0,
    reviews: [],
    saved: false,
    user: null,
    review: ""
}

const actionTypes = {
    SET_DATA: 'SET_DATA',
    SET_RATING_REVIEWS: 'SET_RATING_REVIEWS',
    SET_RATING: 'SET_RATING',
    SET_SAVED: 'SET_SAVED',
    SET_USER: 'SET_USER',
    SET_REVIEW: 'SET_REVIEW',
    SET_REVIEWS: 'SET_REVIEWS'
}

const reducer = (state, action) => {
    switch (action.type) {
        case actionTypes.SET_DATA:
            return {
                ...state,
                name: action.pl.name,
                address: action.pl.address,
                description: action.pl.desc,
                imgUrl: action.pl.imgUrl,
                isRestaurant: action.pl.isRestaurant
            };
        case actionTypes.SET_RATING_REVIEWS:
            return { ...state, rating: parseInt(action.pl.rating), reviews: action.pl.reviews };
        case actionTypes.SET_RATING:
            return { ...state, rating: parseInt(action.pl) };
        case actionTypes.SET_SAVED:
            return { ...state, saved: action.pl };
        case actionTypes.SET_USER:
            return {
                ...state,
                user: action.pl.username,
                saved: (action.pl.places?.[state.name]?.status ?? '') === 'saved'
            };
        case actionTypes.SET_REVIEW:
            return { ...state, review: action.pl };
        case actionTypes.SET_REVIEWS:
            // console.log(action.pl.reviews)
            // console.log(typeof action.pl.reviews)
            return { ...state, reviews: [...action.pl['reviews']] };
        default:
            return state;
    }
}

function EventPage () {

    const [state, dp] = useReducer(reducer, initState);
    const from = useLocation();
    const max = 200;
    const [refresh, setRefresh] = useState(0);
    console.log(state.reviews)

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

        const fetchPlaceInfo = async () => {
            try {
                await fetch('http://127.0.0.1:2700/api/place-rating-reviews', {
                    method: 'POST',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify({name: from.state.name})
                })
                    .then(response => {
                        if (response.status === 200) {
                            return response.json();
                        }
                        throw new Error('could not fetch query');
                    })
                    .then(data => {
                        console.log(data)
                        dp({type: actionTypes.SET_RATING_REVIEWS, pl: data});
                    })
            } catch (e) {
                console.log('error in fetching place info', e);
            }
        };

        getUserInfo();
        fetchPlaceInfo();
        dp({type: actionTypes.SET_DATA, pl: from.state});
    }, []);


    const updateRating = async (newValue) => {
        try {
            const response = await fetch('http://127.0.0.1:2700/api/set-rating', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({name: from.state.name, rating: newValue})
            })
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
            const response = await fetch('http://127.0.0.1:2700/api/update-locations', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({user: state.user, name: state.name, status: !state.saved ? 'saved' : 'unsaved'})
            })
            if (response.ok) {
                const data = await response.json()
                // console.log(data);
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

    const handleTypeReview = (text) => {
        if (text.length > max) {
            return
        }
        dp({type: actionTypes.SET_REVIEW, pl: text});
    }

    const handleReviewSubmit = (e) => {
        e.preventDefault();
        updateReview();
        setTimeout(() => {
            dp({type: actionTypes.SET_REVIEW, pl: ""})
        }, 50)
    }

    const updateReview = async () => {
        try {
            await fetch('http://127.0.0.1:2700/api/set-review', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({user: state.user, name: state.name, review: state.review})
            })
                .then(response => {
                    if (response.status === 200) {
                        return response.json();
                    }
                    throw new Error('could not fetch query');
                })
                .then(data => {
                    console.log(data)
                    dp({type: actionTypes.SET_REVIEWS, pl: data});
                })
        } catch (e) {
            console.log('error in fetching place info', e);
        }
    }


    return (
        <div className='w-full h-full flex p-7'>
            <div
                className='flex flex-col items-center gap-2'
            >
                <img className='h-1/3 object-contain' src={state.imgUrl} alt=""/>
                <div
                    className='w-full flex justify-evenly'
                >
                    <Rating
                        name="simple-controlled"
                        value={state.rating}
                        precision={0.5}
                        onChange={(event, newValue) => handleChangeReview(newValue)}
                        emptyIcon={<StarIcon style={{opacity: 0.55}} fontSize="inherit"/>}
                        size="large"
                    />
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
                <form
                    className='w-full h-[100px] flex flex-col'
                    onSubmit={(e) => handleReviewSubmit(e)}
                >
                    <input
                        className='border-black border-[3px] p-3 rounded-lg'
                        value={state.review}
                        onChange={(e) => handleTypeReview(e.target.value)}
                        type="text"
                        placeholder='Add your review...'
                    />
                    <div
                        className='flex justify-between p-2'
                    >
                        <p>{parseInt(max) - parseInt(state.review.length)} chars left</p>
                        <input
                            type="submit"
                            className='px-2 py-1 transition shadow-md shadow-[#C9C9C9] bg-[#E9E9E9]
                            hover:bg-[#B8B8B8] hover:cursor-pointer'
                        />
                    </div>
                </form>
            </div>
            <div
                className='w-full h-full flex flex-col p-5'
            >
                <div
                    className='h-fit flex flex-col p-5'
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
                        {state.description}
                    </p>
                </div>
                <div
                    className='h-full w-full border-[3px] rounded-lg border-black'
                >
                    {
                        state.reviews.length > 0 ?
                            <div
                                className='w-full h-full flex flex-col gap-4'
                            >
                                {
                                    state.reviews.map(data => {
                                        return (
                                            <div
                                                className='w-full h-[100px] p-3 flex flex-col border-b-[2px] border-b-neutral-400'
                                            >
                                                <div
                                                    className='flex justify-between'
                                                >
                                                    <p className='text-lg font-semibold'>{data.username}</p>
                                                    <p>{data.created_at}</p>
                                                </div>
                                                <p>{data.comment}</p>
                                            </div>
                                        )
                                    })
                                }
                            </div> :
                            <div
                                className='border-[3px] border-black flex items-center justify-center rounded-lg h-[100px] p-5'
                            >
                                No Reviews yet..
                            </div>
                    }
                </div>
            </div>
        </div>
    );

}

export default EventPage;