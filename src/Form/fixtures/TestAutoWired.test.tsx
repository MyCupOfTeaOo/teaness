import React, { useEffect } from 'react';
import { Input, DatePicker } from 'antd';
import Button from 'antd/es/button';
import { Col } from 'es';
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
  person?: Person;
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
    store.componentStores.person?.setSubStore(personStore);
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

export const Test3: React.FC<TestProps> = () => {
  const store = useStore<Members>({
    persons: {
      defaultValue: [{} as any],
      rules: [
        {
          required: true,
          message: 'persons必填',
        },
      ],
    },
  });

  const personStore = useStore<Person>({
    name: {
      rules: [
        {
          required: true,
          message: 'name必填',
        },
      ],
    },
    gender: {},
    startDate: {},
    endDate: {},
  });
  useEffect(() => {
    store.componentStores.persons.setSubStore([personStore]);
  }, [store]);
  const { Form, Item } = useForm(store);
  const { Form: Form2, Item: Item2 } = useForm(personStore);
  return (
    <>
      <Form>
        <Item id="persons">
          {({ value }) => {
            return <div>{JSON.stringify(value)}</div>;
          }}
        </Item>
      </Form>
      <Form2>
        <Item2 id="name">
          <Input />
        </Item2>
        <Col span={24} style={{ display: 'flex', justifyContent: 'center' }}>
          <Button
            onClick={() => {
              // eslint-disable-next-line
              store.submit(data => console.log(data));
            }}
          >
            提交
          </Button>
          <Button
            onClick={() => {
              store.reset();
            }}
          >
            重置
          </Button>
        </Col>
      </Form2>
    </>
  );
};
