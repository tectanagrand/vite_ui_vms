import { Controller } from 'react-hook-form';
import { NumericFormat } from 'react-number-format';
import { TextField } from '@mui/material';

export default function NumericFieldComp({ name, label, control, currency, format, rules, readOnly, disabled }) {
  return (
    <>
      <Controller
        control={control}
        name={name}
        rules={rules}
        render={({ field: { onChange, value, ref }, fieldState: { error } }) => (
          <NumericFormat
            onChange={onChange}
            value={value}
            label={label}
            thousandSeparator
            inputRef={ref}
            customInput={TextField}
            prefix={`${currency} `}
            error={error}
            fullWidth
            inputProps={{
              readOnly: readOnly,
              disabled: disabled,
            }}
          />
        )}
      />
    </>
  );
}
