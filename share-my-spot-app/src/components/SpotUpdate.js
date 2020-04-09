import React from 'react'
import './SpotUpdate.sass'
import Feedback from './Feedback'
import './Feedback.sass'

const API_URL = process.env.REACT_APP_API_URL

export default function ({ spot, onUpdateMySpot, error }) {

    const { id: spotId, title, addressLocation, addressStNumber, addressOther, length, width, height, area, description, price } = spot;
    
    function handleOnUpdateMySpot(event) {
        event.preventDefault()
        
        const title = event.target.title.value
        const addressLocation = event.target.addressLocation.value
        const addressStNumber = event.target.addressStNumber.value
        const addressOther = event.target.addressOther.value
        const length = Number(event.target.length.value)
        const width = Number(event.target.width.value)
        const height = Number(event.target.height.value)
        const area = Number(event.target.area.value)
        const description = event.target.description.value
        const price = Number(event.target.price.value)
        const acceptsBarker = event.target.acceptsBarker.checked ? 'yes' : 'no'
        const surveillance = event.target.surveillance.checked ? 'yes' : 'no'
        const isCovered = event.target.isCovered.checked ? 'yes' : 'no'
        const hourStarts = event.target.hourStarts.value
        const hourEnds = event.target.hourEnds.value
        const mon = event.target.mon.checked ? 'yes' : 'no'
        const tue = event.target.tue.checked ? 'yes' : 'no'
        const wed = event.target.wed.checked ? 'yes' : 'no'
        const thu = event.target.thu.checked ? 'yes' : 'no'
        const fri = event.target.fri.checked ? 'yes' : 'no'
        const sat = event.target.sat.checked ? 'yes' : 'no'
        const sun = event.target.sun.checked ? 'yes' : 'no'
        const [photo] = event.target.photo.files
        onUpdateMySpot({photo, spotId, title, addressLocation, addressStNumber, addressOther, length, width, height, area, description, price, acceptsBarker, surveillance, isCovered, hourStarts, hourEnds, mon, tue, wed, thu, fri, sat, sun})
    }

    return <> <div className="spotUpdate">
        <main>
            <form className="spotUpdate__container" onSubmit={handleOnUpdateMySpot} >
                <h3 className="spotUpdate__h3">TITLE:</h3>
                <div className="spotUpdate__div" >
                    <input className="spotUpdate__infoToComplete" type="text" name="title" placeholder={title} />
                </div>
                <h3 className="spotUpdate__h3">FULL ADDRESS:</h3>
                <div className="spotUpdate__div" >
                    <input className="spotUpdate__infoToComplete" type="text" name="addressLocation" placeholder={addressLocation} />
                    <input className="spotUpdate__infoToComplete" type="text" name="addressStNumber" placeholder={addressStNumber} />
                    <input className="spotUpdate__infoToComplete" type="text" name="addressOther" placeholder={addressOther} />
                </div>
                <h3 className="spotUpdate__h3">PARKING FEATURES:</h3>
                <div className="spotUpdate__div" >
                    <input className="spotUpdate__infoToComplete" type="text" name="length" placeholder={length} />
                    <input className="spotUpdate__infoToComplete" type="text" name="width" placeholder={width} />
                    <input className="spotUpdate__infoToComplete" type="text" name="height" placeholder={height} />
                    <input className="spotUpdate__infoToComplete" type="text" name="area" placeholder={area} />
                    <input className="spotUpdate__infoToComplete" type="text" name="description" placeholder={description} />
                </div>
                <h3 className="spotUpdate__h3">PRICE:</h3>
                <div className="spotUpdate__div" >
                    <input className="spotUpdate__infoToComplete" type="text" name="price" placeholder={price} />
                    <input className="spotUpdate__infoToComplete-upButton" type="file" name="photo" accept="photo/*" /><br></br>
                    <label> Your Photos Here!</label><br></br>
                </div>
                <h3 className="spotUpdate__h3">EXTRA FEATURES:</h3>
                <div className="spotUpdate__div2" >
                    <input className="spotUpdate__checkBox" type="checkbox" name="surveillance" value="yes" />
                    <label> Surveillance</label><br></br>
                    <input className="spotUpdate__checkBox" type="checkbox" name="acceptsBarker" value="yes" />
                    <label> Accepts barker exchange</label><br></br>
                    <input className="spotUpdate__checkBox" type="checkbox" name="isCovered" value="yes" />
                    <label> Covered Parking</label><br></br>
                </div>
                <h3 className="spotUpdate__h3">TIME SCHEDULE:</h3>
                <div className="spotUpdate__div" >
                    <p>Hour Starts: <input type="time" name="hourStarts" /></p>
                    <p>Hour Ends: <input type="time" name="hourEnds" /></p>
                </div>
                <h3 className="spotUpdate__h3">AVAILABILITY:</h3>
                <div className="spotUpdate__div2" >
                    <input className="spotUpdate__checkBox" type="checkbox" name="mon" value="yes" />
                    <label> Monday</label><br></br>
                    <input className="spotUpdate__checkBox" type="checkbox" name="tue" value="yes" />
                    <label> Tuesday</label><br></br>
                    <input className="spotUpdate__checkBox" type="checkbox" name="wed" value="yes" />
                    <label> Wednesday</label><br></br>
                    <input className="spotUpdate__checkBox" type="checkbox" name="thu" value="yes" />
                    <label> Thursday</label><br></br>
                    <input className="spotUpdate__checkBox" type="checkbox" name="fri" value="yes" />
                    <label> Friday</label><br></br>
                    <input className="spotUpdate__checkBox" type="checkbox" name="sat" value="yes" />
                    <label> Saturday</label><br></br>
                    <input className="spotUpdate__checkBox" type="checkbox" name="sun" value="yes" />
                    <label> Sunday</label><br></br>
                </div>
                {error && <Feedback message={error} level="warn" />}
                <button className="spotUpdate__submit" href="">Update your Spot</button>
            </form>
        </main>
    </div>
    </>
}