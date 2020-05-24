import React, { useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import getUnixTime from '../plugins/getUnixTime';
import firebase from '../plugins/firebase';
import 'firebase/auth';
import 'firebase/firestore';

const db = firebase.firestore();

const WEAK_PW = 'weakPw';
const DUPLICATED_EMAIL = 'duplicatedEmail';

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
      const result = await firebase.auth().createUserWithEmailAndPassword(userData.email, userData.password);
      const user = result.user;
      // Firestore
      await db.collection('users').doc(user!.uid).set({
        picture: '/images/profile.png',
        displayName: userData.username,
        userName: userData.username,
        created: getUnixTime(),
      });
      closeModal();
    } catch (err) {
      if (err) {
        console.log({ err });
        const code = err.code;
        if (code === 'auth/weak-password') {
          setErrCode(WEAK_PW);
        } else if (code === 'auth/email-already-in-use') {
          setErrCode(DUPLICATED_EMAIL);
        } else {
          toast('Please try again later.', { type: toast.TYPE.ERROR });
        }
      }
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <>
      <ToastContainer autoClose={4000} />
      <div>
        <div className="bg-gray-200 py-3 border-b border-gray-300">
          <p className="text-2xl w-10/12 m-auto">Sign Up</p>
        </div>
        <form onSubmit={onSubmit} className="mt-6">
          <div className="w-10/12 m-auto">
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="username">
                Username
              </label>
              <input
                className="appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-0"
                id="username"
                type="text"
                placeholder=""
                onChange={e => handleChange(e, 'username')}
              />
            </div>
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
              {errCode === DUPLICATED_EMAIL && (
                <p className="text-red-500 text-xs italic">The email address is already in use by another account.</p>
              )}
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
                Password
              </label>
              <input
                className="appearance-none border-2 border-gray-200 rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
                id="password"
                type="password"
                onChange={e => handleChange(e, 'password')}
              />
              {errCode === WEAK_PW && (
                <p className="text-red-500 text-xs italic">Password should be at least 6 characters.</p>
              )}
            </div>
          </div>
          <div className="bg-gray-200 mt-6 py-3 border-t border-gray-300">
            <div className="w-10/12 m-auto flex items-center justify-end">
              {isSubmitting ? (
                <button className="bg-green-200 text-white font-bold py-2 px-4 rounded cursor-not-allowed focus:outline-none">
                  Submitting…
                </button>
              ) : (
                <input
                  className="text-white font-bold py-2 px-4 rounded bg-green-400 hover:bg-green-500 focus:outline-none focus:shadow-outline"
                  type="submit"
                  value="Sign Up"
                />
              )}
            </div>
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
