import React, { useEffect } from 'react'
import { MySpotItem } from '../components'
import './MySpots.sass'

export default function ({allMySpots, updateMySpot, deleteMySpot, handleMySpots, onItemClick}) {

    useEffect(() => {
        handleMySpots()
    }, [])

    return <ul className="mySpots">
        {allMySpots.length > 0 ? allMySpots.map(mySpotItem => <MySpotItem key={mySpotItem.id} mySpotItem={mySpotItem} onToUpdateMySpot={updateMySpot} onToDeleteMySpot={deleteMySpot} onClick={onItemClick} />) : <><br></br><br></br><h3>YOU HAVEN'T CREATED ANY SPOTS YET!</h3></>}
    </ul>
}