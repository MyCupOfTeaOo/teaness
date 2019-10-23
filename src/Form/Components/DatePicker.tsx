import React, { useCallback, useMemo } from 'react';
import { DatePicker as AntDatePicker } from 'antd';
import { DatePickerProps as AntDatePickerProps } from 'antd/lib/date-picker/interface';
import moment from 'moment';

export interface DatePickerProps
  extends Omit<AntDatePickerProps, 'format' | 'onChange'> {
  format?: string | null;
  onChange?: (date: moment.Moment | string | undefined) => void;
}

const DatePicker: React.FC<DatePickerProps> & {
  sec: string;
  min: string;
  hour: string;
  day: string;
  month: string;
  year: string;
  getFormatMode: (value: string) => string | undefined;
} = props => {
  const { onChange, format, value, ...rest } = props;
  const parseValue = useMemo(() => {
    if (value) {
      if (moment.isMoment(value)) {
        return value;
      } else {
        return moment(value);
      }
    }
    return undefined;
  }, [value]);
  const handle = useCallback(
    (date: moment.Moment | null) => {
      if (onChange) {
        if (date) {
          if (format) onChange(date.format(format));
          else onChange(date);
        } else onChange(undefined);
      }
    },
    [onChange],
  );
  const showTime = useMemo(() => {
    if (format) return getShowTimeObject(format);
  }, [format]);
  return (
    <AntDatePicker
      value={parseValue}
      format={format || undefined}
      onChange={onChange && handle}
      showTime={showTime}
      {...rest}
    />
  );
};

DatePicker.sec = 'YYYY-MM-DD HH:mm:ss';
DatePicker.min = 'YYYY-MM-DD HH:mm';
DatePicker.hour = 'YYYY-MM-DD HH';
DatePicker.day = 'YYYY-MM-DD';
DatePicker.month = 'YYYY-MM';
DatePicker.year = 'YYYY';

const reverseFormat: any = {
  'YYYY-MM-DD HH:mm:ss': 'sec',
  'YYYY-MM-DD HH:mm': 'min',
  'YYYY-MM-DD HH': 'hour',
  'YYYY-MM-DD': 'day',
  'YYYY-MM': 'month',
  YYYY: 'year',
};

DatePicker.getFormatMode = (value: string) => {
  return reverseFormat[value];
};

DatePicker.defaultProps = {
  format: DatePicker.day,
};

export function getShowTimeObject(format: string) {
  const mode = DatePicker.getFormatMode(format);
  switch (mode) {
    case 'hour':
    case 'min':
    case 'sec':
      return {
        format,
      };
    default:
      return undefined;
  }
}

export type DatePickerType = React.FC<DatePickerProps>;

export default DatePicker;
