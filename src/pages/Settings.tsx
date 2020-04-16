import React, { useState, useContext, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import uploadImage from '@taishikato/firebase-storage-uploader'
import { Upload } from 'antd'
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons'
import 'antd/lib/upload/style/index.css'
import IInitialState from '../interfaces/IInitialState'
import { FirestoreContext } from '../components/FirestoreContextProvider'
import firebase from '../plugins/firebase'
import 'firebase/auth'
import 'firebase/storage'

const getBase64 = (img: File, callback: (imageUrl: TImageUrl) => void) => {
  const reader = new FileReader()
  reader.addEventListener('load', () => callback(reader.result as TImageUrl))
  reader.readAsDataURL(img)
}

const beforeUpload = (file: File) => {
  const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png'
  if (!isJpgOrPng) {
    console.error('You can only upload JPG/PNG file!')
  }
  const isLt2M = file.size / 1024 / 1024 < 2
  if (!isLt2M) {
    console.error('Image must smaller than 2MB!')
  }
  return isJpgOrPng && isLt2M
}

const Settings = () => {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [updatePassword, setUpdatePassword] = useState('noNeed')
  const [loading, setLoading] = useState(false)
  const [imageUrl, setImageUrl] = useState('')
  const loginUser = useSelector<IInitialState, IInitialState['loginUser']>(state => state.loginUser)
  const db = useContext(FirestoreContext)
  const [userData, setUserData] = useState({
    userName: loginUser.userName,
    displayName: loginUser.displayName,
    email: loginUser.email,
    password: '',
    passwordConfirm: '',
  })
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>, name: string) => {
    const copyUserData = { ...userData, [name]: e.target.value }
    setUserData(copyUserData)
    console.log({ copyUserData })
    if (copyUserData.password !== '' && copyUserData.password === copyUserData.passwordConfirm) {
      setUpdatePassword('ok')
    } else if (copyUserData.password === '' && copyUserData.passwordConfirm === '') {
      setUpdatePassword('noNeed')
    } else {
      setUpdatePassword('wrong')
    }
  }
  const handleImageChange = (info: any) => {
    if (info.file.status === 'uploading') {
      setLoading(true)
      return
    }
    if (info.file.status === 'done') {
      getBase64(info.file.originFileObj, async (imageUrlVal: TImageUrl) => {
        setImageUrl(imageUrlVal as string)
        setLoading(false)
      })
    }
  }
  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)
    if (userData.userName === '' || userData.displayName === '' || userData.email === '') {
      console.error('項目を入れてください')
      return
    }
    const saveData: any = {}
    // Password
    if (updatePassword === 'ok') {
      // password更新処理
      const user = firebase.auth().currentUser
      try {
        await user!.updatePassword(userData.password)
      } catch (err) {
        console.error('パスワード更新時にエラーが発生しました')
      }
    }
    // 画像
    if (imageUrl !== '') {
      const imageUrlDb = await uploadImage(`${loginUser.id}.png`, imageUrl, firebase)
      saveData.picture = imageUrlDb
    }
    saveData.userName = userData.userName
    saveData.displayName = userData.displayName
    saveData.email = userData.email
    await db.collection('users').doc(loginUser.id).update(saveData)
    setIsSubmitting(false)
    toast('保存が正常に完了しました', { type: toast.TYPE.DEFAULT })
  }
  const uploadButton = (
    <div>
      {loading ? <LoadingOutlined /> : <PlusOutlined />}
      <div className="ant-upload-text">Upload</div>
    </div>
  )
  useEffect(() => {
    setUserData({
      userName: loginUser.userName,
      displayName: loginUser.displayName,
      email: loginUser.email,
      password: '',
      passwordConfirm: '',
    })
  }, [loginUser])
  return (
    <>
      <ToastContainer autoClose={4000} />
      <div className="mt-10 m-auto mb-10">
        <div className="w-11/12 md:w-5/12 lg:w-5/12 m-auto">
          <h2 className="text-2xl font-medium mb-5">設定</h2>
          <div className="border-2 border-gray-300 p-5 rounded">
            <form onSubmit={onSubmit} className="bg-white rounded mb-4">
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="username">
                  ユーザーネーム
                </label>
                <input
                  className="appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-0"
                  id="userName"
                  type="text"
                  placeholder=""
                  value={userData.userName}
                  onChange={e => handleChange(e, 'userName')}
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="username">
                  表示名
                </label>
                <input
                  className="appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-0"
                  id="displayName"
                  type="text"
                  placeholder=""
                  value={userData.displayName}
                  onChange={e => handleChange(e, 'displayName')}
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
                  value={userData.email}
                  onChange={e => handleChange(e, 'email')}
                />
                {/* {errCode === DUPLICATED_EMAIL && (
              <p className="text-red-500 text-xs italic">このメールアドレスは既に使用されています</p>
            )} */}
              </div>
              <div className="mb-6">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
                  プロフィール写真
                </label>
                <Upload
                  name="avatar"
                  listType="picture-card"
                  className="avatar-uploader"
                  showUploadList={false}
                  action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
                  beforeUpload={beforeUpload}
                  onChange={handleImageChange}>
                  {imageUrl ? <img src={imageUrl} alt="avatar" style={{ width: '100%' }} /> : uploadButton}
                </Upload>
              </div>
              <div className="mb-6">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
                  新しいパスワード
                </label>
                <input
                  className="appearance-none border-2 border-gray-200 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  id="password"
                  type="password"
                  onChange={e => handleChange(e, 'password')}
                />
                {/* {errCode === WEAK_PW && (
              <p className="text-red-500 text-xs italic">6文字以上のパスワードを入力してください</p>
            )} */}
              </div>
              <div className="mb-6">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
                  新しいパスワード（確認）{updatePassword === 'ok' && <span className="text-green-500 text-xs">✓</span>}
                  {updatePassword === 'wrong' && <span className="text-red-500 text-xs">x</span>}
                </label>
                <input
                  className="appearance-none border-2 border-gray-200 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  id="password-confirm"
                  type="password"
                  onChange={e => handleChange(e, 'passwordConfirm')}
                />
                {/* {errCode === WEAK_PW && (
              <p className="text-red-500 text-xs italic">6文字以上のパスワードを入力してください</p>
            )} */}
              </div>
              <div className="flex items-end justify-between">
                {isSubmitting ? (
                  <button className="bg-blue-200 text-white font-bold py-2 px-4 rounded-full cursor-not-allowed focus:outline-none">
                    送信中…
                  </button>
                ) : (
                  <input
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-full focus:outline-none focus:shadow-outline"
                    type="submit"
                    value="保存"
                  />
                )}
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  )
}

export default Settings

type TImageUrl = string | null
