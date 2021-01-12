import React, { useEffect } from 'react';
import { Input, DatePicker } from 'antd';
import { useStore, useForm } from '../hooks';

interface TestProps {}

interface Person {
  name: string;
  gender: number;
  startDate?: string;
  endDate?: string;
}

export const Test1: React.FC<TestProps> = () => {
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
        <Input />
      </Item>
      <Item id={['startDate', 'endDate']}>
        <DatePicker.RangePicker />
      </Item>
    </Form>
  );
};

interface Members {
  persons: Person[];
  person: Person;
}

export const Test2: React.FC<TestProps> = () => {
  const store = useStore<Members>({
    persons: {},
    person: {},
  });

  const personStore = useStore<Person>({
    name: {},
    gender: {},
    startDate: {},
    endDate: {},
  });
  useEffect(() => {
    store.componentStores.persons.setSubStore([personStore]);
    store.componentStores.person.setSubStore(personStore);
  }, [store]);
  const { Form, Item } = useForm(store);
  return (
    <Form>
      <Item id="persons">
        <Input />
      </Item>
    </Form>
  );
};
