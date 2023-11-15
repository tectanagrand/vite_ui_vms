import { FormControl, Select, MenuItem, Snackbar, Alert, Dialog, Box, Button, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { useSession } from 'src/provider/sessionProvider';
import TableLayout from 'src/components/common/TableLayout';

const ticketReq = [
  {
    id: 'asjdasdaskdaslkdn',
    'Ticket Number': 'SVE2312312',
    Date: '01/01/2022',
    Requestor: 'skdalsdk@gmail.com',
    Request: '1',
    'Vendor Code': 'LN0012312',
    'Vendor Name': 'PT KACANG GARUDA',
    details: 'aksdlaksd alskdmasdma laksmdasmd',
  },
  {
    id: 'jsdfposiadfiwne',
    ticket_num: 'SVE182312',
    date: '01/01/2020',
    requestor: 'jskdiq@gmail.com',
    request: '0',
    ven_code: 'LN0012312',
    ven_name: 'PT ASDASD ASDAS',
    details: 'aksdlaksd alskdmasdma laksmdasmd',
  },
];

export default function ListReqStat() {
  const { session } = useSession();
  const [openValid, setOpenval] = useState(false);
  const [apprType, setAppr] = useState('');
  // const overrides = {
  //   '& .MuiDataGrid-main': {
  //     width: 0,
  //     minWidth: '95%',
  //   },
  // };
  const [colLength, setColLength] = useState(0);
  const [filterAct, setFilteract] = useState('');
  const [formStat, setFormstat] = useState({
    stat: false,
    type: '',
    message: '',
  });

  const handleSnackClose = (e, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setFormstat({ ...formStat, stat: false });
  };

  const handleAppr = (type) => {
    setOpenval(true);
    setAppr(type);
  };

  useEffect(() => {
    setFilteract(true);
  }, []);

  useEffect(() => {
    setColLength(Object.entries(ticketReq[0]).length + 1);
  });

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

      <TableLayout data={ticketReq} buttons={['accept', 'reject']} lengthRow={colLength} onAppr={handleAppr} />

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
      <Dialog
        open={openValid}
        onClose={() => {
          setOpenval(false);
        }}
      >
        <Box
          sx={{
            width: 400,
            height: 200,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Typography variant="h4">Are you sure want to {apprType} ?</Typography>
          <Box sx={{ display: 'flex', gap: 2, mt: 4 }}>
            <Button sx={{ width: 50 }} variant="contained">
              <Typography>Yes</Typography>
            </Button>
            <Button
              sx={{ width: 50 }}
              variant="contained"
              onClick={() => {
                setOpenval(false);
              }}
            >
              <Typography>No</Typography>
            </Button>
          </Box>
        </Box>
      </Dialog>
    </>
  );
}
