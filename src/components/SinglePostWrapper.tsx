import React, { useState, useContext, MouseEvent } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import moment from 'moment-timezone';
import Skeleton from 'react-loading-skeleton';
import { FirestoreContext } from './FirestoreContextProvider';
import TodoForShow from './TodoForShow';
import IInitialState from '../interfaces/IInitialState';
import { ITodoData as ITodoData2 } from '../interfaces/ITodoData';
import { ITodoNew } from '../interfaces/ITodo';
import getTodos from '../plugins/getTodos';
import { setTimeLine, addTimeLine } from '../store/action';

moment.locale('ja');

const url = 'https://makerslog.co/';

const SinglePostWrapper = () => {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(true);
  const [loadingMoreTimeline, setLoadingMoreTimeline] = useState(false);
  const loginUser = useSelector<IInitialState, IInitialState['loginUser']>(state => state.loginUser);
  const timeline = useSelector<IInitialState, IInitialState['timeline']>(state => state.timeline);
  const loadMoreCount = useSelector<IInitialState, IInitialState['loadMoreCount']>(state => state.loadMoreCount);
  const db = useContext(FirestoreContext);

  const tweet = (e: MouseEvent, todos: ITodoNew[]) => {
    e.preventDefault();
    let tweetText = todos
      .map(todo => {
        let emoji = '✅';
        if (!todo.checked) emoji = '🚧';
        return `${emoji}${todo.text}`;
      })
      .join('\n');
    tweetText += `\n${url}\n#メイカーズログ`;
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(tweetText)}`);
  };

  const getMoreTodos = async () => {
    setLoadingMoreTimeline(true);
    const todoData = await getTodos(db, loadMoreCount);
    dispatch(addTimeLine(todoData as ITodoData2 | []));
    setLoadingMoreTimeline(false);
  };

  React.useEffect(() => {
    const getPosts = async () => {
      setIsLoading(true);
      const [todayPosts, yesterdayPosts, twoaysAgo] = await Promise.all([
        getTodos(db),
        getTodos(db, 1),
        getTodos(db, 2),
      ]);

      const postData = [todayPosts];
      postData.push(yesterdayPosts);
      postData.push(twoaysAgo);

      dispatch(setTimeLine(postData as ITodoData2[] | []));
      setIsLoading(false);
    };

    if (timeline.length === 0) {
      getPosts();
    } else {
      setIsLoading(false);
    }
  }, [db, setIsLoading, timeline, dispatch]);
  return (
    <>
      {isLoading ? (
        <Skeleton count={3} />
      ) : (
        <>
          {timeline.map((postObj: any) => (
            <div key={postObj.date} className="mb-5">
              <h3 className="text-lg mb-5">{moment(postObj.date).tz('Asia/Tokyo').format('MM月DD日(ddd)')}</h3>
              {postObj.todoByUser.length === 0 ? (
                <>まだToDoはありません</>
              ) : (
                postObj.todoByUser.map((todoData: any) => (
                  <div key={todoData.user.userName} className="bg-white rounded mb-4 border-2 border-gray-300">
                    <div className="flex items-center justify-between p-3 border-b border-gray-300">
                      <div className="flex items-center">
                        <Link to={`/@${todoData.user.userName}`}>
                          <img src={todoData.user.picture} alt="プロフィール写真" className="rounded-full w-8 h-8" />
                        </Link>
                        <span className="ml-3 font-medium">
                          <Link to={`/@${todoData.user.userName}`}>{todoData.user.displayName}</Link>
                        </span>
                      </div>
                      {todoData.user.userName === loginUser.userName && (
                        <button
                          onClick={e => tweet(e, todoData.todos)}
                          className="text-white text-xs font-medium twitter-bg p-1 rounded focus:outline-none">
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
          {loadingMoreTimeline ? (
            <button className="border px-6 py-2 rounded-full block m-auto bg-green-200 text-white focus:outline-none cursor-not-allowed	">
              取得中…
            </button>
          ) : (
            <button
              onClick={getMoreTodos}
              className="border border-green-400 px-6 py-2 rounded-full block m-auto hover:bg-green-400 hover:text-white focus:outline-none">
              もっと見る
            </button>
          )}
        </>
      )}
    </>
  );
};

export default SinglePostWrapper;
