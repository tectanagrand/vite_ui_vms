import { Autocomplete, TextField } from '@mui/material';
import { useGridApiContext } from '@mui/x-data-grid';

export default function AutoCompleteCustom(params) {
  const apiRef = useGridApiContext();
  const handleChange = (paramsa, newvalue) => {
    const { id, row, field } = paramsa;
    apiRef.current.setEditCellValue({ id, field, value: newvalue });
  };
  return (
    <Autocomplete
      name={params.name}
      options={params.options}
      value={params.value}
      onChange={(ev, e) => handleChange(params, e)}
      onClose={(ev) => {
        ev.preventDefault();
      }}
      isOptionEqualToValue={(option, value) => option.id === value.id}
      fullWidth
      renderInput={(paramb) => <TextField {...paramb} label={params.label} fullWidth />}
    />
  );
}
