import { DatePicker } from '@mui/x-date-pickers';
import dayjs from 'dayjs';
import { Controller } from 'react-hook-form';

export default function DatePickerComp({ name, label, control, rules }) {
  return (
    <Controller
      control={control}
      name={name}
      rules={rules}
      render={({ field: { onChange, value }, fieldState: { error } }) => (
        <DatePicker
          sx={{ width: '100%' }}
          onChange={onChange}
          value={dayjs(value)}
          label={label}
          slotProps={{ textField: { error: !!error, helperText: error?.message } }}
        />
      )}
    ></Controller>
  );
}
