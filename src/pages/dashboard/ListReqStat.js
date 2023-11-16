import {
  FormControl,
  Select,
  MenuItem,
  Snackbar,
  Alert,
  Dialog,
  Box,
  Button,
  Typography,
  Skeleton,
} from '@mui/material';
import { useEffect, useState } from 'react';
import { useSession } from 'src/provider/sessionProvider';
import TableLayout from 'src/components/common/TableLayout';
import axios from 'axios';

export default function ListReqStat() {
  const columns = ['Ticket Number', 'Date', 'Requestor', 'Request', 'Vendor Code', 'Vendor Name'];
  const { session } = useSession();
  const [reload, setReload] = useState(true);
  const [openValid, setOpenval] = useState(false);
  const [apprType, setAppr] = useState('');
  const [venData, setVendata] = useState({});
  const [ticket, setTicket] = useState();
  const [colLength, setColLength] = useState(0);
  const [filterAct, setFilteract] = useState('');
  const [formStat, setFormstat] = useState({
    stat: false,
    type: 'success',
    message: '',
  });

  const handleSnackClose = (e, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setFormstat({ ...formStat, stat: false });
  };

  const handleAppr = (type, id) => {
    setOpenval(true);
    setAppr(type);
    setVendata(ticket.find((item) => item.id === id));
  };

  const handleProcessReq = async (action, id) => {
    try {
      const jsonSend = {
        ticketid: id,
        session: session.user_id,
        action: action,
      };
      const processReq = await axios.post(`${process.env.REACT_APP_URL_LOC}/reqstat/process`, jsonSend);
      setFormstat({
        stat: true,
        type: 'success',
        message: processReq.data.message,
      });
      setOpenval(false);
      setReload(!reload);
    } catch (error) {
      setFormstat({
        stat: true,
        type: 'error',
        message: error,
      });
    }
  };

  useEffect(() => {
    setFilteract(true);
  }, []);

  useEffect(() => {
    const getTicket = async () => {
      const fetchTicket = await axios.get(`${process.env.REACT_APP_URL_LOC}/reqstat/show`);
      setTicket(fetchTicket.data.data);
    };
    getTicket();
  }, [reload]);

  useEffect(() => {
    setColLength(columns.length + 1);
  }, [ticket]);

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

      {ticket != undefined ? (
        <TableLayout
          data={ticket}
          buttons={['accept', 'reject']}
          lengthRow={colLength}
          onAction={handleAppr}
          header={columns}
        />
      ) : (
        <Box>
          <Skeleton animation="wave" height={100} />
          <Skeleton animation="wave" height={100} />
          <Skeleton animation="wave" height={100} />
          <Skeleton animation="wave" height={100} />
          <Skeleton animation="wave" height={100} />
        </Box>
      )}

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
          {venData['Request'] == 1 && <Typography variant="h5">Reactivation Request</Typography>}
          {venData['Request'] == 0 && <Typography variant="h5">Deactivation Request</Typography>}
          <Typography variant="h6">
            {venData['Vendor Name']} - {venData['Vendor Code']}{' '}
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, mt: 4 }}>
            <Button sx={{ width: 50 }} variant="contained" onClick={(e) => handleProcessReq(apprType, venData['id'])}>
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
