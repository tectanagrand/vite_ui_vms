import { TextField } from '@mui/material';
import { Controller } from 'react-hook-form';

export const TextFieldComp = ({ control, label, name, rules }) => {
  return (
    <>
      <Controller
        name={name}
        control={control}
        rules={rules}
        render={({ field: { onChange, value }, fieldState: { error } }) => (
          <TextField
            helperText={error ? error.message : null}
            error={!!error}
            onChange={onChange}
            value={value}
            label={label}
            variant="outlined"
            fullWidth
            sx={{ mt: 2, mb: 2 }}
          />
        )}
      />
    </>
  );
};
