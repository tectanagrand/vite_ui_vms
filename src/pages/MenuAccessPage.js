import { Grid, Typography, Container, Box, Button } from '@mui/material';
import TableMenuAccess from 'src/components/common/TableMenuAccess';
import { TextFieldComp } from 'src/components/common/TextFieldComp';
import { useForm } from 'react-hook-form';
import { useEffect, useState } from 'react';
import axios from 'axios';

export default function MenuAccessPage() {
  let dtAccess = [];
  const { handleSubmit, control } = useForm();
  const submitDt = async (data) => {
    const insertedDt = {
      groupname: data.groupname,
      groupid: '',
      accessmtx: dtAccess,
    };
    console.log(insertedDt);
    try {
      const submission = await axios.post(`${process.env.REACT_APP_URL_LOC}/user/secmtx/submit`, insertedDt);
      alert(submission);
    } catch (error) {
      alert(error);
    }
  };
  const accessDtUp = (newTb) => {
    dtAccess = newTb;
  };
  const [dtMenu, setdtMenu] = useState([]);
  const dataMenu = dtMenu;
  const groupid = '';
  useEffect(() => {
    const getSecMtx = async () => {
      const secMtx = await axios.post(`${process.env.REACT_APP_URL_LOC}/user/secmtx`, {
        groupid: groupid,
      });
      setdtMenu(secMtx.data.data);
    };
    getSecMtx();
  }, []);
  return (
    <Container>
      <form onSubmit={handleSubmit(submitDt)}>
        <Typography variant="h4">New Menu Access Permission</Typography>
        <Grid container xs>
          <Grid item xs={6}>
            <TextFieldComp name="groupname" control={control} label={'Group Name'} />
          </Grid>
        </Grid>
        <TableMenuAccess data={dataMenu} onChange={accessDtUp} />
        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Button variant="contained" type="submit" sx={{ padding: 2, margin: 2 }}>
            <Typography>Submit</Typography>
          </Button>
        </Box>
      </form>
    </Container>
  );
}
