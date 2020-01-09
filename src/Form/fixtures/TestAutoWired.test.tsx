import React from 'react';
import { Input, DatePicker } from 'antd';
import { useStore, useForm } from '../hooks';

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
  const { Form, Item } = useForm(store);
  return (
    <Form>
      <Item id="name">
        <Input />;
      </Item>
      <Item id={['startDate', 'endDate']}>
        <DatePicker.RangePicker />
      </Item>
    </Form>
  );
};

export default Test;
