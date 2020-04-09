import React, { useState } from 'react'
import { logout } from '../logic'
import { useHistory } from 'react-router-dom'
import './Header.sass'
import logo from '../images/logo.png'

export default ({ onLogout }) => {
    // const [state, setState] = useContext(Context)
    const history = useHistory()
    const [menu, setMenu] = useState(false)

    const handleOpenNav = (event) => {
        event.preventDefault()
       menu ? setMenu(false): setMenu(true)
    }

    const handleLogout = (event) => {
        event.preventDefault()
        logout()
        if (onLogout && typeof onLogout === "function") {
            onLogout()
        }

        history.push('/login')
    }

    const handleAccount = (event) => {
        event.preventDefault()

        history.push('/account')
    }

    const handleSearch = (event) => {
        event.preventDefault()

        history.push('/search')
    }

    const handleAddSpot = (event) => {
        event.preventDefault()

        history.push('/add-a-spot')
    }

    const handleMySpots = (event) => {
        event.preventDefault()
        history.push('/my-spots')
    }

    const handleYourRequests = (event) => {
        event.preventDefault()

        history.push('/manage-requests')
    }

    const handleMyBookings = (event) => {
        event.preventDefault()
        
        history.push('/my-bookings')
    }

    return <>
    <header className="header">
        <nav className="navbar">
            <ul className="navbar__ul">
                <li><a className="burger fas fa-bars" onClick={handleOpenNav}></a></li>
                <li><a><img className="header__logo-img" src={logo} alt="ShareMySpotLogo" /></a></li>
                <li className="navbar__social">
                    <a className="header__account-logout fas fa-power-off" onClick={handleLogout}></a>
                    <a className="header__account-user fas fa-user" onClick={handleAccount}></a>
                </li>
            </ul>
            <div className={menu ? "sidemenu active" : "sidemenu"}>
                <ul>
                <li><a className="textMenu" onClick={handleSearch} >New Search</a></li>
                <li><a className="textMenu" onClick={handleAddSpot} >Add A Spot</a></li>
                <li><a className="textMenu" onClick={handleMySpots}>My Spots</a></li>
                <li><a className="textMenu" onClick={handleYourRequests}>Manage Your Requests</a></li>
                <li><a className="textMenu" onClick={handleMyBookings}>My Bookings</a></li>
                </ul>
            </div>
        </nav>
    </header>
    </>
}
