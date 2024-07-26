import {useEffect, useState} from "react";


function FriendCard (props) {
    console.log(props.friendId)
    const [friendData, setFriendData] = useState({});

    useEffect( () => {
        // dp({type: types.SET_USER, pl: username});

        const fetchFriendData = async () => {
            try {
                await fetch(`http://127.0.0.1:2700/api/user/${state.username}`)
                    .then(response => {
                        if (response.state === 200) {
                            return response.json();
                        }
                        throw new Error('Did not find user');
                    })
                    .then(data => {
                        // dp({type: types.SET_DATA, pl: data});
                        setFriendData(data)
                    })
            } catch (e) {
                console.error('Error in getting user info', e)
            }
        }

        // fetchFriendData();
        const mock = {
            'id': 2,
            'username': 'friend 2',
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
        setFriendData(mock);
        // dp({type: types.SET_DATA, pl: mock});
    }, [])

    return (
        !friendData.visibility ? <></> :
        <div
            className='min-h-[200px] w-full bg-red-400 rounded-lg z-20 overflow-scroll p-4'
        >
            <span
                className='font-semibold text-lg'
            >
                {friendData.username}
            </span>
            <div>
                I am going to {friendData.events.names[0]}
            </div>
        </div>
    )
}

export default FriendCard;