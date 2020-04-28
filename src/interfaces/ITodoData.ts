import { ITodoNew } from './ITodo'

export interface ITodoData {
  date: string
  todoByUser: {
    user: IUser
    todos: ITodoNew[]
  }
}

interface IUser {
  displayName: string
  picture: string
  userName: string
}
