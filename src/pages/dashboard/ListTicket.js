import { DataGrid, GridToolbar, GridToolbarContainer } from '@mui/x-data-grid';
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
  FormControl,
  Select,
  MenuItem,
  Tooltip,
} from '@mui/material';
import axios from 'axios';
import useAxiosPrivate from 'src/hooks/useAxiosPrivate';
import { useEffect, useState } from 'react';
import { Edit, Link, Visibility, Delete, Refresh } from '@mui/icons-material';
import Cookies from 'js-cookie';
import ModalCreateTicket from 'src/components/common/ModalCreateTicket';
import { useSession } from 'src/provider/sessionProvider';
import { useNavigate } from 'react-router-dom';
import ProgressStat from 'src/components/common/ProgressStat';
import { LoadingButton } from '@mui/lab';

// function loaderTicket(filterAct) {
//   axios.defaults.headers.common.Authorization =
//     'Bearer ' + (Cookies.get('refreshtoken') === undefined ? '' : Cookies.get('refreshtoken'));
//   const response = await axios.get(`${process.env.REACT_APP_URL_LOC}/ticket/?is_active=${filterAct}`);
//   return response.data.data;
// }

const overrides = {
  '& .MuiDataGrid-main': {
    width: 0,
    minWidth: '95%',
  },
};

function RefreshTable(props) {
  const refreshBtn = () => {
    props.setRefreshbtn(true);
  };
  return (
    <Tooltip title={<Typography>Refresh</Typography>}>
      <LoadingButton loading={props.isLoading} onClick={refreshBtn} sx={props.sx} variant={'contained'}>
        <Refresh></Refresh>
      </LoadingButton>
    </Tooltip>
  );
}

export function ListTicket() {
  // const load = useLoaderData();
  const { session, getPermission, logOut } = useSession();
  const [perm, setPerm] = useState();
  const [ticket, setTicket] = useState();
  const [openModal, setOpenmodal] = useState(false);
  const [url, setUrl] = useState('');
  const [btnTicket, setBtn] = useState(false);
  const [grow, setGrow] = useState(false);
  const [anchorEl, setAnchorel] = useState(null);
  const [loader, setLoader] = useState(false);
  const [filterAct, setFilteract] = useState(true);
  const [deleted, setDelete] = useState(false);
  const [ticket_state, setTicketstate] = useState([]);
  const [refreshBtn, setRefreshbtn] = useState(false);
  const axiosPrivate = useAxiosPrivate();
  const navigate = useNavigate();
  const urlSetFunc = (urlitem) => {
    setUrl(urlitem);
  };
  const tickets = async (controller) => {
    let permission = {};
    permission['INIT'] = getPermission('Initial Form');
    permission['CREA'] = getPermission('Creation Form');
    permission['FINA'] = getPermission('Final Form');
    try {
      let ticketState = [];
      // axios.defaults.headers.common.Authorization =
      //   'Bearer ' + (Cookies.get('accessToken') === undefined ? '' : Cookies.get('accessToken'));
      if (permission.INIT?.read) {
        ticketState.push("'INIT'");
      }
      if (permission.CREA?.read) {
        ticketState.push("'CREA'");
      }
      if (permission.FINA?.read) {
        ticketState.push("'FINA'");
      }
      setTicketstate(ticketState);
      const response = await axiosPrivate.get(
        `/ticket/?is_active=${filterAct}&ticket_state=${
          ticket_state.length === 0 ? ticketState.join(',') : ticket_state.join(',')
        }`,
        {
          signal: controller.signal,
        }
      );
      const result = response.data.data;
      const load = result.data.map((item) => ({
        id: item.token,
        is_active: item.is_active,
        ticket_num: item.ticket_id,
        date_ticket: new Date(item.created_at),
        assignee: item.email,
        cur_pos: item.cur_pos,
        status_ticket: item.status_ticket,
        vendor_name: item.name_1,
        vendor_code: item.ven_code,
        ticket_state: item.ticket_state,
      }));
      setTicket(load);
      if (refreshBtn) {
        setRefreshbtn(false);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    const controller = new AbortController();
    tickets(controller);
  }, [url, filterAct, deleted, refreshBtn]);

  useEffect(() => {
    let permission = {};
    permission['Table'] = getPermission('Ticket Request');
    permission['INIT'] = getPermission('Initial Form');
    permission['CREA'] = getPermission('Creation Form');
    permission['FINA'] = getPermission('Final Form');
    setPerm(permission);
  }, []);

  const handleOnClose = () => {
    setOpenmodal(false);
    setUrl('');
  };

  const handleOnBtnClose = () => () => {
    setBtn(false);
  };

  const buttonRefreshAct = () => {
    setRefreshbtn(true);
  };

  const copyToClipboard = async (textToCopy) => {
    // Navigator clipboard api needs a secure context (https)
    // Use the 'out of viewport hidden text area' trick
    const textArea = document.createElement('textarea');
    textArea.value = textToCopy.toString();

    // Move textarea out of the viewport so it's not visible
    textArea.style.position = 'absolute';
    textArea.style.left = '-999999px';
    textArea.tabIndex = '-1';

    document.body.appendChild(textArea);
    textArea.select();
    textArea.focus();

    try {
      const hey = document.execCommand('copy');
    } catch (error) {
      console.error(error);
    } finally {
      textArea.remove();
    }
  };

  const handleButtonAction = (type, row) => async (e) => {
    if (type === 'Link') {
      if (navigator.clipboard === undefined) {
        await copyToClipboard(`${location.host}/frm/newform/${row.id}`);
      } else {
        navigator.clipboard.writeText(`${location.host}/frm/newform/${row.id}`);
      }
      setAnchorel(e.target);
      setBtn(true);
      setGrow(true);
      setTimeout(() => {
        setBtn(false);
      }, 1000);
    } else if (type === 'Delete') {
      const deleteTicket = await axiosPrivate.delete(`/ticket/${row.id}`);
      setDelete(!deleted);
      alert(`Ticket ${deleteTicket.data.data} is deleted`);
    } else {
      // <Navigate to={`/form/${row.id}`} />;
      navigate(`../form/${row.id}`, { relative: 'path' });
      setLoader(true);
    }
  };

  const popUpFeedback = (e) => {
    setAnchorel(e.target);
    setBtn(true);
    setGrow(true);
    setTimeout(() => {
      setBtn(false);
    }, 1000);
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
        if (item.row.is_active == true) {
          if (item.row.ticket_state == 'INIT') {
            if (perm.INIT.create) {
              Buttons.push(
                <Tooltip key={item.id} title="Link">
                  <IconButton onClick={handleButtonAction('Link', item.row)} onClose={handleOnBtnClose}>
                    <Link />
                  </IconButton>
                </Tooltip>
              );
            } else if (perm.INIT.read) {
              Buttons.push(
                <Tooltip key={item.id} title="View">
                  <IconButton onClick={handleButtonAction('View', item.row)} onClose={handleOnBtnClose}>
                    <Visibility />
                  </IconButton>
                </Tooltip>
              );
            }
            if (perm.INIT.delete) {
              Buttons.push(
                <Tooltip key={item.id + '_delete'} title="Delete">
                  <IconButton onClick={handleButtonAction('Delete', item.row)} onClose={handleOnBtnClose}>
                    <Delete />
                  </IconButton>
                </Tooltip>
              );
            }
          }
          if (item.row.ticket_state == 'CREA') {
            if (perm.CREA.update) {
              Buttons.push(
                <Tooltip key={item.id} title="Edit">
                  <IconButton onClick={handleButtonAction('Edit', item.row)}>
                    <Edit />
                  </IconButton>
                </Tooltip>
              );
            } else if (perm.CREA.read) {
              Buttons.push(
                <Tooltip key={item.id} title="View">
                  <IconButton onClick={handleButtonAction('View', item.row)} onClose={handleOnBtnClose}>
                    <Visibility />
                  </IconButton>
                </Tooltip>
              );
            }
          }
          if (item.row.ticket_state == 'FINA') {
            if (perm.FINA.update) {
              Buttons.push(
                <Tooltip key={item.id} title="Edit">
                  <IconButton onClick={handleButtonAction('Edit', item.row)}>
                    <Edit />
                  </IconButton>
                </Tooltip>
              );
            } else if (perm.FINA.read) {
              Buttons.push(
                <Tooltip key={item.id} title="View">
                  <IconButton onClick={handleButtonAction('View', item.row)} onClose={handleOnBtnClose}>
                    <Visibility />
                  </IconButton>
                </Tooltip>
              );
            }
          }
        } else {
          Buttons.push(
            <Tooltip key={item.id} title="View">
              <IconButton onClick={handleButtonAction('View', item.row)} onClose={handleOnBtnClose}>
                <Visibility />
              </IconButton>
            </Tooltip>
          );
        }
        return Buttons;
      },
    },
  ];

  return (
    <>
      {ticket !== undefined ? (
        <>
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <FormControl>
                <Select
                  sx={{ width: '10em' }}
                  id={'filterAct'}
                  value={filterAct}
                  onChange={(e) => {
                    setFilteract(!filterAct);
                  }}
                >
                  <MenuItem value={true}>Active</MenuItem>
                  <MenuItem value={false}>Inactive</MenuItem>
                </Select>
              </FormControl>
              <RefreshTable setRefreshbtn={buttonRefreshAct} isLoading={refreshBtn} sx={{ mb: 3 }} />
            </Box>
            {perm.Table.create && (
              <Button
                variant="contained"
                sx={{ width: 180, height: 50, my: 2 }}
                onClick={() => {
                  setOpenmodal(true);
                }}
              >
                Create New Vendor
              </Button>
            )}
          </Box>
          <DataGrid
            sx={overrides}
            rows={ticket}
            columns={columnTable}
            disableColumnFilter
            disableColumnSelector
            disableDensitySelector
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

      <ModalCreateTicket
        open={openModal}
        onClose={handleOnClose}
        linkUrl={url}
        urlSet={urlSetFunc}
        popUp={popUpFeedback}
        onClick={copyToClipboard}
      />
      <Popper open={btnTicket} anchorEl={anchorEl} transition sx={{ zIndex: 3000 }}>
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
