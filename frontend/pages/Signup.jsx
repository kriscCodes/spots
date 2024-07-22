import { Link } from "react-router-dom";

const Signup = () => {

	// may use this one as a flash for handeling incorrect passwords and whatnot
	// const handleMessage = (e) => {
	// 	setUsername(e.target.value)
	// }
	return (
		<div className="w-full h-full flex flex-col gap-10 items-center justify-center">
			<h1 className="text-3xl">Sign Up</h1>
			<form
				className="flex flex-col gap-5 w-[300px] items-center"
				method="POST"
				action="/signup"
			>
				<div className="flex flex-col gap-2 w-[70%]">
					<label htmlFor="username">Username:</label>
					<input
						className="p-1 bg-[#F8F8F8] rounded-sm shadow-md shadow-[#C9C9C9]"
						type="text"
						id="username"
						name="username"
						required
					/>
				</div>

				<div className="flex flex-col gap-2 w-[70%]">
					<label htmlFor="email">Email:</label>
					<input
						className="p-1 bg-[#F8F8F8] rounded-sm shadow-md shadow-[#C9C9C9]"
						type="email"
						id="email"
						name="email"
						required
					/>
				</div>

				<div className="flex flex-col gap-2 w-[70%]">
					<label htmlFor="password">Password:</label>
					<input
						className="p-1 bg-[#F8F8F8] rounded-sm shadow-md shadow-[#C9C9C9]"
						type="password"
						id="password"
						name="password"
						required
					/>
				</div>

				<div className="flex flex-col gap-2 w-[70%]">
					<label htmlFor="confirm">Confirm Password:</label>
					<input
						className="p-1 bg-[#F8F8F8] rounded-sm shadow-md shadow-[#C9C9C9]"
						type="password"
						id="confirm"
						name="confirm"
						required
					/>
				</div>

				<button
					className="w-fit px-10 py-1 mt-5 bg-[#E9E9E9] shadow-md shadow-[#CCCCCC] rounded-md transition-all hover:bg-[#B8B8B8]"
					type="submit"
				>
					Sign Up
				</button>
			</form>

			<Link
				className="text-blue-500 underline transition-all hover:text-blue-600"
				to="/login"
			>
				Already have an account? Login here
			</Link>
		</div>
	);
};

export default Signup;
