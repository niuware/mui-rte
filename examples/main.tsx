import React, { useState, useEffect } from 'react'
import * as ReactDOM from 'react-dom'
import Events from './events'
import Theme from './theme'
import Basic from './basic'
import RefSave from './ref-save'
import ReadOnly from './read-only'
import CustomControls from './custom-controls'

const App = () => {

    const [sample, setSample] = useState(<Basic />)

    useEffect(() => {
        console.log(`Loaded ${sample.type.name} example`)
    })

    return (
        <div>
            Load example: &nbsp; 
            <button onClick={() => setSample(<Basic />)}>Basic</button> 
            <button onClick={() => setSample(<Theme />)}>Theme</button> 
            <button onClick={() => setSample(<RefSave />)}>RefSave</button> 
            <button onClick={() => setSample(<ReadOnly />)}>Read Only</button> 
            <button onClick={() => setSample(<Events />)}>Events</button>
            <button onClick={() => setSample(<CustomControls />)}>Custom Controls</button>
            {sample}
        </div>
    )
}

ReactDOM.render(<App />, document.getElementById("root"))