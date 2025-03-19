import React from "react";
import {
    FaFacebook,
    FaYoutube,
    FaLinkedin,
    FaLocationArrow,
    FaTwitter,
} from "react-icons/fa";
import "./Footer.css";
import image from '../images/rectorat.jpg'
const FooterLinks = [
    {
        title: "Home",
        link: "/#",
    },
    {
        title: "About",
        link: "/#about",
    },
    {
        title: "Contact",
        link: "/#contact",
    },
    {
        title: "Blog",
        link: "/#blog",
    },
];
const Footer = () => {
    return (
        <><div class="serv">
            <div class="content">
                <div class="comp-container">
                    <h2 className="title" id="titleLocation">Localisation</h2>
                </div>
                <div class="pctr">
                    <img src={image} alt="image" />
                    <iframe className="map" width="550" height="330" frameborder="0" scrolling="no" marginheight="0" marginwidth="0" src="https://maps.google.com/maps?width=600&amp;height=400&amp;hl=en&amp;q=B.P%2078C,%20Ouled%20Fares%2002180%20Chlef,%20Alg%C3%A9rie+(Universit%C3%A9%20Hassiba%20Benbouali%20de%20Chlef)&amp;t=&amp;z=14&amp;ie=UTF8&amp;iwloc=B&amp;output=embed"><a href="https://www.gps.ie/">gps trackers</a></iframe>
                </div>
            </div>
        </div><footer class="footer">
                <div class="container3">
                    <div class="row">
                        <div class="footer-col">
                            <h4>company</h4>
                            <ul>
                                <li><a href="#">Présentation</a></li>
                                <li><a href="#">Service</a></li>
                                <li><a href="#">Location</a></li>
                            </ul>
                        </div>
                        <div class="footer-col">
                            <h4>get help</h4>
                            <ul>
                                <li><a href="#">FAQ</a></li>
                                <li><a href="#">shipping</a></li>
                                <li><a href="#">returns</a></li>
                                <li><a href="#">order status</a></li>
                                <li><a href="#">payment options</a></li>
                            </ul>
                        </div>
                        <div class="footer-col">
                            <h4>follow us</h4>
                            <div class="social-links">
                                <a href="https://www.facebook.com/uhbc.dz/"><i>     <FaFacebook />   </i></a>
                                <a href="https://www.linkedin.com/school/universit%C3%A9-hassiba-ben-bouali-chlef/?originalSubdomain=fr"><i>     <FaLinkedin />   </i></a>
                                <a href="https://www.youtube.com/channel/UCCZ5M_ObCUDENiKEeZia0ag"><i>     <FaYoutube />   </i></a>
                                <a href="https://twitter.com/UnivChlef"><i>     <FaTwitter />   </i></a>
                                <a href="https://www.google.com/maps/dir//Universit%C3%A9+Hassiba+Benbouali+de+Chlef,+66GR%2B4W3,+N19,+Ouled+Fares/@36.2242317,1.2000022,12.91z/data=!4m8!4m7!1m0!1m5!1m1!1s0x12840af01e798be3:0xb6c93bcfd297449a!2m2!1d1.2422892!2d36.2252708?hl=fr&entry=ttu"><i>     <FaLocationArrow />   </i></a>
                            </div>
                        </div>
                    </div>
                </div>
            </footer></>
    );
};

export default Footer;