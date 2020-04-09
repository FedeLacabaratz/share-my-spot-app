import React, { useState } from 'react'
import './MyBookingItem.sass'

export default function ({ myBookingItem }) {

    const [phoneB, setPhoneB] = useState(false)
    const [emailB, setEmailB] = useState(false)

    const { title, hourStarts, hourEnds, price, publisherId, bookedTo, bookingCandidates } = myBookingItem
    
    return <li className="myBookingItem" >
        <main>
            <div className="myBookingItem__container">
                <h3 className="myBookingItem__h3">YOU HAVE MADE A RESERVATION:</h3>
                <p>Your reservation to: {title} from {hourStarts} to {hourEnds} at {price}€/hr is awaiting confirmation from {publisherId.name}.</p><br></br>
                <p>Please wait up now to hear back from him.</p>
                <p>In case 24hs go by and you still haven't heard from him, feel free to call or send him an e-mail using the buttons located down below. <br></br><br></br> When/if accepted by the publisher this will serve as your owner's data storage to get in touch with him. <br></br><br></br> In case of being rejected, it will dissapear from your MyBooking</p>
                <div className="myBookingItem__bottom">
                    <i className="myBookingItem__bottom-call fas fa-phone" onClick={e => {
                        e.preventDefault()
                        setPhoneB(!phoneB)
                    }}></i>
                    <div className="myBookingItem__bottom-phone" >
                        {phoneB && typeof publisherId.phone !== 'undefined' && publisherId.phone}
                        {phoneB && typeof publisherId.phone === 'undefined' && 'No phone available'}
                    </div>
                    <i className="myBookingItem__bottom-envelope far fa-envelope" onClick={e => {
                        e.preventDefault()
                        setEmailB(!emailB)
                    }}></i>
                    <div className="myBookingItem__bottom-email" >
                        {emailB && publisherId.email}
                    </div>
                    
                </div>
                {bookingCandidates.includes(bookedTo) ? <h3>YOUR REQUEST HAS BEEN ACCEPTED!</h3> : null}
            </div>
        </main>
    </li > 
    
}
