import React, { useEffect } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';
import pre from '../../components/images/rectorat_UHBC.jpg';
import './Presentation.css';

function Presentation() {
    useEffect(() => {
        AOS.init();
    }, []);

    return (
        <div className="container2">
            <div className="text" data-aos="fade-up">
                <h2 className='title'>QUI SOMMES NOUS ?</h2>
                <p>
                    <strong>L'Université de Haassiba Ben Bouali</strong> propose une plateforme de premier choix qui offre un accès simplifié aux marchés publics et privés en Algérie. En plus de fournir des avis d'appels d'offres, notre site assure le suivi complet du cycle de vie des projets, comprenant les attributions, annulations, échecs d'attribution, mises en demeure, résiliations et prorogations de délais. Notre équipe de professionnels expérimentés en veille économique est là pour vous guider dans la recherche de votre marché en Algérie.
                </p>
            </div>
            <div className="image">
                <img data-aos="fade-up" data-aos-duration="1000" src={pre} alt="Prévisualisation" />
            </div>
        </div>
    );
}

export default Presentation;
