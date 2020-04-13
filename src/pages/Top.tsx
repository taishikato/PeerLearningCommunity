import React from 'react'

const Top = () => {
  return (
    <div className="mt-10 w-11/12 m-auto">
      <div className="flex flex-wrap -mx-2">
        <div className="px-2 w-full md:w-6/12 lg:w-6/12">
          <h3 className="font-semibold text-xl mb-5">今日のみんなのタスク</h3>
          <div className="p-5 bg-white rounded">
            <div className="list-individual border-b border-gray-200">
              <div className="flex flex-wrap items-center">
                <img src="https://jp.taishikato.com/photo.jpg" className="rounded-full" alt="taishi kato" width="40" />
                <div className="ml-4 font-semibold">taishi kato</div>
              </div>
              <div className="mt-6">
                <ul>
                  <li className="mt-1">
                    <label className="inline-flex items-center">
                      <input type="checkbox" className="form-checkbox h-6 w-6 text-green-500" />
                      <span className="ml-3 text-lg">TOEICの勉強</span>
                    </label>
                  </li>
                  <li className="mt-1">
                    <label className="inline-flex items-center">
                      <input type="checkbox" className="form-checkbox h-6 w-6 text-green-500" />
                      <span className="ml-3 text-lg">Reactチュートリアルやる</span>
                    </label>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        <div className="px-2 w-full mt-6 md:w-6/12 lg:w-6/12 md:mt-0 lg:mt-0">
          <h3 className="font-semibold text-xl mb-5">自分のタスク</h3>
          <div className="p-5 bg-white rounded">
            <div>
              <ul>
                <li className="mt-1">
                  <label className="inline-flex items-center">
                    <input type="checkbox" className="form-checkbox h-6 w-6 text-green-500" />
                    <span className="ml-3 text-lg">TOEICの勉強</span>
                  </label>
                </li>
                <li className="mt-1">
                  <label className="inline-flex items-center">
                    <input type="checkbox" className="form-checkbox h-6 w-6 text-green-500" />
                    <span className="ml-3 text-lg">Reactチュートリアルやる</span>
                  </label>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Top
