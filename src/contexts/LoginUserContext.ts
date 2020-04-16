import React from 'react'

const LoginUserContext = React.createContext<ILoginUser>({id: '', displayName: '', userName: '', email: ''})

export default LoginUserContext

interface ILoginUser {
  id: string
  displayName: string
  userName: string
  picture?: string
  email: string
}