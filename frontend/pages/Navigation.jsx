import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

function Navigation () {
    const location = useLocation();
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [username, setUsername] = useState(null);
    const nav = useNavigate();


    const logout = async () => {
        await fetch('/logout', {
            method: 'GET',
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

        if (isLoggedIn) {
            getUserInfo();
        } else {
            checkLoginStatus();
        }

    }, [isLoggedIn]);

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
                            to={`/feed/:${username}`}>Feed
                        </Link>
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
                location.pathname === `/feed/:${username}` && (
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
        </div>
    );
}

export default Navigation;