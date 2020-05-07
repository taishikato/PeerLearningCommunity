import React from 'react'
import ReactDOM from 'react-dom'
import './css/index.css'
import './css/tailwind.css'
import App from './App'
import ReactGA from 'react-ga'
import * as serviceWorker from './serviceWorker'
ReactGA.initialize('UA-27648393-30');
ReactGA.pageview(window.location.pathname + window.location.search);

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root'),
)

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister()
