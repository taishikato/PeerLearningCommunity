import React from 'react'
import firebase from '../plugins/firebase'
import 'firebase/firestore'

const db = firebase.firestore()

export const FirestoreContext = React.createContext<firebase.firestore.Firestore>(db)

const FirestoreContextProvider: React.FC = props => {
  return <FirestoreContext.Provider value={db}>{props.children}</FirestoreContext.Provider>
}

export default FirestoreContextProvider
