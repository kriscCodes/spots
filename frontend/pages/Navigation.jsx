import {Link, useLocation} from "react-router-dom";

function Navigation () {
    const location = useLocation();
    return (
        <>
            {location.pathname === '/' && <Link to='/login'>Login</Link>}
        </>
    );
}

export default Navigation;