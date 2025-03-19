import React from 'react'
import bg from '../../components/images/bg.jpg';
import './Accueil.css'
function Accueil() {
    return (
        <div className="background-container">
            <img className="background" src={bg} alt='' />
            <div className="centered-text">
                <p>Découvrez ici toutes les opportunités d'approvisionnement en un seul endroit</p>
                <p className='paragraphe'>Découvrez des appels d'offres et assurez-vous des contrats en toute facilité !</p>
            </div>
        </div>
    )
}

export default Accueil