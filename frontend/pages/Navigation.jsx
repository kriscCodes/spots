import {Link, useLocation} from "react-router-dom";

function Navigation () {
    const location = useLocation();
    return (
        <div className='w-full py-2 px-5 flex'>
            {
                location.pathname === '/'
                &&
                <Link
                    className='ml-auto bg-[#E9E9E9] rounded-lg px-2 py-1 hover:bg-[#B8B8B8]'
                    to='/login'>Login
                </Link>
            }
            {
                (location.pathname === '/signup' || location.pathname === '/login')
                &&
                <Link
                    className='rounded-lg px-2 text-xl'
                    to='/'
                >
                    SPOT
                </Link>
            }
        </div>
    );
}

export default Navigation;