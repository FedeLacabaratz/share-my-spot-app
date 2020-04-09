import React from 'react'
import './YourRequest.sass'

export default function ({ yourRequestItem, onToAccept, onToDecline }) {

    const { id, title, bookingCandidates, bookedTo } = yourRequestItem

    const spotId = id
    const publisherId = yourRequestItem.publisherId.id

    return !yourRequestItem.bookedTo ? <li className="yourRequest">
        <main>
            <div className="yourRequest__container">
                <h3 className="yourRequest__h3">SOMEONE HAS REQUESTED TO BOOK YOUR PARKING SPOT:</h3>
                <ul>
                    {bookingCandidates.map(candidate => <li key={candidate.id}>
                        <h4>User: <strong>{candidate.name} {candidate.surname}</strong>,<br></br> Email: <strong>{candidate.email}</strong>,<br></br> Phone: <strong>{candidate.phone}</strong>,<br></br><br></br></h4>
                        <p>Has requested a reservation from your listing: </p><br></br><h4><strong>{title}</strong></h4> <br></br><br></br> <p>Please get in touch with him as soon as possible before making a decision on his offer. In case you've already done so and accepted his proposal, this will serve as contact information with your tenant.</p>
                        <div className="yourRequest__bottom">
                            <button className="yourRequest__buttons" onClick={event => {
                                event.preventDefault();
                                const candidateId = candidate.id
                                onToAccept(publisherId, candidateId, spotId)
                            }} >Accept Request</button>
                            <button className="yourRequest__buttons" onClick={event => {
                                event.preventDefault();
                                const candidateId = candidate.id
                                onToDecline(publisherId, candidateId, spotId)
                            }}>Decline Request</button>
                        </div>
                    </li>)}
                </ul>
            </div>
        </main>
    </li> : <li className="yourRequest">
            <main>
                <div className="yourRequest__container">
                    <h3 className="yourRequest__h3">SOMEONE HAS REQUESTED TO BOOK YOUR PARKING SPOT:</h3>
                    <h4>User: <strong>{bookedTo.name} {bookedTo.surname}</strong>,<br></br> Email: <strong>{bookedTo.email}</strong>,<br></br> Phone: <strong>{bookedTo.phone}</strong>,<br></br><br></br></h4>
                    <p>Has requested a reservation from your listing: </p><br></br><h4><strong>{title}</strong></h4> <br></br><br></br> <p>Please get in touch with him as soon as possible before making a decision on his offer. In case you've already done so and accepted his proposal, this will serve as contact information with your tenant. </p>
                    <div className="yourRequest__bottom">
                        <h3><strong>BOOKING ACCEPTED!</strong></h3>
                    </div>
                </div>
            </main>
        </li>
}
