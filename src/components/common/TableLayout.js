import { Table, TableCell, TableRow, TableHead, TableBody } from '@mui/material';
import TableRows from './TableRows';

export default function TableLayout({ data, buttons, lengthRow, onAppr }) {
  const changeOnAppr = (item) => {
    console.log(item);
    onAppr(item);
  };
  return (
    <Table>
      <TableHead>
        <TableRow>
          <TableCell>details</TableCell>
          {Object.keys(data[0]).map((item) => {
            if (item != 'id' && item != 'details') {
              return <TableCell>{item}</TableCell>;
            }
          })}
          {buttons.length != 0 && <TableCell></TableCell>}
        </TableRow>
      </TableHead>
      <TableBody>
        {data.map((item) => (
          <TableRows row={item} length={lengthRow} button={buttons} setApprov={changeOnAppr} />
        ))}
      </TableBody>
    </Table>
  );
}
