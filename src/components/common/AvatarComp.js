import { Avatar, IconButton, Menu, MenuItem, Backdrop, CircularProgress } from '@mui/material';
import { useState } from 'react';
import { useSession } from 'src/provider/sessionProvider';
import { useNavigate } from 'react-router-dom';
export default function AvatarComp() {
  const { session, logOut } = useSession();
  const [loader, setLoader] = useState(false);
  const navigate = useNavigate();

  const [anchorEl, setAnchorel] = useState();
  const handleMenu = (e) => {
    setAnchorel(e.currentTarget);
  };
  const handleClose = () => {
    setAnchorel(null);
  };
  const handleLogout = () => {
    console.log('test');
    logOut();
    setLoader(true);
    setTimeout(() => {
      navigate('/login');
    }, 1000);
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
        <MenuItem onClick={handleLogout}>Logout</MenuItem>
      </Menu>
      <Backdrop sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer - 2 }} open={loader}>
        <CircularProgress color="inherit" />
      </Backdrop>
    </>
  );
}
