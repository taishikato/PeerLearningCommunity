import React from 'react'
import FirestoreContextProvider from './components/FirestoreContextProvider'
import Auth from './components/Auth'
import Navbar from './components/Navbar'
import Top from './pages/Top'

const App = () => {
  return (
    <div id="app" className="App" style={{ backgroundColor: '#f6f6f6' }}>
      <FirestoreContextProvider>
        <Auth>
          <Navbar />
          <Top />
        </Auth>
      </FirestoreContextProvider>
    </div>
  )
}

export default App
