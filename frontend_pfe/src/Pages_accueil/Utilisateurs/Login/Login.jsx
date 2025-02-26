import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import './Login.css';
import bg from '../../../Assets/wave (2).svg'

function Login() {
    const navigate = useNavigate();
    const [error, setError] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const submit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(
                `http://localhost:5000/login`,
                { email, password },
                {
                    headers: {
                        "Content-Type": "application/json",
                        "Method": "POST",
                    }
                }
            );
            const { data } = response;
            localStorage.setItem('token', data.token);
            localStorage.setItem('email', email);
            localStorage.setItem('name', data.user.name);
            if (data.user.role === 'admin') {
                navigate("/besoins");
            } else if (data.user.isDeleted === true) {
                setError("User is already deleted by Admin.");
                console.log("User is already deleted by Admin");
            } else if (data.user.role === 'user') {
                navigate("/home");
            }
            else {
                navigate('/pending')
            }
        } catch (error) {
            if (error.response) {
                setError(error.response.data.message);
            } else {
                setError("An unexpected error occurred. Please try again later.");
            }
        }
    };

    return (
        <><div className="card-container">
            <button className="button-back" onClick={()=>{
                navigate("/")
            }}>back</button>
            <div className="card">
                <form onSubmit={submit} className="form">
                    <h1>Login</h1>
                    <input className="input2" type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
                    <input className="input2" type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
                    <button type="submit" className="btn">Login</button>
                    <div>
                        <p>Vous n'avez pas de compte ?<Link to="/signup" className="a">Signup</Link></p>
                    </div>
                </form>
                {error && <div className="error-message">{error}</div>}
            </div>
        </div>
            <img src={bg} alt="" className="bg-image" /></>

    );
}

export default Login;
