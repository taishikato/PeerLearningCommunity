import React, { useState, useContext } from 'react'
import { useSelector } from 'react-redux'
import moment from 'moment-timezone'
import axios from 'axios'
import Skeleton from 'react-loading-skeleton'
import { FirestoreContext } from './FirestoreContextProvider'
import TodoForShow from './TodoForShow'
import asyncForEach from '../plugins/asyncForEach'
import IInitialState from '../interfaces/IInitialState'
import { ITodoData as ITodoData2 } from '../interfaces/ITodoData'
import { ITodoNew } from '../interfaces/ITodo'

moment.locale('ja')

const SinglePostWrapper = () => {
  const [isLoading, setIsLoading] = useState(true)
  const loginUser = useSelector<IInitialState, IInitialState['loginUser']>(state => state.loginUser)
  const [posts, setPosts] = useState<IPost[]>([])
  const [postsNew, setPostsNew] = useState<ITodoData2[]>([])
  const db = useContext(FirestoreContext)

  React.useEffect(() => {
    const getPosts2 = async () => {
      const [todayPosts, yesterdayPosts, twoaysAgo] = await Promise.all([
        axios.post('https://asia-northeast1-peer-learning-app.cloudfunctions.net/getTodosApiFunc/getTodos', {
          dayBefore: 0,
        }),
        axios.post('https://asia-northeast1-peer-learning-app.cloudfunctions.net/getTodosApiFunc/getTodos', {
          dayBefore: 1,
        }),
        axios.post('https://asia-northeast1-peer-learning-app.cloudfunctions.net/getTodosApiFunc/getTodos', {
          dayBefore: 2,
        }),
      ])

      const postData = [todayPosts.data]
      postData.push(yesterdayPosts.data)
      postData.push(twoaysAgo.data)

      console.log()

      setPostsNew(postData)
      setIsLoading(false)
    }

    getPosts2()

    const getPosts = async () => {
      const postsFromDb = await db
        .collection('posts')
        // .where('createdDate', '==', today)
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
    // getPosts()
  }, [loginUser.id, db, setPosts, setIsLoading])
  return (
    <>
      {isLoading ? (
        <Skeleton count={3} />
      ) : (
        <>
          {postsNew.map((postObj: any) => (
            <div key={postObj.date} className="mb-5">
              <h3 className="text-xl mb-5">{moment(postObj.date).tz('Asia/Tokyo').format('MM月DD日(ddd)')}</h3>
              {postObj.todoByUser.map((todoData: any) => (
                <div key={todoData.user.userName} className="bg-white rounded mb-4 border-2 border-gray-300">
                  <div className="flex items-center p-3 border-b border-gray-300">
                    <img src={todoData.user.picture} alt="プロフィール写真" className="rounded-full w-10 h-10" />
                    <span className="ml-3 font-medium">{todoData.user.displayName}</span>
                  </div>
                  {todoData.todos.map((todo: ITodoNew) => (
                    <div key={todo.id} className="todo-component-wrapper p-3 border-b border-gray-300">
                      <TodoForShow todo={todo} />
                    </div>
                  ))}
                </div>
              ))}
            </div>
          ))}
          {/* {posts.map(postObj => (
            <div key={postObj.post.id} className="list-individual border-b border-gray-200 pt-4 pb-3">
              <div className="flex flex-wrap items-center">
                <img src={postObj.user.picture} className="rounded-full" alt={postObj.user.displayName} width="40" />
                <div className="ml-4">
                  <span className="font-semibold">{postObj.user.displayName}</span>
                  <p className="text-xs text-gray-400">
                    {moment(postObj.post.createdDateObj).tz('Asia/Tokyo').format('YYYY/MM/DD')}
                  </p>
                </div>
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
          ))} */}
        </>
      )}
    </>
  )
}

export default SinglePostWrapper

// const defaultMyPostData = {
//   id: '',
//   created: 0,
//   createdDate: '',
//   createdDateObj: '',
//   todos: [],
//   userId: '',
// }

// const defaultPostData = [
//   {
//     id: '',
//     post: defaultMyPostData,
//     user: {},
//   },
// ]

// interface IPostNew {
//   date: string
//   [key: string]: ITodoDataNew[]
// }

// interface ITodoDataNew {
//   id?: string
//   created: number
//   createdDate: string
//   createdDateObj: string
//   todos: ITodo[]
//   userId: string
// }

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
