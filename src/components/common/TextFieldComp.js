import { TextField } from '@mui/material';
import { Controller } from 'react-hook-form';

export const TextFieldComp = ({ control, label, name, rules, valueovr, readOnly }) => {
  return (
    <>
      <Controller
        name={name}
        control={control}
        rules={rules}
        defaultValue={valueovr}
        render={({ field: { onChange, value, ref }, fieldState: { error } }) => (
          <TextField
            helperText={error ? error.message : null}
            error={!!error}
            onChange={onChange}
            inputRef={ref}
            value={value}
            label={label}
            variant="outlined"
            inputProps={{ readOnly: readOnly }}
            fullWidth
          />
        )}
      />
    </>
  );
};
