import { DataGrid } from '@mui/x-data-grid';
import SearchBar from '@mkyy/mui-search-bar';
import { useEffect, useState } from 'react';
import useAxiosPrivate from 'src/hooks/useAxiosPrivate';
import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogActions,
  Typography,
  Snackbar,
  Alert,
  Tooltip,
  IconButton,
} from '@mui/material';
import { Delete, Edit } from '@mui/icons-material';
import { TextFieldComp } from 'src/components/common/TextFieldComp';
import { useForm } from 'react-hook-form';

export default function ListMasterBank() {
  const { control, handleSubmit, clearErrors, reset } = useForm();
  const axiosPrivate = useAxiosPrivate();
  const column = [
    {
      field: 'bank_key',
      type: 'string',
      headerName: 'Bank Key',
      flex: 0.1,
      sortable: false,
    },
    {
      field: 'bank_code',
      type: 'string',
      headerName: 'Bank Code',
      flex: 0.1,
      sortable: false,
    },
    {
      field: 'bank_name',
      type: 'string',
      headerName: 'Bank Name',
      flex: 0.1,
      sortable: false,
    },
    {
      field: 'actions',
      headerName: 'Actions',
      renderCell: (item) => {
        let Buttons = [];
        Buttons.push(
          <Tooltip title="Edit">
            <IconButton onClick={handleButtonAction('Edit', item.row)}>
              <Edit />
            </IconButton>
          </Tooltip>
        );
        Buttons.push(
          <Tooltip title="Delete">
            <IconButton onClick={handleButtonAction('Delete', item.row)}>
              <Delete />
            </IconButton>
          </Tooltip>
        );
        return Buttons;
      },
    },
  ];

  const overrides = {
    '& .MuiDataGrid-main': {
      width: 0,
      minWidth: '95%',
    },
  };

  const [params, setParams] = useState({
    page: 0,
    maxPage: 10,
    que: '',
  });

  const [rows, setRows] = useState({
    isLoading: false,
    rows: [{ id: '', bank_key: '', bank_code: '', bank_name: '' }],
  });
  const [typepost, setType] = useState('');

  const [formStat, setFormstat] = useState({
    stat: false,
    type: 'info',
    message: '',
  });

  const [modalOpen, setModalopen] = useState(false);

  const handleCloseModal = () => {
    setModalopen(false);
    clearErrors();
  };

  const handleSnackClose = () => {
    setFormstat({ stat: false, type: 'info', message: '' });
  };

  const handleButtonAction = (type, row) => async (e) => {
    if (type === 'Edit') {
      setType('update');
      reset({
        bankcode: row.bank_code,
        bankkey: row.bank_key,
        bankname: row.bank_name,
        address1: row.address_1,
        address2: row.address_2,
        address3: row.address_3,
      });
      setModalopen(true);
    } else if (type === 'Delete') {
      if (confirm('Are you sure want to delete ' + row.bank_name + '?')) {
        try {
          const deleteBank = await axiosPrivate.post(`${process.env.REACT_APP_URL_LOC}/master/deletebank`, {
            bankcode: row.bank_code,
            bankkey: row.bank_key,
          });
          setFormstat({ stat: true, type: 'success', message: `${deleteBank.data.name} is deleted` });
          setParams({ page: 0, maxPage: params.maxPage, que: params.que });
        } catch (error) {
          setFormstat({ stat: true, type: 'error', message: error.message });
        }
      }
    }
  };

  const [totallen, setTotal] = useState(0);
  const requestSearch = (searchedVal) => {
    const getBankdt = async () => {
      const getBankdata = await axiosPrivate.post(`${process.env.REACT_APP_URL_LOC}/master/ssrbank`, {
        page: 0,
        maxPage: params.maxPage,
        que: searchedVal.toLowerCase(),
      });
      setRows({ isLoading: false, rows: getBankdata.data.data });
      setTotal((prev) => (getBankdata.data.allrow !== undefined ? getBankdata.data.allrow : prev));
    };
    getBankdt();
    setParams({ page: 0, maxPage: params.maxPage, que: searchedVal.toLowerCase() });
  };

  const cancelSearch = () => {
    requestSearch('');
  };

  const submitBank = async (values) => {
    try {
      const submitForm = await axiosPrivate.post(`${process.env.REACT_APP_URL_LOC}/master/addbank`, {
        ...values,
        type: typepost,
      });
      setFormstat({
        stat: true,
        type: 'success',
        message: `${submitForm.data.name} is successfully added`,
      });
      setModalopen(false);
    } catch (error) {
      setFormstat({
        stat: true,
        type: 'error',
        message: error.message,
      });
      setModalopen(false);
    }
  };

  useEffect(() => {
    setRows({ ...rows, isLoading: true });
    const getBankdt = async () => {
      const getBankdata = await axiosPrivate.post(`${process.env.REACT_APP_URL_LOC}/master/ssrbank`, params);
      setRows({ isLoading: false, rows: getBankdata.data.data });
      setTotal((prev) => (getBankdata.data.allrow !== undefined ? getBankdata.data.allrow : prev));
    };
    getBankdt();
  }, [params]);

  return (
    <>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
        <Button
          variant="contained"
          sx={{ width: 180, height: 50, my: 2 }}
          onClick={() => {
            setType('insert');
            setModalopen(true);
          }}
        >
          + Add new bank
        </Button>
      </Box>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', margin: 1 }}>
        <SearchBar
          value={params.que}
          onChange={requestSearch}
          onCancelResearch={cancelSearch}
          onSearch={() => requestSearch(params.que)}
        />
      </Box>
      <DataGrid
        sx={overrides}
        rows={rows.rows}
        columns={column}
        rowCount={parseInt(totallen)}
        isLoading={rows.isLoading}
        disableColumnFilter
        disableColumnSelector
        disableDensitySelector
        pageSizeOptions={[10]}
        paginationModel={{ page: params.page, pageSize: params.maxPage }}
        paginationMode="server"
        onPaginationModelChange={(par) => {
          setParams({ ...params, page: par.page, maxPage: par.pageSize });
        }}
      />
      <Dialog maxWidth="xl" open={modalOpen} onClose={handleCloseModal}>
        <DialogTitle>Add new bank</DialogTitle>
        <form onSubmit={handleSubmit(submitBank)}>
          <Box sx={{ width: 800, height: '100%', padding: 3, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Box sx={{ display: 'flex', flexDirection: 'row', gap: 2 }}>
              <TextFieldComp
                name="bankcode"
                label="Bank Code"
                control={control}
                rules={{
                  required: 'Please insert this field',
                  maxLength: { value: 10, message: 'Length exceeded 10 characters' },
                }}
              />
              <TextFieldComp
                name="bankkey"
                label="Bank Key"
                control={control}
                rules={{
                  required: 'Please insert this field',
                  maxLength: { value: 10, message: 'Length exceeded 10 characters' },
                }}
              />
            </Box>
            <TextFieldComp
              name="bankname"
              label="Bank Name"
              control={control}
              rules={{ required: 'Please insert this field' }}
            />
            <TextFieldComp
              name="address1"
              label="Address 1"
              control={control}
              rules={{
                required: 'Please insert this field',
                maxLength: { value: 200, message: 'Exceeded 200 characters' },
              }}
            />
            <Box sx={{ display: 'flex', flexDirection: 'row', gap: 2 }}>
              <TextFieldComp
                name="address2"
                label="Address 2"
                control={control}
                rules={{
                  required: 'Please insert this field',
                  maxLength: { value: 50, message: 'Exceeded 50 characters' },
                }}
              />
              <TextFieldComp
                name="address3"
                label="Address 3"
                control={control}
                rules={{
                  required: 'Please insert this field',
                  maxLength: { value: 50, message: 'Exceeded 50 characters' },
                }}
              />
            </Box>
          </Box>

          <DialogActions>
            <Button sx={{ width: 120, m: 1 }} color="secondary" onClick={handleCloseModal}>
              <Typography>Cancel</Typography>
            </Button>
            <Button sx={{ width: 120, m: 1 }} variant="contained" type="submit">
              <Typography>Submit</Typography>
            </Button>
          </DialogActions>
        </form>
      </Dialog>
      <Snackbar
        open={formStat.stat}
        onClose={handleSnackClose}
        autoHideDuration={3000}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert severity={formStat.type} onClose={handleSnackClose} variant="filled">
          {formStat.message}
        </Alert>
      </Snackbar>
    </>
  );
}
