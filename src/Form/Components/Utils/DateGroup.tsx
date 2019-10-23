import React, { useState, useCallback } from 'react';
import moment, { Moment } from 'moment';
import classnames from 'classnames';
import './styles.scss';

export interface DateGroupProps {
  /**
   * children必须是两个 DatePicker
   */
  children: [JSX.Element, JSX.Element];
  className?: string;
  style?: React.CSSProperties;
  /**
   * datePicker 的默认值
   */
  values?: [string | Moment | undefined, string | Moment | undefined];
}

const DateGroup: React.FC<DateGroupProps> = props => {
  const [defaultPickerValue, setDefaultPickerValue] = useState(() =>
    moment()
      .hour(23)
      .minute(59)
      .second(59),
  );
  // 防止跨天
  const onOpenChange = useCallback((status: boolean) => {
    if (status) {
      setDefaultPickerValue(
        moment()
          .hour(23)
          .minute(59)
          .second(59),
      );
    }
  }, []);
  const [startDate, setStartDate] = useState(
    props.children[0].props.value || (props.values && props.values[0]),
  );
  const [endDate, setEndDate] = useState(
    props.children[1].props.value || (props.values && props.values[1]),
  );
  const disableStartDateFunc = useCallback(
    (date: moment.Moment) => {
      if (!endDate) return false;
      if (moment.isMoment(endDate)) {
        return date.isAfter(endDate);
      } else {
        return date.isAfter(moment(endDate));
      }
    },
    [endDate],
  );
  const disableEndDateFunc = useCallback(
    (date: moment.Moment) => {
      if (!startDate) return false;
      if (moment.isMoment(startDate)) {
        return date.isBefore(startDate);
      } else {
        return date.isBefore(moment(startDate));
      }
    },
    [startDate],
  );
  const children = React.Children.map(props.children, (child, index) => {
    return React.cloneElement(child as any, {
      disabledDate: index === 0 ? disableStartDateFunc : disableEndDateFunc,
      defaultPickerValue: index === 1 ? defaultPickerValue : undefined,
      onOpenChange: index === 1 ? onOpenChange : undefined,
      onChange: (value: string | Moment | undefined) => {
        if (index === 0) setStartDate(value);
        if (index === 1) setEndDate(value);
        const { onChange } = (child as any).props;
        if (onChange) {
          onChange(value);
        }
      },
    });
  });
  return (
    <div
      className={classnames(props.className, 'tea-date-group')}
      {...props.style}
    >
      {children}
    </div>
  );
};

export default DateGroup;
