import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Skeleton from 'react-loading-skeleton';
import Modal from 'react-modal';
import { FirestoreContext } from './FirestoreContextProvider';
import TodoAdd from './TodoAdd';
import Todo from './Todo';
import SignupForm from './SignupForm';
import LoginForm from './LoginForm';
import IInitialState from '../interfaces/IInitialState';
import { ITodoNew } from '../interfaces/ITodo';
import { setMyTodos } from '../store/action';

const MySinglePostWrapper: React.FC<IProps> = ({ setLoading }) => {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = React.useState(true);
  const [isPostModalOpen, setIsPostModalOpen] = React.useState(false);
  const [isSignupModalOpen, setIsSignupModalOpen] = React.useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = React.useState(false);
  let isLogin = useSelector<IInitialState, IInitialState['isLogin']>(state => state.isLogin);
  const loginUser = useSelector<IInitialState, IInitialState['loginUser']>(state => state.loginUser);
  const todosStore = useSelector<IInitialState, IInitialState['myTodos']>(state => state.myTodos);
  const [todosState, setTodosState] = useState<ITodoNew[]>([]);
  const db = React.useContext(FirestoreContext);
  React.useEffect(() => {
    if (!isLogin) {
      setIsLoading(false);
      setLoading(false);
      return;
    }
    const getTodo = async () => {
      setIsLoading(true);
      if (todosStore[0] !== undefined && todosStore[0].id !== '') {
        setTodosState(todosStore as ITodoNew[]);
        setIsLoading(false);
        setLoading(false);
        return;
      }
      const todos = await db
        .collection('todos')
        .where('userId', '==', loginUser.id)
        .where('checked', '==', false)
        .get();
      if (todos.empty) {
        setIsLoading(false);
        setLoading(false);
        return;
      }
      const todoData = todos.docs.map(doc => doc.data());
      dispatch(setMyTodos(todoData as ITodoNew[]));
      setTodosState(todosStore as ITodoNew[]);
      setIsLoading(false);
      setLoading(false);
    };
    getTodo();
  }, [loginUser.id, setIsLoading, isLogin, db, dispatch, setTodosState, todosStore, setLoading]);
  return (
    <>
      <div className="list-individual mx-3">
        <div>
          {isLoading ? (
            <Skeleton count={3} />
          ) : (
            <>
              {todosState[0] !== undefined ? (
                <>
                  <ul className="bg-white mb-5">
                    {todosState.map(todo => (
                      <li key={todo.id} className="todo-component-wrapper border-b border-gray-300 mb-3 pb-3">
                        <Todo todo={todo} />
                      </li>
                    ))}
                  </ul>
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
                <div className="bg-white rounded p-3 mb-5 border-2 border-gray-300">
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
        <TodoAdd closeModal={() => setIsPostModalOpen(false)} />
      </Modal>
    </>
  );
};

export default MySinglePostWrapper;

interface IProps {
  setLoading: (val: boolean) => void;
}
