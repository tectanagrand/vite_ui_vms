import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import {
  Button,
  IconButton,
  Box,
  Paper,
  Typography,
  Popper,
  Grow,
  Backdrop,
  CircularProgress,
  Skeleton,
} from '@mui/material';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { Edit, Link, Visibility } from '@mui/icons-material';
import Cookies from 'js-cookie';
import ModalCreateTicket from 'src/components/common/ModalCreateTicket';
import { useSession } from 'src/provider/sessionProvider';
import { useNavigate } from 'react-router-dom';
import ProgressStat from 'src/components/common/ProgressStat';

export async function loaderTicket() {
  axios.defaults.headers.common.Authorization =
    'Bearer ' + (Cookies.get('refreshtoken') === undefined ? '' : Cookies.get('refreshtoken'));
  const response = await axios.get(`${process.env.REACT_APP_URL_LOC}/ticket/`);
  return response.data.data;
}

const overrides = {
  '& .MuiDataGrid-main': {
    width: 0,
    minWidth: '95%',
  },
};

const loadTicket = async () => {
  const load = await loaderTicket();
  let ticket_load = [];
  load.data.map((item) => {
    ticket_load.push({
      id: item.token,
      ticket_num: item.ticket_id,
      date_ticket: new Date(item.created_at),
      assignee: item.email,
      cur_pos: item.cur_pos,
      status_ticket: item.status_ticket,
      vendor_name: item.name_1,
      vendor_code: item.ven_code,
      ticket_state: item.ticket_state,
    });
  });
  return ticket_load;
};

export function ListTicket() {
  // const load = useLoaderData();
  const { session, getPermission } = useSession();
  const [perm, setPerm] = useState();
  const [ticket, setTicket] = useState();
  const [openModal, setOpenmodal] = useState(false);
  const [url, setUrl] = useState('');
  const [btnTicket, setBtn] = useState(false);
  const [grow, setGrow] = useState(false);
  const [anchorEl, setAnchorel] = useState(null);
  const [loader, setLoader] = useState(false);
  const navigate = useNavigate();
  const urlSetFunc = (urlitem) => {
    setUrl(urlitem);
  };
  useEffect(() => {
    const tickets = async () => {
      const item = await loadTicket();
      setTicket(item);
    };
    tickets();
  }, [url]);

  useEffect(() => {
    const interval = setInterval(async () => {
      const tickets = await loadTicket();
      setTicket(tickets);
    }, 1000 * 10);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    let permission = {};
    permission['Table'] = getPermission('Ticket Request');
    permission['INIT'] = getPermission('Initial Form');
    permission['CREA'] = getPermission('Creation Form');
    permission['FINA'] = getPermission('Final Form');
    console.log(permission);
    setPerm(permission);
  }, []);

  const handleOnClose = () => {
    setOpenmodal(false);
    setUrl('');
  };

  const handleOnBtnClose = () => () => {
    setBtn(false);
  };

  const handleButtonAction = (type, row) => (e) => {
    if (type === 'Link') {
      navigator.clipboard.writeText(`http://localhost:3000/frm/newform/${row.id}`);
      setAnchorel(e.currentTarget);
      setBtn(true);
      setGrow(true);
      setTimeout(() => {
        setBtn(false);
      }, 1000);
    } else {
      // <Navigate to={`/form/${row.id}`} />;
      navigate(`../form/${row.id}`, { relative: 'path' });
      setLoader(true);
    }
  };

  const columnTable = [
    {
      field: 'ticket_num',
      type: 'string',
      headerName: 'Ticket Number',
      flex: 0.124,
    },
    {
      field: 'date_ticket',
      type: 'date',
      flex: 0.1,
      headerName: 'Date',
    },
    {
      field: 'assignee',
      type: 'string',
      flex: 0.18,
      headerName: 'Assignee',
    },
    {
      field: 'vendor_name',
      type: 'string',
      flex: 0.2,
      headerName: 'Vendor Name',
    },
    {
      field: 'vendor_code',
      type: 'string',
      flex: 0.15,
      headerName: 'Vendor Code',
    },
    {
      field: 'cur_pos',
      type: 'string',
      flex: 0.1,
      headerName: 'Position',
    },
    {
      field: 'status_ticket',
      type: 'string',
      flex: 0.123,
      headerName: 'Status',
      renderCell: (item) => {
        let status = item.row.status_ticket;
        let severity;
        let text;
        if (status === 'ON PROCESS') {
          severity = 'warning.main';
          text = 'black';
        } else if (status === 'REJECT') {
          severity = 'error.main';
          text = 'white';
        } else if (status === 'ACCEPTED') {
          severity = 'success.main';
          text = 'white';
        }
        return (
          <>
            <ProgressStat color={severity}>
              <Typography color={text} variant="body">
                {status}
              </Typography>
            </ProgressStat>
          </>
        );
      },
    },
    {
      field: 'action',
      flex: 0.1,
      type: 'actions',
      renderCell: (item) => {
        let Buttons = [];
        if (item.row.ticket_state == 'INIT') {
          if (perm.INIT.create) {
            Buttons.push(
              <IconButton onClick={handleButtonAction('Link', item.row)} onClose={handleOnBtnClose}>
                <Link />
              </IconButton>
            );
          }
          if (perm.INIT.read) {
            Buttons.push(
              <IconButton onClick={handleButtonAction('View', item.row)} onClose={handleOnBtnClose}>
                <Visibility />
              </IconButton>
            );
          }
        }
        if (item.row.ticket_state == 'CREA') {
          if (perm.CREA.update) {
            Buttons.push(
              <IconButton onClick={handleButtonAction('Edit', item.row)}>
                <Edit />
              </IconButton>
            );
          }
          if (perm.CREA.read) {
            Buttons.push(
              <IconButton onClick={handleButtonAction('Link', item.row)} onClose={handleOnBtnClose}>
                <Link />
              </IconButton>
            );
          }
        }
        return Buttons;
        // if (perm.create) {
        //   return (
        //     <>

        //     </>
        //   );
        // } else if (item.row.cur_pos !== session.role) {
        //   return (
        //     <>
        //       <IconButton onClick={handleButtonAction('View', item.row)}>
        //         <Visibility />
        //       </IconButton>
        //     </>
        //   );
        // } else {
        //   return (
        //     <>
        //       <IconButton onClick={handleButtonAction('Link', item.row)}>
        //         <Link />
        //       </IconButton>
        //       <IconButton onClick={handleButtonAction('Edit', item.row)}>
        //         <Edit />
        //       </IconButton>
        //     </>
        //   );
        // }
      },
    },
  ];

  return (
    <>
      {ticket !== undefined ? (
        <>
          {perm.Table.create && (
            <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Button
                variant="contained"
                sx={{ width: 180, height: 50, my: 2 }}
                onClick={() => {
                  setOpenmodal(true);
                }}
              >
                Create New Vendor
              </Button>
            </Box>
          )}
          <DataGrid
            sx={overrides}
            rows={ticket}
            columns={columnTable}
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
        </>
      ) : (
        <Box>
          <Skeleton animation="wave" height={100} />
          <Skeleton animation="wave" height={100} />
          <Skeleton animation="wave" height={100} />
          <Skeleton animation="wave" height={100} />
          <Skeleton animation="wave" height={100} />
        </Box>
      )}

      <ModalCreateTicket open={openModal} onClose={handleOnClose} linkUrl={url} urlSet={urlSetFunc} />
      <Popper open={btnTicket} anchorEl={anchorEl} transition>
        {({ TransitionProps }) => {
          return (
            <Grow {...TransitionProps} in={btnTicket} timeout={350}>
              <Paper sx={{ border: 1, p: 1, bgcolor: 'background.paper' }}>Link Form Copied !</Paper>
            </Grow>
          );
        }}
      </Popper>
      <Backdrop sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer - 2 }} open={loader}>
        <CircularProgress color="inherit" />
      </Backdrop>
    </>
  );
}
