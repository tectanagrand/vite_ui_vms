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
import { useRef, useState } from 'react';
import axios from 'axios';
import { useSession } from 'src/provider/sessionProvider';

export default function ModalCreateTicket({ open, onClose, linkUrl, urlSet }) {
  const { session } = useSession();
  const handlegenticket = (param) => async () => {
    try {
      const response = await axios.post(`${process.env.REACT_APP_URL_LOC}/ticket/new`, {
        user_id: session.user_id,
        to_who: param,
      });
      const createdTicket = response.data;
      if (param === 'VENDOR') {
        urlSet(`http://localhost:3000/frm/newform/${createdTicket.data.token}`);
      } else {
        onClose();
        urlSet('');
      }
      alert('success');
    } catch (err) {
      alert(err);
    }
  };
  const handleClickLink = () => {
    navigator.clipboard.writeText(linkUrl);
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
        <Button sx={{ height: 80, width: 400, mb: 2 }} onClick={handlegenticket('VENDOR')}>
          By Vendor
        </Button>
        <Button sx={{ height: 80, width: 400, my: 2 }} onClick={handlegenticket('PROC')}>
          By User
        </Button>
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
            value={linkUrl ? linkUrl : ''}
            onClick={handleClickLink}
          />
        </FormControl>
      </Box>
    </Dialog>
  );
}
