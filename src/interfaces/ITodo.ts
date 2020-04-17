export default interface ITodo {
  id: string
  text: string
  checked: boolean
}

export const defaultTodo = {
  id: '',
  text: '',
  checked: false
}