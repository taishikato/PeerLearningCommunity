import React, { useContext, useState } from 'react'
import { useDispatch } from 'react-redux'
import { setTask as seTaskAction } from '../store/action'
import { FirestoreContext } from './FirestoreContextProvider'
import generateUuid from '../plugins/generateUuid'
import AddFormButton from './AddFormButton'
import ITaskData from '../interfaces/ITaskData'
import ITodo from '../interfaces/ITodo'

const EditMyTask: React.FC<IProps> = props => {
  const dispatch = useDispatch()
  const db = useContext(FirestoreContext)
  const [task, setTask] = useState(props.task)
  const [todos, setTodos] = useState<ITodo[]>(task.todos)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const addForm = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    const copiedTodos = [...todos]
    const newTodo = {
      id: generateUuid(),
      text: '',
      checked: false,
    }
    copiedTodos.push(newTodo)
    setTodos(copiedTodos)
    const copiedTask = { ...task, todos: copiedTodos }
    setTask(copiedTask)
  }
  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault()
    const target = e.target
    const value = target.value
    const todoId: string = target.name
    const copyTodos = [...todos]
    copyTodos.some(todo => {
      if (todo.id === todoId) {
        todo.text = value
        return true
      }
      return false
    })
    setTodos(copyTodos)
    setTask({ ...task, todos: copyTodos })
  }
  const deleteTodo = (e: React.MouseEvent<HTMLButtonElement>, todoId: string) => {
    e.preventDefault()
    const copyTodos = [...todos]
    const filteredTodos = copyTodos.filter(todoObj => todoObj.id !== todoId)
    setTodos(filteredTodos)
    const copiedTask = { ...task, todos: filteredTodos }
    setTask(copiedTask)
  }
  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)
    await db.collection('posts').doc(task.id).update({ todos })
    dispatch(seTaskAction(task))
    setIsSubmitting(false)
  }
  return (
    <div>
      <form onSubmit={onSubmit}>
        <div className="bg-gray-200 p-3 border-b border-gray-300">
          <p className="text-2xl">タスク編集</p>
        </div>
        <div className="mt-6">
          <ul className="w-10/12 m-auto">
            {task.todos.map(todo => (
              <li key={todo.id} className="flex flex-wrap items-center justify-between mb-2 single-form">
                <input
                  className="w-10/12 border-2 border-gray-200 rounded py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-green-500"
                  type="text"
                  value={todo.text}
                  onChange={e => handleFormChange(e)}
                  name={todo.id}
                />
                <button
                  onClick={e => deleteTodo(e, todo.id)}
                  className="bg-red-500 rounded-full px-3 py-1 font-bold text-white text-xs hover:underline">
                  削除
                </button>
              </li>
            ))}
            <li className="mt-3">
              <AddFormButton addForm={addForm} />
            </li>
          </ul>
        </div>
        <div className="bg-gray-200 mt-6 p-3 border-t border-gray-300 flex justify-end">
          {isSubmitting ? (
            <button
              disabled
              className="px-6 p-2 rounded-lg text-white bg-green-200 mr-2 rounded-full font-bold cursor-not-allowed">
              送信中…
            </button>
          ) : (
            <input
              type="submit"
              className="bg-green-400 px-6 py-2 rounded-full text-white font-semibold cursor-pointer focus:outline-none"
              value="保存"
            />
          )}
        </div>
      </form>
    </div>
  )
}

export default EditMyTask

interface IProps {
  task: ITaskData
}
