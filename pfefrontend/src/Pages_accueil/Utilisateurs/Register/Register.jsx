import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { FiArrowLeft, FiUpload } from "react-icons/fi";
import './Register.css';
import bg from '../../../Assets/wave (2).svg';

function Signup() {
    const navigate = useNavigate();
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [fileName, setFileName] = useState('');

    const [formData, setFormData] = useState({
        name: '',
        phoneNumber: '',
        email: '',
        password: '',
        fileBase64: '',
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFileName(file.name);
            const reader = new FileReader();
            reader.onloadend = () => {
                setFormData({ ...formData, fileBase64: reader.result });
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (isSubmitting) return;
        setIsSubmitting(true);
        setError('');

        const { name, phoneNumber, email, password, fileBase64 } = formData;
        if (!name || !phoneNumber || !email || !password || !fileBase64) {
            setError("Please fill in all fields.");
            setIsSubmitting(false);
            return;
        }

        try {
            const userData = {
                ...formData,
                role: "pending",
            };
            const response = await axios.post(`${import.meta.env.VITE_API_URL}/register`, userData);
            const { data } = response;
            
            if (data.token) {
                localStorage.setItem('token', data.token);
                localStorage.setItem('email', formData.email);
                navigate("/pending");
            } else {
                setError(data.message || "Registration failed. Please try again.");
            }
        } catch (error) {
            if (error.response) {
                setError(error.response.data.message || "Registration failed. Please check your details.");
            } else {
                setError("An unexpected error occurred. Please try again later.");
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="signup-container">
            <button className="button-back" onClick={() => navigate("/")}>
                <FiArrowLeft size={20} />
            </button>
            
            <div className="card-container">
                <div className="card">
                    <form onSubmit={handleSubmit}>
                        <h1>Create Account</h1>
                        
                        <input
                            className="input2"
                            type="text"
                            name="name"
                            placeholder="Full Name"
                            onChange={handleChange}
                            required
                        />
                        
                        <input
                            className="input2"
                            type="tel"
                            name="phoneNumber"
                            placeholder="Phone Number"
                            onChange={handleChange}
                            required
                        />
                        
                        <input
                            className="input2"
                            type="email"
                            name="email"
                            placeholder="Email Address"
                            onChange={handleChange}
                            required
                        />
                        
                        <input
                            className="input2"
                            type="password"
                            name="password"
                            placeholder="Password"
                            onChange={handleChange}
                            required
                        />
                        
                        <label className="register-label">Upload Commerce Register *</label>
                        <div className="file-input-container">
                            <label htmlFor="file" className="file-input-button">
                                <FiUpload style={{ marginRight: '8px' }} />
                                {fileName || "Choose file"}
                            </label>
                            <input
                                type="file"
                                id="file"
                                name="file"
                                onChange={handleFileChange}
                                style={{ display: 'none' }}
                                required
                            />
                        </div>
                        
                        <button 
                            type="submit" 
                            className="btn" 
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? 'Creating Account...' : 'Sign Up'}
                        </button>
                        
                        <div className="login-footer">
                            <p>Already have an account? <Link to="/login" className="a">Log in</Link></p>
                        </div>
                    </form>
                    
                    {error && <div className="error-message">{error}</div>}
                </div>
            </div>
            
            <img src={bg} alt="background wave" className="bg-image" />
        </div>
    );
}

export default Signup;
