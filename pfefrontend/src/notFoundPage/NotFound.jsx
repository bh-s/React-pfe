import React from 'react';
import NotFoundPage from '../components/images/notfound.svg';
import './NotFound.css';
import { useNavigate } from 'react-router-dom';
function NotFound() {
    const navigate = useNavigate()

    return (
        <div className="not-found-container">
            <img src={NotFoundPage} alt="Not Found" className="not-found-image" />
            <h1 className="not-found-text">Page Not Found</h1>
            <p className="not-found-message">The page you are looking for does not exist.</p>
            <button className='btn' style={{ width: "100px", backgroundColor: "#3BC7B8" }} onClick={() => navigate(-1)}>Go back</button>
        </div>
    );
}

export default NotFound;
