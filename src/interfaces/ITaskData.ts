import ITodo from './ITodo'

export default interface ITaskData {
  id?: string
  created: number
  createdDate: string
  createdDateObj: string
  todos: ITodo[]
  userId: string
}