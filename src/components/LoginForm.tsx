import React, { useState } from 'react'
import firebase from '../plugins/firebase'
import 'firebase/auth'

const WRONG_PW = 'wrongPw'
const USER_NOT_FOUND = 'userNotFound'
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
      await firebase.auth().signInWithEmailAndPassword(userData.email, userData.password)
      closeModal()
    } catch (err) {
      if (err) {
        console.log(err.code)
        console.log(err.message)
        const code = err.code
        if (code === 'auth/wrong-password') setErrCode(WRONG_PW)
        if (code === 'auth/user-not-found') setErrCode(USER_NOT_FOUND)
      }
    } finally {
      setIsSubmitting(false)
    }
  }
  return (
    <div className="modal-content py-4 text-left px-6">
      <div className="flex justify-between items-center pb-3">
        <p className="text-2xl font-bold">ログイン</p>
      </div>
      <form onSubmit={onSubmit} className="bg-white rounded mb-4">
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
          {errCode === USER_NOT_FOUND && (
            <p className="text-red-500 text-xs italic">このメールアドレスを持つユーザーは存在しません</p>
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
          {errCode === WRONG_PW && <p className="text-red-500 text-xs italic">有効ではないパスワードです</p>}
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
              value="ログイン"
            />
          )}
        </div>
      </form>
    </div>
  )
}

export default LoginForm

interface IProps {
  closeModal: () => void
}
