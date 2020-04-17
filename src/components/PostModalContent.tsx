import React, { useState, useContext } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import moment from 'moment-timezone'
import getUnixTime from '../plugins/getUnixTime'
import { FirestoreContext } from './FirestoreContextProvider'
import generateUuid from '../plugins/generateUuid'
import { setTask } from '../store/action'
import IInitialState from '../interfaces/IInitialState'
import ITaskData from '../interfaces/ITaskData'

const PostModalContent: React.FC<IProps> = ({ closeModal }) => {
  const db = useContext(FirestoreContext)
  const dispatch = useDispatch()
  const loginUser = useSelector<IInitialState, IInitialState['loginUser']>(state => state.loginUser)
  const [isAddButtonDisabled, setIsAddButtonDisabled] = useState(true)
  const [newTasks, setNewTasks] = useState<{ id: string; text: string; checked: boolean }[]>([
    { id: generateUuid(), text: '', checked: false },
  ])
  const handleAddForm = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    const copyTasks = [...newTasks]
    const newObj = {
      id: generateUuid(),
      text: '',
      checked: false,
    }
    copyTasks.push(newObj)
    setNewTasks(copyTasks)
  }
  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const target = e.target
    const value = target.value
    const todoId: string = target.name
    const copyTasks = [...newTasks]
    copyTasks.some(task => {
      if (task.id === todoId) {
        task.text = target.value
        return true
      }
      return false
    })
    let disableFlg = true
    if (value !== '') {
      disableFlg = false
    } else {
      copyTasks.forEach(task => {
        if (task.text !== '') {
          disableFlg = false
          return true
        }
        return false
      })
    }
    setIsAddButtonDisabled(disableFlg)
    setNewTasks(copyTasks)
  }
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const addPost: ITaskData = {
      userId: loginUser.id,
      todos: newTasks,
      created: getUnixTime(),
      createdDateObj: moment().tz('Asia/Tokyo').format(),
      createdDate: moment().tz('Asia/Tokyo').format('YYYYMMDD'),
    }
    await db.collection('posts').add(addPost)
    const today = moment().tz('Asia/Tokyo').format('YYYYMMDD')
    const postByUserAndDate = await db
      .collection('posts')
      .where('createdDate', '==', today)
      .where('userId', '==', loginUser.id)
      .get()
    addPost.id = postByUserAndDate.docs[0].data().id
    dispatch(setTask(addPost))
    closeModal()
  }
  return (
    <div className="modal-content py-4 text-left px-6">
      <div className="flex justify-between items-center pb-3">
        <p className="text-2xl font-bold">今日は何する？</p>
      </div>
      <form onSubmit={handleSubmit}>
        {newTasks.map(task => (
          <input
            key={task.id}
            className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-green-500 mb-2"
            id="inline-full-name"
            type="text"
            placeholder="TOEICの勉強する"
            value={task.text}
            onChange={e => handleFormChange(e)}
            name={task.id}
          />
        ))}
        <button onClick={e => handleAddForm(e)} className="my-2 focus:outline-none">
          フォーム追加
        </button>

        <div className="flex justify-end pt-2">
          {isAddButtonDisabled ? (
            <button
              disabled
              className="px-6 p-2 rounded-lg text-white bg-green-200 mr-2 rounded-full font-bold cursor-not-allowed">
              追加
            </button>
          ) : (
            <input
              value="追加"
              type="submit"
              className="px-6 p-2 rounded-lg text-white bg-green-400 hover:bg-green-500 mr-2 rounded-full font-bold"
            />
          )}
        </div>
      </form>
    </div>
  )
}

export default PostModalContent

interface IProps {
  closeModal: () => void
}
