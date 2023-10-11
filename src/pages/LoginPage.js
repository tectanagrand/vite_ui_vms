import { Paper, Box, Button, Link } from '@mui/material';
import { useForm } from 'react-hook-form';
import { TextFieldComp } from 'src/components/common/TextFieldComp';
import { Typography } from '@mui/material';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from 'src/provider/authProvider';
import Cookies from 'js-cookie';
const defaultValue = {
  Username: '',
  Password: '',
  FormToken: '',
};
export default function LoginPage() {
  const { handleSubmit, control } = useForm({ defaultValues: defaultValue });
  const [dirForm, setDirform] = useState({ state: 'login', html: 'User with form link ?' });
  const navigate = useNavigate();
  const { setJWTToken } = useAuth();
  const onSubmit = async (data) => {
    if (dirForm.state === 'form') {
      navigate(`/frm/newform/${data.FormToken}`);
    } else {
      try {
        const logindata = await axios.post(`${process.env.REACT_APP_URL_LOC}/user/login`, {
          username: data.Username,
          password: data.Password,
        });
        const jwttoken = logindata.data.token;
        setJWTToken(jwttoken);
        alert('Successfull login');
      } catch (err) {
        alert(err.stack);
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
            <Typography variant="h3" sx={{ mt: 2 }}>
              Vendor Management System KPN
            </Typography>
            {dirForm.state === 'login' && (
              <TextFieldComp name={'Username'} control={control} label={'Username'} rules={{ required: true }} />
            )}
            {dirForm.state === 'login' && (
              <TextFieldComp name={'Password'} control={control} label={'Password'} rules={{ required: true }} />
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
    </>
  );
}
