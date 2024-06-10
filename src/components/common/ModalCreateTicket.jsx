import {
  Dialog,
  Button,
  Typography,
  TextField,
  IconButton,
  OutlinedInput,
  InputLabel,
  FormControl,
  InputAdornment,
  Box,
} from '@mui/material';
import { Link } from '@mui/icons-material';
import axios from 'axios';
import useAxiosPrivate from 'src/hooks/useAxiosPrivate';
import { useSession } from 'src/provider/sessionProvider';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { LoadingButton } from '@mui/lab';

export default function ModalCreateTicket({ open, onClose, linkUrl, urlSet, popUp, onClick }) {
  const axiosPrivate = useAxiosPrivate();
  const { session } = useSession();
  const navigate = useNavigate();
  const [links, setLinks] = useState(linkUrl);
  const [btnClicked, setBtnclicked] = useState(false);

  useEffect(() => {
    setLinks(linkUrl);
  }, [linkUrl]);

  const handlePopUp = (e) => {
    popUp(e);
  };

  const handleClick = (e) => {
    onClick(links);
  };

  const handlegenticket = (param) => async () => {
    setBtnclicked(true);
    try {
      const response = await axiosPrivate.post(`/ticket/new`, {
        user_id: session.user_id,
        to_who: param,
      });
      const createdTicket = response.data;
      if (param === 'VENDOR') {
        urlSet(`${location.protocol}/${location.host}/${createdTicket.data.link}`);
      } else {
        onClose();
        navigate(`../form/${createdTicket.data.token}`);
      }
      alert('success');
      setBtnclicked(false);
    } catch (err) {
      setBtnclicked(false);
      alert(err);
    }
  };
  const handleClickLink = async (e) => {
    if (navigator.clipboard === undefined) {
      handleClick();
    } else {
      navigator.clipboard.writeText(links);
    }
    handlePopUp(e);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xl">
      <Box
        sx={{
          width: 800,
          height: 500,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Typography sx={{ mb: 7 }} variant="h5">
          Create New Form Request Ticket
        </Typography>
        <LoadingButton sx={{ height: 80, width: 400, mb: 2 }} onClick={handlegenticket('VENDOR')} loading={btnClicked}>
          By Vendor
        </LoadingButton>
        <LoadingButton sx={{ height: 80, width: 400, my: 2 }} onClick={handlegenticket('PROC')} loading={btnClicked}>
          By User
        </LoadingButton>
        <FormControl sx={{ mt: 5, mb: 1, width: 780 }} variant="outlined">
          <InputLabel htmlFor="link-url-form-label">Link Form</InputLabel>
          <OutlinedInput
            id="link-url-form"
            endAdornment={
              <InputAdornment position="end">
                <IconButton>
                  <Link />
                </IconButton>
              </InputAdornment>
            }
            label="Password"
            value={links}
            readOnly={true}
            onClick={handleClickLink}
          />
        </FormControl>
      </Box>
    </Dialog>
  );
}
