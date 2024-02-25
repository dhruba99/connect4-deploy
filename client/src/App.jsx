import { useState } from 'react'
import './App.css'
import Connect4 from './Components/Connect4';

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <Connect4/>
    </>
  )
}

export default App
