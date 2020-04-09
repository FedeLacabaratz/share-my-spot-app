import React from 'react'
import './MySpotItem.sass'
const API_URL = process.env.REACT_APP_API_URL

export default function ({ mySpotItem: { id, title, price }, onToUpdateMySpot, onToDeleteMySpot, onClick }) {
    
    const handleOnSpotUpdate = (event) => {
        event.preventDefault()
        
        onToUpdateMySpot(id)
    }
    const handleOnSpotDelete = (event) => {
        event.preventDefault()

        onToDeleteMySpot(id)
    }
    return <li className="mySpotItem">
        <div className="mySpotItem__container" >
            <main>
                <img className="mySpotItem__photo" alt="spot" src={`${API_URL}/load/${id}?v=${Math.floor(Math.random() * 99999)}`} onClick={() => onClick(id)}/>
                <h3 className="mySpotItem__h4">{title}</h3>
                <h2 className="mySpotItem__h2">{price} €/per hour</h2><span>(*) See Conditions</span>
                <div className="mySpotItem__bottom">
                    <i className="mySpotItem__bottom-edit fas fa-edit" onClick={handleOnSpotUpdate}></i>
                    <i className="mySpotItem__bottom-trash fas fa-trash-alt" onClick={handleOnSpotDelete}></i>
                </div>
            </main>
        </div>
    </li>

}