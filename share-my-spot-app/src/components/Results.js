import React from 'react'
import { Item } from '../components'
import './Results.sass'

export default function ({results, onItemClick}) {
    
    return <ul className="results">
        {results.map(item => <Item key={item.id} item={item} onClick={onItemClick} />)}
    </ul>
}