import {
  ConfigProvider,
  Select, Space, Typography,
} from 'antd';
import React from 'react';

const { Text } = Typography;
const SelectBox = ({
  valueSelected, onUpdateValue, options, onRefresh, onUpdateFileVisibility,
  label, placeholder, isSearchEnabled, hasClearButton,
}) => {
  const valueChangeHandler = (value) => {
    onUpdateFileVisibility(false);
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
