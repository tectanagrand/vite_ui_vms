import {
  Button,
  FormControl,
  Select,
  MenuItem,
  Typography,
  Dialog,
  Box,
  DialogTitle,
  DialogActions,
  TextField,
  Snackbar,
  Alert,
} from '@mui/material';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { useSession } from 'src/provider/sessionProvider';

export default function ListVendor() {
  const { session } = useSession();

  const overrides = {
    '& .MuiDataGrid-main': {
      width: 0,
      minWidth: '95%',
    },
  };

  const [filterAct, setFilteract] = useState('');
  const [formStat, setFormstat] = useState({
    stat: false,
    type: '',
    message: '',
  });
  const [dialogOpen, setDialog] = useState(false);
  const [btnState, setBtnst] = useState({});
  const [data, setData] = useState([]);
  const [request, setRequest] = useState({
    ven_id: '',
    ven_code: '',
    ven_name: '',
    reason: '',
    requestor: '',
    requestor_id: '',
  });
  const handleSnackClose = (e, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setFormstat({ ...formStat, stat: false });
  };

  const getData = async () => {
    const data = await axios.get(`${process.env.REACT_APP_URL_LOC}/vendor/?isactive=${filterAct}`);
    return data.data;
  };

  const handleBtnAct = (row) => () => {
    setDialog(true);
    if (row.is_active === true) {
      setBtnst({ color: 'error', text: 'Deactivate' });
    } else {
      setBtnst({ color: 'success', text: 'Reactivate' });
    }
    setRequest({
      ven_id: row.id,
      ven_code: row.ven_code,
      ven_name: row.ven_name,
      reason: row.act_remark,
      requestor: session.email,
      requestor_id: session.user_id,
      is_active: row.is_active,
    });
  };

  const submitReq = async () => {
    try {
      const requestType = request.is_active === true ? 0 : 1;
      const response = await axios.post(`${process.env.REACT_APP_URL_LOC}/reqstat/new`, {
        ven_id: request.ven_id,
        remarks: request.reason,
        request: requestType,
        requestor: request.requestor_id,
      });
      const message = response.data.message;
      setFormstat({
        stat: true,
        type: 'success',
        message: message,
      });
    } catch (error) {
      setFormstat({
        stat: true,
        type: 'error',
        message: 'error',
      });
      console.error(error);
    }
  };

  const handleReason = (e) => {
    setRequest((prevRequest) => ({
      ...prevRequest,
      reason: e.target.value,
    }));
  };

  const handleCloseMdl = () => {
    setDialog(false);
  };

  useEffect(() => {
    setFilteract(true);
  }, []);

  useEffect(() => {
    const response = async () => {
      const items = await getData();
      setData(items.data);
    };
    response();
  }, [filterAct]);

  const columns = [
    {
      field: 'ven_name',
      type: 'string',
      headerName: 'Vendor Name',
      flex: 0.124,
    },
    {
      field: 'ven_code',
      type: 'string',
      headerName: 'Vendor Code',
      flex: 0.124,
    },
    {
      field: 'act_remark',
      type: 'string',
      headerName: 'Reason',
      flex: 0.124,
    },
    {
      field: 'action',
      type: 'actions',
      flex: 0.1,
      renderCell: (item) => {
        if (item.row.is_active == true) {
          return (
            <Button variant="contained" color="error" onClick={handleBtnAct(item.row)}>
              <Typography>Deactivate</Typography>
            </Button>
          );
        } else {
          return (
            <Button variant="contained" color="success" onClick={handleBtnAct(item.row)}>
              <Typography>Activate</Typography>
            </Button>
          );
        }
      },
    },
  ];

  return (
    <>
      <FormControl>
        <Select
          sx={{ width: '10em' }}
          id={'filterAct'}
          value={filterAct}
          onChange={(e) => {
            setFilteract(e.target.value);
          }}
        >
          <MenuItem value={true}>Active</MenuItem>
          <MenuItem value={false}>Not Active</MenuItem>
        </Select>
      </FormControl>
      <DataGrid
        sx={overrides}
        columns={columns}
        rows={data}
        disableColumnFilter
        disableColumnSelector
        disableDensitySelector
        slots={{ toolbar: GridToolbar }}
        slotProps={{
          toolbar: {
            csvOptions: { disableToolbarButton: true },
            printOptions: { disableToolbarButton: true },
            showQuickFilter: true,
          },
        }}
      />
      <Dialog maxWidth="xl" open={dialogOpen} onClose={handleCloseMdl}>
        <DialogTitle>Create {btnState.text} Request</DialogTitle>
        <Box sx={{ width: 800, height: '100%', padding: 3, display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField id="ven_code" label="Vendor Code" value={request.ven_code} inputProps={{ readOnly: true }} />
          <TextField id="name_1" label="Name" value={request.ven_name} inputProps={{ readOnly: true }} />
          <TextField id="reason" label="Reason" value={request.reason} onChange={handleReason} multiline />
          <TextField id="request" label="Request By" value={request.requestor} inputProps={{ readOnly: true }} />
        </Box>
        <DialogActions>
          <Button sx={{ width: 120, m: 1 }} color="secondary" onClick={handleCloseMdl}>
            <Typography>Cancel</Typography>
          </Button>
          <Button sx={{ width: 120, m: 1 }} variant="contained" color={btnState.color} onClick={submitReq}>
            <Typography>{btnState.text}</Typography>
          </Button>
        </DialogActions>
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
