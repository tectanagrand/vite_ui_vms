import { FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import { Controller } from 'react-hook-form';
import { useState, useEffect } from 'react';

export default function SelectComp({ name, control, label, options, onChangeovr, rules, disabled, valueovr }) {
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
    <FormControl fullWidth sx={{ mt: 2, mb: 2 }} disabled={disabled}>
      <Controller
        render={({ field: { onChange, value }, fieldState: { error } }) => {
          if (disabled) {
            value = '';
          }
          return (
            <>
              <InputLabel error={!!error}>{label}</InputLabel>
              <Select
                fullWidth
                error={!!error}
                label={label}
                value={value}
                onChange={(e) => {
                  onChange(e);
                  if (onChangeovr != undefined) {
                    onChangeovr(e.target.value);
                  }
                }}
              >
                {generateSingleOptions()}
              </Select>
            </>
          );
        }}
        control={control}
        name={name}
        rules={rules}
        defaultValue={valueovr}
      />
    </FormControl>
  );
}
