import React, { useState, useContext } from 'react';
import { FirestoreContext } from './FirestoreContextProvider';
import { ITodoNew } from '../interfaces/ITodo';
import generateUuid from '../plugins/generateUuid';
import { useSelector } from 'react-redux';
import IInitialState from '../interfaces/IInitialState';

const CommentAddForm: React.FC<IProps> = ({ show, todo }) => {
  const db = useContext(FirestoreContext);
  const [comment, setComment] = useState('');
  const [commentList, setCommentList] = useState<IComment[]>([]);
  const loginUser = useSelector<IInitialState, IInitialState['loginUser']>(state => state.loginUser);
  React.useEffect(() => {
    const getComments = async () => {
      const todoSnapShot = await db.collection('comments').where('todoId', '==', todo.id).get();
      console.log(todoSnapShot);
      if (todoSnapShot.empty) return;
      setCommentList(todoSnapShot.docs.map(doc => doc.data()) as IComment[]);
    };
    if (show) {
      console.log('comment');
      getComments();
    }
  }, [show, db, todo]);

  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => setComment(e.target.value);
  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const id = generateUuid();
    await db.collection('comments').doc(id).set({ id, todoId: todo.id, userId: loginUser.id, text: comment });
  };
  return (
    <div>
      {commentList.map((comment: IComment) => (
        <div key={comment.id}>{comment.text}</div>
      ))}
      <form onSubmit={submit} className={show ? 'w-full flex flex-wrap items-center -mx-2 mt-2' : 'hidden'}>
        <div className="px-2 w-10/12">
          <input
            onChange={handleOnChange}
            type="text"
            placeholder="コメントを書く"
            className="w-full rounded border-2 border-gray-200 bg-gray-100 p-1 text-sm focus:outline-none"
          />
        </div>
        <div className="px-2 w-2/12">
          <input
            type="submit"
            value="投稿"
            className="rounded bg-gray-100 p-1 text-sm border-2 border-gray-100 cursor-pointer hover:bg-gray-200"
          />
        </div>
      </form>
    </div>
  );
};

export default CommentAddForm;

interface IProps {
  show: boolean;
  todo: ITodoNew;
}

interface IComment {
  id: string;
  todoId: string;
  userId: string;
  text: string;
}
