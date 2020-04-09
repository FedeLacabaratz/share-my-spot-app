import React, { useEffect, useState } from 'react'
import './Detail.sass'
import { useParams } from "react-router-dom";
import {retrieveUser} from '../logic'

const API_URL = process.env.REACT_APP_API_URL

export default function ({ handleDetail, spotDetail, handleOnBooking }) {

    let { spotId } = useParams()
    let { id, publisherId, title, price, description, hourStarts, hourEnds, length, width, height, area, surveillance, acceptsBarker, isCovered, addressLocation, addressStNumber, addressOther, mon, tue, wed, thu, fri, sat, sun } = spotDetail
    const [user, setUser] = useState({})
    const [isOwner, setIsOwner] = useState(false)
    const [candidateId, setCandidateId] = useState()

    const handleRetrieveUser = async () =>{
        try {
            const _user = await retrieveUser()
            setUser(_user)
            setCandidateId(_user.id)
            setIsOwner(_user.id === spotDetail?.publisherId?.id)
        } catch ({message}) {
            console.log(message)
        }
    }

    useEffect(() => {
        handleRetrieveUser()
        if (spotId) handleDetail(spotId)
    }, [])


    const handleToBooking = (event) => {
        event.preventDefault()

        handleOnBooking(candidateId, spotDetail)
    }

    return <div className="detail" >
        <form className="detail__container" onSubmit={handleToBooking} >
            <main>
                <img className="detail__photo" alt="spot detail" src={`${API_URL}/load/${id}`} />
                <h3 className="detail__h4">{title}</h3>
                <h2 className="detail__h2">{price}€/per hour</h2><span>(*) See conditions</span>
                <h3 className="detail__h3">DESCRIPTION:</h3>
                <p className="detail__p">{description}</p>
                <h3 className="detail__h3">TIME SCHEDULE:</h3>
                <ul className="detail__ul">
                    <li>Hour Starts: {hourStarts}hr.</li>
                    <li>Hour Ends: {hourEnds}hr.</li>
                </ul>
                <h3 className="detail__h3">PARKING FEATURES:</h3>
                <ul className="detail__ul">
                    <li>Length: {length}mt</li>
                    <li>Width: {width}mt</li>
                    <li>Height: {height}mt</li>
                    <li>Area: {area}mt2</li>
                </ul>
                <h3 className="detail__h3">EXTRA FEATURES:</h3>
                <ul className="detail__ul">
                    <li>Surveillance: {surveillance === true ? surveillance = "Yes" : surveillance = "No"}</li>
                    <li>Accepts Barker Exchange: {acceptsBarker === true ? acceptsBarker = "Yes" : acceptsBarker = "No"}</li>
                    <li>Covered Parking: {isCovered === true ? isCovered = "Yes" : isCovered = "No"}</li>
                </ul>
                <h3 className="detail__h3">FULL ADDRESS:</h3>
                <p className="detail__p">{addressStNumber}<br></br>{addressOther}<br></br>{addressLocation}</p>
                <h3 className="detail__h3">PUBLISHER:</h3>
                <p className="detail__p">{publisherId?.name}<br></br>{publisherId?.phone}<br></br>{publisherId?.email}</p>
                <h3 className="detail__h3">AVAILABILITY:</h3>
                <ul className="detail__ul">
                    <li>Monday: {mon === true ? mon = 'Yes' : mon = "No"}</li>
                    <li>Tuesday: {tue === true ? tue = 'Yes' : tue = "No"}</li>
                    <li>Wednesday: {wed === true ? wed = 'Yes' : wed = "No"}</li>
                    <li>Thursday: {thu === true ? thu = 'Yes' : thu = "No"}</li>
                    <li>Friday: {fri === true ? fri = 'Yes' : fri = "No"}</li>
                    <li>Saturday: {sat === true ? sat = 'Yes' : sat = "No"}</li>
                    <li>Sunday: {sun === true ? sun = 'Yes' : sun = "No"}</li>
                </ul>
                {!isOwner && <button type="submit" className="detail__mAbook" href="">Place your reservation!</button> }
            </main>
        </form>
    </div>
}