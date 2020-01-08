import React from 'react';
import { Input, DatePicker } from 'antd';
import { useStore, useAutoWired } from '../hooks';

interface TestProps {}

interface Person {
  name: string;
  gender: number;
  startDate?: string;
  endDate?: string;
}

const Test: React.FC<TestProps> = () => {
  const store = useStore<Person>({
    name: {},
    gender: {},
    startDate: {},
    endDate: {},
  });
  const Autowired = useAutoWired(store);
  return (
    <div>
      <Autowired id="name">
        <Input />;
      </Autowired>
      <Autowired id={['startDate', 'endDate']}>
        <DatePicker.RangePicker />
      </Autowired>
    </div>
  );
};

export default Test;
