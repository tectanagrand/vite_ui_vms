import { Box, Stack } from '@mui/material';
import { useRouteError } from 'react-router-dom';

export default function ErrorPage() {
  const error = useRouteError();
  console.log(error);
  return (
    <>
      <Box sx={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Stack sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <h1>Error {error.response.status}</h1>
          <h2> {error.response.data.message}</h2>
        </Stack>
      </Box>
    </>
  );
}
