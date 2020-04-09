import React, { useEffect, useContext } from 'react'
import { isLoggedIn } from '../logic'
import { withRouter } from 'react-router-dom'
import { Context } from './ContextProvider'
import Feedback from './Feedback'
import './Feedback.sass'
import './Search.sass'
import imgBack from '../images/homeBckgrnd.png'
import {useParams} from "react-router-dom";

export default withRouter(({ history, onSearch, error }) => {
    let { spotId } = useParams()

    const [set, setState] = useContext(Context)

    useEffect(() => {

        if (isLoggedIn) {
            (async () => {
                try {

                    if(spotId) history.push(`/detail/${spotId}`)
                    else history.push('/search')

                } catch (error) {
                    setState({ error: error.message })
                    history.push('/login')
                }
            })()
        } else {
            history.push('/login')
        }
    }, [])

    const handleOnSearch = (event) => {
        event.preventDefault()

        let addressLocation = event.target.location.value
        let length = event.target.length.value
        let height = event.target.height.value
        let width = event.target.width.value
        let price = event.target.price.value
        let acceptsBarker = event.target.acceptsBarker.value.toLowerCase()

        let query = { addressLocation, length, height, width, price, acceptsBarker }

        let _query = ''

        for (const keys in query) {
            if (query[keys].length) {
                _query += keys + '=' + query[keys] + '&'
            }
        }

        onSearch(_query)
    }

    return <>
        <div className="search">
            <div className="search__container">
                <main>
                    <form className="search__form" onSubmit={handleOnSearch}>
                        <img className="search__backgroundImg" src={imgBack} alt="ShareMySpotLogo" />
                        <input className="search__input" type="text" name="location" placeholder="Search by location" />
                        <input className="search__input" type="text" name="length" placeholder="Search by length" />
                        <input className="search__input" type="text" name="height" placeholder="Search by height" />
                        <input className="search__input" type="text" name="width" placeholder="Search by width" />
                        <input className="search__input" type="text" name="price" placeholder="Search by price" />
                        <input className="search__input" type="text" name="acceptsBarker" placeholder="Barker Exchange?" />
                        {error && <Feedback message={error} level="warn" />}
                        <button className="search__goSearch">Search</button>
                    </form>
                </main>
            </div>
        </div>
    </>
})