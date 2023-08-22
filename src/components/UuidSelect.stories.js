import React from 'react';
import UuidSelect from './UuidSelect';

const options = [
  {
    value: '6888927',
    label: 'ACT 1 (6888927)',
  },
  {
    value: '7823829',
    label: 'ACT 2 (7823829)',
  },
];
const value = {};
export default {
  title: 'UuidSelect',
  component: UuidSelect,
};

export const Primary = () => (
  <UuidSelect
    onSetUuid={() => {}}
    uuid={value}
    uuidOptions={[]}
    onRefresh={() => {}}
  />
);
export const Secondary = () => (
  <UuidSelect
    uuidOptions={options}
  />
);
