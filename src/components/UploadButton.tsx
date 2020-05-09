import React from 'react'
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons'

const UploadButton: React.FC<IProps> = ({ loading }) => {
  return (
    <div>
      {loading ? <LoadingOutlined /> : <PlusOutlined />}
      <div className="ant-upload-text">Upload</div>
    </div>
  )
}

export default UploadButton

interface IProps {
  loading: boolean
}
