export default interface ITodo {
  id: string
  text: string
  checked: boolean
}

export const defaultTodo = {
  id: '',
  text: '',
  checked: false,
}

export interface ITodoNew {
  id: string
  text: string
  checked: boolean
  userId: string
  createdDate: string
  created: number
}
