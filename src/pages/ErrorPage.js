import { Box, Stack } from '@mui/material';
import { useRouteError, Navigate } from 'react-router-dom';

export default function ErrorPage() {
  const error = useRouteError();
  console.log(error);
  if (error.response?.status === 401) {
    return <Navigate replace to="/login" />;
  }
  return (
    <>
      <Box sx={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Stack sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <h1>Error {error.response?.status || error?.status}</h1>
          <h2> {error?.response?.data?.message || error?.statusText}</h2>
        </Stack>
      </Box>
    </>
  );
}
