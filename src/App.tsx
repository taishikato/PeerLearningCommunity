import React from 'react'
import { BrowserRouter, Route, Switch } from 'react-router-dom'
import FirestoreContextProvider from './components/FirestoreContextProvider'
import Auth from './components/Auth'
import Navbar from './components/Navbar'
import Top from './pages/Top'
import Settings from './pages/Settings'

const App = () => {
  return (
    <div id="app" className="App">
      <BrowserRouter>
        <FirestoreContextProvider>
          <Auth>
            <Navbar />
            <Switch>
              <Route component={Top} exact path="/" />
              <Route component={Settings} exact path="/settings" />
            </Switch>
          </Auth>
        </FirestoreContextProvider>
      </BrowserRouter>
    </div>
  )
}

export default App
