import {
  ConfigProvider,
  Select, Space, Typography,
} from 'antd';
import React from 'react';

const { Text } = Typography;
const SelectBox = ({
  valueSelected, onUpdateValue, options, onRefresh,
  label, placeholder, isSearchEnabled, hasClearButton,
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
              colorBorder: 'black',
              colorPrimaryBorderHover: 'black',
              colorPrimaryBorder: 'black',
              colorInfoBorder: 'black',
            },
          }}
        >
          <Select
            showSearch={isSearchEnabled}
            allowClear={hasClearButton}
            placeholder={placeholder}
            optionFilterProp="children"
            onChange={valueChangeHandler}
            style={{ width: '100%' }}
            valueSelected={valueSelected}
            onClear={onRefresh && onRefresh}
            filterOption={(input, option) => (option?.label ?? '').toLowerCase().includes(input.toLowerCase())}
            options={options}
          />
        </ConfigProvider>
      </Space.Compact>
    </div>
  );
};

export default SelectBox;
