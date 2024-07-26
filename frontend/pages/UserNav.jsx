import {Link, useLocation, useNavigate} from 'react-router-dom';

const UserNav = (props) => {

	const nav = useNavigate();

	const logout = async () => {
        await fetch('http://127.0.0.1:2700/api/logout', {
            method: 'POST',
            credentials: 'include'
        });
        nav('/');
    }

	return (
		// each link will have an icon instead
		<div className="w-full py-2 px-5 flex">
			<Link
				className='rounded-lg px-2 text-xl'
				to='/'
			>
				SPOTS
			</Link>
			<div className="w-full flex justify-end">
				<Link
					className="ml-2 bg-[#E9E9E9] rounded-lg px-2 py-1 hover:bg-[#B8B8B8]"
					to="/dashboard"
				>
					Dashboard
				</Link>
				<Link
					className="ml-2 bg-[#E9E9E9] rounded-lg px-2 py-1 hover:bg-[#B8B8B8]"
					to={`/settings/${props.user.username}`}
				>
					Settings
				</Link>
				{/*<Link*/}
				{/*	className="ml-2 bg-[#E9E9E9] rounded-lg px-2 py-1 hover:bg-[#B8B8B8]"*/}
				{/*	to={`/user/${props.user.username}`}*/}
				{/*>*/}
				{/*	{props.user.username}*/}
				{/*</Link>*/}
				<button
					className='bg-[#E9E9E9] rounded-lg px-3 py-1 hover:bg-[#B8B8B8]'
					onClick={logout}
				>
					Log out
				</button>
			</div>
		</div>
	);
};


export default UserNav;
