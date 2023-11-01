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
  const [dialogOpen, setDialog] = useState(false);
  const [btnState, setBtnst] = useState({});
  const [data, setData] = useState([]);
  const [request, setRequest] = useState({
    ven_code: '',
    ven_name: '',
    reason: '',
    requestor: '',
  });
  // const handleChange = (e) => {
  //   setFilteract(e.)
  // }

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
      ven_code: row.ven_code,
      ven_name: row.ven_name,
      reason: row.act_remark,
      requestor: session.email,
    });
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
      console.log(items);
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
          <TextField id="reason" label="Reason" value={request.reason} multiline />
          <TextField id="request" label="Request By" value={request.requestor} inputProps={{ readOnly: true }} />
        </Box>
        <DialogActions>
          <Button sx={{ width: 120, m: 1 }} color="secondary" onClick={handleCloseMdl}>
            <Typography>Cancel</Typography>
          </Button>
          <Button sx={{ width: 120, m: 1 }} variant="contained" color={btnState.color}>
            <Typography>{btnState.text}</Typography>
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
