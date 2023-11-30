import { Controller } from 'react-hook-form';
import { Autocomplete, TextField } from '@mui/material';

export default function AutoCompleteSelect({ name, label, control, options, onChangeovr }) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field: { onChange, value }, fieldState: { error } }) => {
        <Autocomplete
          onChange={(e, newValue) => {
            if (onChangeovr != undefined) {
              onChangeovr(newValue);
            }
            onChange();
          }}
          value={value}
          error={error}
          options={options}
          renderInput={(params) => <TextField {...params} label={label} />}
        />;
      }}
    />
  );
}
