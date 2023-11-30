import { Paper, Box, Button, Link, Backdrop, SvgIcon } from '@mui/material';
import { useForm } from 'react-hook-form';
import { TextFieldComp } from 'src/components/common/TextFieldComp';
import { Typography } from '@mui/material';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useSession } from 'src/provider/sessionProvider';
import CircularProgress from '@mui/material/CircularProgress';
import { PasswordWithEyes } from 'src/components/common/PasswordWithEyes';
import imgbg from '../images/gama-tower.jpg';
import Logo from '../images/kpn-logo.png';
const defaultValue = {
  Username: '',
  Password: '',
  FormToken: '',
};
export default function LoginPage() {
  const { handleSubmit, control } = useForm({ defaultValues: defaultValue });
  const [openLoad, setOpenload] = useState(false);
  const [dirForm, setDirform] = useState({ state: 'login', html: 'User with form link ?' });
  const navigate = useNavigate();
  const { setSession } = useSession();
  const onSubmit = async (data) => {
    setOpenload(true);
    if (dirForm.state === 'form') {
      navigate(`/frm/newform/${data.FormToken}`);
    } else {
      try {
        const logindata = await axios.post(`${process.env.REACT_APP_URL_LOC}/user/login`, {
          username: data.Username,
          password: data.Password,
        });
        // var headers = new Headers();
        // headers.append('Content-Type', 'application/json');
        // headers.append('Accept', 'application/json');
        // const login = await fetch(`${process.env.REACT_APP_URL_LOC}/user/login`, {
        //   method: 'POST',
        //   redirect: 'follow',
        //   credentials: 'include',
        //   headers: headers,
        //   body: JSON.stringify({
        //     username: data.Username,
        //     password: data.Password,
        //   }),
        // });
        console.log(logindata);
        const response = logindata.data;
        setSession(response);
        alert('Successfull login');
        setTimeout(() => {
          navigate('/dashboard/ticket');
        }, 1000);
      } catch (err) {
        setOpenload(false);
        console.log(err);
        alert(err);
      }
    }
  };

  const onFormClick = (e) => {
    if (dirForm.state == 'login') {
      setDirform({ state: 'form', html: 'User with dashboard access ?' });
    } else {
      setDirform({ state: 'login', html: 'User with form link ?' });
    }
  };

  return (
    <>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100%',
          flexDirection: 'column',
          backgroundImage: `url(${imgbg})`,
          backgroundRepeat: 'no-repeat',
          backgroundSize: 'cover',
        }}
      >
        <form onSubmit={handleSubmit(onSubmit)}>
          <Paper
            sx={{
              display: 'flex',
              width: 600,
              height: 300,
              p: 3,
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
            }}
            elevation={3}
          >
            {/* <Box>
              <SvgIcon>
                <Logo />
              </SvgIcon>
            </Box> */}
            <Typography variant="h3" sx={{ mt: 2 }}>
              Vendor Management System KPN
            </Typography>
            {dirForm.state === 'login' && (
              <TextFieldComp name={'Username'} control={control} label={'Username'} rules={{ required: true }} />
            )}
            {dirForm.state === 'login' && (
              <PasswordWithEyes name={'Password'} control={control} label={'Password'} rules={{ required: true }} />
            )}
            {dirForm.state === 'form' && (
              <TextFieldComp name={'FormToken'} control={control} label={'Token Form'} rules={{ required: true }} />
            )}
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', height: 100, width: 600 }}>
              <Link onClick={onFormClick}>{dirForm.html}</Link>
              {dirForm.state === 'login' && (
                <Button type="submit" sx={{ height: 50, m: 1, width: 100 }}>
                  Login
                </Button>
              )}
              {dirForm.state === 'form' && (
                <Button type="submit" sx={{ height: 50, m: 1, width: 100 }}>
                  Open
                </Button>
              )}
            </Box>
          </Paper>
        </form>
      </Box>
      <Backdrop sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }} open={openLoad}>
        <CircularProgress color="inherit" />
      </Backdrop>
    </>
  );
}
