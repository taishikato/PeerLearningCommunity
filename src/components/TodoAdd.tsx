import React, { useState, useEffect, useContext } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import moment from 'moment-timezone';
import getUnixTime from '../plugins/getUnixTime';
import { FirestoreContext } from './FirestoreContextProvider';
import { addMyTodos } from '../store/action';
import generateUuid from '../plugins/generateUuid';
import IInitialState from '../interfaces/IInitialState';
import IProject from '../interfaces/IProject';

const PostModalContent: React.FC<IProps> = ({ closeModal }) => {
  const db = useContext(FirestoreContext);
  const dispatch = useDispatch();
  const loginUser = useSelector<IInitialState, IInitialState['loginUser']>(state => state.loginUser);
  const [isAddButtonDisabled, setIsAddButtonDisabled] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [projects, setProjects] = useState<IProject[]>([]);
  const [todo, setTodo] = useState<{ [key: string]: string }>({});
  useEffect(() => {
    const getProjects = async () => {
      const projectSnapShot = await db.collection('projects').where('userId', '==', loginUser.id).get();
      const projects = projectSnapShot.docs.map(doc => doc.data());
      setProjects(projects as IProject[]);
    };
    getProjects();
  }, [loginUser.id, db]);

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setIsAddButtonDisabled(false);
    const name = e.target.name;
    const value = e.target.value;
    const copyTodo = { ...todo, [name]: value };
    setTodo(copyTodo);
    if (name === 'text' && value === '') {
      setIsAddButtonDisabled(true);
    }
  };
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    const today = moment().tz('Asia/Tokyo').format('YYYYMMDD');
    const id = generateUuid();
    const todoObj: any = {
      checked: false,
      created: getUnixTime(),
      createdDate: today,
      id,
      text: todo.text,
      userId: loginUser.id,
    };
    // Set tag
    if (todo.tag !== '' && todo.tag !== null && todo.tag !== undefined) {
      console.log('here');
      todoObj.tag = todo.tag;
    }
    await db.collection('todos').doc(id).set(todoObj);
    dispatch(addMyTodos(todoObj));
    setIsSubmitting(false);
    closeModal();
  };
  return (
    <div>
      <div className="bg-gray-200 py-3 border-b border-gray-300">
        <p className="text-2xl w-10/12 m-auto">New TODO</p>
      </div>
      <form onSubmit={handleSubmit} className="mt-6">
        <div className="w-10/12 m-auto mb-3">
          <input
            className="w-full border-2 border-gray-200 rounded py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline hover:border-gray-300"
            id="inline-full-name"
            type="text"
            placeholder="Add an amazing feature"
            name="text"
            onChange={e => handleFormChange(e)}
          />
        </div>
        <div className="w-10/12 m-auto">
          <div className="relative">
            <select
              onChange={e => handleFormChange(e)}
              name="tag"
              className="block appearance-none w-full bg-white border-2 border-gray-200 text-gray-700 hover:border-gray-300 px-4 py-2 pr-8 rounded leading-tight focus:outline-none focus:shadow-outline">
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
          <div className="w-10/12 m-auto flex justify-end">
            {isSubmitting && (
              <button
                disabled
                className="px-5 p-2 rounded text-white bg-green-200 rounded font-semibold cursor-not-allowed">
                Submitting…
              </button>
            )}
            {isAddButtonDisabled && !isSubmitting && (
              <button disabled className="px-5 p-2 rounded text-white bg-green-200 font-semibold cursor-not-allowed">
                Add
              </button>
            )}
            {!isAddButtonDisabled && !isSubmitting && (
              <input
                value="Add"
                type="submit"
                className="px-5 p-2 rounded text-white bg-green-400 hover:bg-green-500 font-semibold focus:outline-none"
              />
            )}
          </div>
        </div>
      </form>
    </div>
  );
};

export default PostModalContent;

interface IProps {
  closeModal: () => void;
}
