import { KeyboardArrowDown, KeyboardArrowUp, Check, DoDisturb } from '@mui/icons-material';
import { TableRow, TableCell, IconButton, Collapse, Typography, TextField, Tooltip } from '@mui/material';
import { useState } from 'react';

export default function Row({ row, length, button, setApprov }) {
  const [open, setOpen] = useState(false);
  const clickDetails = () => {
    setOpen(!open);
  };
  const changeOnAppr = (item) => {
    setApprov(item);
  };
  return (
    <>
      <TableRow>
        <TableCell>
          <IconButton onClick={clickDetails}>{open ? <KeyboardArrowUp /> : <KeyboardArrowDown />}</IconButton>
        </TableCell>
        {Object.keys(row).map((key) => {
          if (key != 'details' && key != 'id') {
            return <TableCell align="left">{row[key]}</TableCell>;
          }
        })}
        <TableCell>
          {button.length != 0 &&
            button.map((item) => {
              switch (item) {
                case 'accept':
                  return (
                    <Tooltip title={<Typography>{item}</Typography>}>
                      <IconButton sx={{ backgroundColor: '#4ef542', mx: 1 }} onClick={() => changeOnAppr(item)}>
                        <Check></Check>
                      </IconButton>
                    </Tooltip>
                  );
                case 'reject':
                  return (
                    <Tooltip title={<Typography>{item}</Typography>}>
                      <IconButton sx={{ backgroundColor: '#f2573f', mx: 1 }} onClick={() => changeOnAppr(item)}>
                        <DoDisturb></DoDisturb>
                      </IconButton>
                    </Tooltip>
                  );
              }
            })}
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell colSpan={length} sx={{ padding: 0, margin: 0 }}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Typography variant="h6" sx={{ mx: 2, my: 2 }}>
              Details
            </Typography>
            <TextField inputProps={{ readOnly: true }} multiline value={row.details} fullWidth sx={{ px: 4 }} />
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
}
