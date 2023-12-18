import { Autocomplete, TextField, createFilterOptions } from '@mui/material';
import ModalCreateBank from './ModalCreateBank';
import { useGridApiContext } from '@mui/x-data-grid';

export default function AutoCompleteCustom(params) {
  const apiRef = useGridApiContext();
  const handleChange = (paramsa, newvalue) => {
    const { id, row, field } = paramsa;
    apiRef.current.setEditCellValue({ id, field, value: newvalue });
  };
  const newAddModal = (e) => {
    params.newAddModal(e.inputValue);
  };
  const filter = createFilterOptions();
  return (
    <>
      <Autocomplete
        name={params.name}
        options={params.options}
        value={params.value}
        onChange={(ev, e) => {
          if (typeof e === 'string') {
            setTimeout(() => {
              newAddModal(e);
            });
          } else if (e && e.inputValue) {
            newAddModal(e);
          } else {
            handleChange(params, e);
          }
        }}
        onClose={(ev) => {
          ev.preventDefault();
        }}
        filterOptions={(options, param) => {
          const filtered = filter(options, param);
          if (param.inputValue !== '' && params.addnew) {
            filtered.push({
              inputValue: param.inputValue,
              label: `Add "${param.inputValue}"`,
            });
          }
          return filtered;
        }}
        getOptionLabel={(option) => {
          if (typeof option === 'string') {
            return option;
          }
          if (option.inputValue) {
            return option.inputValue;
          }
          return option.label;
        }}
        renderOption={(props, option) => <li {...props}>{option.label}</li>}
        isOptionEqualToValue={(option, value) => option.id === value.id}
        fullWidth
        renderInput={(paramb) => <TextField {...paramb} label={params.label} fullWidth />}
      />
    </>
  );
}
