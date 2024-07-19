import {BrowserRouter as Router, Link, Route, Routes} from 'react-router-dom';
import Home from '../pages/Home';
import Login from "../pages/Login.jsx";
import Signup from '../pages/Signup';
import Navigation from "../pages/Navigation.jsx";

function App() {
	return (
		<div className='h-screen w-screen overflow-hidden'>
			<Router>
				<div className='w-full h-full'>
					<Navigation />
					<Routes>
						<Route path="/" element={<Home />} />
						<Route path="/login" element={<Login />} />
						<Route path="/signup" element={<Signup />} />
					</Routes>
				</div>
			</Router>
		</div>
	);
}

export default App;
