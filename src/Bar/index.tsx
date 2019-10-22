import React from 'react';

export interface BarProps {
  children: any;
}

export default function(props: BarProps) {
  return <div>{props.children}</div>;
}
