import { DataGrid, GridActionsCellItem } from '@mui/x-data-grid';
import { useState, forwardRef, useEffect } from 'react';
import { Delete as DeleteIcon, Undo } from '@mui/icons-material';
import { Alert as MuiAlert, Snackbar } from '@mui/material';
import { styled, lighten, darken } from '@mui/material/styles';

const Alert = forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export default function VenFileTable({ initData, upTable }) {
  const [file_ven, setFile_ven] = useState(initData);
  const [sbarOpen, setSbarOpen] = useState(false);
  const [fetchStat, setFetchStat] = useState({});
  // console.log(initData);

  useEffect(() => {
    setFile_ven(initData);
  }, [initData]);

  // console.log(file_ven);
  const DataGridFile = styled(DataGrid)(() => ({
    '& .row-idle': {
      backgroundColor: '#fff',
    },
    '& .row-delete': {
      backgroundColor: '#fc8b72',
      '&:hover': {
        backgroundColor: lighten('#fc8b72', 0.2),
      },
      '&.Mui-selected': {
        backgroundColor: darken('#fc8b72', 0.2),
        '&:hover': {
          backgroundColor: lighten('#fc8b72', 0.2),
        },
      },
    },
  }));

  const onDeleteSBar = () => {
    setSbarOpen(true);
  };

  const onCloseBar = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setSbarOpen(false);
  };

  const handleDeleteClick = (id) => () => {
    let prevData = [];
    file_ven.map(async (item) => {
      try {
        if (item.id === id) {
          if (item.source == 'ven_file_atth') {
            prevData.push({ ...item, method: 'delete' });
            setFetchStat({
              stat: 'success',
              message: `file ${item.file_name} staged to be deleted`,
            });
            onDeleteSBar();
          } else {
            const deletedFile = await fetch(`${process.env.REACT_APP_URL_LOC}/vendor/file/${id}`, {
              method: 'DELETE',
            });
            const response = await deletedFile.json();
            if (response.status == 200) {
              setFetchStat({
                stat: 'success',
                message: `temporary file ${response.data.file_name} deleted`,
              });
              onDeleteSBar();
            } else {
              throw Error(response.message);
            }
          }
        } else {
          prevData.push(item);
        }
      } catch (err) {
        setFetchStat({
          stat: 'error',
          message: 'error deleting item',
        });
        onDeleteSBar();
      }
    });
    setFile_ven(prevData);
    upTable(prevData);
    // console.log(file_ven);
  };

  const handleUndoClick =
    ({ id, row }) =>
    () => {
      let pushData = [];
      file_ven.map((item) => {
        if (item.id === id) {
          pushData.push({ ...item, method: '' });
        } else {
          pushData.push(item);
        }
      });
      setFetchStat({ stat: 'info', message: `${row.file_name} delete stage canceled` });
      setFile_ven(pushData);
      upTable(pushData);
      onDeleteSBar();
    };

  const columns = [
    {
      field: 'desc_file',
      type: 'string',
      headerName: 'Type',
      width: 200,
    },
    { field: 'file_name', type: 'string', headerName: 'File Name', width: 650 },
    {
      field: 'action',
      type: 'actions',
      headerName: 'Action',
      width: 100,
      cellClassName: 'actions',
      getActions: (item) => {
        if (item.row.method == 'delete') {
          return [<GridActionsCellItem icon={<Undo />} label="Undo" onClick={handleUndoClick(item)} />];
        } else {
          return [<GridActionsCellItem icon={<DeleteIcon />} label="Delete" onClick={handleDeleteClick(item.id)} />];
        }
      },
    },
  ];

  return (
    <>
      <DataGridFile
        rows={file_ven}
        columns={columns}
        getRowClassName={(params) => {
          if (params.row.method == 'delete') {
            return 'row-delete';
          } else {
            return 'row-idle';
          }
        }}
      />
      <Snackbar
        open={sbarOpen}
        autoHideDuration={3000}
        onClose={onCloseBar}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert severity={fetchStat.stat ? fetchStat.stat : 'info'}>
          {fetchStat.message ? fetchStat.message : 'test'}
        </Alert>
      </Snackbar>
    </>
  );
}
