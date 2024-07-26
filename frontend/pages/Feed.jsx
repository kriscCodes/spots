import {useParams} from "react-router-dom";
import {useEffect, useReducer, useState} from "react";
import FriendsFeed from "./FriendsFeed.jsx";
import NearbyFeed from "./NearbyFeed.jsx";

const initState = {
    username: '',
    userData: {},
    onNearbyFeed: true
}

const types = {
    SET_USER: 'SET_USER',
    SET_DATA: 'SET_DATA',
    SET_ON_NEARBY_FEED: 'SET_ON_NEARBY_FEED'
}

const reducer = (state, action) => {
    switch (action.type) {
        case types.SET_USER:
            return { ...state, username: action.pl };
        case types.SET_DATA:
            return { ...state, userData: action.pl };
        case types.SET_ON_NEARBY_FEED:
            return { ...state, onNearbyFeed: action.pl };
        default:
            return { ...state };
    }
}

function Feed () {

    const [state, dp] = useReducer(reducer, initState);
    const {username} = useParams();

    const tabStyle = `font-semibold mb-[-4px] rounded-t-md border-t-[2px] border-x-[2px]
        border-t-black border-x-black before:content-["."] before:text-transparent before:-z-10 before:w-full
        before:left-0 before:absolute before:bottom-[2px] before:bg-white before:translate-y-[50%]`

    useEffect( () => {
        dp({type: types.SET_USER, pl: username});

        const fetchUserInfo = async () => {
            try {
                await fetch(`http://127.0.0.1:2700/api/user/${state.username}`)
                    .then(response => {
                        if (response.state === 200) {
                            return response.json();
                        }
                        throw new Error('Did not find user');
                    })
                    .then(data => {
                        dp({type: types.SET_DATA, pl: data});
                    })
            } catch (e) {
                console.error('Error in getting user info', e)
            }
        }

        // fetchUserInfo();
        const mock = {
            'id': 1,
            'username': 'dj',
            'email': 'test@test.com',
            'password': '12345678',
            'visibility': true,
            'friends': {'ids': [
                    2, 3, 4, 5, 6
                ]},
            'events': {
                'names': ['musical event']
            },
            'locations': {
                'names': ['Restaurant']
            }
        }
        dp({type: types.SET_DATA, pl: mock});
    }, [])

    const handleTabClick = (tabName) => {
        if (tabName === 'Near you' && !state.onNearbyFeed) {
            dp({type: types.SET_ON_NEARBY_FEED, pl: true});
        }
        else if (tabName === 'Friends' && state.onNearbyFeed) {
            dp({type: types.SET_ON_NEARBY_FEED, pl: false});
        }
    }


    return (
        <div
            className='relative w-full h-screen flex'
        >
            <div
                className='w-3/4 pr-2 mb-10'
            >
                <header
                    className='h-fit pt-2 px-5 flex items-center'
                >
                    <span className='w-[80%] text-xl font-bold'>
                        Feeds
                    </span>
                    <div
                        className='w-[20%] flex justify-evenly'
                    >
                        <span
                            className={`relative w-1/2 z-10 text-center
                            ${state.onNearbyFeed ? tabStyle : 'text-neutral-400'}`}
                            onClick={() => handleTabClick('Near you')}
                        >
                            Near you
                        </span>
                        <span
                            className={`relative w-1/2 z-10 text-center
                            ${!state.onNearbyFeed ? tabStyle : 'text-neutral-400'}`}
                            // className={`w-1/2 text-center ${!state.onNearbyFeed ? 'font-semibold' : 'text-neutral-400'}`}
                            onClick={() => handleTabClick('Friends')}
                        >
                            Friends
                        </span>
                    </div>
                </header>
                <div
                    // className='h-full border-t-[2px] border-t-black rounded-t-md'
                    className='h-full border-t-[2px] border-t-black border-b-[2px] overflow-scroll border-r-[2px] rounded-tr-md border-black'

                >
                    {
                        state.onNearbyFeed ?
                            <NearbyFeed data={state.userData} /> :
                            <FriendsFeed data={state.userData.friends.ids} />

                    }
                </div>
            </div>
            <div
                className='w-1/4'
            >
                Account stuff
            </div>
        </div>
    )
}

export default Feed;