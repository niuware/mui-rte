import React, { useState, useEffect } from 'react'
import * as ReactDOM from 'react-dom'
import Events from './events'
import Themed from './theme'
import Basic from './basic'
import RefSave from './ref-save'
import ReadOnly from './read-only'
import CustomControls from './custom-controls'
import Decorators from './decorator'
import InlineToolbar from './inline-toolbar'
import CustomInlineToolbar from './custom-inline-toolbar'
import LoadHTML from './load-html'
import ResetValue from './reset-value'
import AtomicCustomBlock from './atomic-custom-block'
import KeyBindings from './key-bindings'
import MaxLength from './max-length'
import Autocomplete from './autocomplete'
import AutocompleteAsync from './autocomplete-async'
import AutocompleteAtomic from './autocomplete-atomic'
import AsyncImageUpload from './async-image-upload'
import AsyncAtomicCustomBlock from './async-atomic-custom-block'
import { createTheme, Theme, ThemeProvider } from '@mui/material/styles'

const defaultTheme: Theme = createTheme({})

const App = () => {

    const [sample, setSample] = useState(<Basic />)

    useEffect(() => {
        console.log(`Loaded ${sample.type.name} example`)
    })

    return (
        <ThemeProvider theme={defaultTheme}>
            <div>
                Choose example: &nbsp;
                <button onClick={() => setSample(<Basic />)}>Basic</button>
                <button onClick={() => setSample(<Themed />)}>Themed</button>
                <button onClick={() => setSample(<RefSave />)}>Ref Events</button>
                <button onClick={() => setSample(<CustomControls />)}>Custom Controls</button>
                <button onClick={() => setSample(<Decorators />)}>Decorators</button>
                <button onClick={() => setSample(<InlineToolbar />)}>Inline Toolbar</button>
                <button onClick={() => setSample(<CustomInlineToolbar />)}>Custom Inline Toolbar</button>
                <button onClick={() => setSample(<AtomicCustomBlock />)}>Atomic Custom Block</button>
                <button onClick={() => setSample(<AsyncAtomicCustomBlock />)}>Async Atomic Custom Block</button>
                <button onClick={() => setSample(<AsyncImageUpload />)}>Async image upload</button>
                <button onClick={() => setSample(<ReadOnly />)}>Read Only</button>
                <button onClick={() => setSample(<Events />)}>Events</button>
                <button onClick={() => setSample(<LoadHTML />)}>Load from HTML</button>
                <button onClick={() => setSample(<ResetValue />)}>Reset value</button>
                <button onClick={() => setSample(<KeyBindings />)}>Key Bindings</button>
                <button onClick={() => setSample(<MaxLength />)}>Max length</button>
                <button onClick={() => setSample(<Autocomplete />)}>Autocomplete</button>
                <button onClick={() => setSample(<AutocompleteAsync />)}>AutocompleteAsync</button>
                <button onClick={() => setSample(<AutocompleteAtomic />)}>Autocomplete Atomic</button>
                <div style={{
                    margin: "20px 0"
                }}>
                    <p>
                        <strong>{sample.type.name}</strong> example:
                    </p>
                    {sample}
                </div>
            </div>
        </ThemeProvider>
    )
}

ReactDOM.render(<App />, document.getElementById("root"))
