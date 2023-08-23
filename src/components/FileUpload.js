import React from 'react';
import { InboxOutlined } from '@ant-design/icons';
import { Upload } from 'antd';

const { Dragger } = Upload;

const FileUpload = ({ fileUploadProps }) => (
  // eslint-disable-next-line react/jsx-props-no-spreading
  <Dragger {...fileUploadProps}>
    <p className="ant-upload-drag-icon">
      <InboxOutlined />
    </p>
    <p className="ant-upload-text">Click or drag file to this area to upload</p>
  </Dragger>
);
export default FileUpload;
