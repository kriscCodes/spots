import { useState } from 'react'
import { useNavigate, Link } from "react-router-dom";

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
        <div className='w-full h-full flex flex-col gap-10 items-center justify-center'>
            <h1 className='text-3xl'>Login</h1>
            <form className='flex flex-col gap-5 w-[300px] items-center' onSubmit={handleSubmit}>
                <div className='flex flex-col gap-2 w-[70%]'>
                    <label>Username</label>
                    <input
                        className='p-1 bg-[#F8F8F8] transition border rounded-sm shadow-md shadow-[#C9C9C9]
                        focus:outline-none focus:border-blue-400 focus:bg-[#DDDDDD] hover:bg-[#DDDDDD]'
                        type="text" value={username}
                        onChange={(e) => setUsername(e.target.value)}/>
                </div>
                <div className='flex flex-col gap-2 w-[70%]'>
                    <label>Password</label>
                    <input
                        className='p-1 bg-[#F8F8F8] transition border rounded-sm shadow-md shadow-[#C9C9C9]
                        focus:outline-none focus:border-blue-400 focus:bg-[#DDDDDD] hover:bg-[#DDDDDD]'
                        type="password" value={password}
                        onChange={(e) => setPassword(e.target.value)}/>
                </div>
                <button
                    className='w-fit px-10 py-1 mt-5 bg-[#E9E9E9] shadow-md shadow-[#CCCCCC] rounded-md transition-all hover:cursor-pointer hover:bg-[#B8B8B8]'
                    type='submit'>Login
                </button>
            </form>
            <Link className='text-blue-500 underline transition-all hover:text-blue-600' to='/signup'>New? Sign up here</Link>
        </div>
    );
}

export default Login;