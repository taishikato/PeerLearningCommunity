import { createStore, combineReducers } from 'redux'
import { LOGIN, LOGOUT, DONE_CHECKING } from './action'
import IInitialState from '../interfaces/IInitialState'
import { defaultUser } from '../interfaces/ILoginUser'

export const initialState: IInitialState = {
  loginUser: defaultUser,
  isLogin: false,
  isCheckingLogin: true
}

const loginUser = (state = {}, action: any) => {
  switch (action.type) {
    case LOGIN:
      return {
        id: action.id,
        picture: action.picture,
        userName: action.userName,
        displayName: action.displayName,
        email: action.email
      }
      case LOGOUT:
        return {}
    default:
      return state
  }
}

const isLogin = (state = false, action: any) => {
  switch (action.type) {
    case LOGIN:
      return true
    case LOGOUT:
      return false
    default:
      return state
  }
}

const isCheckingLogin = (state = true, action: any) => {
  switch (action.type) {
    case DONE_CHECKING:
      return false
    default:
      return state
  }
}

const reducer = combineReducers({
  loginUser,
  isLogin,
  isCheckingLogin
})

export const initializeStore = (preloadedState = initialState) => {
  return createStore(
    reducer,
    preloadedState
  )
}