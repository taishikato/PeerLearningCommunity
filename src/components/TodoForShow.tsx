import React, { useState, useEffect, useRef, MouseEvent, useContext } from 'react';
import { ITodoNew } from '../interfaces/ITodo';
import extractTag from '../plugins/extractTag';
import { FirestoreContext } from './FirestoreContextProvider';
import { Link } from 'react-router-dom';
import ReactHashtag from 'react-hashtag';
import CommentAddForm from './CommentAddForm';

const TodoForShow: React.FC<IProps> = ({ todo }) => {
  const db = useContext(FirestoreContext);
  let text = todo.text;
  const tag = extractTag(text);
  const addCommentButton = useRef<HTMLButtonElement>(null);
  const [showCommentForm, setShowCommentForm] = useState(false);
  const [commentCount, setCommentCount] = useState(0);

  const handleAddCommentButtonClick = () => {
    setShowCommentForm(true);
  };

  useEffect(() => {
    const getComments = async () => {
      const todoSnapShot = await db.collection('comments').where('todoId', '==', todo.id).get();
      setCommentCount(todoSnapShot.size);
      if (todoSnapShot.size > 0) addCommentButton.current!.style.display = 'block';
    };
    getComments();
  }, [db, todo, setCommentCount]);

  return (
    <div>
      <div className="flex items-center">
        <label className="inline-flex items-center">
          <input
            type="checkbox"
            className="form-checkbox h-6 w-6 text-green-500 cursor-not-allowed"
            checked={todo.checked}
            disabled
          />
          {tag !== null ? (
            <span className="ml-3 text-lg">
              <ReactHashtag
                renderHashtag={(hashtagValue: string) => (
                  <Link
                    to={`/project/${hashtagValue.slice(1)}`}
                    className="bg-blue-200 p-1 ml-3 rounded text-blue-700 text-lg">
                    {hashtagValue}
                  </Link>
                )}>
                {text}
              </ReactHashtag>
            </span>
          ) : (
            <span className="ml-3 text-lg">{text}</span>
          )}
        </label>
      </div>
      <div className="mt-1">
        <button
          onClick={handleAddCommentButtonClick}
          className="rounded-full text-xs ml-8 py-1 px-2 focus:outline-none hover:bg-gray-200"
          ref={addCommentButton}>
          <span role="img" aria-label="絵文字">
            💬
          </span>
          {commentCount > 0 && commentCount}
        </button>
      </div>
      <div className="ml-8">
        <CommentAddForm show={showCommentForm} todo={todo} />
      </div>
    </div>
  );
};

export default TodoForShow;

interface IProps {
  todo: ITodoNew;
}
