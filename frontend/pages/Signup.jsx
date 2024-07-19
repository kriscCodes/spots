import { Link } from "react-router-dom";

const Signup = () => {

	// may use this one as a flash for handeling incorrect passwords and whatnot
	// const handleMessage = (e) => {
	// 	setUsername(e.target.value)
	// }
	return (
		<div>
			<h1>Sign Up</h1>
			<form method="POST" action="/signup">
				<label htmlFor="username">Username:</label>
				<input type="text" id="username" name="username" required />
				<br />

				<label htmlFor="email">Email:</label>
				<input type="email" id="email" name="email" required />
				<br />

				<label htmlFor="password">Password:</label>
				<input type="password" id="password" name="password" required />
				<br />

				<label htmlFor="confirm">Confirm Password:</label>
				<input type="password" id="confirm" name="confirm" required />
				<br />

				<button type="submit">Sign Up</button>
			</form>

			<Link to='/login'>Already have an account? Login here</Link>
		</div>
	);
};

export default Signup;
