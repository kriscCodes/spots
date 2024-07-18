import {BrowserRouter as Router, Link, Route, Routes} from 'react-router-dom';
import Home from '../pages/Home';
import Login from "../pages/Login.jsx";
import './App.css';

function App() {
	return (
		<>
			<Router>
				<Link to='/login'>Login</Link>
				<div className="App">
					<Routes>
						<Route path="/" element={<Home />} />
						<Route path="/login" element={<Login />} />
					</Routes>
				</div>
			</Router>
		</>
	);
}

export default App;
