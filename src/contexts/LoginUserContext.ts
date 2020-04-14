import React from 'react'

const LoginUserContext = React.createContext<ILoginUser>({displayName: '', userName: ''})

export default LoginUserContext

interface ILoginUser {
  displayName: string
  userName: string
  picture?: string
}