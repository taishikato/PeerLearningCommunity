import React from 'react'
import { ITodoNew } from '../interfaces/ITodo'

const TodoForShow: React.FC<IProps> = ({ todo }) => {
  return (
    <div>
      <label className="inline-flex items-center">
        <input
          type="checkbox"
          className="form-checkbox h-6 w-6 text-green-500 cursor-not-allowed"
          checked={todo.checked}
          disabled
        />
        <span className="ml-3 text-lg">{todo.text}</span>
      </label>
    </div>
  )
}

export default TodoForShow

interface IProps {
  todo: ITodoNew
}
