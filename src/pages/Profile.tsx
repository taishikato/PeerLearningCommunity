import React, { useState, useEffect, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FirestoreContext } from '../components/FirestoreContextProvider';
import ILoginUser, { defaultUser } from '../interfaces/ILoginUser';
import IProject from '../interfaces/IProject';
import firebase from '../plugins/firebase';
import 'firebase/storage';
import dog from '../assets/images/dog.gif';
import service from '../assets/images/service.svg';

const Profile = () => {
  const [user, setUser] = useState<ILoginUser>(defaultUser);
  const [projects, setProjects] = useState<IProject[]>([]);
  const [loading, setLoading] = useState(true);
  const { username } = useParams();
  const db = useContext(FirestoreContext);

  useEffect(() => {
    const getUser = async () => {
      const user = await db.collection('users').where('userName', '==', username).get();
      if (user.empty) {
        setLoading(false);
        return;
      }
      const userData = user.docs[0].data();
      setUser(userData as ILoginUser);
      const projectsSnapShot = await db.collection('projects').where('userId', '==', userData.id).get();
      const projects = await Promise.all(
        projectsSnapShot.docs.map(async doc => {
          const project = doc.data();
          project.image = service;
          if (project.hasImage) {
            try {
              const imageUrl = await firebase
                .storage()
                .ref()
                .child(`/projects/thumbs/${project.id}_200x200.png`)
                .getDownloadURL();
              project.image = imageUrl;
            } catch (err) {
              console.error(err.message);
            }
          }
          return project;
        }),
      );
      setProjects(projects as IProject[]);
      setLoading(false);
    };
    getUser();
  }, [username, db]);
  return (
    <>
      {loading ? (
        <div className="bg-gray-100 h-full w-full flex items-center justify-center flex-col">
          <img src={dog} alt="" className="rounded-lg w-64" />
          <p>Loading…</p>
        </div>
      ) : (
        <>
          <div className="w-full px-3 py-6 bg-green-400 md:px-6 lg:px-6">
            <div className="flex flex-wrap items-center">
              <img src={user.picture} alt="" className="rounded-full w-16 h-16" />
              <p className="font-semibold text-lg ml-5 text-white">{user.displayName}</p>
            </div>
          </div>
          <div className="h-full bg-gray-100 px-3 md:px-6 lg:px-6">
            <div className="font-semibold text-lg py-5">プロジェクト</div>
            <ul className="flex flex-wrap -mx-2">
              {projects.map(project => (
                <li className="px-2">
                  <Link to={`/project/${project.tag}`} className="bg-white rounded-lg p-2 block">
                    <img src={project.image} className="w-20 h-20 rounded-lg" alt="" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </>
      )}
    </>
  );
};

export default Profile;
