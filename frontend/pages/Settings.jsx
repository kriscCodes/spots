import { useParams, useNavigate } from 'react-router-dom';
import { useContext, useEffect, useState } from 'react';
import UserNav from './UserNav';
import axios from 'axios';
const Settings = () => {
	let { username } = useParams();
	const [user, setUser] = useState({});
	const [privacy, setPrivacy] = useState(false);
	const [name, setName] = useState('');
	const [email, setEmail] = useState('')
	const [nameForm, setNameForm] = useState(false);
	const [emailForm, setEmailForm] = useState(false);
    let nav = useNavigate();
	useEffect(() => {
		
		const fetchData = async () => {
			console.log(username);
			try {
				const response = await axios.get(
					`http://127.0.0.1:2700/api/user/${username}`
				);
				setUser({ ...response.data });
				console.log(response.data);
				setPrivacy(response.data.visibility);
				// console.log(name, email);
			} catch (err) {
				console.log(err);
			}
		};

		fetchData();
	}, [username]);

	const handlePrivacy = async () => {
		// make call here to udpate users privacy in database
		try {
			await axios.put(`http://127.0.0.1:2700/api/user/${username}/privacy`, {
				visibility: !privacy,
			});
			console.log(user.visibility);
			window.location.reload();
		} catch (err) {
			console.log(err);
		}
	};

	const handleNameForm = () => {
		
		setNameForm(true);
		setName(user.username); // Set the current username as the initial value
		
	};
	const handleEmailForm = () => {
		
		setEmailForm(true); // Set the current email as the initial value
		setEmail(user.email)
	};

	const handleNameChange = (e) => {
		setName(e.target.value);
	};

	const handleEmailChange = (e) => {
		setEmail(e.target.value);
	};

const handleNameSubmit = async (e) => {
    if (e) e.preventDefault(); // Prevent form submission if it's triggered by a form
    console.log("handleNameSubmit function called");
    try {
        console.log("Attempting to update username...");
        console.log("Current username:", username);
        console.log("New username:", name);
        const response = await axios.put(
            `http://127.0.0.1:2700/api/user/${username}/username`,
            {
                user_name: name,
            }
        );

        console.log("PUT request response:", response);

        if (response.status === 200) {
            const { new_username } = response.data;
            console.log("Username updated successfully to:", new_username);
            setNameForm(false);

            console.log("Attempting to log out...");
            try {
                const logoutResponse = await axios.post('http://127.0.0.1:2700/api/logout');
                console.log("Logout response:", logoutResponse);
                if (logoutResponse.status === 200) {
                    console.log("Logout successful");
                    console.log("Redirecting to login page...");
                    nav('/login');
                } else {
                    console.error("Unexpected logout response:", logoutResponse);
                }
            } catch (logoutError) {
                console.error("Error during logout:", logoutError);
                if (logoutError.response) {
                    console.error("Logout server responded with:", logoutError.response.status, logoutError.response.data);
                }
            }
        }
    } catch (err) {
        console.error("Error in handleNameSubmit:", err);
        if (err.response) {
            console.error("Server responded with:", err.response.status, err.response.data);
        }
    }
};

	const handleEmailSubmit = async (e) => {
    if (e) e.preventDefault(); // Prevent form submission if it's triggered by a form
    console.log("handleEmailSubmit function called");
    try {
        console.log("Attempting to update email...");
        console.log("Current username:", username);
        console.log("New email:", email);
        const response = await axios.put(
            `http://127.0.0.1:2700/api/user/${username}/email`,
            {
                email: email,
            }
        );

        console.log("PUT request response:", response);

        if (response.status === 200) {
            const { new_email } = response.data;
            console.log("Email updated successfully to:", new_email);
            setEmailForm(false);

            console.log("Attempting to log out...");
            try {
                const logoutResponse = await axios.post('http://127.0.0.1:2700/api/logout');
                console.log("Logout response:", logoutResponse);
                if (logoutResponse.status === 200) {
                    console.log("Logout successful");
                    console.log("Redirecting to login page...");
                    nav('/login');
                } else {
                    console.error("Unexpected logout response:", logoutResponse);
                }
            } catch (logoutError) {
                console.error("Error during logout:", logoutError);
                if (logoutError.response) {
                    console.error("Logout server responded with:", logoutError.response.status, logoutError.response.data);
                }
            }
        }
    } catch (err) {
        console.error("Error in handleEmailSubmit:", err);
        if (err.response) {
            console.error("Server responded with:", err.response.status, err.response.data);
        }
    }

	};

	const Private = 'Private';
	const Public = 'Public';

	return (
		<div className="w-full h-full flex flex-col justify-center items-center gap-10">
			<UserNav user={user} />
			<h1 className="text-5xl">Settings</h1>
			<div className="w-full h-full flex flex-col gap-8 items-center justify-around">
				<div className="w-1/4 flex gap-5 justify-start">
					<h3 className="text py-1">Username: </h3>
					{nameForm ? (
						<form onSubmit={handleNameSubmit} method="PUT">
							<input
								className="p-1 bg-[#F8F8F8] rounded-sm shadow-md shadow-[#C9C9C9]"
								onChange={handleNameChange}
								value={name}
								type="text"
							></input>
						</form>
					) : (
						<button
							className="flex-1 px-10 py-1 bg-[#E9E9E9] shadow-md shadow-[#CCCCCC] rounded-md transition-all hover:bg-[#B8B8B8]"
							type="submit"
							onClick={handleNameForm}
						>
							{user.username}
						</button>
					)}
				</div>
				<div className="w-1/4 flex gap-5 justify-start">
					<h3 className="text py-1">Email: </h3>
					{emailForm ? (
						<form>
							<input className="flex-1" type="text"></input>
						</form>
					) : (
						<button
							className="flex-1 px-10 py-1 bg-[#E9E9E9] shadow-md shadow-[#CCCCCC] rounded-md transition-all hover:bg-[#B8B8B8]"
							type="submit"
							onClick={handleEmailForm}
						>
							{user.email}
						</button>
					)}
				</div>
				<div className="w-1/4 flex gap-5 justify-start">
					<h3 className="text py-1">Privacy: </h3>
					<button
						className="flex-1 px-10 py-1 bg-[#E9E9E9] shadow-md shadow-[#CCCCCC] rounded-md transition-all hover:bg-[#B8B8B8]"
						type="submit"
						onClick={handlePrivacy}
					>
						{user.visibility ? Public : Private}
					</button>
				</div>
			</div>
		</div>
	);
};

export default Settings;