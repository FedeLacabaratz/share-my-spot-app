import React, { useEffect } from 'react'
import { MyBookingItem } from '../components'
import './MyBookings.sass'

export default function ({ myBookingSpots, handleMyBookings }) {

    useEffect(() => {
        handleMyBookings()
    }, [])

    return <>
        <ul className="myBookings">
            {myBookingSpots.length > 0 ? myBookingSpots.map(myBookingItem => <MyBookingItem key={myBookingItem.id} myBookingItem={myBookingItem} />) : <><br></br><br></br><h3>YOU HAVEN'T MADE ANY BOOKINGS YET!</h3></>}
        </ul>
    </>
}