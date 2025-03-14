import React from "react";
import './pending.css';
import img from './../../../Assets/undraw_message_sent_re_q2kl.svg'
import { useNavigate } from 'react-router-dom';

function Pending() {
    const navigate = useNavigate()

    return (
        <div className="pending-container">
            <h1>Votre demande est en attente</h1>
            <p>Nous vous contacterons prochainement.</p>
            <img src={img} alt="Message envoyé" />
            <button className='btn' style={{ width: "100px", backgroundColor: "#3BC7B8" }} onClick={() => navigate(-1)}>Go back</button>
        </div>
    );
}

export default Pending;
