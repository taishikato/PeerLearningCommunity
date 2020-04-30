import React, { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
// import moment from 'moment-timezone'
import Skeleton from 'react-loading-skeleton'
import Modal from 'react-modal'
import { FirestoreContext } from './FirestoreContextProvider'
import { setTask } from '../store/action'
import PostModalContent from './PostModalContent'
import Todo from './Todo'
import SignupForm from './SignupForm'
import LoginForm from './LoginForm'
import EditMyTask from './EditMyTask'
import IInitialState from '../interfaces/IInitialState'
import ITaskData from '../interfaces/ITaskData'
import { ITodoNew } from '../interfaces/ITodo'

const MySinglePostWrapper = () => {
  const dispatch = useDispatch()
  const [isLoading, setIsLoading] = React.useState(true)
  const [isModalOpen, setIsModalOpen] = React.useState(false)
  const [isPostModalOpen, setIsPostModalOpen] = React.useState(false)
  const [isSignupModalOpen, setIsSignupModalOpen] = React.useState(false)
  const [isLoginModalOpen, setIsLoginModalOpen] = React.useState(false)
  const isLogin = useSelector<IInitialState, IInitialState['isLogin']>(state => state.isLogin)
  const loginUser = useSelector<IInitialState, IInitialState['loginUser']>(state => state.loginUser)
  const task = useSelector<IInitialState, IInitialState['myTask']>(state => state.myTask)
  const [todosState, setTodosState] = useState<ITodoNew[]>([])
  const db = React.useContext(FirestoreContext)
  const handleChangeTodoStatus = async (e: React.ChangeEvent<HTMLInputElement>, todoId: string) => {
    const todos = [...task.todos]
    todos.some(todo => {
      if (todo.id === todoId) {
        todo.checked = e.target.checked
        return true
      }
      return false
    })
    dispatch(setTask({ ...task, todos }))
    await db.collection('posts').doc(task.id).update({ todos })
  }
  React.useEffect(() => {
    if (!isLogin) {
      setIsLoading(false)
      return
    }
    // const today = moment().tz('Asia/Tokyo').format('YYYYMMDD')
    const getTodo = async () => {
      const todos = await db.collection('todos').where('userId', '==', loginUser.id).where('checked', '==', false).get()
      if (todos.empty) {
        setIsLoading(false)
        return
      }
      // const postDataForState = todos.docs[0].data()
      // postDataForState.id = todo.docs[0].id
      // dispatch(setTask(postDataForState as ITaskData))
      const todoData = todos.docs.map(doc => doc.data())
      setTodosState(todoData as ITodoNew[])
      setIsLoading(false)
    }
    getTodo()
  }, [loginUser.id, setIsLoading, isLogin, db])
  return (
    <>
      <div className="list-individual">
        <div>
          {isLoading ? (
            <Skeleton count={3} />
          ) : (
            <>
              {todosState[0] !== undefined ? (
                <>
                  <ul className="bg-white rounded mb-4 border-2 border-gray-300">
                    {todosState.map(todo => (
                      <div key={todo.id} className="todo-component-wrapper p-3 border-b border-gray-300">
                        <Todo todo={todo} />
                      </div>
                      // <li className="mt-1" key={todo.id}>
                      //   <label className="inline-flex items-center">
                      //     <input
                      //       type="checkbox"
                      //       className="form-checkbox h-6 w-6 text-green-500"
                      //       onChange={e => handleChangeTodoStatus(e, todo.id)}
                      //       checked={todo.checked}
                      //     />
                      //     <span className="ml-3 text-lg">{todo.text}</span>
                      //   </label>
                      // </li>
                    ))}
                  </ul>
                  {/* <div className="clearfix">
                    <button
                      onClick={() => setIsModalOpen(true)}
                      className="flex rounded-full text-xs text-gray-800 float-right focus:outline-none hover:underline">
                      タスクを編集
                    </button>
                  </div> */}
                </>
              ) : isLogin ? (
                <div className="text-center">
                  <button
                    onClick={() => setIsPostModalOpen(true)}
                    className="px-6 py-2 bg-green-400 rounded-full text-white font-bold focus:outline-none">
                    今日のタスクを追加する
                  </button>
                </div>
              ) : (
                <div className="bg-white rounded p-3 mb-4 border-2 border-gray-300">
                  <button
                    onClick={() => setIsLoginModalOpen(true)}
                    className="text-blue-500 hover:underline focus:outline-none">
                    ログイン
                  </button>
                  または
                  <button
                    onClick={() => setIsSignupModalOpen(true)}
                    className="text-blue-500 hover:underline focus:outline-none">
                    サインアップ
                  </button>
                  してタスクを追加する
                </div>
              )}
            </>
          )}
        </div>
      </div>
      <Modal
        isOpen={isLoginModalOpen}
        onRequestClose={() => setIsLoginModalOpen(false)}
        ariaHideApp={false}
        style={{
          overlay: {
            zIndex: 100000,
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
          },
          content: {
            width: '600px',
            maxWidth: '100%',
            height: '400px',
            position: 'absolute',
            top: '40%',
            left: '50%',
            transform: 'translateY(-50%)translateX(-50%)',
            border: 'none',
            backgroundColor: 'white',
          },
        }}>
        <LoginForm closeModal={() => setIsLoginModalOpen(false)} />
      </Modal>
      <Modal
        isOpen={isSignupModalOpen}
        onRequestClose={() => setIsSignupModalOpen(false)}
        ariaHideApp={false}
        style={{
          overlay: {
            zIndex: 100000,
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
          },
          content: {
            width: '600px',
            maxWidth: '100%',
            height: '450px',
            position: 'absolute',
            top: '40%',
            left: '50%',
            transform: 'translateY(-50%)translateX(-50%)',
            border: 'none',
            backgroundColor: 'white',
          },
        }}>
        <SignupForm closeModal={() => setIsSignupModalOpen(false)} />
      </Modal>
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
        <EditMyTask task={task} />
      </Modal>
      <Modal
        isOpen={isPostModalOpen}
        onRequestClose={() => setIsPostModalOpen(false)}
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
        <PostModalContent closeModal={() => setIsPostModalOpen(false)} />
      </Modal>
    </>
  )
}

export default MySinglePostWrapper
