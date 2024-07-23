import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
function Login() {
	const [username, setUsername] = useState('');
	const [password, setPassword] = useState('');

	const handleUsername = (e) => {
		setUsername(e.target.value);
	};
	const handlePassword = (e) => {
		setPassword(e.target.value);
	};
	const nav = useNavigate();

	const handleSubmit = async (e) => {
		e.preventDefault();

		if (!username || !password) {
			console.error('Error: Enter username and password');
			return;
		}
		console.log('here')
		try {
			const response = await fetch('http://127.0.0.1:2700/api/login', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ username, password }),
			});

			if (response.ok) {
				window.location.href = `/user/${username}`;
			}
			
			if (!response.ok) {
				throw new Error('Error: Login Failed!');
			}
		} catch (e) {
			console.error(e);
		}
	};

	return (
		<div className="w-full h-full flex flex-col gap-10 items-center justify-center">
			<h1 className="text-3xl">Login</h1>
			<form
				className="flex flex-col gap-5 w-[300px] items-center"
				onSubmit={handleSubmit}
			>
				<div className="flex flex-col gap-2 w-[70%]">
					<label>Username</label>
					<input
						className="p-1 bg-[#F8F8F8] rounded-sm shadow-md shadow-[#C9C9C9]"
						type="text"
						value={username}
						onChange={handleUsername}
					/>
				</div>
				<div className="flex flex-col gap-2 w-[70%]">
					<label>Password</label>
					<input
						className="p-1 bg-[#F8F8F8] rounded-sm shadow-md shadow-[#C9C9C9] caret-black"
						type="password"
						value={password}
						onChange={handlePassword}
					/>
				</div>
				<button
					className="w-fit px-10 py-1 mt-5 bg-[#E9E9E9] shadow-md shadow-[#CCCCCC] rounded-md transition-all hover:bg-[#B8B8B8]"
					type="submit"
				>
					Login
				</button>
			</form>
			<Link
				className="text-blue-500 underline transition-all hover:text-blue-600"
				to="/signup"
			>
				New? Sign up here
			</Link>
		</div>
	);
}

export default Login;
