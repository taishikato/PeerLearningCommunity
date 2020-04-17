import ITodo, { defaultTodo } from './ITodo'

export default interface ITaskData {
  id?: string
  created: number
  createdDate: string
  createdDateObj: string
  todos: ITodo[]
  userId: string
}

export const defaultTask = {
  id: '',
  created: 0,
  createdDate: '',
  createdDateObj: '',
  todos: [defaultTodo],
  userId: ''
}