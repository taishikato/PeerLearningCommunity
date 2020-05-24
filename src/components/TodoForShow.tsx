import React, { useState, useEffect, useContext } from 'react';
import { ITodoNew } from '../interfaces/ITodo';
import { FirestoreContext } from './FirestoreContextProvider';
import ProjectItem from './ProjectItem';
import CommentAddForm from './CommentAddForm';
import CommentAddButton from './CommentAddButton';

const TodoForShow: React.FC<IProps> = ({ todo }) => {
  const db = useContext(FirestoreContext);
  let text = todo.text;
  const [showCommentForm, setShowCommentForm] = useState(false);
  const [commentCount, setCommentCount] = useState(0);

  const handleAddCommentButtonClick = () => setShowCommentForm(!showCommentForm);

  useEffect(() => {
    const getComments = async () => {
      const todoSnapShot = await db.collection('comments').where('todoId', '==', todo.id).get();
      setCommentCount(todoSnapShot.size);
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
          <span className="ml-3">{text}</span>
        </label>
      </div>
      <div className="mt-1 flex items-center">
        <CommentAddButton commentCount={commentCount} handleAddCommentButtonClick={handleAddCommentButtonClick} />
        {todo.tag !== '' && todo.tag !== null && <ProjectItem tag={todo.tag as string} />}
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
