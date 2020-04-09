import React from 'react'
import logo from '../images/logo.png'
import './Register.sass'
import Feedback from './Feedback'
import './Feedback.sass'
import { withRouter } from 'react-router-dom'

export default withRouter (function ({ onRegister, history, error }) {
    function handleOnRegister(event) {
        event.preventDefault()

        const name = event.target.name.value
        const surname = event.target.surname.value
        const email = event.target.email.value
        const phone = Number(event.target.phone.value)
        const password = event.target.password.value
        
        onRegister(name, surname, email, phone, password)
    }

    const handleGoToLogin = (event) => {
        event.preventDefault()

        history.push('/login')
    }

    return <>
        <div className="register">
            <form className="register__container" onSubmit={handleOnRegister}>
                <img className="register__container-logo" src={logo} alt="ShareMySpotLogo" />
                <h2 className="register__h2">Sign-Up</h2>
                <input className="register__input" type="text" name="name" placeholder="name" />
                <input className="register__input" type="text" name="surname" placeholder="surname" />
                <input className="register__input" type="text" name="email" placeholder="email" />
                <input className="register__input" type="number" name="phone" placeholder="phone" />
                <input className="register__input" type="password" name="password" placeholder="password" />
                <button className="register__register">Register</button><br></br>
                {error && <Feedback message={error} level="warn" />}
                <a className="register__toLogin" onClick={handleGoToLogin}>Already registered? - Go To Login</a>
            </form>
        </div> 
    </>
})