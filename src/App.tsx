import React from 'react'
import Auth from './components/Auth'
import Navbar from './components/Navbar'
import Top from './pages/Top'

const App = () => {
  return (
    <div id="app" className="App" style={{ backgroundColor: '#f6f6f6' }}>
      <Auth>
        <Navbar />
        <Top />
      </Auth>
    </div>
  )
}

export default App
