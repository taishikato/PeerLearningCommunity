import React, { useState, useContext } from 'react'
import { useSelector } from 'react-redux'
import moment from 'moment-timezone'
import getUnixTime from '../plugins/getUnixTime'
import extractTag from '../plugins/extractTag'
import { FirestoreContext } from './FirestoreContextProvider'
import generateUuid from '../plugins/generateUuid'
import IInitialState from '../interfaces/IInitialState'

const PostModalContent: React.FC<IProps> = ({ closeModal }) => {
  const db = useContext(FirestoreContext)
  const loginUser = useSelector<IInitialState, IInitialState['loginUser']>(state => state.loginUser)
  const [isAddButtonDisabled, setIsAddButtonDisabled] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [text, setText] = useState('')
  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setText(value)
    if (value !== '') {
      setIsAddButtonDisabled(false)
    } else {
      setIsAddButtonDisabled(true)
    }
  }
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)
    // Set tag
    const today = moment().tz('Asia/Tokyo').format('YYYYMMDD')
    const id = generateUuid()
    const todoObj: any = {
      checked: false,
      created: getUnixTime(),
      createdDate: today,
      id,
      text,
      userId: loginUser.id,
    }
    const tag = extractTag(text)
    if (tag !== null) {
      todoObj.tag = tag.slice(1)
    }
    await db.collection('todos').doc(id).set(todoObj)
    setIsSubmitting(false)
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
            placeholder="Reduxを組み込む"
            value={text}
            onChange={e => handleFormChange(e)}
          />
        </ul>

        <div className="bg-gray-200 mt-6 py-3 border-t border-gray-300">
          <div className="w-10/12 m-auto flex justify-end">
            {isSubmitting && (
              <button
                disabled
                className="px-5 p-2 rounded text-white bg-green-200 rounded font-semibold cursor-not-allowed">
                送信中…
              </button>
            )}
            {isAddButtonDisabled && !isSubmitting && (
              <button disabled className="px-5 p-2 rounded text-white bg-green-200 font-semibold cursor-not-allowed">
                追加
              </button>
            )}
            {!isAddButtonDisabled && !isSubmitting && (
              <input
                value="追加"
                type="submit"
                className="px-5 p-2 rounded text-white bg-green-400 hover:bg-green-500 font-semibold focus:outline-none"
              />
            )}
          </div>
        </div>
      </form>
    </div>
  )
}

export default PostModalContent

interface IProps {
  closeModal: () => void
}
