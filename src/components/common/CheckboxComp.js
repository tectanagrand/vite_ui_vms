import { FormControlLabel, Checkbox } from '@mui/material';
import { Controller } from 'react-hook-form';

export default function CheckboxComp({ name, control, label, readOnly }) {
  return (
    <>
      <FormControlLabel
        control={
          <Controller
            name={name}
            control={control}
            render={({ field: props }) => (
              <Checkbox
                {...props}
                checked={props.value}
                inputProps={{
                  readOnly: readOnly,
                }}
                onChange={(e) => props.onChange(e.target.checked)}
              />
            )}
          />
        }
        label={label}
      />
    </>
  );
}
