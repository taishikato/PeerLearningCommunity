import React from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import IInitialState from '../interfaces/IInitialState';

const ProfilBar = () => {
  const loginUser = useSelector<IInitialState, IInitialState['loginUser']>(state => state.loginUser);
  return (
    <div className="flex items-center">
      <Link to={`@${loginUser.userName}`}>
        <img src={loginUser.picture} className="rounded-full w-6 h-6" alt="" />
      </Link>
      <Link to={`@${loginUser.userName}`}>
        <span className="font-semibold text-sm ml-2">{loginUser.displayName}</span>
      </Link>
    </div>
  );
};

export default ProfilBar;
