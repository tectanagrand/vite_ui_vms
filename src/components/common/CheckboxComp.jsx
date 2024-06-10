import { FormControlLabel, Checkbox } from '@mui/material';
import { Controller } from 'react-hook-form';

export default function CheckboxComp({ name, control, label, readOnly, onChangeovr }) {
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
                disabled={readOnly}
                onChange={(e) => {
                  if (onChangeovr !== undefined) {
                    onChangeovr(e.target.checked);
                  }
                  props.onChange(e.target.checked);
                }}
              />
            )}
          />
        }
        label={label}
      />
    </>
  );
}
