import { Container, Typography, Grid, Box, Button } from '@mui/material';
import SelectComp from 'src/components/common/SelectComp';
import { TextFieldComp } from 'src/components/common/TextFieldComp';
import { useForm } from 'react-hook-form';

const defaultValue = {
  username: '',
  password: '',
  fullname: '',
  email: '',
  usergroup: '',
};

export default function FormUserPage() {
  const { handleSubmit, control } = useForm({ defaultValues: defaultValue });

  return (
    <Container>
      <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <Typography variant="h4">User Form</Typography>
        <Grid container xs spacing={2}>
          <Grid item xs>
            <TextFieldComp name="username" control={control} label="Username" rules={{ required: true }} />
          </Grid>
          <Grid item xs>
            <TextFieldComp name="password" control={control} label="Password" rules={{ required: true }} />
          </Grid>
        </Grid>
        <Grid container xs spacing={2}>
          <Grid item xs>
            <TextFieldComp name="fullname" control={control} label="Full Name" rules={{ required: true }} />
          </Grid>
          <Grid item xs>
            <TextFieldComp name="email" control={control} label="Email" rules={{ required: true }} />
          </Grid>
        </Grid>
        <Grid container xs>
          <Grid item xs>
            <SelectComp
              name="usergroup"
              control={control}
              label="User Group"
              options={[{ value: 'XXXX', label: 'XXXX' }]}
              rules={{ required: true }}
            />
          </Grid>
          <Grid item xs></Grid>
        </Grid>
      </Box>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
        <Button sx={{ width: 100, height: 50 }} variant="contained">
          <Typography>Save</Typography>
        </Button>
      </Box>
    </Container>
  );
}
