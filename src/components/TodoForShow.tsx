import React from 'react'
import { ITodoNew } from '../interfaces/ITodo'
import extractTag from '../plugins/extractTag'
import { Link } from 'react-router-dom'
import ReactHashtag from 'react-hashtag'

const TodoForShow: React.FC<IProps> = ({ todo }) => {
  let text = todo.text
  const tag = extractTag(text)

  return (
    <div>
      <label className="inline-flex items-center">
        <input
          type="checkbox"
          className="form-checkbox h-6 w-6 text-green-500 cursor-not-allowed"
          checked={todo.checked}
          disabled
        />
        {tag !== null ? (
          <span className="ml-3 text-lg">
            <ReactHashtag
              renderHashtag={(hashtagValue: string) => (
                <Link
                  to={`/project/${hashtagValue.slice(1)}`}
                  className="bg-blue-200 p-1 ml-3 rounded text-blue-700 text-lg">
                  {hashtagValue}
                </Link>
              )}>
              {text}
            </ReactHashtag>
          </span>
        ) : (
          <span className="ml-3 text-lg">{text}</span>
        )}
      </label>
    </div>
  )
}

export default TodoForShow

interface IProps {
  todo: ITodoNew
}
