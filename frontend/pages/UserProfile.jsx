// import { useParams } from 'react-router-dom';
// import { useEffect, useState } from 'react';
// import UserNav from './UserNav';
// import axios from 'axios';
// const UserProfile = () => {
//     const { username } = useParams();
//     const [user, setUser] = useState({ places: [] });
// // TO SEE STUFF HERE I NEED TO MAKE CREATE WAY FOR USER TO SAVE EVENT
//     useEffect(() => {
//         // Define the async function to fetch data
//         	const fetchData = async () => {
//
//                 const endpoint = username
//                 // console.log(username)
//                 try {
//                     const response = await axios.get(`http://127.0.0.1:2700/api/user/${endpoint}`)
//                     setUser({...response.data})
//                     // console.log(user)
//
//                 } catch (err) {
//                     console.log(err)
//                 }
//         	};
//
//
//         // console.log('username', username)
//         fetchData();
//     }, [username]);
//
//     useEffect(() => {
//         console.log('data', user);
//     }, [user])
//
//     return (
//         <div className="relative w-full h-screen flex flex-col overflow-scroll">
//             <UserNav user={user} />
//             <h1>Collection</h1>
//             <div
//                 className='rounded-lg border-[3px] border-black'
//             >
//                 {/*{*/}
//                 {/*    user.places && user['places'].map(data => {*/}
//                 {/*        console.log('dataaa', data)*/}
//                 {/*        return (*/}
//                 {/*            <div*/}
//                 {/*                className={`transition min-h-[120px] flex items-center gap-5 justify-center*/}
//                 {/*                rounded-lg hover:cursor-pointer hover:bg-[#B8B8B8] w-full`}*/}
//                 {/*            >*/}
//                 {/*                 {data}*/}
//                 {/*             </div>*/}
//                 {/*         )*/}
//                 {/*     })*/}
//                 {/*}*/}
//                 {user.places && user.places.length > 0 ? (
//                     user.places.map((data, index) => (
//                         <div
//                             key={index}
//                             className={`transition min-h-[120px] flex items-center gap-5 justify-center
//                             rounded-lg hover:cursor-pointer hover:bg-[#B8B8B8] w-full`}
//                         >
//                             {JSON.stringify(data)}
//                         </div>
//                     ))
//                 ) : (
//                     <p>No places found</p>
//                 )}
//             </div>
//         </div>
//     );
// };
//
// export default UserProfile;

import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import UserNav from './UserNav';
import axios from 'axios';

const UserProfile = () => {
    const { username } = useParams();
    const [user, setUser] = useState({ places: [] });
    const [loading, setLoading] = useState(true); // Add loading state

    useEffect(() => {
        const fetchData = async () => {
            const endpoint = username;
            try {
                console.log('Fetching data for user:', endpoint);
                const response = await axios.get(`http://127.0.0.1:2700/api/user/${endpoint}`);
                console.log('Response data:', response.data);

                // Ensure places is an array
                // const placesArray = Array.isArray(response.data.places)
                //     ? response.data.places
                //     : Object.values(response.data.places);
                // const placesArray = Object.entries(response.data.places).map(([name, status]) => ({ [name]: status }));
                const placesArray = Object.entries(response.data.places).map(([name, status]) => ({ name, status }));


                setUser({ ...response.data, places: placesArray });
                setLoading(false); // Set loading to false after data is fetched
            } catch (err) {
                console.error('Error fetching user data:', err);
                setLoading(false); // Set loading to false even if there's an error
            }
        };

        fetchData();
    }, [username]);

    useEffect(() => {
        console.log('Updated user data:', user);
    }, [user]);

    return (
        <div className="relative w-full h-screen flex flex-col overflow-scroll">
            <UserNav user={user} />
            <h1 className={'mx-5 font-bold text-xl'}>Collection: </h1>
            <div className='rounded-lg border-[3px] border-black m-5'>
                {loading ? (
                    <p>Loading...</p> // Show loading indicator while data is being fetched
                ) : (
                    user.places && user.places.length > 0 ? (
                        user.places.map((place, index) => (
                            <div
                                key={index}
                                className={`transition min-h-[120px] flex items-center gap-5 justify-center
                                rounded-lg hover:cursor-pointer hover:bg-[#B8B8B8] w-full`}
                            >
                                <p className={'text-lg font-bold'}>{place.name}</p>
                            </div>
                        ))
                    ) : (
                        <p>No places found</p>
                    )
                )}
            </div>
        </div>
    );
};

export default UserProfile;
