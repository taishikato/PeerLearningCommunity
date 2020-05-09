import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import Modal from 'react-modal'
import { Link, RouteComponentProps } from 'react-router-dom'
import TodoAdd from './TodoAdd'
import SignupForm from './SignupForm'
import LoginForm from './LoginForm'
import IInitialState from '../interfaces/IInitialState'
import firebase from '../plugins/firebase'
import 'firebase/auth'
import { withRouter } from 'react-router'
import ProjectAdd from './ProjectAdd'
import logo from '../assets/images/logo.png'

const Navbar: React.FC<RouteComponentProps> = props => {
  const isLogin = useSelector<IInitialState, IInitialState['isLogin']>(state => state.isLogin)
  const loginUser = useSelector<IInitialState, IInitialState['loginUser']>(state => state.loginUser)
  const [isOpen, setIsOpen] = useState(false)
  const [isOpenDropDown, setIsOpenDropDown] = React.useState(false)
  const [isPostModalOpen, setIsPostModalOpen] = useState(false)
  const [isSignupModalOpen, setIsSignupModalOpen] = useState(false)
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false)
  const [isAddProjectModalOpen, setIsAddProjectModalOpen] = useState(false)
  const handleDropDown = () => setIsOpenDropDown(!isOpenDropDown)
  const handleHumburger = () => setIsOpen(!isOpen)
  const logout = async () => {
    await firebase.auth().signOut()
  }
  React.useEffect(() => {
    if (isOpenDropDown) handleDropDown()
    if (isOpen) handleHumburger()
  }, [props.location])
  return (
    <>
      <nav className="flex flex-wrap items-center px-6 py-4 text-gray-800 bg-white border-b-2 border-gray-300">
        <div className="mr-6">
          <Link to="/" className="font-extrabold text-green-400">
            <img src={logo} alt="ロゴ" width="130px" />
          </Link>
        </div>
        <div className="ml-auto block lg:hidden">
          <button
            onClick={handleHumburger}
            className="flex items-center px-3 py-2 border rounded text-teal-200 border-teal-400 hover:border-white focus:outline-none">
            <svg className="fill-current h-3 w-3" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
              <title>Menu</title>
              <path d="M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v-2z" />
            </svg>
          </button>
        </div>
        <div
          className={`ml-auto mt-4 md:p-0 md:mt-0 lg:mt-0 lg:p-0 lg:flex lg:items-center w-full lg:w-auto rounded z-50 ${
            isOpen ? 'block' : 'hidden'
          }`}>
          {isLogin && (
            <button
              className="ml-auto rounded font-semibold py-2 px-5 focus:outline-none bg-gray-200"
              onClick={() => setIsAddProjectModalOpen(true)}>
              プロジェクトを追加
            </button>
          )}
          {isLogin && (
            <button
              className="ml-2 bg-green-400 rounded font-semibold text-white py-2 px-5 focus:outline-none"
              onClick={() => setIsPostModalOpen(true)}>
              タスクを追加
            </button>
          )}
          {/* {isLogin && myTask.todos[0].id !== '' && (
            <button
              className="ml-auto bg-green-400 rounded-full font-bold text-white py-2 px-5 focus:outline-none"
              onClick={() => setIsEditModalOpen(true)}>
              今日のタスクを編集
            </button>
          )} */}
          <div className="mt-4 ml-4 lg:mt-0">
            {isLogin ? (
              <div className="relative">
                <button
                  onClick={handleDropDown}
                  className="relative z-10 block h-10 w-10 rounded-full overflow-hidden focus:outline-none">
                  <img className="h-full w-full object-cover" src={loginUser.picture} alt={loginUser.displayName} />
                </button>
                <div
                  className={`${
                    isOpenDropDown ? 'show' : 'hidden'
                  } absolute z-40 right-0 mt-2 py-2 w-full md:w-48 lg:w-48 bg-white rounded-lg shadow-xl`}>
                  {/* <a
                      href="/[username]"
                      className="block px-4 py-2 text-gray-800 cursor-pointer hover:bg-indigo-500 hover:text-white">
                      Profile
                    </a> */}
                  <Link
                    to="/settings"
                    className="block px-4 py-2 text-gray-800 cursor-pointer hover:bg-indigo-500 hover:text-white">
                    設定
                  </Link>
                  <a
                    onClick={logout}
                    href="/"
                    className="cursor-pointer block px-4 py-2 text-gray-800 hover:bg-indigo-500 hover:text-white">
                    ログアウト
                  </a>
                </div>
              </div>
            ) : (
              <>
                <button
                  onClick={() => setIsSignupModalOpen(true)}
                  className="bg-green-400 text-white py-2 px-5 font-semibold rounded focus:outline-none">
                  サインアップ
                </button>
                <button
                  onClick={() => setIsLoginModalOpen(true)}
                  className="ml-3 py-2 px-5 font-semibold rounded text-gray-600 hover:text-gray-900 focus:outline-none">
                  ログイン
                </button>
              </>
            )}
          </div>
        </div>
      </nav>
      <Modal
        isOpen={isPostModalOpen}
        onRequestClose={() => setIsPostModalOpen(false)}
        ariaHideApp={false}
        style={{
          overlay: {
            zIndex: 100000,
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
          },
          content: {
            padding: 0,
            width: '600px',
            maxWidth: '100%',
            position: 'absolute',
            top: '40%',
            left: '50%',
            bottom: 'none',
            transform: 'translateY(-50%)translateX(-50%)',
            border: 'none',
            backgroundColor: 'white',
          },
        }}>
        <TodoAdd closeModal={() => setIsPostModalOpen(false)} />
      </Modal>
      <Modal
        isOpen={isSignupModalOpen}
        onRequestClose={() => setIsSignupModalOpen(false)}
        ariaHideApp={false}
        style={{
          overlay: {
            zIndex: 100000,
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
          },
          content: {
            padding: 0,
            width: '600px',
            maxWidth: '100%',
            position: 'absolute',
            top: '40%',
            left: '50%',
            bottom: 'none',
            transform: 'translateY(-50%)translateX(-50%)',
            border: 'none',
            backgroundColor: 'white',
          },
        }}>
        <SignupForm closeModal={() => setIsSignupModalOpen(false)} />
      </Modal>
      <Modal
        isOpen={isLoginModalOpen}
        onRequestClose={() => setIsLoginModalOpen(false)}
        ariaHideApp={false}
        style={{
          overlay: {
            zIndex: 100000,
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
          },
          content: {
            width: '600px',
            maxWidth: '100%',
            height: '400px',
            position: 'absolute',
            top: '40%',
            left: '50%',
            transform: 'translateY(-50%)translateX(-50%)',
            border: 'none',
            backgroundColor: 'white',
          },
        }}>
        <LoginForm closeModal={() => setIsLoginModalOpen(false)} />
      </Modal>
      <Modal
        isOpen={isAddProjectModalOpen}
        onRequestClose={() => setIsAddProjectModalOpen(false)}
        ariaHideApp={false}
        style={{
          overlay: {
            zIndex: 100000,
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
          },
          content: {
            padding: 0,
            width: '600px',
            maxWidth: '100%',
            position: 'absolute',
            top: '50%',
            left: '50%',
            bottom: 'none',
            transform: 'translateY(-50%)translateX(-50%)',
            border: 'none',
            backgroundColor: 'white',
          },
        }}>
        <ProjectAdd closeModal={() => setIsAddProjectModalOpen(false)} />
      </Modal>
    </>
  )
}

export default withRouter(Navbar)
