import {
  Button, Input, Space, Typography,
} from 'antd';
import React from 'react';

const { Text } = Typography;
const UuidInput = ({
  uuid, onSetUuid, onRefresh, disabled,
}) => {
  const uuidNoChangeHandler = (e) => {
    onSetUuid(e.target.value);
  };

  return (
    <div>
      <Text>Uuid Number</Text>
      <Space.Compact style={{ width: '100%' }}>
        <Input placeholder="Enter Uuid Number" onChange={uuidNoChangeHandler} style={{ backgroundColor: 'white', border: '1px solid black' }} value={uuid} />
        <Button
          style={{
            backgroundColor: '#da6eaa', color: 'white',
          }}
          onClick={onRefresh}
          disabled={disabled}
        >
          Clear
        </Button>
      </Space.Compact>
    </div>
  );
};

export default UuidInput;
