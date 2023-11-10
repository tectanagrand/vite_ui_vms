const { Table, TableCell, TableRow, TableHead, TableBody } = require('@mui/material');

export default function TableLayout({ data, details, buttons }) {
  return (
    <>
      <TableHead>
        <TableRow>
          {Object.keys(data[0]).map((item) => (
            <TableCell>{item}</TableCell>
          ))}
        </TableRow>
      </TableHead>
      <TableBody>
        {data.map((item) => (
          <TableRow>
            {Object.keys(item).map((key) => {
              if (key !== details) {
                return <TableCell>{item[key]}</TableCell>;
              }
            })}
          </TableRow>
        ))}
      </TableBody>
    </>
  );
}
