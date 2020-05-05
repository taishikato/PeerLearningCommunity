import ILoginUser from '../interfaces/ILoginUser'
import { ITodoNew } from '../interfaces/ITodo'

export const LOGIN = 'login'
export const LOGOUT = 'logout'
export const DONE_CHECKING = 'doneChecking'
export const ADD_TODOS = 'add_todos'
export const SET_TODOS = 'set_todos'

export const setMyTodos = (todos: ITodoNew[]) => ({
  type: SET_TODOS,
  todos,
})

export const addMyTodos = (todo: ITodoNew) => ({
  type: ADD_TODOS,
  id: todo.id,
  created: todo.created,
  createdDate: todo.createdDate,
  userId: todo.userId,
  text: todo.text,
})

export const loginUser = (user: ILoginUser) => ({
  type: LOGIN,
  id: user.id,
  picture: user.picture,
  userName: user.userName,
  displayName: user.displayName,
  email: user.email,
})

export const logoutUser = () => ({
  type: LOGOUT,
})

export const checkingLoginDone = () => ({
  type: DONE_CHECKING,
})
