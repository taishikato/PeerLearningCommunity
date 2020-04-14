import React, { useState } from 'react'
// import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import getUnixTime from '../plugins/getUnixTime'
import firebase from '../plugins/firebase'
import 'firebase/auth'
import 'firebase/firestore'

const db = firebase.firestore()

const WEAK_PW = 'weakPw'
const DUPLICATED_EMAIL = 'duplicatedEmail'

const LoginForm: React.FC<IProps> = ({ closeModal }) => {
  const [userData, setUserData] = useState<{ [key: string]: string }>({
    username: '',
    email: '',
    password: '',
  })
  const [errCode, setErrCode] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>, itemName: string) => {
    e.preventDefault()
    const copyUserData = { ...userData }
    copyUserData[itemName] = e.target.value
    setUserData(copyUserData)
  }
  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)
    setErrCode('')
    try {
      // Firebase Auth
      const result = await firebase.auth().createUserWithEmailAndPassword(userData.email, userData.password)
      const user = result.user
      // Firestore
      await db.collection('users').doc(user!.uid).set({
        displayName: userData.username,
        userName: userData.username,
        created: getUnixTime(),
      })
      closeModal()
    } catch (err) {
      if (err) {
        console.log(err.code)
        console.log(err.message)
        const code = err.code
        if (code === 'auth/weak-password') setErrCode(WEAK_PW)
        if (code === 'auth/email-already-in-use') setErrCode(DUPLICATED_EMAIL)
      }
    } finally {
      setIsSubmitting(false)
    }
  }
  return (
    <>
      {/* <ToastContainer /> */}
      <div className="modal-content py-4 text-left px-6">
        <div className="flex justify-between items-center pb-3">
          <p className="text-2xl font-bold">サインアップ</p>
        </div>
        <form onSubmit={onSubmit} className="bg-white rounded mb-4">
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="username">
              ユーザーネーム
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
              メールアドレス
            </label>
            <input
              className="appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-0"
              id="email"
              type="email"
              placeholder=""
              onChange={e => handleChange(e, 'email')}
            />
            {errCode === DUPLICATED_EMAIL && (
              <p className="text-red-500 text-xs italic">このメールアドレスは既に使用されています</p>
            )}
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
              パスワード
            </label>
            <input
              className="appearance-none border-2 border-gray-200 rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
              id="password"
              type="password"
              onChange={e => handleChange(e, 'password')}
            />
            {errCode === WEAK_PW && (
              <p className="text-red-500 text-xs italic">6文字以上のパスワードを入力してください</p>
            )}
          </div>
          <div className="flex items-end justify-between">
            {isSubmitting ? (
              <button className="bg-blue-200 text-white font-bold py-2 px-4 rounded-full cursor-not-allowed focus:outline-none">
                送信中…
              </button>
            ) : (
              <input
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full focus:outline-none focus:shadow-outline"
                type="submit"
                value="サインアップ"
              />
            )}
            {/* <a className="inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800" href="/">
            Forgot Password?
          </a> */}
          </div>
        </form>
      </div>
    </>
  )
}

export default LoginForm

interface IProps {
  closeModal: () => void
}
