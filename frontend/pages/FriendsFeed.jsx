import FriendCard from "./FriendCard.jsx";
import {useState} from "react";

function FriendsFeed (props) {

    const [friends, setFriends] = useState(props.data);
    console.log(friends)

    return (
        <div
            className='w-full h-full p-5 flex flex-col gap-5 overflow-scroll items-center'
        >
            {
                friends.map(number => (
                    <FriendCard key={'friend' + number} friendId={number} />
                ))
            }
        </div>
    )
}

export default FriendsFeed;