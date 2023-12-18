import { Box, Typography } from '@mui/material';
import { Warning } from '@mui/icons-material';
import { useRouteError } from 'react-router-dom';
export default function TicketInvalid() {
  const err = useRouteError();
  console.log(err);
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Warning sx={{ fontSize: 100 }} />
      <Typography variant="h2">{err.response.data.message}</Typography>
    </Box>
  );
}
