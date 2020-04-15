import React, { useEffect, useState } from 'react'
import firebase from '../plugins/firebase'
import IsLoginContext from '../contexts/IsLoginContext'
import LoginUserContext from '../contexts/LoginUserContext'
import 'firebase/firestore'

const db = firebase.firestore()

const defaultLoginUser = { id: '', displayName: '', userName: '' }

const Auth: React.FC = props => {
  const [isLogin, setIsLogin] = useState(false)
  const [loginUser, setLoginUser] = useState<ILoginUser>(defaultLoginUser)
  useEffect(() => {
    firebase.auth().onAuthStateChanged(async (user: any) => {
      if (user === null) {
        setIsLogin(false)
        setLoginUser(defaultLoginUser)
      } else {
        const userData = await db.collection('users').doc(user.uid).get()
        setIsLogin(true)
        const userDatad = userData.data()
        userDatad!.id = user.uid
        setLoginUser(userDatad as ILoginUser)
      }
    })
  }, [setIsLogin, setLoginUser])
  return (
    <IsLoginContext.Provider value={isLogin}>
      <LoginUserContext.Provider value={loginUser}>{props.children}</LoginUserContext.Provider>
    </IsLoginContext.Provider>
  )
}

export default Auth

interface ILoginUser {
  id: string
  displayName: string
  userName: string
}
