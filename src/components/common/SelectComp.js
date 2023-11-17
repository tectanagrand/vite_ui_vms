import { FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import { Controller } from 'react-hook-form';

export default function SelectComp({ name, control, label, options, rules }) {
  const generateSingleOptions = () => {
    return options.map((item) => {
      return (
        <MenuItem key={item.value} value={item.value}>
          {item.label}
        </MenuItem>
      );
    });
  };
  return (
    <FormControl fullWidth sx={{ mt: 2, mb: 2 }}>
      <InputLabel>{label}</InputLabel>
      <Controller
        render={({ field: { onChange, value } }) => (
          <Select onChange={onChange} value={value} fullWidth label={label}>
            {generateSingleOptions()}
          </Select>
        )}
        control={control}
        name={name}
      />
    </FormControl>
  );
}
