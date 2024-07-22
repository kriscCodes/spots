import {Link, useLocation} from "react-router-dom";

function Navigation () {
    const location = useLocation();
    return (
			<>
				{location.pathname === '/' && (
					<div className="w-full flex justify-between">
						<Link className="ml-2" to="/login">Login</Link>
						<Link className="mr-2" to="/signup">Join Today</Link>
					</div>
				)}
			</>
		);
}

export default Navigation;