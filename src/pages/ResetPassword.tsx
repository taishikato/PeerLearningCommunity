import React, { useState, ChangeEvent, FormEvent } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import firebase from '../plugins/firebase';
import 'firebase/auth';

const auth = firebase.auth();

const ResetPassword = () => {
  const [email, setEmail] = useState('');

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => setEmail(e.target.value);
  const submit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await auth.sendPasswordResetEmail(email);
      toast('Email has been sent successfully.', { type: toast.TYPE.DEFAULT });
    } catch (err) {
      toast('An error occured. Please try again later.', { type: toast.TYPE.ERROR });
    }
  };
  return (
    <>
      <ToastContainer autoClose={4000} />
      <div className="h-full py-6">
        <div className="h-full m-auto w-11/12 md:w-5/12 lg:w-5/12">
          <h2 className="text-lg font-semibold mb-3">Reset the password</h2>
          <div className="bg-white rounded">
            <p className="mb-2">We send you an URL to reset your password to your email.</p>
            <form onSubmit={submit}>
              <input
                type="email"
                onChange={handleChange}
                placeholder="Email"
                className="appearance-none border-2 border-gray-200 rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
              />
              <input
                type="submit"
                value="Send"
                className="w-full px-6 py-2 rounded m-auto bg-green-400 cursor-pointer text-white hover:bg-green-500 focus:outline-none"
              />
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default ResetPassword;
