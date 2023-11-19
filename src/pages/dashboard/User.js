import TableLayout from 'src/components/common/TableLayout';
import { useState, useEffect } from 'react';
import { Box, Button, Typography } from '@mui/material';
import { useNavigate } from 'react-router';

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

const header = ['Full Name', 'Username', 'Email', 'Department', 'Role'];

export default function User() {
  const [colLen, setCollen] = useState(0);

  const navigate = useNavigate();

  const buttonNewUser = () => {
    navigate('./create');
  };
  useEffect(() => {
    setCollen(Object.entries(usersMock[0]).length);
  }, []);

  const buttonAction = (action) => {
    console.log(action);
  };

  return (
    <>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
        <Button sx={{ width: 200, heigth: 50, margin: 2 }} variant="contained" onClick={buttonNewUser}>
          <Typography>Create New User</Typography>
        </Button>
      </Box>
      <TableLayout
        data={usersMock}
        buttons={['edit', 'deactive']}
        lengthRow={colLen}
        onAction={buttonAction}
        header={header}
      ></TableLayout>
    </>
  );
}
