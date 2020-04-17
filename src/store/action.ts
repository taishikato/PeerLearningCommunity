import ILoginUser from '../interfaces/ILoginUser'
import ITaskData from '../interfaces/ITaskData'

export const LOGIN = 'login'
export const LOGOUT = 'logout'
export const DONE_CHECKING = 'doneChecking'
export const TASK = 'task'

export const setTask = (task: ITaskData) => ({
  type: TASK,
  id: task.id,
  created: task.created,
  createdDate: task.createdDate,
  createdDateObj: task.createdDateObj,
  todos: task.todos,
  userId: task.userId
})

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