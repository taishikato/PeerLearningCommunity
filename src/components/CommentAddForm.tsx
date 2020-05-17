import React, { useState, useContext } from 'react';
import { FirestoreContext } from './FirestoreContextProvider';
import { ITodoNew } from '../interfaces/ITodo';
import generateUuid from '../plugins/generateUuid';
import getUnixTime from '../plugins/getUnixTime';
import { useSelector } from 'react-redux';
import IInitialState from '../interfaces/IInitialState';
import moment from 'moment-timezone';

const CommentAddForm: React.FC<IProps> = ({ show, todo }) => {
  const db = useContext(FirestoreContext);
  const [comment, setComment] = useState('');
  const [commentList, setCommentList] = useState<ICommentList[]>([]);
  const loginUser = useSelector<IInitialState, IInitialState['loginUser']>(state => state.loginUser);
  React.useEffect(() => {
    const getComments = async () => {
      const commentsSnapShot = await db
        .collection('comments')
        .where('todoId', '==', todo.id)
        .orderBy('created', 'asc')
        .get();
      if (commentsSnapShot.empty) return;

      const commentsObj = await Promise.all(
        commentsSnapShot.docs.map(async doc => {
          const comment = doc.data();
          let user = loginUser;
          if (comment.userId !== loginUser.id) {
            const userSnapShot = await db.collection('users').doc(comment.userId).get();
            user = userSnapShot.data() as IInitialState['loginUser'];
          }
          return {
            comment,
            user,
          };
        }),
      );
      setCommentList(commentsObj as ICommentList[]);
    };
    if (show) {
      getComments();
    }
  }, [show, db, todo, loginUser]);

  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => setComment(e.target.value);
  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const id = generateUuid();
    await db
      .collection('comments')
      .doc(id)
      .set({ id, todoId: todo.id, userId: loginUser.id, text: comment, created: getUnixTime() });
  };
  return (
    <div>
      {commentList.map((commentData: ICommentList) => (
        <div className="flex mb-3">
          <img src={commentData.user.picture} className="w-6 h-6 rounded-full" alt="" />
          <div key={commentData.comment.id} className="bg-gray-100 rounded ml-2 p-2">
            <div className="font-bold text-sm">{commentData.user.displayName}</div>
            <div className="font-light text-sm">{commentData.comment.text}</div>
            <div className="text-xs text-gray-500 mt-1">
              {moment.unix(commentData.comment.created).tz('Asia/Tokyo').format('YYYY/MM/DD')}
            </div>
          </div>
        </div>
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
        <div className="px-2 py-1 w-2/12">
          <input
            type="submit"
            value="投稿"
            className="rounded bg-gray-100 p-1 text-sm border-2 border-gray-100 cursor-pointer hover:bg-gray-200 focus:outline-none"
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
  created: number;
}

interface ICommentList {
  comment: IComment;
  user: IInitialState['loginUser'];
}
