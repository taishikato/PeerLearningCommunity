import React, { useState, useEffect, useContext } from 'react';
import { ITodoNew } from '../interfaces/ITodo';
import { useSelector, useDispatch } from 'react-redux';
import { FirestoreContext } from './FirestoreContextProvider';
import IInitialState from '../interfaces/IInitialState';
import { editMyTodo, removeMyTodos } from '../store/action';
import IProject from '../interfaces/IProject';

const EditTodo: React.FC<IProps> = ({ closeModal, todo }) => {
  const db = useContext(FirestoreContext);
  const dispatch = useDispatch();
  const loginUser = useSelector<IInitialState, IInitialState['loginUser']>(state => state.loginUser);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isAddButtonDisabled, setIsAddButtonDisabled] = useState(false);
  const todoRef = db.collection('todos').doc(todo.id);
  const [editedTodo, setEditedTodo] = useState<{ [key: string]: string }>({});
  const [projects, setProjects] = useState<IProject[]>([]);

  useEffect(() => {
    const getProjects = async () => {
      const projectSnapShot = await db.collection('projects').where('userId', '==', loginUser.id).get();
      const projects = projectSnapShot.docs.map(doc => doc.data());
      setProjects(projects as IProject[]);
    };
    getProjects();
  }, [loginUser.id, db]);

  useEffect(() => {
    setEditedTodo({ text: todo.text, tag: todo.tag as string });
  }, [todo]);

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const name = e.target.name;
    const value = e.target.value;
    const copyiedTodo = { ...todo, [name]: value };
    setEditedTodo({ text: copyiedTodo.text, tag: copyiedTodo.tag as string });
    if (name === 'text' && value === '') return setIsAddButtonDisabled(true);
    return setIsAddButtonDisabled(false);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    const todoObj: { [key: string]: string } = { text: editedTodo.text, tag: editedTodo.tag };
    // Save
    await todoRef.update(todoObj);
    todoObj.id = todo.id;
    dispatch(editMyTodo(todoObj));
    setIsSubmitting(false);
    closeModal();
  };

  const deleteTodo = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();
    setIsDeleting(true);
    await todoRef.delete();
    dispatch(removeMyTodos(todo.id));
    setIsDeleting(false);
    closeModal();
  };
  return (
    <div>
      <div className="bg-gray-200 py-3 border-b border-gray-300">
        <p className="text-2xl w-10/12 m-auto">編集</p>
      </div>
      <form onSubmit={handleSubmit} className="mt-6">
        <div className="w-10/12 m-auto mb-3">
          <input
            className="w-full border-2 border-gray-200 rounded py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-green-500"
            id="inline-full-name"
            type="text"
            placeholder="アカウント登録機能実装"
            value={editedTodo.text}
            name="text"
            onChange={e => handleFormChange(e)}
          />
        </div>

        <div className="w-10/12 m-auto">
          <div className="relative">
            <select
              onChange={e => handleFormChange(e)}
              name="tag"
              value={editedTodo.tag}
              className="block appearance-none w-full bg-white border-2 border-gray-200 hover:border-gray-300 px-4 py-2 pr-8 rounded leading-tight focus:outline-none focus:shadow-outline">
              <option hidden>Your Project</option>
              <option value="">None</option>
              {projects.map(project => (
                <option key={project.id} value={project.tag}>
                  {project.name}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
              <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-gray-200 mt-6 py-3 border-t border-gray-300">
          <div className="w-10/12 m-auto flex items-center justify-end">
            <div>
              {isSubmitting && (
                <button
                  disabled
                  className="px-5 p-2 rounded text-white bg-green-200 rounded font-semibold cursor-not-allowed">
                  送信中…
                </button>
              )}
              {isAddButtonDisabled && !isSubmitting && (
                <button
                  disabled
                  className="px-5 p-2 rounded text-white bg-green-200 rounded font-semibold cursor-not-allowed">
                  更新
                </button>
              )}
              {!isAddButtonDisabled && !isSubmitting && (
                <input
                  value="更新"
                  type="submit"
                  className="px-5 p-2 rounded text-white bg-green-400 hover:bg-green-500 rounded font-semibold cursor-pointer focus:outline-none"
                />
              )}
            </div>
            <div className="ml-2">
              {isDeleting ? (
                <button
                  disabled
                  className="px-5 p-2 rounded rounded font-semibold bg-red-200 text-white cursor-not-allowed">
                  削除中…
                </button>
              ) : (
                <button
                  onClick={deleteTodo}
                  className="px-5 p-2 rounded rounded font-semibold bg-red-500 text-white hover:bg-red-600 focus:outline-none">
                  削除
                </button>
              )}
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default EditTodo;

interface IProps {
  closeModal: () => void;
  todo: ITodoNew;
}
