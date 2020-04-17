import { createStore, combineReducers } from 'redux'
import { LOGIN, LOGOUT, DONE_CHECKING, TASK } from './action'
import IInitialState from '../interfaces/IInitialState'
import { defaultTask } from '../interfaces/ITaskData'
import { defaultUser } from '../interfaces/ILoginUser'

export const initialState: IInitialState = {
  loginUser: defaultUser,
  isLogin: false,
  isCheckingLogin: true,
  myTask: defaultTask
}

const myTask = (state = {}, action: any) => {
  switch (action.type) {
    case TASK:
      return {
        id: action.id,
        created: action.created,
        createdDate: action.createdDate,
        createdDateObj: action.createdDateObj,
        todos: action.todos,
        userId: action.userId
      }
    default:
      return state
  }
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
  isCheckingLogin,
  myTask
})

export const initializeStore = (preloadedState = initialState) => {
  return createStore(
    reducer,
    preloadedState
  )
}