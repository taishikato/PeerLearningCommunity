import { createStore, combineReducers } from 'redux'
import { LOGIN, LOGOUT, DONE_CHECKING, ADD_TODOS, SET_TODOS } from './action'
import IInitialState from '../interfaces/IInitialState'
// import { defaultTask } from '../interfaces/ITaskData'
import { defaultTodo } from '../interfaces/ITodo'
import { defaultUser } from '../interfaces/ILoginUser'

export const initialState: IInitialState = {
  loginUser: defaultUser,
  isLogin: false,
  isCheckingLogin: true,
  myTodos: [defaultTodo],
}

const myTodos = (state = [{}], action: any) => {
  switch (action.type) {
    case SET_TODOS:
      console.log('SET_TODOS')
      return [...action.todos]
    case ADD_TODOS:
      return [
        ...state,
        {
          id: action.id,
          created: action.created,
          createdDate: action.createdDate,
          createdDateObj: action.createdDateObj,
          todos: action.todos,
          userId: action.userId,
        },
      ]
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
        email: action.email,
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
  myTodos,
})

export const initializeStore = (preloadedState = initialState) => {
  return createStore(reducer, preloadedState)
}
