import React, { useState } from 'react'

const PostModalContent = () => {
  const [isAddButtonDisabled, setIsAddButtonDisabled] = useState(true)
  const [newTasks, setNewTasks] = useState<{ [key: string]: string }>({ task1: '' })
  const handleAddForm = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    const copyTasks = { ...newTasks }
    const keyName = `task${Object.keys(copyTasks).length + 1}`
    copyTasks[keyName] = ''
    setNewTasks(copyTasks)
  }
  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const target = e.target
    const name: string = target.name
    const copyTasks = { ...newTasks, [name]: target.value }
    let disableFlg = true
    Object.keys(copyTasks).some(key => {
      if (copyTasks[key] !== '') {
        disableFlg = false
        return true
      }
      return false
    })
    setIsAddButtonDisabled(disableFlg)
    setNewTasks(copyTasks)
  }
  return (
    <div className="modal-content py-4 text-left px-6">
      <div className="flex justify-between items-center pb-3">
        <p className="text-2xl font-bold">今日は何する？</p>
      </div>
      <form>
        {Object.keys(newTasks).map(keyName => (
          <input
            key={keyName}
            className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-green-500 mb-2"
            id="inline-full-name"
            type="text"
            placeholder="TOEICの勉強する"
            value={newTasks[keyName]}
            onChange={e => handleFormChange(e)}
            name={keyName}
          />
        ))}
        <button onClick={e => handleAddForm(e)} className="my-2 focus:outline-none">
          フォーム追加
        </button>
      </form>

      <div className="flex justify-end pt-2">
        {isAddButtonDisabled ? (
          <button
            disabled
            className="px-6 p-2 rounded-lg text-white bg-green-200 mr-2 rounded-full font-bold cursor-not-allowed">
            追加
          </button>
        ) : (
          <button className="px-6 p-2 rounded-lg text-white bg-green-400 hover:bg-green-500 mr-2 rounded-full font-bold">
            追加
          </button>
        )}
      </div>
    </div>
  )
}

export default PostModalContent
