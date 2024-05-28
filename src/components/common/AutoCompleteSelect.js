import { Controller } from 'react-hook-form';
import { Autocomplete, TextField } from '@mui/material';

export default function AutoCompleteSelect({
  name,
  label,
  control,
  options,
  onChangeovr,
  freeSolo,
  readOnly,
  disable,
  rules,
}) {
  return (
    <Controller
      name={name}
      control={control}
      rules={rules}
      render={({ field: { onChange, value, ref }, fieldState: { error } }) => (
        <Autocomplete
          onChange={(e, newValue) => {
            console.log(newValue);
            if (onChangeovr != undefined) {
              onChangeovr(newValue);
            }
            if (freeSolo) {
              if (typeof newValue === 'object') {
                console.log('is object');
                onChange(newValue);
              } else {
                onChange(newValue?.toUpperCase());
              }
            } else {
              onChange(newValue);
            }
          }}
          value={value}
          error={error}
          options={options}
          freeSolo={freeSolo}
          autoSelect={freeSolo}
          fullWidth
          readOnly={readOnly}
          disabled={disable}
          renderInput={(params) => <TextField {...params} label={label} error={error} inputRef={ref} />}
        />
      )}
    />
  );
}
