import { Container, Typography, Grid, Box, Button } from '@mui/material';
import SelectComp from 'src/components/common/SelectComp';
import { TextFieldComp } from 'src/components/common/TextFieldComp';
import { PasswordWithEyes } from 'src/components/common/PasswordWithEyes';
import { useForm } from 'react-hook-form';
import { useEffect, useState } from 'react';
import axios from 'axios';
import dayjs from 'dayjs';
import DatePickerComp from 'src/components/common/DatePickerComp';
import { useSearchParams, useNavigate } from 'react-router-dom';

export default function FormUserPage() {
  const [searchParams] = useSearchParams();
  const [userId, setUserid] = useState('');
  const navigate = useNavigate();
  const {
    handleSubmit,
    control,
    reset,
    getFieldState,
    formState: { isDirty },
  } = useForm({
    mode: 'onChange',
    defaultValues: {
      manager: '',
      fullname: '',
      username: '',
      usergroup: '',
      email: '',
      password: '',
      role: '',
      datecreated: dayjs().format('MM/DD/YYYY'),
      expireddate: dayjs().format('MM/DD/YYYY'),
    },
    resetOptions: {
      keepDirtyValues: true, // user-interacted input will be retained
      keepErrors: true, // input errors will be retained with value update
    },
  });

  const getUserData = async (iduser) => {
    const userDt = await axios.get(`${process.env.REACT_APP_URL_LOC}/user/show/?iduser=${iduser}`);
    const data = userDt.data.data;
    if (data != undefined) {
      setUserid(data.user_id);
      reset({
        manager: data.mgr_id,
        fullname: data.fullname,
        username: data.username,
        usergroup: data.usergroup,
        email: data.email,
        role: data.role,
        datecreated: dayjs(data.datecreated).format('MM/DD/YYYY'),
        expireddate: dayjs(data.expireddate).format('MM/DD/YYYY'),
      });
    }
  };

  const [userGroup, setuserGroup] = useState([{ value: '', label: '' }]);
  const [roles, setRoles] = useState([{ value: '', label: '' }]);
  const [manager, setManager] = useState([{ value: '', label: '' }]);
  const onRoleChange = (data) => {
    if (data !== 'MGR') {
      setisMgr(false);
    } else {
      setisMgr(true);
    }
  };
  const [isMgr, setisMgr] = useState(false);

  useEffect(() => {
    const getUsergrp = async () => {
      try {
        const getUsrgrp = await axios.get(`${process.env.REACT_APP_URL_LOC}/user/lssecmtx`);
        const dataUsrgrp = getUsrgrp.data.data.map((data) => {
          return { value: data.user_group_id, label: data.user_group_name };
        });
        setuserGroup(dataUsrgrp);
      } catch (error) {
        alert(error);
      }
    };
    getUsergrp();
  }, []);

  useEffect(() => {
    const getRole = async () => {
      try {
        const getRole = await axios.get(`${process.env.REACT_APP_URL_LOC}/user/roles`);
        const dataRole = getRole.data.data.map((data) => {
          return { value: data.id_role, label: data.role };
        });
        setRoles(dataRole);
      } catch (error) {
        alert(error);
      }
    };
    getRole();
  }, []);

  useEffect(() => {
    const getMgr = async () => {
      try {
        const getManager = await axios.get(`${process.env.REACT_APP_URL_LOC}/user/mgrs`);
        const dataMgr = getManager.data.data.map((data) => {
          return { value: data.mgr_id, label: data.fullname };
        });
        setManager(dataMgr);
      } catch (error) {
        alert(error);
      }
    };
    getMgr();
  }, []);

  useEffect(() => {
    const userid = searchParams.get('iduser');
    getUserData(userid);
  }, []);

  const submitUser = async (data) => {
    const mgr_id = isMgr ? '' : data.manager;
    let subUserDt = {
      user_id: userId,
      mgr_id: mgr_id,
      fullname: data.fullname,
      username: data.username,
      usergroup: data.usergroup,
      email: data.email,
      role: data.role,
      createddate: dayjs(data.datecreated).format('MM/DD/YYYY'),
      expireddate: dayjs(data.expireddate).format('MM/DD/YYYY'),
    };
    if (getFieldState('password').isDirty) {
      subUserDt.password = data.password;
    }
    // console.log(subUserDt);
    try {
      const submitDatauser = await axios.post(`${process.env.REACT_APP_URL_LOC}/user/submit`, subUserDt);
      alert(submitDatauser.data.message);
      navigate('../users');
    } catch (error) {
      alert(error);
    }
  };
  return (
    <Container>
      <form onSubmit={handleSubmit(submitUser)}>
        <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
          <Typography variant="h4" sx={{ textAlign: 'center', pb: 5 }}>
            User Form
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs>
              <DatePickerComp label="Date Created" name="datecreated" control={control} rules={{ required: true }} />
            </Grid>
            <Grid item xs>
              <DatePickerComp label="Expired Date" name="expireddate" control={control} rules={{ required: true }} />
            </Grid>
          </Grid>
          <Grid container spacing={2}>
            <Grid item xs>
              <TextFieldComp name="username" control={control} label="Username" rules={{ required: true }} />
            </Grid>
            <Grid item xs>
              <PasswordWithEyes
                name="password"
                control={control}
                label="Password"
                rules={{ required: userId != '' ? false : true }}
              />
            </Grid>
          </Grid>
          <Grid container spacing={2}>
            <Grid item xs>
              <TextFieldComp name="fullname" control={control} label="Full Name" rules={{ required: true }} />
            </Grid>
            <Grid item xs>
              <TextFieldComp name="email" control={control} label="Email" rules={{ required: true }} />
            </Grid>
          </Grid>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <SelectComp
                name="usergroup"
                control={control}
                label="User Group"
                options={userGroup}
                rules={{ required: true }}
              />
            </Grid>
            <Grid item xs={6}>
              <SelectComp
                name="role"
                control={control}
                label="Role"
                options={roles}
                rules={{ required: true }}
                onChangeovr={onRoleChange}
              />
            </Grid>
            {
              <Grid item xs={6}>
                <SelectComp name="manager" control={control} label="Manager" options={manager} disabled={isMgr} />
              </Grid>
            }
          </Grid>
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 10 }}>
          <Button type="submit" sx={{ width: 100, height: 50 }} variant="contained">
            <Typography>Save</Typography>
          </Button>
        </Box>
      </form>
    </Container>
  );
}
