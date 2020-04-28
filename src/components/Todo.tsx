import React, { useState, useContext } from 'react'
import moment from 'moment-timezone'
import { ITodoNew } from '../interfaces/ITodo'
import { FirestoreContext } from './FirestoreContextProvider'

const Todo: React.FC<IProps> = ({ todo }) => {
  const [todoState, setTodoState] = useState(todo)
  const db = useContext(FirestoreContext)
  const handleChangeTodoStatus = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const checked = e.target.checked
    const today = moment().tz('Asia/Tokyo').format('YYYYMMDD')
    await db.collection('todos').doc(todo.id).update({ checked, doneDate: today })
    const copiedTodo = { ...todoState }
    copiedTodo.checked = checked
    setTodoState(copiedTodo)
  }
  return (
    <div>
      <label className="inline-flex items-center">
        <input
          type="checkbox"
          className="form-checkbox h-6 w-6 text-green-500"
          onChange={e => handleChangeTodoStatus(e)}
          checked={todoState.checked}
        />
        <span className="ml-3 text-lg">{todoState.text}</span>
      </label>
    </div>
  )
}

export default Todo

interface IProps {
  todo: ITodoNew
}
