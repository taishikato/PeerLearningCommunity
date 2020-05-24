import React from 'react';
import { Link } from 'react-router-dom';

const ProjectItem: React.FC<IProps> = ({ tag }) => {
  return (
    <div className="rounded-full text-xs ml-2 py-1 focus:outline-none">
      <span role="img" aria-labelledby="emoji">
        🚀
      </span>
      <Link to={`/project/${tag}`} className="ml-1 hover:underline">
        {tag}
      </Link>
    </div>
  );
};

export default ProjectItem;

interface IProps {
  tag: string;
}
