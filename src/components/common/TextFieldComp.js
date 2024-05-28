import { TextField } from '@mui/material';
import { Controller } from 'react-hook-form';

export const TextFieldComp = ({
  control,
  label,
  name,
  rules,
  valueovr,
  readOnly,
  onChangeovr,
  toUpperCase,
  toLowerCase,
  Number,
  helperText,
}) => {
  return (
    <>
      <Controller
        name={name}
        control={control}
        rules={rules}
        defaultValue={valueovr}
        render={({ field: { onChange, value, ref }, fieldState: { error } }) => (
          <TextField
            helperText={error ? error.message : helperText}
            error={!!error}
            onChange={(e) => {
              if (toUpperCase) {
                onChange(e.target.value.toUpperCase());
              } else if (toLowerCase) {
                onChange(e.target.value.toLowerCase());
              }
              if (Number) {
                if (!e.target.value.match(/[a-zA-Z!@#$%^&*(),.?":{}|<>-]/g) !== null) {
                  onChange(e.target.value);
                }
              } else {
                onChange(e);
              }
            }}
            onBlur={(e) => {
              if (onChangeovr !== undefined) {
                onChangeovr(e.target.value);
              }
            }}
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
