import React from 'react';
import { Input } from 'antd';
import { useStore, useAutoWired } from '../hooks';

interface TestProps {}

interface Person {
  name: string;
  gender: number;
  birthday?: string;
}

const Test: React.FC<TestProps> = () => {
  const store = useStore<Person>({
    name: {},
    gender: {},
    birthday: {},
  });
  const Autowired = useAutoWired(store);
  return (
    <div>
      <Autowired id="name">
        <Input />;
      </Autowired>
    </div>
  );
};

export default Test;
