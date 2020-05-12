import ILoginUser from '../interfaces/ILoginUser';
import { ITodoNew } from '../interfaces/ITodo';
import { ITodoData } from '../interfaces/ITodoData';

export const LOGIN = 'login';
export const LOGOUT = 'logout';
export const DONE_CHECKING = 'doneChecking';
export const ADD_TODOS = 'add_todos';
export const SET_TODOS = 'set_todos';
export const REMOVE_TODOS = 'remove_todos';
export const EDIT_TODOS = 'edit_todos';
export const SET_TIMELINE = 'set_timeline';

/**
 * Timeline
 */
export const setTimeLine = (timeline: ITodoData[]) => ({
  type: SET_TIMELINE,
  timeline,
});

/**
 * My todos
 */
export const setMyTodos = (todos: ITodoNew[]) => ({
  type: SET_TODOS,
  todos,
});

export const addMyTodos = (todo: ITodoNew) => ({
  type: ADD_TODOS,
  id: todo.id,
  created: todo.created,
  createdDate: todo.createdDate,
  userId: todo.userId,
  text: todo.text,
});

export const removeMyTodos = (todoId: string) => ({
  type: REMOVE_TODOS,
  id: todoId,
});

export const editMyTodo = (todo: { [key: string]: string }) => ({
  type: EDIT_TODOS,
  todo,
});

/**
 * LoginUser
 */
export const loginUser = (user: ILoginUser) => ({
  type: LOGIN,
  id: user.id,
  picture: user.picture,
  userName: user.userName,
  displayName: user.displayName,
  email: user.email,
});

export const logoutUser = () => ({
  type: LOGOUT,
});

export const checkingLoginDone = () => ({
  type: DONE_CHECKING,
});
