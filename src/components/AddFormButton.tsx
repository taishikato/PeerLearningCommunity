import React from 'react'

const AddFormButton: React.FC<IProps> = ({ addForm }) => {
  return (
    <button
      onClick={e => addForm(e)}
      className="bg-gray-200 rounded-full px-6 py-2 focus:outline-none hover:bg-gray-300">
      ToDoを追加
    </button>
  )
}

export default AddFormButton

interface IProps {
  addForm: (e: React.MouseEvent<HTMLButtonElement>) => void
}
