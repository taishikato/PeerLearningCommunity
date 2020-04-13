import React from 'react'
import Navbar from './components/Navbar'
import Top from './pages/Top'

const App = () => {
  return (
    <div id="app" className="App" style={{ backgroundColor: '#f6f6f6' }}>
      <Navbar />
      <Top />
    </div>
  )
}

export default App
