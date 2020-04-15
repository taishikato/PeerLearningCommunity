import React, { useState, useContext } from 'react'
import moment from 'moment-timezone'
import Skeleton from 'react-loading-skeleton'
import IsLoginContext from '../contexts/IsLoginContext'
import LoginUserContext from '../contexts/LoginUserContext'
import { FirestoreContext } from './FirestoreContextProvider'
import asyncForEach from '../plugins/asyncForEach'

const SinglePostWrapper = () => {
  const [isLoading, setIsLoading] = useState(true)
  const loginUser = useContext(LoginUserContext)
  const isLoggedIn = React.useContext(IsLoginContext)
  const [posts, setPosts] = useState<IPost[]>(defaultPostData)
  const db = useContext(FirestoreContext)

  React.useEffect(() => {
    const today = moment().tz('Asia/Tokyo').format('YYYYMMDD')
    const getPosts = async () => {
      if (!isLoggedIn) return
      const postsFromDb = await db
        .collection('posts')
        .where('createdDate', '==', today)
        .orderBy('created', 'desc')
        .get()
      if (postsFromDb.empty) {
        setIsLoading(false)
        return
      }
      let postsData: any[] = []
      await asyncForEach(postsFromDb.docs, async doc => {
        const post = doc.data()
        post.id = doc.id
        if (post.userId === loginUser.id) return
        const user = await db.collection('users').doc(post.userId).get()
        postsData.push({
          post,
          user: user.data(),
        })
      })
      setPosts(postsData)
      setIsLoading(false)
    }
  }, [isLoggedIn, setIsLoading, loginUser.id, setPosts])
  return (
    <>
      {isLoading ? (
        <Skeleton count={3} />
      ) : (
        <>
          {posts.map(postObj => (
            <div key={postObj.id} className="list-individual border-b border-gray-200">
              {console.log({ postObj })}
              <div className="flex flex-wrap items-center">
                <img src={postObj.user.picture} className="rounded-full" alt={postObj.user.displayName} width="40" />
                <div className="ml-4 font-semibold">{postObj.user.displayName}</div>
              </div>
              <div className="mt-6">
                <ul>
                  {postObj.post.todos.map(todo => (
                    <li className="mt-1" key={todo.id}>
                      <label className="inline-flex items-center">
                        <input
                          type="checkbox"
                          className="form-checkbox h-6 w-6 text-green-500 cursor-not-allowed"
                          checked={todo.checked}
                          disabled
                        />
                        <span className="ml-3 text-lg">{todo.text}</span>
                      </label>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </>
      )}
    </>
  )
}

export default SinglePostWrapper

const defaultMyPostData = {
  id: '',
  created: 0,
  createdDate: '',
  createdDateObj: '',
  todos: [],
  userId: '',
}

const defaultPostData = [
  {
    id: '',
    post: defaultMyPostData,
    user: {},
  },
]

interface IPost {
  id: string
  post: ITodoData
  user: any
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
