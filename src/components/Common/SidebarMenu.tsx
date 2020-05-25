import React, { useState, useEffect, useContext } from 'react';
import { useSelector } from 'react-redux';
import { Link, useLocation } from 'react-router-dom';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faCaretRight } from '@fortawesome/free-solid-svg-icons';
import ProfilBar from '../ProfilBar';
import IInitialState from '../../interfaces/IInitialState';
import { FirestoreContext } from '../FirestoreContextProvider';
import serviceImage from '../../assets/images/service.svg';
import asyncForEach from '../../plugins/asyncForEach';
import firebase from '../../plugins/firebase';
import 'firebase/storage';

const SidebarMenu = () => {
  const [menu, setMenu] = useState<any>({
    home: {
      name: '🏠 Home',
      path: '/',
      active: false,
    },
    timeline: {
      name: '👩‍💻 👨‍💻 Timeline',
      path: '/timeline',
      active: false,
    },
    projects: [],
  });
  const isLogin = useSelector<IInitialState, IInitialState['isLogin']>(state => state.isLogin);
  const loginUser = useSelector<IInitialState, IInitialState['loginUser']>(state => state.loginUser);
  const db = useContext(FirestoreContext);
  const location = useLocation();

  useEffect(() => {
    const copiedMenu = { ...menu };
    if (location.pathname === '/') {
      copiedMenu.home.active = true;
      copiedMenu.timeline.active = false;
      copiedMenu.projects = setProjectsFalse(copiedMenu);
      setMenu(copiedMenu);
      return;
    }
    if (location.pathname === '/timeline') {
      copiedMenu.home.active = false;
      copiedMenu.timeline.active = true;
      copiedMenu.projects = setProjectsFalse(copiedMenu);
      setMenu(copiedMenu);
      return;
    }
    copiedMenu.home.active = false;
    copiedMenu.projects.forEach((item: any) => {
      if (location.pathname !== item.path) {
        item.active = false;
        return;
      }
      item.active = true;
    });
    setMenu(copiedMenu);
  }, [location]);

  useEffect(() => {
    const getProjects = async () => {
      const copiedMenu = { ...menu };
      const projectSnapShot = await db.collection('projects').where('userId', '==', loginUser.id).get();
      await asyncForEach(projectSnapShot.docs, async doc => {
        const project = doc.data();
        project.image = serviceImage;
        if (project.hasImage) {
          project.image = await firebase
            .storage()
            .ref()
            .child(`/projects/thumbs/${project.id}_100x100.png`)
            .getDownloadURL();
        }
        copiedMenu.projects.push({
          name: project.name,
          path: `/project/${project.tag}`,
          image: project.image,
          active: false,
        });
      });
      setMenu(copiedMenu);
    };
    if (isLogin && menu.projects.length === 0) getProjects();
  }, [loginUser, db, isLogin, menu]);
  return (
    <div>
      {isLogin ? (
        <>
          <div className="mx-6 mb-5 pb-3 border-b border-gray-400">
            <ProfilBar />
          </div>
          <Link
            to={menu.home.path}
            className={`block text-base font-semibold pl-6 py-1 hover:bg-gray-200 ${
              menu.home.active ? 'bg-gray-200' : 'bg-gray-100'
            }`}>
            {menu.home.name}
          </Link>

          <Link
            to={menu.timeline.path}
            className={`block mt-2 text-base font-semibold pl-6 py-1 hover:bg-gray-200 ${
              menu.timeline.active ? 'bg-gray-200' : 'bg-gray-100'
            }`}>
            {menu.timeline.name}
          </Link>

          <h3 className="py-1 font-semibold text-sm mt-4 pl-6 text-gray-500">Projects</h3>
          <ul>
            {menu.projects.map((item: any) => (
              <li>
                <Link
                  to={item.path}
                  className={`flex items-center text-base font-semibold pl-6 py-1 hover:bg-gray-200 ${
                    item.active ? 'bg-gray-200' : 'bg-gray-100'
                  }`}>
                  <img src={item.image} alt="" className="rounded-full w-4 h-4" />
                  <span className="ml-2">{item.name}</span>
                </Link>
              </li>
            ))}
          </ul>
        </>
      ) : (
        <div className="pl-6">Loading…</div>
      )}
    </div>
  );
};

export default SidebarMenu;

const setProjectsFalse = (menu: any) => {
  return menu.projects.map((item: any) => {
    return { ...item, active: false };
  });
};
