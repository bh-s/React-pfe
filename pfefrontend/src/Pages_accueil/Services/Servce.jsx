import React from 'react';
import bg from '../../components/images/pre.jpg';
import AOS from 'aos';
import { useEffect } from 'react';
import './Service.css';

function Service() {
    useEffect(() => {
        AOS.init();
    }, []);

    return (
        <div style={{ position: "relative", top: 0, left: 0, width: '100%', height: '100%' }}>
            <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(255, 255, 255, 0.5)' }}></div>
            <img src={bg} style={{ top: 0, left: 0, width: '100%', height: '100%', position: 'absolute', objectFit: 'cover', zIndex: '-1' }} />
            <div className='text-cnr'>
                <h1 className='title' id='title' data-aos="fade-up">NOS SERVICES</h1>
                <p className="text2" data-aos="fade-up">
                    Notre plateforme vous offre la possibilité de rester informé en quelques clics de tous les appels d'offres pertinents pour vos secteurs d'activité, ainsi que des annonces importantes telles que <b>Avis de prorogation de délais</b>, <b>Avis d'annulation ou d'infructuosité</b>, <b>Avis d'attribution</b>.
                </p>
            </div>
            <div className="card-container2" >
                <div className="service-card" data-aos="fade-up" >
                    <h2 className="service-card-title">Veille des appels d'offres</h2>
                    <p className="service-card-description">Ne manquez plus aucun appel d'offres pertinent pour votre secteur d'activité. Nous surveillons en temps réel les opportunités disponibles et vous alertons instantanément.</p>
                </div>
                <div className="service-card" data-aos="fade-up">
                    <h2 className="service-card-title">Gestion des appels d'offres</h2>
                    <p className="service-card-description">Facilitez la gestion de vos appels d'offres avec notre plateforme intuitive. Organisez, suivez et analysez tous vos projets en cours pour maximiser vos chances de succès.</p>
                </div>
                <div className="service-card">
                    <h2 className="service-card-title">Accompagnement personnalisé</h2>
                    <p className="service-card-description">Bénéficiez d'un accompagnement personnalisé tout au long de votre processus d'appels d'offres. Notre équipe d'experts est là pour répondre à vos questions et vous aider à optimiser vos soumissions.</p>
                </div>
            </div>
        </div>
    );
}

export default Service;
