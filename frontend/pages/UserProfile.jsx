import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import UserNav from './UserNav';
import axios from 'axios';
const UserProfile = () => {
	const { username } = useParams();
	const [user, setUser] = useState({});
// TO SEE STUFF HERE I NEED TO MAKE CREATE WAY FOR USER TO SAVE EVENT
	useEffect(() => {
		// Define the async function to fetch data
		const fetchData = async () => {

            const endpoint = username
            console.log(username)
            try {
                const response = await axios.get(`http://127.0.0.1:2700/api/user/${endpoint}`)
                setUser({...response.data})
                console.log(user)

            } catch (err) {
                console.log(err)
            }
		};

		fetchData();
	}, []); 

	return (
		<div className="relative w-full h-screen flex flex-col overflow-scroll">
			<UserNav user={user} />
			<h1>Collection</h1>
            <div>
                {/* map all the events the user has saved */}
            </div>
		</div>
	);
};

export default UserProfile;
