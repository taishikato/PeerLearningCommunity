import React, { useState, useContext } from 'react'
import { useSelector } from 'react-redux'
import moment from 'moment-timezone'
// import AddFormButton from './AddFormButton'
import getUnixTime from '../plugins/getUnixTime'
import { FirestoreContext } from './FirestoreContextProvider'
import generateUuid from '../plugins/generateUuid'
// import { setTask } from '../store/action'
import IInitialState from '../interfaces/IInitialState'
// import ITaskData from '../interfaces/ITaskData'

const PostModalContent: React.FC<IProps> = ({ closeModal }) => {
  const db = useContext(FirestoreContext)
  // const dispatch = useDispatch()
  const loginUser = useSelector<IInitialState, IInitialState['loginUser']>(state => state.loginUser)
  const [isAddButtonDisabled, setIsAddButtonDisabled] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  // const [newTasks, setNewTasks] = useState<{ id: string; text: string; checked: boolean }[]>([
  //   { id: generateUuid(), text: '', checked: false },
  // ])
  const [text, setText] = useState('')
  // const handleAddForm = (e: React.MouseEvent<HTMLButtonElement>) => {
  //   e.preventDefault()
  //   const copyTasks = [...newTasks]
  //   const newObj = {
  //     id: generateUuid(),
  //     text: '',
  //     checked: false,
  //   }
  //   copyTasks.push(newObj)
  //   setNewTasks(copyTasks)
  // }
  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setText(value)
    if (value !== '') {
      setIsAddButtonDisabled(false)
    } else {
      setIsAddButtonDisabled(true)
    }
    // const target = e.target
    // const value = target.value
    // const todoId: string = target.name
    // const copyTasks = [...newTasks]
    // copyTasks.some(task => {
    //   if (task.id === todoId) {
    //     task.text = target.value
    //     return true
    //   }
    //   return false
    // })
    // let disableFlg = true
    // if (value !== '') {
    //   disableFlg = false
    // } else {
    //   copyTasks.forEach(task => {
    //     if (task.text !== '') {
    //       disableFlg = false
    //       return true
    //     }
    //     return false
    //   })
    // }
    // setIsAddButtonDisabled(disableFlg)
    // setNewTasks(copyTasks)
  }
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)
    // const addPost: ITaskData = {
    //   userId: loginUser.id,
    //   todos: newTasks,
    //   created: getUnixTime(),
    //   createdDateObj: moment().tz('Asia/Tokyo').format(),
    //   createdDate: moment().tz('Asia/Tokyo').format('YYYYMMDD'),
    // }
    // await db.collection('posts').add(addPost)
    const today = moment().tz('Asia/Tokyo').format('YYYYMMDD')
    const id = generateUuid()
    await db.collection('todos').doc(id).set({
      checked: false,
      created: getUnixTime(),
      createdDate: today,
      id,
      text,
      userId: loginUser.id,
    })
    // const postByUserAndDate = await db
    //   .collection('posts')
    //   .where('createdDate', '==', today)
    //   .where('userId', '==', loginUser.id)
    //   .get()
    // addPost.id = postByUserAndDate.docs[0].id
    // dispatch(setTask(addPost))
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
          {/* {newTasks.map(task => (
            <li key={task.id} className="mb-2 single-form">
              <input
                className="w-full border-2 border-gray-200 rounded py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-green-500"
                id="inline-full-name"
                type="text"
                placeholder="TOEICの勉強する"
                value={task.text}
                onChange={e => handleFormChange(e)}
                name={task.id}
              />
            </li>
          ))} */}
          {/* <li className="mt-3">
            <AddFormButton addForm={handleAddForm} />
          </li> */}
          <input
            className="w-full border-2 border-gray-200 rounded py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-green-500"
            id="inline-full-name"
            type="text"
            placeholder="TOEICの勉強する"
            value={text}
            onChange={e => handleFormChange(e)}
          />
        </ul>

        <div className="bg-gray-200 mt-6 py-3 border-t border-gray-300">
          <div className="w-10/12 m-auto flex justify-end">
            {isSubmitting && (
              <button
                disabled
                className="px-6 p-2 rounded-lg text-white bg-green-200 rounded-full font-bold cursor-not-allowed">
                送信中…
              </button>
            )}
            {isAddButtonDisabled && !isSubmitting && (
              <button
                disabled
                className="px-6 p-2 rounded-lg text-white bg-green-200 rounded-full font-bold cursor-not-allowed">
                追加
              </button>
            )}
            {!isAddButtonDisabled && !isSubmitting && (
              <input
                value="追加"
                type="submit"
                className="px-6 p-2 rounded-lg text-white bg-green-400 hover:bg-green-500 rounded-full font-bold focus:outline-none"
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
