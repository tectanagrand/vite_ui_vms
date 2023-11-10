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
  Table,
  TableRow,
  TableHead,
  TableCell,
  TableBody,
} from '@mui/material';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { useEffect, useRef, useState } from 'react';
import { useSession } from 'src/provider/sessionProvider';

const ticketReq = [
  {
    id: 'asjdasdaskdaslkdn',
    ticket_num: 'SVE2312312',
    date: '01/01/2022',
    requestor: 'skdalsdk@gmail.com',
    request: '1',
    ven_code: 'LN0012312',
    ven_name: 'PT KACANG GARUDA',
    remarks: 'aksdlaksd alskdmasdma laksmdasmd',
  },
  {
    id: 'jsdfposiadfiwne',
    ticket_num: 'SVE182312',
    date: '01/01/2020',
    requestor: 'jskdiq@gmail.com',
    request: '0',
    ven_code: 'LN0012312',
    ven_name: 'PT ASDASD ASDAS',
    remarks: 'aksdlaksd alskdmasdma laksmdasmd',
  },
];

export default function ListReqStat() {
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

  const handleCloseMdl = () => {
    setDialog(false);
  };

  useEffect(() => {
    setFilteract(true);
  }, []);

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
