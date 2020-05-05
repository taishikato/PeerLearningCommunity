import React, { useState, useEffect, useContext } from 'react'
import { Link } from 'react-router-dom'
import { FirestoreContext } from './FirestoreContextProvider'
import IProject from '../interfaces/IProject'

const RecentProjects = () => {
  const db = useContext(FirestoreContext)
  const [projects, setProjects] = useState<IProject[]>([])
  useEffect(() => {
    const getProjects = async () => {
      const projects = await db.collection('projects').orderBy('created', 'desc').get()
      setProjects(projects.docs.map(doc => doc.data()) as IProject[])
    }
    getProjects()
  }, [db])
  return (
    <div className="mb-5">
      <ul>
        {projects.map(project => (
          <li className="p-3 mb-2 rounded bg-green-200">
            <Link to={`/project/${project.tag}`} className="block font-semibold">
              {project.name}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default RecentProjects
