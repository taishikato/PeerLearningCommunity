import React from 'react'
import { useSelector } from 'react-redux'
import moment from 'moment-timezone'
import Skeleton from 'react-loading-skeleton'
import { FirestoreContext } from './FirestoreContextProvider'
import IInitialState from '../interfaces/IInitialState'
import ITaskData from '../interfaces/ITaskData'
import Modal from 'react-modal'
import EditMyTask from './EditMyTask'

const MySinglePostWrapper = () => {
  const [isLoading, setIsLoading] = React.useState(true)
  const [postData, setPostData] = React.useState<ITaskData>(defaultPostData)
  const [isModalOpen, setIsModalOpen] = React.useState(false)
  const isLogin = useSelector<IInitialState, IInitialState['isLogin']>(state => state.isLogin)
  const loginUser = useSelector<IInitialState, IInitialState['loginUser']>(state => state.loginUser)
  const db = React.useContext(FirestoreContext)
  const handleChangeTodoStatus = async (e: React.ChangeEvent<HTMLInputElement>, todoId: string) => {
    const todos = [...postData.todos]
    todos.some(todo => {
      if (todo.id === todoId) {
        todo.checked = e.target.checked
        return true
      }
      return false
    })
    setPostData({ ...postData, todos })
    await db.collection('posts').doc(postData.id).update({ todos })
  }
  React.useEffect(() => {
    if (!isLogin) {
      setIsLoading(false)
      return
    }
    const today = moment().tz('Asia/Tokyo').format('YYYYMMDD')
    const getTodo = async () => {
      const todo = await db
        .collection('posts')
        .where('userId', '==', loginUser.id)
        .where('createdDate', '==', today)
        .get()
      if (todo.empty) {
        setIsLoading(false)
        return
      }
      const postDataForState = todo.docs[0].data()
      postDataForState.id = todo.docs[0].id
      setPostData(postDataForState as any)
      setIsLoading(false)
    }
    getTodo()
  }, [loginUser.id, setPostData, setIsLoading, isLogin, db])
  return (
    <>
      <div className="list-individual border-b border-gray-200">
        <div>
          {isLoading ? (
            <Skeleton count={3} />
          ) : (
            <>
              <ul>
                {postData.todos.map(todo => (
                  <li className="mt-1" key={todo.id}>
                    <label className="inline-flex items-center">
                      <input
                        type="checkbox"
                        className="form-checkbox h-6 w-6 text-green-500"
                        onChange={e => handleChangeTodoStatus(e, todo.id)}
                        checked={todo.checked}
                      />
                      <span className="ml-3 text-lg">{todo.text}</span>
                    </label>
                  </li>
                ))}
              </ul>
              <div className="clearfix">
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="flex rounded-full text-xs text-gray-800 float-right focus:outline-none hover:underline">
                  タスクを編集
                </button>
              </div>
            </>
          )}
        </div>
      </div>
      <Modal
        isOpen={isModalOpen}
        onRequestClose={() => setIsModalOpen(false)}
        ariaHideApp={false}
        style={{
          overlay: {
            zIndex: 100000,
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
          },
          content: {
            width: '600px',
            maxWidth: '100%',
            position: 'absolute',
            height: 'auto',
            top: '40%',
            left: '50%',
            bottom: 'none',
            transform: 'translateY(-50%)translateX(-50%)',
            border: 'none',
            backgroundColor: 'white',
            padding: '0',
          },
        }}>
        <EditMyTask task={postData} />
      </Modal>
    </>
  )
}

export default MySinglePostWrapper

const defaultPostData = {
  id: '',
  created: 0,
  createdDate: '',
  createdDateObj: '',
  todos: [],
  userId: '',
}
