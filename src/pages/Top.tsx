import React from 'react';
import SinglePostWrapper from '../components/SinglePostWrapper';
import MySinglePostWrapper from '../components/MySinglePostWrapper';
import RecentProjects from '../components/RecentProjects';
import Streak from '../components/Streak';
import Footer from '../components/Footer';

const Top = () => {
  return (
    <div className="h-auto bg-gray-100 flex flex-wrap -mx-2">
      <div className="px-2 w-full h-auto md:w-3/12 lg:w-3/12">
        <div className="pt-10 h-full bg-white border-r border-gray-300">
          <h3 className="font-semibold text-base mb-4 px-3">自分のタスク</h3>
          <MySinglePostWrapper />
        </div>
      </div>
      <div className="pt-10 w-full md:w-9/12 lg:w-9/12 px-3 md:pl-2 md:pr-6 lg:pl-2 lg:pr-6">
        <div className="flex flex-wrap -mx-2">
          <div className="px-2 w-full md:w-8/12 lg:w-8/12">
            <SinglePostWrapper />
          </div>
          <div className="px-2 w-full mt-6 md:w-4/12 lg:w-4/12 md:mt-0 lg:mt-0">
            <h3 className="font-medium text-lg mb-4">最近追加されたプロジェクト</h3>
            <RecentProjects />
            {/* <h3 className="font-medium text-lg mb-5">
              連続更新記録（修理中）{' '}
              <span className="text-xs text-gray-600 font-medium">*毎晩深夜0時頃に更新されます</span>
            </h3>
            <div className="p-5 bg-white rounded mb-4 border-2 border-gray-300">
              <Streak />
            </div> */}
            <div className="mb-10">
              <Footer />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Top;
