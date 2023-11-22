import { Controller } from 'react-hook-form';
import { NumericFormat } from 'react-number-format';
import { TextField } from '@mui/material';

export default function NumericFieldComp({ name, label, control, currency, format, rules, readOnly }) {
  return (
    <>
      <Controller
        control={control}
        name={name}
        rules={rules}
        render={({ field, fieldState: { error } }) => (
          <NumericFormat
            value={field.value}
            onChange={field.onChange}
            {...format}
            label={label}
            thousandSeparator
            customInput={TextField}
            prefix={`${currency} `}
            error={error}
            fullWidth
            readOnly={readOnly}
            sx={{ mt: 2, mb: 2 }}
          />
        )}
      />
    </>
  );
}
