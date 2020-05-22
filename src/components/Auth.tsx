import React, { useEffect, useContext } from 'react';
import { useDispatch } from 'react-redux';
import { loginUser, checkingLoginDone } from '../store/action';
import { FirestoreContext } from './FirestoreContextProvider';
import ILoginUser from '../interfaces/ILoginUser';
import firebase from '../plugins/firebase';
import 'firebase/storage';

const Auth: React.FC = ({ children }) => {
  const db = useContext(FirestoreContext);
  const dispatch = useDispatch();
  useEffect(() => {
    firebase.auth().onAuthStateChanged(async (user: any) => {
      if (user !== null) {
        const userData = await db.collection('users').doc(user.uid).get();
        const userDatad = userData.data();
        userDatad!.id = user.uid;
        userDatad!.email = user.email;
        if (userDatad!.hasImage) {
          const imageUrl = await firebase
            .storage()
            .ref()
            .child(`/users/thumbs/${userDatad!.id}_100x100.png`)
            .getDownloadURL();
          userDatad!.picture = imageUrl;
        }
        dispatch(loginUser(userDatad as ILoginUser));
      }
      dispatch(checkingLoginDone());
    });
  }, [db, dispatch]);
  return <>{children}</>;
};

export default Auth;
