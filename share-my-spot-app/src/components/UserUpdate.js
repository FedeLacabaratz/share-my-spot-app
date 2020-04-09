import React, { useState, useEffect, useContext } from 'react'
import { isLoggedIn, retrieveUser } from '../logic'
import { Context } from './ContextProvider'
import './UserUpdate.sass'
import Feedback from './Feedback'
import './Feedback.sass'
import { withRouter } from 'react-router-dom'

export default withRouter(function ({ history, onUserUpdate, error }) {

    const [state, setState] = useContext(Context)
    const [name, setName] = useState()

    useEffect(() => {
        if (isLoggedIn())
            (async () => {
                try {
                    const currentUser = await retrieveUser()

                    const { name } = currentUser

                    setName(name)

                    history.push('/account')
                } catch (error) {
                    setState({ ...state, error: error.message })
                    history.push('/search')
                }
            })()
        else history.push('/search')
    }, [])

    function handleOnUpdateUser(event) {
        event.preventDefault()

        const body = {
            email: event.target.email.value,
            phone: Number(event.target.phone.value),
            password: event.target.password.value,
            oldPassword: event.target.oldPassword.value
        }

        onUserUpdate(body)
    }

    return <> <div className="updateUser">
        <form className="updateUser__container" onSubmit={handleOnUpdateUser}>
            <h2 className="updateUser__h2">Account</h2>
            <h3 className="updateUser__h3">Welcome {name}</h3>
            <input className="updateUser__input" name="email" type="text" placeholder="email" />
            <input className="updateUser__input" name="phone" type="number" placeholder="new phone number?" />
            <input className="updateUser__input" name="oldPassword" type="password" placeholder="old password" />
            <input className="updateUser__input" name="password" type="password" placeholder="new password" />
            {error && <Feedback message={error} level="warn" />}
            <button className="updateUser__submitUpdate">Update Information</button>
        </form>
    </div>
    </>
})