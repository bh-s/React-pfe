import React, { useState } from "react";
import axios from "axios";
import './Register.css';
import { useNavigate, Link } from "react-router-dom";
import bg from '../../../Assets/wave (2).svg'

function Signup() {
    const navigate = useNavigate();
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

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
        setFormData({ ...formData, file });
        const reader = new FileReader();
        reader.onloadend = () => {
            setFormData({ ...formData, fileBase64: reader.result });
        };
        reader.readAsDataURL(file);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (isSubmitting) return;
        setIsSubmitting(true);

        const { name, phoneNumber, email, password, fileBase64 } = formData;
        if (!name || !phoneNumber || !email || !password || !fileBase64) {
            setError("Veuillez remplir tous les champs.");
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
            console.log(response.data);
            if (data.token) {
                console.log("Token:", data.token);
                localStorage.setItem('token', data.token);
                localStorage.setItem('email', formData.email);
                navigate("/pending");
            } else {
                setError(data.message);
            }
        } catch (error) {
            if (error.response) {
                setError(error.response.data.message);
            } else {
                setError("An unexpected error occurred. Please try again later.");
            }
        } finally {
            setIsSubmitting(false);
        }
    };


    return (
        <><div className="card-container">
            <button className="button-back" onClick={() => {
                navigate("/")
            }}>back</button>
            <div className="card">
                <form onSubmit={handleSubmit}>
                    <h1>Signup</h1>
                    <input className="input2" type="text" name="name" placeholder="Prénom" onChange={handleChange} />
                    <input className="input2" type="text" name="phoneNumber" placeholder="numberphone" onChange={handleChange} />
                    <input className="input2" type="email" name="email" placeholder="email" onChange={handleChange} />
                    <input className="input2" type="password" name="password" placeholder="Mot de passe" onChange={handleChange} />
                    <label className="register-label">Entrez votre registre de commerce *</label>
                    <input type="file" id="file" name="file" className="file-input-button" onChange={handleFileChange} />
                    <button type="submit" className="btn" disabled={isSubmitting}>Submit</button>
                    <div>
                        <p>Avez-vous un compte?<Link to="/login" className="a"> {' '}Login page</Link></p>
                    </div>
                </form>
                {error && <div className="error-message">{error}</div>}
            </div>
        </div>
            <img src={bg} alt="" className="bg-image" /></>
    );
}
export default Signup;
