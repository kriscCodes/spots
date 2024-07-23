import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';
const UserProfile = () => {
	const { username } = useParams();

	const [user, setUser] = useState({});
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);


	useEffect(() => {
		// Define the async function to fetch data
		const fetchData = async () => {

            const endpoint = username
            console.log(username)
            try {
                const response = await axios.get(`http://127.0.0.1:2700/api/user/${endpoint}`)
                setUser({...response.data})
            } catch (err) {
                console.log(err)
            }
			// try {
			// 	const response = await axios.get(
			// 		`http://127.0.0.1:2700/api/user/${username}`,
			// 		{
			// 			headers: { 'Content-Type': 'application/json' },
			// 		}
			// 	);
			// 	setUser(response.data);
			// 	console.log(username);
			// } catch (error) {
			// 	setError(error);
			// } finally {
			// 	setLoading(false);
			// }
		};

		fetchData();
	}, []); // Empty dependency array means this effect runs once on mount

	// if (loading) {
	// 	return <div>Loading...</div>;
	// }

	// if (error) {
	// 	return <div>Error: {error.message}</div>;
	// }

	return (
		<div>
			<h1>{user.username}</h1>
		</div>
	);
};

export default UserProfile;
