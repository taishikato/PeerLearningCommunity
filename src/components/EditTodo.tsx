import React, { useState, useContext } from 'react'
import { ITodoNew } from '../interfaces/ITodo'
import { FirestoreContext } from './FirestoreContextProvider'

const EditTodo: React.FC<IProps> = ({ closeModal, todo }) => {
  const db = useContext(FirestoreContext)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [isAddButtonDisabled, setIsAddButtonDisabled] = useState(false)
  const [text, setText] = useState(todo.text)
  const todoRef = db.collection('todos').doc(todo.id)
  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setText(value)
    if (value === '') return setIsAddButtonDisabled(true)
    return setIsAddButtonDisabled(false)
  }
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)
    await todoRef.update({ text })
    setIsSubmitting(false)
    closeModal()
  }
  const deleteTodo = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault()
    setIsDeleting(true)
    await todoRef.delete()
    setIsDeleting(false)
    closeModal()
  }
  return (
    <div>
      <div className="bg-gray-200 py-3 border-b border-gray-300">
        <p className="text-2xl w-10/12 m-auto">新規タスク</p>
      </div>
      <form onSubmit={handleSubmit} className="mt-6">
        <ul className="w-10/12 m-auto">
          <input
            className="w-full border-2 border-gray-200 rounded py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-green-500"
            id="inline-full-name"
            type="text"
            placeholder="アカウント登録機能実装"
            value={text}
            onChange={e => handleFormChange(e)}
          />
        </ul>

        <div className="bg-gray-200 mt-6 py-3 border-t border-gray-300">
          <div className="w-10/12 m-auto flex items-center justify-end">
            <div>
              {isDeleting ? (
                <button
                  disabled
                  className="px-5 p-2 rounded rounded font-semibold bg-red-200 text-white cursor-not-allowed">
                  削除中…
                </button>
              ) : (
                <button
                  onClick={deleteTodo}
                  className="px-5 p-2 rounded rounded font-semibold bg-red-500 text-white hover:bg-red-600 focus:outline-none">
                  削除
                </button>
              )}
            </div>
            <div className="ml-2">
              {isSubmitting && (
                <button
                  disabled
                  className="px-5 p-2 rounded text-white bg-green-200 rounded font-semibold cursor-not-allowed">
                  送信中…
                </button>
              )}
              {isAddButtonDisabled && !isSubmitting && (
                <button
                  disabled
                  className="px-5 p-2 rounded text-white bg-green-200 rounded font-semibold cursor-not-allowed">
                  更新
                </button>
              )}
              {!isAddButtonDisabled && !isSubmitting && (
                <input
                  value="追加"
                  type="submit"
                  className="px-5 p-2 rounded text-white bg-green-400 hover:bg-green-500 rounded font-semibold cursor-pointer focus:outline-none"
                />
              )}
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}

export default EditTodo

interface IProps {
  closeModal: () => void
  todo: ITodoNew
}
