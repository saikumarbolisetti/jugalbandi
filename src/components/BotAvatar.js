import React from 'react';
import { FormOutlined } from '@ant-design/icons';

const avatarStyles = {
  backgroundColor: '#754a75',
  color: 'white',
  position: 'absolute',
  height: '20px',
  width: '20px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  borderRadius: '50%',
};

const BotAvatar = () => (
  <div style={avatarStyles}><FormOutlined /></div>
);

export default BotAvatar;
