import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import IInitialState from '../interfaces/IInitialState';
import SinglePostWrapper from '../components/SinglePostWrapper';
import MySinglePostWrapper from '../components/MySinglePostWrapper';
import RecentProjects from '../components/RecentProjects';
// import Streak from '../components/Streak';
import Footer from '../components/Footer';
import ProfilBar from '../components/ProfilBar';
import dog from '../assets/images/dog.gif';

const Top = () => {
  const isLogin = useSelector<IInitialState, IInitialState['isLogin']>(state => state.isLogin);
  const [loadingMyTask, setLoadingMyTask] = useState(true);
  const [loadingTimeline, setLoadingTimeline] = useState(true);
  React.useEffect(() => {
    console.log({ loadingMyTask });
  }, [loadingMyTask]);
  return (
    <>
      {(loadingMyTask || loadingTimeline) && (
        <div className="bg-gray-100 h-full w-full flex items-center justify-center flex-col">
          <img src={dog} alt="" className="rounded-lg w-64" />
          <p>Loading…</p>
        </div>
      )}
      <div className={`h-auto bg-gray-100 ${!loadingMyTask && !loadingTimeline ? 'block' : 'hidden'}`}>
        <div className="h-full bg-gray-100 flex md:-mx-2 ld:-mx-2">
          <div className="h-auto md:px-2 lg:px-2 w-full md:w-3/12 lg:w-3/12">
            <div className="h-full pt-10 bg-white border-r border-gray-400">
              {isLogin && (
                <>
                  <div className="mx-3 mb-5 pb-3 border-b border-gray-400">
                    <ProfilBar />
                  </div>
                  <h3 className="font-semibold text-base mb-4 px-3">My TODOs</h3>
                </>
              )}
              <MySinglePostWrapper setLoading={setLoadingMyTask} />
            </div>
          </div>
          <div className="h-full h-auto pt-10 w-full md:w-9/12 lg:w-9/12 px-3 md:pl-2 md:pr-6 lg:pl-2 lg:pr-6">
            <div className="h-full flex flex-wrap -mx-2">
              <div className="h-full mb-10 px-2 w-full md:w-8/12 lg:w-8/12">
                <SinglePostWrapper setLoading={setLoadingTimeline} />
              </div>
              <div className="h-full px-2 w-full mt-6 md:w-4/12 lg:w-4/12 md:mt-0 lg:mt-0">
                <h3 className="font-semibold text-base mb-4">New Projects</h3>
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
      </div>
    </>
  );
};

export default Top;
