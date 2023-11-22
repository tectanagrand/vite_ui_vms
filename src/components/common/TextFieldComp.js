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
        render={({ field: { onChange, value }, fieldState: { error } }) => (
          <TextField
            helperText={error ? error.message : null}
            error={!!error}
            onChange={onChange}
            value={value}
            label={label}
            variant="outlined"
            inputProps={{ readOnly: readOnly }}
            fullWidth
            sx={{ mt: 2, mb: 2 }}
          />
        )}
      />
    </>
  );
};
