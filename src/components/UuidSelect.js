import {
  ConfigProvider,
  Select, Space, Typography,
} from 'antd';
import React from 'react';

const { Text } = Typography;

const SelectBox = ({
  valueSelected, onUpdateValue, options, label,
}) => {
  const valueChangeHandler = (value) => {
    if (onUpdateValue) {
      onUpdateValue(value);
    }
  };

  return (
    <div>
      <Text>{label}</Text>
      <Space.Compact style={{ width: '100%' }} direction="vertical">
        <ConfigProvider
          theme={{
            token: {
              colorBorder: '#D9D9D9',
              colorPrimaryBorderHover: '#D9D9D9',
              colorPrimaryBorder: '#D9D9D9',
              colorInfoBorder: '#D9D9D9',
            },
          }}
        >
          <Select
            value={valueSelected}
            onChange={valueChangeHandler}
            allowClear
            placeholder="Select existing document"
            style={{ width: '100%' }}
          >
            {options.map((option) => (
              <Select.Option key={option} value={option.value}>
                {option.label}
              </Select.Option>
            ))}
          </Select>
        </ConfigProvider>
      </Space.Compact>
    </div>
  );
};

export default SelectBox;
