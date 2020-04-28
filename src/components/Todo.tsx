import React from 'react'
import { ITodoNew } from '../interfaces/ITodo'

const Todo: React.FC<IProps> = ({ todo }) => {
  const handleChangeTodoStatus = (e: React.ChangeEvent<HTMLInputElement>) => {}
  return (
    <div>
      <label className="inline-flex items-center">
        <input
          type="checkbox"
          className="form-checkbox h-6 w-6 text-green-500"
          onChange={e => handleChangeTodoStatus(e)}
          checked={todo.checked}
        />
        <span className="ml-3 text-lg">{todo.text}</span>
      </label>
    </div>
  )
}

export default Todo

interface IProps {
  todo: ITodoNew
}
