import React, { useState, useEffect, useContext } from 'react'
import { useParams } from 'react-router-dom'
import Modal from 'react-modal'
import { useSelector } from 'react-redux'
import ProjectEdit from '../components/ProjectEdit'
import { FirestoreContext } from '../components/FirestoreContextProvider'
import IProject from '../interfaces/IProject'
import IInitialState from '../interfaces/IInitialState'
import ILoginUser from '../interfaces/ILoginUser'

const Project = () => {
  const { tag } = useParams()
  const loginUser = useSelector<IInitialState, IInitialState['loginUser']>(state => state.loginUser)
  const db = useContext(FirestoreContext)
  const [projectState, setProjectState] = useState<IProject>({
    name: '',
    description: '',
    tag: '',
    created: 0,
    userId: '',
  })
  const [maker, setMaker] = useState<ILoginUser>({} as ILoginUser)
  const [isModalOpen, setIsModalOpen] = useState(false)
  useEffect(() => {
    const getProject = async () => {
      // プロジェクト取得
      const projectSnap = await db.collection('projects').where('tag', '==', tag).get()
      if (projectSnap.empty) return
      const project: IProject = projectSnap.docs[0].data() as IProject
      project.id = projectSnap.docs[0].id
      setProjectState(project)
      // 作成者取得
      const snapshot = await db.collection('users').doc(project.userId).get()
      const user = snapshot.data() as ILoginUser
      setMaker(user)
    }
    getProject()
  }, [projectState, db, tag])
  return (
    <>
      <div className="flex flex-wrap w-9/12 mt-5 m-auto">
        <div className="w-8/12">
          <div>
            <span className="text-xl font-semibold">{projectState.name}</span>
            {projectState.userId === loginUser.id && (
              <button
                onClick={() => setIsModalOpen(true)}
                className="text-xs px-2 py-1 ml-3 bg-gray-200 rounded-full focus:outline-none">
                編集
              </button>
            )}
          </div>
          <div>{projectState.description}</div>
        </div>
        <div className="w-4/12">
          <div className="p-4 border-2 border-gray-300 rounded">
            <div className="text-sm font-semibold mb-3">作成者</div>
            <div className="flex items-center">
              <img src={maker.picture} alt="プロフィール写真" className="rounded-full w-10 h-10" />
              <div className="ml-2">{maker.displayName}</div>
            </div>
          </div>
        </div>
      </div>
      <Modal
        isOpen={isModalOpen}
        onRequestClose={() => setIsModalOpen(false)}
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
        <ProjectEdit project={projectState} closeModal={() => setIsModalOpen(false)} />
      </Modal>
    </>
  )
}

export default Project
