import React, { useState } from 'react'
import { ITodoNew } from '../interfaces/ITodo'
import Modal from 'react-modal'
import EditTodo from './EditTodo'

const EditButton: React.FC<IProps> = ({ todo }) => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  return (
    <>
      <button
        onClick={() => setIsModalOpen(true)}
        className="px-2 py-1 bg-gray-200 rounded-full text-xs focus:outline-none">
        編集
      </button>
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
            width: '600px',
            maxWidth: '100%',
            position: 'absolute',
            height: 'auto',
            top: '40%',
            left: '50%',
            bottom: 'none',
            transform: 'translateY(-50%)translateX(-50%)',
            border: 'none',
            backgroundColor: 'white',
            padding: '0',
          },
        }}>
        <EditTodo closeModal={() => setIsModalOpen(false)} todo={todo} />
      </Modal>
    </>
  )
}

export default EditButton

interface IProps {
  todo: ITodoNew
}
