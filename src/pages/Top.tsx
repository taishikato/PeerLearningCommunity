import React from 'react'
import SinglePostWrapper from '../components/SinglePostWrapper'
import MySinglePostWrapper from '../components/MySinglePostWrapper'

const Top = () => {
  return (
    <div className="h-full" style={{ backgroundColor: '#f6f6f6' }}>
      <div className="pt-10 w-11/12 m-auto">
        <div className="flex flex-wrap -mx-2">
          <div className="px-2 w-full md:w-7/12 lg:w-7/12">
            <h3 className="font-semibold text-xl mb-5">今日のみんなのタスク</h3>
            <div className="p-5 bg-white rounded">
              <SinglePostWrapper />
            </div>
          </div>
          <div className="px-2 w-full mt-6 md:w-5/12 lg:w-5/12 md:mt-0 lg:mt-0">
            <h3 className="font-semibold text-xl mb-5">自分のタスク</h3>
            <div className="p-5 bg-white rounded">
              <MySinglePostWrapper />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Top
