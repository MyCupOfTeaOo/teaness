import React, { useState } from 'react';
import { Input, Radio } from 'antd';
import Label from '../../../../Label';
import Layout, { maskLayout, horizontal } from '../Layout';

export const staticLayout = maskLayout(
  horizontal,
  {
    label: {
      float: 'left',
      labelStyle: {
        minWidth: 100,
        paddingRight: 24,
      },
    },
  },
  { depth: true },
);

export const staticDemo = (
  <div>
    <Layout layout={staticLayout}>
      <Label text="姓名1">
        <Input />
      </Label>
      <Label text="姓名2">
        <Input />
      </Label>
      <Label text="姓名3">
        <Input />
      </Label>
    </Layout>
  </div>
);

export const useLayout = maskLayout(
  horizontal,
  (float?: 'left' | 'right') => ({
    label: {
      float,
      labelStyle: {
        minWidth: 100,
        paddingRight: 24,
      },
    },
  }),
  { depth: true },
);

export const DynamicDemo: React.FC<any> = () => {
  const [float, setFloat] = useState<'left' | 'right'>('left');
  const layout = useLayout(float);
  return (
    <div>
      <Radio.Group
        buttonStyle="solid"
        value={float}
        onChange={e => setFloat(e.target.value)}
      >
        <Radio.Button value="left">left</Radio.Button>
        <Radio.Button value="right">right</Radio.Button>
      </Radio.Group>
      <Layout layout={layout}>
        <Label text="姓名1">
          <Input />
        </Label>
        <Label text="姓名2">
          <Input />
        </Label>
        <Label text="姓名3">
          <Input />
        </Label>
      </Layout>
    </div>
  );
};
