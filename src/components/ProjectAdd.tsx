import React, { useState, useContext } from 'react';
import { useSelector } from 'react-redux';
import IInitialState from '../interfaces/IInitialState';
import getUnixTime from '../plugins/getUnixTime';
import generateUuid from '../plugins/generateUuid';
import { FirestoreContext } from './FirestoreContextProvider';
import uploadImage from '@taishikato/firebase-storage-uploader';
import beforeUpload from '../plugins/beforeUpload';
import getBase64 from '../plugins/getBase64';
import UploadButton from './UploadButton';
import firebase from '../plugins/firebase';
import 'firebase/storage';
import { Upload } from 'antd';
import 'antd/lib/upload/style/index.css';

type TImageUrl = string | null;

const AddProject: React.FC<IProps> = ({ closeModal }) => {
  const [imageUrl, setImageUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const db = useContext(FirestoreContext);
  const projectRef = db.collection('projects');
  const loginUser = useSelector<IInitialState, IInitialState['loginUser']>(state => state.loginUser);
  const [project, setProject] = useState<{ [key: string]: string | number | boolean }>({
    name: '',
    description: '',
    url: '',
    tag: '',
    hasImage: false,
    created: 0,
    userId: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isAddButtonDisabled, setIsAddButtonDisabled] = useState(true);
  const [duplicateTag, setDuplicateTag] = useState(false);
  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    setIsAddButtonDisabled(true);
    const name = e.target.name;
    const value = e.target.value;
    const copiePproject = { ...project };
    copiePproject[name] = value;
    setProject(copiePproject);
    if (copiePproject.name !== '' && copiePproject.description !== '' && copiePproject.tag !== '') {
      setIsAddButtonDisabled(false);
    }
  };
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setDuplicateTag(false);
    let tag = project.tag;
    if ((tag as string).charAt(0) === '#') {
      tag = (tag as string).slice(1);
    }
    project.tag = tag;
    const projectData = await projectRef.where('tag', '==', tag).get();
    if (!projectData.empty) {
      setDuplicateTag(true);
      setIsSubmitting(false);
      return;
    }
    const id = generateUuid();
    project.id = id;
    if (imageUrl !== '') {
      await uploadImage(`/projects/${project.id}.png`, imageUrl, firebase);
      project.hasImage = true;
    }
    project.created = getUnixTime();
    project.userId = loginUser.id;
    await projectRef.doc(id).set(project);
    setIsSubmitting(false);
    closeModal();
  };
  const handleImageChange = (info: any) => {
    if (info.file.status === 'uploading') {
      setLoading(true);
      return;
    }
    if (info.file.status === 'done') {
      getBase64(info.file.originFileObj, async (imageUrlVal: TImageUrl) => {
        setImageUrl(imageUrlVal as string);
        setLoading(false);
      });
    }
  };
  return (
    <div>
      <div className="bg-gray-200 py-3 border-b border-gray-300">
        <p className="text-2xl w-10/12 m-auto">New Project</p>
      </div>
      <form onSubmit={handleSubmit} className="mt-6">
        <div className="w-10/12 m-auto">
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="username">
              Name
            </label>
            <input
              className="w-full border-2 border-gray-200 rounded py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-green-500"
              type="text"
              placeholder="Shouter"
              value={project.name as string}
              name="name"
              onChange={e => handleFormChange(e)}
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="username">
              Tagline
            </label>
            <input
              className="w-full border-2 border-gray-200 rounded py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-green-500"
              type="text"
              name="description"
              value={project.description as string}
              onChange={e => handleFormChange(e)}
              placeholder="Shout your thoughts on the Internet"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="username">
              URL
            </label>
            <input
              className="w-full border-2 border-gray-200 rounded py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-green-500"
              type="url"
              name="url"
              value={project.url as string}
              onChange={e => handleFormChange(e)}
              placeholder="https://shouter.com/"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
              Icon
            </label>
            <Upload
              name="avatar"
              listType="picture-card"
              className="avatar-uploader"
              showUploadList={false}
              action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
              beforeUpload={beforeUpload}
              onChange={handleImageChange}>
              {imageUrl ? (
                <img src={imageUrl} alt="avatar" style={{ width: '100%' }} />
              ) : (
                <UploadButton loading={loading} />
              )}
            </Upload>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="username">
              tag
            </label>
            <input
              className="w-full border-2 border-gray-200 rounded py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-green-500"
              type="text"
              name="tag"
              value={project.tag as string}
              onChange={e => handleFormChange(e)}
              placeholder="#shouter"
            />
            {duplicateTag && <p className="text-sm text-red-500">This tag is already taken.</p>}
          </div>
        </div>

        <div className="bg-gray-200 mt-6 py-3 border-t border-gray-300">
          <div className="w-10/12 m-auto flex items-center justify-end">
            <div>
              {isSubmitting && (
                <button
                  disabled
                  className="px-5 p-2 rounded text-white bg-green-200 rounded font-semibold cursor-not-allowed">
                  Submitting…
                </button>
              )}
              {isAddButtonDisabled && !isSubmitting && (
                <button
                  disabled
                  className="px-5 p-2 rounded text-white bg-green-200 rounded font-semibold cursor-not-allowed">
                  Add
                </button>
              )}
              {!isAddButtonDisabled && !isSubmitting && (
                <input
                  value="Add"
                  type="submit"
                  className="px-5 p-2 rounded text-white bg-green-400 hover:bg-green-500 rounded font-semibold cursor-pointer focus:outline-none"
                />
              )}
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default AddProject;

interface IProps {
  closeModal: () => void;
}
