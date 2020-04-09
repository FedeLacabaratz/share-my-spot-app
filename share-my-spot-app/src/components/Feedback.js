import React from 'react'
import './Feedback.sass'

export default function ({ message, level }) {
    return <p className={`feedback feedback--${level}`}>{message}</p>
}