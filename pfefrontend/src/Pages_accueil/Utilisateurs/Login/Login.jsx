import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { FiArrowLeft, FiMail, FiLock, FiEye, FiEyeOff } from "react-icons/fi";
import './Login.css';
import bg from '../../../Assets/wave (2).svg';

function Login() {
    const navigate = useNavigate();
    const [error, setError] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const submit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');
        
        try {
            const response = await axios.post(`${import.meta.env.VITE_API_URL}/login`,
                { email, password },
                {
                    headers: {
                        "Content-Type": "application/json",
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
                setError("Your account has been deactivated by Admin.");
            } else if (data.user.role === 'user') {
                navigate("/home");
            } else if (data.user.role === 'controller') {
                navigate("/besoins");
            } else {
                navigate('/pending')
            }
        } catch (error) {
            if (error.response) {
                setError(error.response.data.message || "Invalid credentials. Please try again.");
            } else {
                setError("An unexpected error occurred. Please try again later.");
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="login-page">
            <button className="button-back" onClick={() => navigate("/")}>
                <FiArrowLeft size={20} />
            </button>
            
            <div className="login-container">
                <div className="login-card">
                    <div className="login-header">
                        <h1>Welcome Back</h1>
                        <p>Sign in to access your account</p>
                    </div>
                    
                    <form onSubmit={submit} className="login-form">
                        <div className="input-group">
                            <FiMail className="input-icon" />
                            <input
                                type="email"
                                placeholder="Email Address"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                        
                        <div className="input-group">
                            <FiLock className="input-icon" />
                            <input
                                type={showPassword ? "text" : "password"}
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                            <button 
                                type="button" 
                                className="password-toggle"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? <FiEyeOff /> : <FiEye />}
                            </button>
                        </div>
                        
                        <div className="forgot-password">
                            <Link to="/forgot-password">Forgot password?</Link>
                        </div>
                        
                        <button 
                            type="submit" 
                            className="login-button" 
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <span className="spinner"></span>
                            ) : (
                                "Sign In"
                            )}
                        </button>
                        
                        {error && <div className="error-message">{error}</div>}
                        
                        <div className="signup-link">
                            Don't have an account? <Link to="/signup">Sign up</Link>
                        </div>
                    </form>
                </div>
            </div>
            
            <img src={bg} alt="background wave" className="bg-image" />
        </div>
    );
}

export default Login;
