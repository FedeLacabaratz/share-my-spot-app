import React, { useState } from 'react'

const Context = React.createContext([{}, () => { }])

function Provider({ children }) {
    const [state, setState] = useState({})

    return (
        <Context.Provider value={[state, setState]}>
            {children}
        </Context.Provider>
    )
}

export { Context, Provider }