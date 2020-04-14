import React, { useState, useContext } from 'react'
import Modal from 'react-modal'
import PostModalContent from './PostModalContent'
import SignupForm from './SignupForm'
import LoginForm from './LoginForm'
import IsLoginContext from '../contexts/IsLoginContext'
import LoginUserContext from '../contexts/LoginUserContext'
import firebase from '../plugins/firebase'
import 'firebase/auth'

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [isOpenDropDown, setIsOpenDropDown] = React.useState(false)
  const [isPostModalOpen, setIsPostModalOpen] = useState(false)
  const [isSignupModalOpen, setIsSignupModalOpen] = useState(false)
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false)
  const isLogin = useContext(IsLoginContext)
  const loginUser = useContext(LoginUserContext)
  const handleDropDown = () => {
    setIsOpenDropDown(!isOpenDropDown)
  }
  const handleHumburger = () => {
    setIsOpen(!isOpen)
  }
  const logout = async () => {
    await firebase.auth().signOut()
  }
  return (
    <>
      <nav
        style={{ boxShadow: '0px 6px 20px rgba(0, 0, 0, 0.06)' }}
        className="flex items-center justify-between flex-wrap px-6 py-4 text-gray-800">
        <div className="flex items-center flex-shrink-0 mr-6">
          <a href="/" className="font-extrabold text-green-400">
            Peer Community
          </a>
        </div>
        <div className="block lg:hidden">
          <button
            onClick={handleHumburger}
            className="flex items-center px-3 py-2 border rounded text-teal-200 border-teal-400 hover:border-white focus:outline-none">
            <svg className="fill-current h-3 w-3" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
              <title>Menu</title>
              <path d="M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v-2z" />
            </svg>
          </button>
        </div>
        <div className="lg:flex lg:items-center">
          {isLogin && (
            <button
              className="bg-green-400 rounded-full font-bold text-white py-2 px-6 focus:outline-none"
              onClick={() => setIsPostModalOpen(true)}>
              Add
            </button>
          )}
          <div
            className={`ml-5 mt-4 md:p-0 md:mt-0 lg:mt-0 lg:p-0 lg:flex lg:items-center w-full lg:w-auto rounded z-50 ${
              isOpen ? 'block' : 'hidden'
            }`}>
            <div className="mt-4 lg:mt-0">
              {isLogin ? (
                <div className="relative">
                  <button
                    onClick={handleDropDown}
                    className="relative z-10 block h-10 w-10 rounded-full overflow-hidden border-2 border-gray-600 focus:outline-none focus:border-white">
                    <img className="h-full w-full object-cover" src={loginUser.picture} alt={loginUser.displayName} />
                  </button>
                  <div
                    className={`${
                      isOpenDropDown ? 'show' : 'hidden'
                    } absolute z-40 right-0 mt-2 py-2 w-full md:w-48 lg:w-48 bg-white rounded-lg shadow-xl`}>
                    <a
                      href="/[username]"
                      className="block px-4 py-2 text-gray-800 cursor-pointer hover:bg-indigo-500 hover:text-white">
                      Profile
                    </a>
                    <a
                      href="/settings"
                      className="block px-4 py-2 text-gray-800 cursor-pointer hover:bg-indigo-500 hover:text-white">
                      Settings
                    </a>
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
                    className="ml-3 bg-green-400 text-white py-2 px-6 font-semibold rounded-full focus:outline-none">
                    サインアップ
                  </button>
                  <button
                    onClick={() => setIsLoginModalOpen(true)}
                    className="ml-3 py-2 px-6 font-semibold rounded-full text-gray-600 hover:text-gray-900 focus:outline-none">
                    ログイン
                  </button>
                </>
              )}
            </div>
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
            width: '600px',
            maxWidth: '100%',
            position: 'absolute',
            top: '40%',
            left: '50%',
            transform: 'translateY(-50%)translateX(-50%)',
            border: 'none',
            backgroundColor: 'white',
          },
        }}>
        <PostModalContent />
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
            width: '600px',
            maxWidth: '100%',
            height: '450px',
            position: 'absolute',
            top: '40%',
            left: '50%',
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
    </>
  )
}

export default Navbar
