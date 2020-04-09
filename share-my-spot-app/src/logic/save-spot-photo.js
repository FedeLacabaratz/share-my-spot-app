import { validate } from 'share-my-spot-utils'
import context from './context'
require('dotenv').config()

/**
* Saves spot image
* 
* @param {ObjectuserI} spotId id of spot
* @param {Stream} photo data of the image
*
* @returns {Promise} - empty Promise that confirms uploading of the photo.  
*/

const API_URL = process.env.REACT_APP_API_URL

export default (function (spotId, photo) {
    
    if (spotId) {
        validate.string(spotId, 'spotId')
        if (!spotId.trim().length) throw new Error(`spotId is empty or blank`)
    }

    let formData = new FormData()
    formData.append('photo', photo);

    return (async () => {
        
            const response = await fetch(`${API_URL}/upload/${spotId}`, {
                method: 'POST',
                headers: { 'Authorization': 'Bearer ' + this.token, },
                body: formData
            })
            if (response.status === 201) return   

    })()
}).bind(context)