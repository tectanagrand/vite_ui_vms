import { Avatar, IconButton, Menu, MenuItem } from '@mui/material';
import { useState } from 'react';
import { useSession } from 'src/provider/sessionProvider';

export default function AvatarComp() {
  const { session } = useSession();
  const [anchorEl, setAnchorel] = useState();
  const handleMenu = (e) => {
    setAnchorel(e.currentTarget);
  };
  const handleClose = () => {
    setAnchorel(null);
  };
  return (
    <>
      <IconButton onClick={handleMenu}>
        <Avatar>{session.username?.slice(0, 2).toUpperCase()}</Avatar>
      </IconButton>
      <Menu
        id="avatar-appbar"
        anchorEl={anchorEl}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        keepMounted
      >
        <MenuItem>Logout</MenuItem>
      </Menu>
    </>
  );
}
