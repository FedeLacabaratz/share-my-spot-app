import React, { useState, useEffect, useContext } from 'react'
import { Register, Login, Search, Header, Results, Detail, UserUpdate, AddSpot, MySpots, SpotUpdate, MyBookings, ManageYourRequests } from '../components'
import { registerUser, login, isLoggedIn, retrieveUser, search, retrieveSpot, userUpdate, addSpot, saveSpotPhoto, retrieveMySpots, spotUpdate, spotDelete, bookSpot, acceptBooking, declineBooking, retrieveMyBookings, retrieveSpotsForBookingManagement } from '../logic'
import { Context } from './ContextProvider'
import { Route, withRouter, Redirect } from 'react-router-dom'

export default withRouter(function ({ history }) {

  const [state, setState] = useContext(Context)
  const [user, setUser] = useState({})
  const [results, setResults] = useState([])
  const [detail, setDetail] = useState({})
  const [spot, setSpot] = useState()
  const [spotId, setSpotId] = useState([])
  const [mySpots, setMySpots] = useState([])
  const [myBookingSpots, setMyBookingSpots] = useState([])
  const [yourRequests, setYourRequests] = useState([])

  useEffect(() => {
    if (isLoggedIn()) {
      (async () => {
        try {

          const user = await retrieveUser()

          setUser(user)
          history.push('/search')

        } catch (error) {
          setState({ ...state, error: error.message })

          setTimeout(() => {
            setState({ error: undefined })
          }, 3000)
          history.push('/login')
        }
      })()

    } else {
      history.push('/login')
    }
  }, [])

  const handleLogout = () => {
    setUser({})
    setResults([])
    setDetail({})
    setSpot(undefined)
    setSpotId([])
    setMySpots([])
    setMyBookingSpots([])
    setYourRequests([])
  }

  const handleRegister = (name, surname, email, phone, password) => {
    (async () => {
      try {
        await registerUser(name, surname, email, phone, password)

        history.push('/login')

      } catch ({ message }) {
        setState({ ...state, error: message })

        setTimeout(() => {
          setState({ error: undefined })
        }, 3000)
      }
    })()
  }

  const handleLogin = (email, password) => {
    (async () => {
      try {
        await login(email, password)

        history.push('/search')

      } catch ({ message }) {
        setState({ ...state, error: message })

        setTimeout(() => {
          setState({ error: undefined })
        }, 3000)
      }
    })()
  }

  const handleUserUpdate = (body) => {
    (async () => {
      try {

        await userUpdate(body)

        const newUser = await retrieveUser()
        setUser(newUser)

        setTimeout(() => {
          history.push('/search')
        }, 3000)

      } catch ({ message }) {
        setState({ ...state, error: message })

        setTimeout(() => {
          setState({ error: undefined })
        }, 3000)
      }
    })()
  }

  const handleSearch = (query) => {

    (async () => {
      try {
        const res = await search(query)

        if (!res.length) {
          setState({ ...state, error: 'No results were found matching your query' })

          setTimeout(() => {
            setState({ error: undefined })
          }, 3000)

        } else {
          setResults(res)
          history.push('/results')
        }

      } catch ({ message }) {
        setState({ ...state, error: message })

        setTimeout(() => {
          setState({ error: undefined })
        }, 3000)
      }
    })()
  }

  const handleDetail = (spotId) => {

    (async () => {
      try {

        const spotDetail = await retrieveSpot(spotId)
        setDetail(spotDetail)

        history.push(`/detail/${spotId}`)

      } catch ({ message }) {
        setState({ ...state, error: message })

        setTimeout(() => {
          setState({ error: undefined })
        }, 3000)
      }
    })()
  }

  const handleAddSpot = (photo, title, addressLocation, addressStNumber, addressOther, length, width, height, area, description, price, acceptsBarker, surveillance, isCovered, hourStarts, hourEnds, mon, tue, wed, thu, fri, sat, sun) => {

    (async () => {
      try {

        const spotId = await addSpot(title, addressLocation, addressStNumber, addressOther, length, width, height, area, description, price, acceptsBarker, surveillance, isCovered, hourStarts, hourEnds, mon, tue, wed, thu, fri, sat, sun)

        if (photo) {
          await saveSpotPhoto(spotId, photo)
        }

        handleDetail(spotId)

      } catch ({ message }) {
        setState({ ...state, error: message })

        setTimeout(() => {
          setState({ error: undefined })
        }, 3000)
      }
    })()
  }

  const handleMySpots = () => {
    (async () => {
      try {

        const allMySpots = await retrieveMySpots()

        setMySpots(allMySpots)
        history.push('/my-spots')

      } catch ({ message }) {
        setState({ ...state, error: message })

        setTimeout(() => {
          setState({ error: undefined })
        }, 3000)
      }
    })()
  }

  const handleToUpdateMySpot = (spotId) => {

    (async () => {
      try {

        const spot = await retrieveSpot(spotId)
        setSpot(spot)
        setSpotId(spotId)

        history.push(`/update/${spotId}`)

      } catch ({ message }) {
        setState({ ...state, error: message })

        setTimeout(() => {
          setState({ error: undefined })
        }, 3000)
      }
    })()
  }

  const handleOnUpdateMySpot = ({ photo, spotId, title, addressLocation, addressStNumber, addressOther, length, width, height, area, description, price, acceptsBarker, surveillance, isCovered, hourStarts, hourEnds, mon, tue, wed, thu, fri, sat, sun }) => {

    (async () => {
      try {
        await spotUpdate({ title, addressLocation, addressStNumber, addressOther, length, width, height, area, description, price, acceptsBarker, surveillance, isCovered, hourStarts, hourEnds, mon, tue, wed, thu, fri, sat, sun }, spotId)

        if (photo) {
          await saveSpotPhoto(spotId, photo)
        }

        const updatedSpot = await retrieveSpot(spotId)
        setSpot(updatedSpot)
        setSpotId(spotId)

        history.push(`/my-spots`)

      } catch ({ message }) {
        setState({ ...state, error: message })

        setTimeout(() => {
          setState({ error: undefined })
        }, 3000)
      }
    })()
  }

  const handleDeleteMySpot = (spotId) => {

    (async () => {
      try {

        await spotDelete(spotId)

        await retrieveMySpots(mySpots)

        handleMySpots()

      } catch ({ message }) {
        setState({ ...state, error: message })

        setTimeout(() => {
          setState({ error: undefined })
        }, 3000)
      }
    })()
  }

  const handleBooking = (candidateId, spotDetail) => {
    (async () => {
      try {
        await bookSpot(candidateId, spotDetail.id)

        const spots = await retrieveMyBookings()
        setMyBookingSpots(spots)

        history.push('/my-bookings')

      } catch ({ message }) {
        setState({ ...state, error: message })

        setTimeout(() => {
          setState({ error: undefined })
        }, 3000)
      }
    })()
  }

  const handleMyBookings = () => {
    (async () => {
      try {

        const spots = await retrieveMyBookings()
        setMyBookingSpots(spots)

        history.push('/my-bookings')

      } catch ({ message }) {
        setState({ ...state, error: message })

        setTimeout(() => {
          setState({ error: undefined })
        }, 3000)
      }
    })()
  }

  const handleMyRequests = () => {
    (async () => {
      try {

        const yourRequests = await retrieveSpotsForBookingManagement()

        setYourRequests(yourRequests)

        history.push('/manage-requests')

      } catch ({ message }) {
        setState({ ...state, error: message })

        setTimeout(() => {
          setState({ error: undefined })
        }, 3000)
      }
    })()
  }

  const handleOnAccept = (publisherId, candidateId, spotId) => {
    (async () => {
      try {

        await acceptBooking(publisherId, candidateId, spotId)

        handleMyRequests()


      } catch ({ message }) {
        setState({ ...state, error: message })

        setTimeout(() => {
          setState({ error: undefined })
        }, 3000)
      }
    })()
  }

  const handleOnDecline = (publisherId, candidateId, spotId) => {
    (async () => {
      try {

        await declineBooking(publisherId, candidateId, spotId)

        handleMyRequests()


      } catch ({ message }) {
        setState({ ...state, error: message })

        setTimeout(() => {
          setState({ error: undefined })
        }, 3000)
      }
    })()
  }

  const { error } = state
  const { bookingCandidates } = yourRequests

  return <div className="App">
    <Route exact path='/' render={() => isLoggedIn() ? <Redirect to='/search' /> : <Redirect to='/login' />} />
    <Route path='/register' render={() => isLoggedIn() ? <Redirect to='/search' /> : <Register onRegister={handleRegister} error={error} />} />
    <Route path='/login' render={() => isLoggedIn() ? <Redirect to='/search' /> : <Login onLogin={handleLogin} error={error} />} />
    <Route path='/account' render={() => isLoggedIn() ? <><Header onLogout={handleLogout} /><UserUpdate onUserUpdate={handleUserUpdate} error={error} /></> : <Redirect to='/login' />} />
    <Route path='/search' render={() => isLoggedIn() ? <><Header onLogout={handleLogout} /><Search onSearch={handleSearch} error={error} /></> : <Redirect to='/login' />} />
    <Route path='/results' render={() => isLoggedIn() ? <> <Header onLogout={handleLogout} /> <Results results={results} onItemClick={handleDetail} /> </> : <Redirect to='/login' />} />
    <Route path='/detail/:spotId' render={() => isLoggedIn() ? <><Header onLogout={handleLogout} /><Detail spotDetail={detail} handleDetail={handleDetail} handleOnBooking={handleBooking} /></> : <Redirect to='/login' />} />
    <Route path='/add-a-spot' render={() => isLoggedIn() ? <><Header onLogout={handleLogout} /><AddSpot onAddSpot={handleAddSpot} error={error} /></> : <Redirect to='/login' />} />
    <Route path='/my-spots' render={() => isLoggedIn() ? <><Header onLogout={handleLogout} /><MySpots handleMySpots={handleMySpots} allMySpots={mySpots} updateMySpot={handleToUpdateMySpot} deleteMySpot={handleDeleteMySpot} onItemClick={handleDetail} error={error} /> </> : <Redirect to='/login' />} />
    <Route path='/update/:spotId' render={() => isLoggedIn() ? <><Header onLogout={handleLogout} /><SpotUpdate spot={spot} onUpdateMySpot={handleOnUpdateMySpot} /></> : <Redirect to='/login' />} />
    <Route path='/my-bookings' render={() => isLoggedIn() ? <><Header onLogout={handleLogout} /><MyBookings myBookingSpots={myBookingSpots} handleMyBookings={handleMyBookings} /></> : <Redirect to='/login' />} />
    <Route path='/manage-requests' render={() => isLoggedIn() ? <><Header onLogout={handleLogout} /><ManageYourRequests yourRequests={yourRequests} handleMyRequests={handleMyRequests} onAccept={handleOnAccept} onDecline={handleOnDecline} /></> : <Redirect to='/login' />} />
  </div>
})
