import React from 'react'
import FirestoreContext from '../contexts/FirestoreContext'
import firebase from '../plugins/firebase'
import 'firebase/firestore'

const db = firebase.firestore()

const FirestoreContextProvider: React.FC = props => {
  return <FirestoreContext.Provider value={db}>{props.children}</FirestoreContext.Provider>
}

export default FirestoreContextProvider
