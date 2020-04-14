import React from 'react'
import moment from 'moment-timezone'
import Skeleton from 'react-loading-skeleton'
import LoginUserContext from '../contexts/LoginUserContext'
import firebase from '../plugins/firebase'
import 'firebase/firestore'

const db = firebase.firestore()

const SinglePostWrapper = () => {
  const [isLoading, setIsLoading] = React.useState(true)
  const [postData, setPostData] = React.useState<ITodoData>(defaultPostData)
  const loginUser = React.useContext(LoginUserContext)
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
    const today = moment().tz('Asia/Tokyo').format('YYYYMMDD')
    const getTodo = async () => {
      const todo = await db
        .collection('posts')
        .where('userId', '==', loginUser.id)
        .where('createdDate', '==', today)
        .get()
      if (todo.empty) return
      const postDataForState = todo.docs[0].data()
      postDataForState.id = todo.docs[0].id
      setPostData(postDataForState as any)
      setIsLoading(false)
    }
    getTodo()
  }, [loginUser.id, setPostData, setIsLoading])
  return (
    <div className="list-individual border-b border-gray-200">
      <div className="flex flex-wrap items-center">
        <img src="https://jp.taishikato.com/photo.jpg" className="rounded-full" alt="taishi kato" width="40" />
        <div className="ml-4 font-semibold">taishi kato</div>
      </div>
      {console.log({ postData })}
      <div className="mt-6">
        {isLoading ? (
          <Skeleton count={3} />
        ) : (
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
        )}
      </div>
    </div>
  )
}

export default SinglePostWrapper

const defaultPostData = {
  id: '',
  created: 0,
  createdDate: '',
  createdDateObj: '',
  todos: [],
  userId: '',
}

interface ITodoData {
  id?: string
  created: number
  createdDate: string
  createdDateObj: string
  todos: ITodo[]
  userId: string
}

interface ITodo {
  id: string
  text: string
  checked: boolean
}
