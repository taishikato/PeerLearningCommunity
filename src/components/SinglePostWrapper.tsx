import React, { useState, useContext } from 'react'
import moment from 'moment-timezone'
import Skeleton from 'react-loading-skeleton'
import LoginUserContext from '../contexts/LoginUserContext'
import { FirestoreContext } from './FirestoreContextProvider'
import asyncForEach from '../plugins/asyncForEach'

const SinglePostWrapper = () => {
  const [isLoading, setIsLoading] = useState(true)
  const loginUser = useContext(LoginUserContext)
  const [posts, setPosts] = useState<ITodoData[]>(defaultPostData)
  const db = useContext(FirestoreContext)
  React.useEffect(() => {
    const today = moment().tz('Asia/Tokyo').format('YYYYMMDD')
    const getPosts = async () => {
      const postsFromDb = await db
        .collection('posts')
        .where('createdDate', '==', today)
        .where('userId', '>', loginUser.id)
        .where('userId', '<', loginUser.id)
        // .orderBy('created', 'desc')
        .get()
      if (postsFromDb.empty) {
        setIsLoading(false)
        return
      }
      let postsData: any[] = []
      await asyncForEach(postsFromDb.docs, async doc => {
        const post = doc.data()
        post.id = doc.id
        const user = await db.collection('users').doc(post.userId).get()
        postsData.push({
          post,
          user: user.data(),
        })
      })
      setPosts(postsData)
      setIsLoading(false)
    }
    getPosts()
  }, [loginUser.id, db, setPosts, setIsLoading])
  return (
    <>
      {console.log({ posts })}
      {isLoading ? (
        <Skeleton count={3} />
      ) : (
        <>
          {posts.map(post => (
            <div key={post.id} className="list-individual border-b border-gray-200">
              <div className="flex flex-wrap items-center">
                <img src="https://jp.taishikato.com/photo.jpg" className="rounded-full" alt="taishi kato" width="40" />
                <div className="ml-4 font-semibold">taishi kato</div>
              </div>
              <div className="mt-6">
                <ul>
                  {post.todos.map(todo => (
                    <li className="mt-1" key={todo.id}>
                      <label className="inline-flex items-center">
                        <input
                          type="checkbox"
                          className="form-checkbox h-6 w-6 text-green-500"
                          checked={todo.checked}
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

const defaultPostData = [
  {
    id: '',
    created: 0,
    createdDate: '',
    createdDateObj: '',
    todos: [],
    userId: '',
  },
]

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
