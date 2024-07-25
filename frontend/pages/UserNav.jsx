import { Link, useLocation } from 'react-router-dom';

const UserNav = (props) => {
	return (
		// each link will have an icon instead
		<div className="w-full py-2 px-5 flex">
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
				<Link
					className="ml-2 bg-[#E9E9E9] rounded-lg px-2 py-1 hover:bg-[#B8B8B8]"
					to={`/user/${props.user.username}`}
				>
					{props.user.username}
				</Link>
			</div>
		</div>
	);
};


export default UserNav;
