import React, { useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import { Link } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';
import firebase from '../plugins/firebase';
import 'firebase/auth';

const WRONG_PW = 'wrongPw';
const USER_NOT_FOUND = 'userNotFound';
const LoginForm: React.FC<IProps> = ({ closeModal }) => {
  const [userData, setUserData] = useState<{ [key: string]: string }>({
    username: '',
    email: '',
    password: '',
  });
  const [errCode, setErrCode] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>, itemName: string) => {
    e.preventDefault();
    const copyUserData = { ...userData };
    copyUserData[itemName] = e.target.value;
    setUserData(copyUserData);
  };
  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrCode('');
    try {
      // Firebase Auth
      await firebase.auth().signInWithEmailAndPassword(userData.email, userData.password);
      closeModal();
    } catch (err) {
      if (err) {
        const code = err.code;
        if (code === 'auth/wrong-password') {
          setErrCode(WRONG_PW);
        } else if (code === 'auth/user-not-found') {
          setErrCode(USER_NOT_FOUND);
        } else {
          toast('An error occured. Please try again.', { type: toast.TYPE.ERROR });
        }
      }
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <>
      <ToastContainer autoClose={4000} />
      <div className="modal-content py-4 text-left px-6">
        <div className="flex justify-between items-center pb-3">
          <p className="text-2xl font-bold">Login</p>
        </div>
        <form onSubmit={onSubmit} className="bg-white rounded mb-4">
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="username">
              Email
            </label>
            <input
              className="appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-0"
              id="email"
              type="email"
              placeholder=""
              onChange={e => handleChange(e, 'email')}
            />
            {errCode === USER_NOT_FOUND && (
              <p className="text-red-500 text-xs italic">There is no user corresponding to this email.</p>
            )}
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
              Password
            </label>
            <input
              className="appearance-none border-2 border-gray-200 rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
              id="password"
              type="password"
              onChange={e => handleChange(e, 'password')}
            />
            {errCode === WRONG_PW && <p className="text-red-500 text-xs italic">The password is invalid.</p>}
          </div>
          <div className="flex items-end items-center">
            {isSubmitting ? (
              <button className="bg-green-200 text-white font-bold py-2 px-5 rounded cursor-not-allowed focus:outline-none">
                Submitting…
              </button>
            ) : (
              <input
                className="bg-green-400 hover:bg-green-500 text-white font-bold py-2 px-5 rounded cursor-pointer focus:outline-none focus:shadow-outline"
                type="submit"
                value="Login"
              />
            )}
            <Link
              to="/reset-password"
              onClick={() => closeModal()}
              className="ml-3 text-blue-500 font-semibold text-sm hover:underline">
              Forgot password?
            </Link>
          </div>
        </form>
      </div>
    </>
  );
};

export default LoginForm;

interface IProps {
  closeModal: () => void;
}
