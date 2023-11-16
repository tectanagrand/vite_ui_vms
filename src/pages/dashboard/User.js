import TableLayout from 'src/components/common/TableLayout';
import { useState, useEffect } from 'react';
import { Box, Button, Typography } from '@mui/material';

const usersMock = [
  {
    id: '123121102i3',
    'Full Name': 'Rara Sekar',
    'User Name': 'RarSek',
    Email: 'rarasekar@gmail.com',
    Department: 'PROC',
    Role: 'USER',
  },
  {
    id: '9812031203',
    'Full Name': 'Isyana S',
    'User Name': 'Isya_s',
    Email: 'isyanas@gmail.com',
    Department: 'MDM',
    Role: 'USER',
  },
];

export default function User() {
  const [colLen, setCollen] = useState(0);

  useEffect(() => {
    setCollen(Object.entries(usersMock[0]));
  }, []);

  const buttonAction = (action) => {
    console.log(action);
  };

  return (
    <>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
        <Button sx={{ width: 200, heigth: 50, margin: 2 }} variant="contained">
          <Typography>Create New User</Typography>
        </Button>
      </Box>
      <TableLayout
        data={usersMock}
        buttons={['edit', 'deactive']}
        lengthRow={colLen}
        onAction={buttonAction}
      ></TableLayout>
    </>
  );
}
