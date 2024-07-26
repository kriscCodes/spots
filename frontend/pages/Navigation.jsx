import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

function Navigation () {
    const location = useLocation();
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [username, setUsername] = useState(null);
    const nav = useNavigate();

    // console.log(location.pathname)
    // console.log(`/user/${username}`)
    // console.log(location.pathname === `/user/${username}`)


    const logout = async () => {
        await fetch('http://127.0.0.1:2700/api/logout', {
            method: 'POST',
            credentials: 'include'
        });
        setIsLoggedIn(false);
        setUsername(null);
        nav('/');
    }


    useEffect(() => {
        const checkLoginStatus = async () => {
            try {
                const response = await fetch('/api/is-logged-in', {
                    method: 'GET',
                    credentials: 'include'
                });

                if (response.ok) {
                    const data = await response.json();
                    setIsLoggedIn(data.loggedIn);
                } else {
                    console.error('Failed to fetch login status:', response.statusText);
                }
            } catch (error) {
                console.error('Error checking login status:', error);
            }
        };

        const getUserInfo = async () => {
            try {
                const response = await fetch('/api/get-user', {
                    method: 'GET',
                    credentials: 'include'
                });

                if (response.ok) {
                    const data = await response.json();
                    setUsername(data.username);
                } else {
                    console.error('Failed to fetch username status:', response.statusText);
                }
            } catch (error) {
                console.error('Error checking username status:', error);
            }
        };

        console.log('1', isLoggedIn)
        if (isLoggedIn) {
            console.log('2', isLoggedIn)

            getUserInfo();
        } else {
            checkLoginStatus();
        }

    }, []);

    return (
        <div className='w-full py-2 px-5 flex'>
            {
                location.pathname === '/' && !isLoggedIn && (
                    <div className="w-full flex items-center justify-end gap-2 py-2">
                        <Link
                            className='bg-[#E9E9E9] rounded-lg px-3 py-1 hover:bg-[#B8B8B8]'
                            to='/login'
                        >
                            Login
                        </Link>
                        <Link
                            className="bg-[#E9E9E9] rounded-lg px-3 py-1 hover:bg-[#B8B8B8] mr-2" to="/signup"
                        >
                            Join Today
                        </Link>
                    </div>
                )
            }
            {
                location.pathname === '/' && isLoggedIn && (
                    <div className="w-full flex items-center justify-end gap-2 py-2">
                        <Link
                            className='bg-[#E9E9E9] rounded-lg px-3 py-1 hover:bg-[#B8B8B8]'
                            to={`/user/:${username}`}>Profile
                        </Link>
                        <Link
                            className='bg-[#E9E9E9] rounded-lg px-3 py-1 hover:bg-[#B8B8B8]'
                            to={`/feed/:${username}`}>Dashboard
                        </Link>
                        <button
                            className='bg-[#E9E9E9] rounded-lg px-3 py-1 hover:bg-[#B8B8B8]'
                            onClick={logout}
                        >
                            Log out
                        </button>
                    </div>
                )
            }
            {
                (location.pathname === '/signup' || location.pathname === '/login')
                &&
                <Link
                    className='rounded-lg px-2 text-xl'
                    to='/'
                >
                    SPOTS
                </Link>
            }
            {
                // location.pathname === `/feed/:${username}` && (
                location.pathname === `/dashboard` && (
                    <div
                        className="w-full flex items-center justify-between gap-2 py-2"
                    >
                        <Link
                            className='rounded-lg px-2 text-xl'
                            to='/'
                        >
                            SPOTS
                        </Link>
                        <button
                            className='bg-[#E9E9E9] rounded-lg px-3 py-1 hover:bg-[#B8B8B8]'
                            onClick={logout}
                        >
                            Log out
                        </button>
                    </div>
                )
            }
            {
                (location.pathname === `/user/${username}` || location.pathname.includes('/feed/')) && (
                    <div
                        className="w-full flex items-center justify-between gap-2 py-2"
                    >
                        <Link
                            className='rounded-lg px-2 text-xl'
                            to='/'
                        >
                            SPOTS
                        </Link>
                        <button
                            className='bg-[#E9E9E9] rounded-lg px-3 py-1 hover:bg-[#B8B8B8]'
                            onClick={logout}
                        >
                            Log out
                        </button>
                    </div>
                )
            }
            {
                location.pathname.includes('/event') && isLoggedIn && (
                    <div
                        className="w-full flex items-center justify-between gap-2 py-2"
                    >
                        <Link
                            className='rounded-lg px-2 text-xl'
                            to='/'
                        >
                            SPOTS
                        </Link>
                        <div className="w-full flex items-center justify-end gap-2 py-2">
                            <Link
                                className='bg-[#E9E9E9] rounded-lg px-3 py-1 hover:bg-[#B8B8B8]'
                                to={`/user/:${username}`}>Profile
                            </Link>
                            <Link
                                className='bg-[#E9E9E9] rounded-lg px-3 py-1 hover:bg-[#B8B8B8]'
                                to={`/feed/:${username}`}>Dashboard
                            </Link>
                            <button
                                className='bg-[#E9E9E9] rounded-lg px-3 py-1 hover:bg-[#B8B8B8]'
                                onClick={logout}
                            >
                                Log out
                            </button>
                        </div>
                    </div>
                )
            }
            {
            location.pathname.includes('/event') && !isLoggedIn && (
                    <Link
                        className='rounded-lg px-2 text-xl'
                        to='/'
                    >
                        SPOTS
                    </Link>
                )
            }
        </div>
    );
}

export default Navigation;