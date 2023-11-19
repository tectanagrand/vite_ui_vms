import { DatePicker } from '@mui/x-date-pickers';
import { Controller } from 'react-hook-form';

export default function DatePickerComp({ name, label, control, rules }) {
  return (
    <Controller
      control={control}
      name={name}
      rules={rules}
      defaultValue={''}
      render={({ field, fieldState: { error } }) => (
        <DatePicker
          sx={{ width: '100%' }}
          {...field}
          label={label}
          slotProps={{ textField: { error: !!error, helperText: error?.message } }}
        />
      )}
    ></Controller>
  );
}
