import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import Home from '../pages/Home';
import Login from "../pages/Login.jsx";
import Signup from '../pages/Signup';
import Navigation from "../pages/Navigation.jsx";
import Dashboard from '../pages/Dashboard.jsx';
import UserProfile from '../pages/UserProfile.jsx';
import EventPage from "../pages/EventPage.jsx";
import Feed from "../pages/Feed.jsx";
import Settings from '../pages/Settings.jsx';

function App() {
	return (
		<div className='h-screen w-screen overflow-hidden'>
			<Router>
				<div className='w-full h-full flex flex-col'>
					<Navigation />
					<Routes>
						<Route path="/" element={<Home />} />
						<Route path="/login" element={<Login />} />
						<Route path="/signup" element={<Signup />} />
						<Route path="/event" element={<EventPage />} />
						<Route path="/dashboard" element={<Dashboard />} />
						<Route path="/user/:username" element={<UserProfile />} />
						<Route path="/feed/:username" element={<Feed />} />
						<Route path="/settings/:username" element={<Settings />} />
					</Routes>
				</div>
			</Router>
		</div>
	);
}

export default App;
