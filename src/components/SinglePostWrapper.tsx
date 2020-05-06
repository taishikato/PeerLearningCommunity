import React, { useState, useContext, MouseEvent } from 'react'
import { useSelector } from 'react-redux'
import moment from 'moment-timezone'
import axios from 'axios'
import Skeleton from 'react-loading-skeleton'
import { FirestoreContext } from './FirestoreContextProvider'
import TodoForShow from './TodoForShow'
import IInitialState from '../interfaces/IInitialState'
import { ITodoData as ITodoData2 } from '../interfaces/ITodoData'
import { ITodoNew } from '../interfaces/ITodo'

moment.locale('ja')

const SinglePostWrapper = () => {
  const [isLoading, setIsLoading] = useState(true)
  const loginUser = useSelector<IInitialState, IInitialState['loginUser']>(state => state.loginUser)
  const [postsNew, setPostsNew] = useState<ITodoData2[]>([])
  const db = useContext(FirestoreContext)

  const tweet = (e: MouseEvent, todos: ITodoNew[]) => {
    e.preventDefault()
    const tweetText = todos.map(todo => todo.text).join('')
    window.open(
      `https://twitter.com/intent/tweet?url=https://peer-learning-community.netlify.app/&text=${encodeURIComponent(
        tweetText,
      )}`,
    )
  }

  React.useEffect(() => {
    const getPosts2 = async () => {
      setIsLoading(true)
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

      setPostsNew(postData)
      setIsLoading(false)
    }

    getPosts2()
  }, [loginUser.id, db, setIsLoading, setPostsNew])
  return (
    <>
      {isLoading ? (
        <Skeleton count={3} />
      ) : (
        <>
          {postsNew.map((postObj: any) => (
            <div key={postObj.date} className="mb-5">
              <h3 className="text-xl mb-5">{moment(postObj.date).tz('Asia/Tokyo').format('MM月DD日(ddd)')}</h3>
              {postObj.todoByUser.length === 0 ? (
                <>まだToDoはありません</>
              ) : (
                postObj.todoByUser.map((todoData: any) => (
                  <div key={todoData.user.userName} className="bg-white rounded mb-4 border-2 border-gray-300">
                    <div className="flex items-center justify-between p-3 border-b border-gray-300">
                      <div className="flex items-center">
                        <img src={todoData.user.picture} alt="プロフィール写真" className="rounded-full w-10 h-10" />
                        <span className="ml-3 font-medium">{todoData.user.displayName}</span>
                      </div>
                      {todoData.user.userName === loginUser.userName && (
                        <button
                          onClick={e => tweet(e, todoData.todos)}
                          className="text-white text-sm twitter-bg p-1 rounded focus:outline-none">
                          Tweet
                        </button>
                      )}
                    </div>
                    {todoData.todos.map((todo: ITodoNew) => (
                      <div key={todo.id} className="todo-component-wrapper p-3 border-b border-gray-300">
                        <TodoForShow todo={todo} />
                      </div>
                    ))}
                  </div>
                ))
              )}
            </div>
          ))}
        </>
      )}
    </>
  )
}

export default SinglePostWrapper
