import React, { useState } from 'react'
import './Item.sass'
const API_URL = process.env.REACT_APP_API_URL

export default function ({ item: { id, title, price, publisherId }, onClick }) {
    const [phoneB, setPhoneB] = useState(false)
    const [emailB, setEmailB] = useState(false)

    return <li className="item">
        <div className="item__container" >
            <main>
                <img className="item__photo" alt="published spot" src={`${API_URL}/load/${id}`} onClick={() => onClick(id)} />
                <h3 className="item__h4">{title}</h3>
                <h2 className="item__h2">{price} €/per hour</h2><span>(*) See Conditions</span>
                <div className="item__bottom">
                    <i className="item__bottom-call fas fa-phone" onClick={e => {
                        e.preventDefault()
                        setPhoneB(!phoneB)
                    }}></i>
                    <div className="item__bottom-phone" >
                        {phoneB && typeof publisherId.phone !== 'undefined' && publisherId.phone}
                        {phoneB && typeof publisherId.phone === 'undefined' && 'No phone available'}
                    </div>
                    <i className="item__bottom-envelope far fa-envelope" onClick={e => {
                        e.preventDefault()
                        setEmailB(!emailB)
                    }}></i>
                    <div className="item__bottom-email" >
                        {emailB && publisherId.email}
                    </div>
                </div>
            </main>
        </div>
    </li>

}