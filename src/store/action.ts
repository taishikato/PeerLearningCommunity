import ILoginUser from '../interfaces/ILoginUser'

export const LOGIN = 'login'
export const LOGOUT = 'logout'
export const DONE_CHECKING = 'doneChecking'

export const loginUser = (user: ILoginUser) => ({
  type: LOGIN,
  id: user.id,
  picture: user.picture,
  userName: user.userName,
  displayName: user.displayName,
  email: user.email
})
export const logoutUser = () => ({
  type: LOGOUT
})

export const checkingLoginDone = () => ({
  type: DONE_CHECKING
})