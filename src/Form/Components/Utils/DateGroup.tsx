import React, { useState, useCallback } from 'react';
import moment, { Moment } from 'moment';
import classnames from 'classnames';
import './styles.scss';
import { DatePicker } from '..';

export interface DateGroupProps {
  /**
   * children必须是两个 DatePicker
   */
  children: [JSX.Element, JSX.Element];
  className?: string;
  style?: React.CSSProperties;
  /**
   * 严格模式,严格模式下,不允许选择时间相同
   */
  strict?: boolean;
}

export function range(start: number, end: number) {
  const result = [];
  for (let i = start; i < end; i += 1) {
    result.push(i);
  }
  return result;
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
        moment(
          moment()
            .hour(23)
            .minute(59)
            .second(59)
            .format(props.children[1].props.format ?? DatePicker.day),
        ),
      );
    }
  }, []);
  const [startDate, setStartDate] = useState(props.children[0].props.value);
  const [endDate, setEndDate] = useState(props.children[1].props.value);
  const disableStartDateFunc = useCallback(
    (date: moment.Moment) => {
      if (!endDate) return false;
      if (moment.isMoment(endDate)) {
        if (props.strict) {
          return !date.isBefore(endDate);
        }
        return date.isAfter(endDate);
      } else {
        if (props.strict) {
          return !date.isBefore(moment(endDate));
        }
        return date.isAfter(moment(endDate));
      }
    },
    [endDate],
  );
  const disableEndDateFunc = useCallback(
    (date: moment.Moment) => {
      if (!startDate) return false;
      if (moment.isMoment(startDate)) {
        if (props.strict) {
          return !date.isAfter(startDate);
        }
        return date.isBefore(startDate);
      } else {
        if (props.strict) {
          return !date.isAfter(moment(startDate));
        }
        return date.isBefore(moment(startDate));
      }
    },
    [startDate],
  );
  // const disabledStartTime = useCallback(() => {
  //   let time = startDate;
  //   if (time) {
  //     if (moment.isMoment(startDate)) {
  //       time = startDate;
  //     } else {
  //       time = startDate;
  //     }
  //   }
  //   return {
  //     // disabledHours: () => range(0, 24).splice(4, 20),
  //     // disabledMinutes: () => range(30, 60),
  //     // disabledSeconds: () => [55, 56],
  //   };
  // }, [endDate]);
  // const disabledEndTime = useCallback(
  //   (date: moment.Moment) => {
  //     let time: moment.Moment | undefined = startDate;
  //     if (time) {
  //       if (moment.isMoment(startDate)) {
  //         time = startDate;
  //       } else {
  //         time = startDate;
  //       }
  //     }
  //     const hours = time?.hours();
  //     let minutes: number | undefined;
  //     let seconds: number | undefined;

  //     if (date && date.hours() === time?.hours()) {
  //       minutes = time?.minutes();
  //       if (date.minutes() === time?.minutes()) {
  //         seconds = time?.seconds();
  //       }
  //     } else if (time?.hours() === 23) {
  //       minutes = time?.minutes();
  //       if (time?.minutes() === 59) {
  //         seconds = time?.seconds();
  //         if (props.strict && seconds) {
  //           seconds -= 1;
  //         }
  //       }
  //     }

  //     return {
  //       disabledHours: () => (hours ? range(0, hours) : []),
  //       disabledMinutes: () => (minutes ? range(0, minutes) : []),
  //       disabledSeconds: () => (seconds ? range(0, seconds) : []),
  //     };
  //   },
  //   [startDate],
  // );
  const children = React.Children.map(props.children, (child, index) => {
    return React.cloneElement(child as any, {
      // disabledTime: index === 0 ? disabledStartTime : disabledEndTime,
      // showTime:
      //   index === 1
      //     ? {
      //         defaultValue: defaultPickerValue,
      //       }
      //     : {},
      disabledDate: index === 0 ? disableStartDateFunc : disableEndDateFunc,
      defaultPickerValue: index === 1 ? defaultPickerValue : undefined,
      onOpenChange: index === 1 ? onOpenChange : undefined,
      valueChange: (value: string | Moment | undefined) => {
        if (index === 0) setStartDate(value);
        if (index === 1) setEndDate(value);
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
