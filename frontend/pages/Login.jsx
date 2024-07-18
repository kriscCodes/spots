import { useState } from 'react'
import { useNavigate } from "react-router-dom";

function Login() {

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const nav = useNavigate()

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!username || !password) {
            console.error('Error: Enter username and password')
            return
        }
        try {
            const response = await fetch('/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username, password })
            });

            if (!response.ok) {
                throw new Error('Error: Login Failed!')
            }
            nav('/')
        } catch (e) {
            console.error(e)
        }
    }


    return (
        <div>
            <h1>Login</h1>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Username:</label>
                    <input type="text" value={username} onChange={(e) => setUsername(e.target.value)}/>
                </div>
                <div>
                    <label>Password:</label>
                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)}/>
                </div>
                <button type='submit'>Login</button>
            </form>
            {/*<a href="{{ url_for('register') }}">Don't have an account? Register here</a>*/}
        </div>
    );
}

export default Login;