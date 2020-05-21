import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { FirestoreContext } from './FirestoreContextProvider';
import IProject from '../interfaces/IProject';
import firebase from '../plugins/firebase';
import 'firebase/storage';

const RecentProjects = () => {
  const db = useContext(FirestoreContext);
  const [projects, setProjects] = useState<IProject[]>([]);
  useEffect(() => {
    const getProjects = async () => {
      const projects = await db.collection('projects').orderBy('created', 'desc').get();
      const projectsData = await Promise.all(
        projects.docs.map(async doc => {
          const project = doc.data();
          if (project.hasImage) {
            try {
              const imageUrl = await firebase
                .storage()
                .ref()
                .child(`/projects/thumbs/${project.id}_100x100.png`)
                .getDownloadURL();
              project.image = imageUrl;
            } catch (err) {
              console.error(err.message);
            }
          }
          return project;
        }),
      );
      setProjects(projectsData as IProject[]);
    };
    getProjects();
  }, [db]);
  return (
    <div className="mb-5">
      <ul>
        {projects.map(project => (
          <li className="p-2 mb-2 rounded bg-white border border-green-400">
            <Link to={`/project/${project.tag}`} className="flex items-center font-semibold text-sm">
              {project.hasImage && <img src={project.image} className="mr-3 w-8 h-8 rounded-full" alt="" />}
              {project.name}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RecentProjects;
